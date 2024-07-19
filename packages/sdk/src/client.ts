import { MONERIUM_CONFIG } from './config';
import constants from './constants';
import {
  cleanQueryString,
  getAuthFlowUrlAndStoreCodeVerifier,
  isAuthCode,
  isClientCredentials,
  isRefreshToken,
  rest,
} from './helpers';
import type {
  AuthArgs,
  AuthCodeRequest,
  AuthContext,
  AuthFlowOptions,
  AuthorizationCodeCredentials,
  Balances,
  BearerProfile,
  BearerTokenCredentials,
  ClassOptions,
  ClientCredentials,
  ClientCredentialsRequest,
  ENV,
  Environment,
  LinkAddress,
  LinkedAddress,
  MoneriumEvent,
  MoneriumEventListener,
  NewOrder,
  Order,
  OrderFilter,
  OrderNotification,
  OrderState,
  PKCERequestArgs,
  Profile,
  RefreshTokenRequest,
  SupportingDoc,
  Token,
} from './types';
import { mapChainIdToChain, urlEncoded } from './utils';

// import pjson from "../package.json";
const { STORAGE_CODE_VERIFIER, STORAGE_REFRESH_TOKEN } = constants;

const isServer = typeof window === 'undefined';

export class MoneriumClient {
  #env: Environment;

  #authorizationHeader?: string;
  /**
   * The PKCE code verifier
   * @deprecated, use localStorage, will be removed in v3
   * @hidden
   * */
  codeVerifier?: string;
  /**
   * The bearer profile will be available after authentication, it includes the `access_token` and `refresh_token`
   * */
  bearerProfile?: BearerProfile;
  /**
   * The socket will be available after subscribing to an event
   * */
  #socket?: WebSocket;
  /** The subscriptions map will be available after subscribing to an event */
  #subscriptions: Map<OrderState, MoneriumEventListener> = new Map();

  isAuthorized = !!this.bearerProfile;

  #client?: BearerTokenCredentials;
  /**
   * The state parameter is used to maintain state between the request and the callback.
   * */
  state: string | undefined;

  /**
   * @defaultValue `sandbox`
   * @example
   * new MoneriumClient() // defaults to `sandbox`
   *
   * new MoneriumClient('production')
   *
   * new MoneriumClient({
   *  environment: 'sandbox',
   *  clientId: 'your-client-id',
   *  redirectUrl: 'your-redirect-url'
   * })
   * */
  constructor(envOrOptions?: ENV | ClassOptions) {
    // No arguments, default to sandbox
    if (!envOrOptions) {
      this.#env = MONERIUM_CONFIG.environments['sandbox'];
      return;
    }
    // String argument
    if (typeof envOrOptions === 'string') {
      this.#env = MONERIUM_CONFIG.environments[envOrOptions];
    } else {
      this.#env =
        MONERIUM_CONFIG.environments[envOrOptions.environment || 'sandbox'];

      if (!isServer) {
        const { clientId, redirectUrl } =
          envOrOptions as AuthorizationCodeCredentials;
        this.#client = {
          clientId: clientId as string,
          redirectUrl: redirectUrl as string,
        };
      } else {
        const { clientId, clientSecret } = envOrOptions as ClientCredentials;
        this.#client = {
          clientId: clientId as string,
          clientSecret: clientSecret as string,
        };
      }
      // this.getAccess();
    }
  }

  /**
   * Construct the url to the authorization code flow,
   * Code Verifier needed for the code challenge is stored in local storage
   * For automatic wallet link, add the following properties: `address`, `signature` & `chainId`
   * @returns string
   * {@link https://monerium.dev/api-docs#operation/auth}
   * @category Auth
   */
  async authorize(client?: AuthFlowOptions) {
    const clientId =
      client?.clientId ||
      (this.#client as AuthorizationCodeCredentials)?.clientId;
    const redirectUrl =
      client?.redirectUrl ||
      (this.#client as AuthorizationCodeCredentials)?.redirectUrl;

    if (!clientId) {
      throw new Error('Missing ClientId');
    }
    if (!redirectUrl) {
      throw new Error('Missing RedirectUrl');
    }

    const authFlowUrl = getAuthFlowUrlAndStoreCodeVerifier(this.#env.api, {
      client_id: clientId,
      redirect_uri: redirectUrl,
      address: client?.address,
      signature: client?.signature,
      chainId: client?.chainId,
      state: client?.state,
    });

    // Redirect to the authFlow
    window.location.assign(authFlowUrl);
  }

  /**
   * Get access to the API
   * @param {AuthorizationCodeCredentials | ClientCredentials} client - the client credentials
   * @returns boolean to indicate if access has been granted
   * @category Auth
   */
  async getAccess(
    client?: AuthorizationCodeCredentials | ClientCredentials
  ): Promise<boolean> {
    const clientId = client?.clientId || this.#client?.clientId;
    const clientSecret =
      (client as ClientCredentials)?.clientSecret ||
      (this.#client as ClientCredentials)?.clientSecret;

    if (clientSecret) {
      if (!isServer) {
        throw new Error('Only use client credentials on server side');
      }
      await this.#clientCredentialsAuthorization(
        this.#client as ClientCredentials
      );
      return !!this.bearerProfile;
    }

    const redirectUrl =
      (client as AuthorizationCodeCredentials)?.redirectUrl ||
      (this.#client as AuthorizationCodeCredentials)?.redirectUrl;

    if (!clientId) {
      throw new Error('Missing ClientId');
    }

    if (isServer) {
      throw new Error('This only works client side');
    }

    const authCode =
      new URLSearchParams(window.location.search).get('code') || undefined;

    const state =
      new URLSearchParams(window.location.search).get('state') || undefined;

    const refreshToken =
      localStorage.getItem(STORAGE_REFRESH_TOKEN) || undefined;

    if (refreshToken) {
      await this.#refreshTokenAuthorization(clientId, refreshToken);
    } else if (authCode) {
      await this.#authCodeAuthorization(clientId, redirectUrl, authCode, state);
    }

    return !!this.bearerProfile;
  }

  /**
   * {@link https://monerium.dev/api-docs#operation/auth-token}
   */
  async #grantAccess(args: AuthArgs): Promise<BearerProfile> {
    let params:
      | AuthCodeRequest
      | RefreshTokenRequest
      | ClientCredentialsRequest;

    if (isAuthCode(args)) {
      params = { ...args, grant_type: 'authorization_code' } as AuthCodeRequest;
    } else if (isRefreshToken(args)) {
      params = { ...args, grant_type: 'refresh_token' } as RefreshTokenRequest;
    } else if (isClientCredentials(args)) {
      params = {
        ...args,
        grant_type: 'client_credentials',
      } as ClientCredentialsRequest;
    } else {
      throw new Error('Authorization grant type could not be detected.');
    }

    await this.#api<BearerProfile>(
      'post',
      `auth/token`,
      params as unknown as Record<string, string>,
      true
    )
      .then((res) => {
        this.bearerProfile = res;
        this.isAuthorized = !!res;
        this.#authorizationHeader = `Bearer ${res?.access_token}`;
        if (!isServer) {
          window.localStorage.setItem(
            STORAGE_REFRESH_TOKEN,
            this.bearerProfile?.refresh_token || ''
          );
        }
      })
      .catch((err) => {
        if (!isServer) {
          localStorage.removeItem(STORAGE_CODE_VERIFIER);
          localStorage.removeItem(STORAGE_REFRESH_TOKEN);
          cleanQueryString();
        }
        throw new Error(err?.message);
      });

    /**
     * Remove auth code from URL.
     * Make sure this is the last action before returning the bearer profile
     * NextJS seems to overwrite this if there is data fetching in the background
     */
    if (isAuthCode(args)) {
      cleanQueryString();
    }

    return this.bearerProfile as BearerProfile;
  }

  // -- Read Methods
  /**
   * {@link https://monerium.dev/api-docs#operation/auth-context}
   * @category Auth
   */
  getAuthContext(): Promise<AuthContext> {
    return this.#api<AuthContext>('get', `auth/context`);
  }

  /**
   * {@link https://monerium.dev/api-docs#operation/profile}
   * @param {string} profileId - the id of the profile to fetch.
   * @category Profiles
   */
  getProfile(profileId: string): Promise<Profile> {
    return this.#api<Profile>('get', `profiles/${profileId}`);
  }
  /**
   * {@link https://monerium.dev/api-docs#operation/profiles}
   * @category Profiles
   */
  getProfiles(): Promise<Profile[]> {
    return this.#api<Profile[]>('get', `profiles`);
  }
  /**
   * {@link https://monerium.dev/api-docs#operation/profile-balances}
   * @param {string=} profileId - the id of the profile to fetch balances.
   * @category Accounts
   */
  getBalances(profileId?: string): Promise<Balances[]> {
    if (profileId) {
      return this.#api<Balances[]>('get', `profiles/${profileId}/balances`);
    } else {
      return this.#api<Balances[]>('get', `balances`);
    }
  }

  /**
   * {@link https://monerium.dev/api-docs#operation/orders}
   * @category Orders
   */
  getOrders(filter?: OrderFilter): Promise<Order[]> {
    const searchParams = urlEncoded(filter as Record<string, string>);
    return this.#api<Order[]>('get', `orders?${searchParams}`);
  }
  /**
   * {@link https://monerium.dev/api-docs#operation/order}
   * @category Orders
   */
  getOrder(orderId: string): Promise<Order> {
    return this.#api<Order>('get', `orders/${orderId}`);
  }

  /**
   * {@link https://monerium.dev/api-docs#operation/tokens}
   * @category Tokens
   */
  getTokens(): Promise<Token[]> {
    return this.#api<Token[]>('get', 'tokens');
  }

  // -- Write Methods

  /**
   * {@link https://monerium.dev/api-docs#operation/profile-addresses}
   * @category Accounts
   */
  linkAddress(profileId: string, body: LinkAddress): Promise<LinkedAddress> {
    body = mapChainIdToChain(body);
    body.accounts = body.accounts.map((account) => mapChainIdToChain(account));

    return this.#api(
      'post',
      `profiles/${profileId}/addresses`,
      JSON.stringify(body)
    );
  }

  /**
   * {@link https://monerium.dev/api-docs#operation/post-orders}
   * @category Orders
   */
  placeOrder(order: NewOrder, profileId?: string): Promise<Order> {
    const body = {
      kind: 'redeem',
      currency: 'eur',
      ...mapChainIdToChain(order),
      counterpart: {
        ...order.counterpart,
        identifier: mapChainIdToChain(order.counterpart.identifier),
      },
    };

    if (profileId) {
      return this.#api<Order>(
        'post',
        `profiles/${profileId}/orders`,
        JSON.stringify(body)
      );
    } else {
      return this.#api<Order>('post', `orders`, JSON.stringify(body));
    }
  }

  /**
   * {@link https://monerium.dev/api-docs#operation/supporting-document}
   * @category Orders
   */
  uploadSupportingDocument(document: File): Promise<SupportingDoc> {
    const formData = new FormData();
    formData.append('file', document as unknown as Blob);

    return rest<SupportingDoc>(`${this.#env.api}/files`, 'post', formData, {
      Authorization: this.#authorizationHeader || '',
    });
  }

  // -- Helper Methods

  async #api<T>(
    method: string,
    resource: string,
    body?: BodyInit | Record<string, string>,
    isFormEncoded?: boolean
  ): Promise<T> {
    return rest<T>(
      `${this.#env.api}/${resource}`,
      method,
      isFormEncoded ? urlEncoded(body as Record<string, string>) : body,
      {
        Authorization: this.#authorizationHeader || '',
        'Content-Type': `application/${
          isFormEncoded ? 'x-www-form-urlencoded' : 'json'
        }`,
      }
    );
  }

  /*
   * Triggered when the client has claimed an authorization code
   * 1. Code Verifier is picked up from the localStorage
   * 2. auth service is called to claim the tokens
   * 3. Refresh token is stored in the localStorage
   */
  #authCodeAuthorization = async (
    clientId: string,
    redirectUrl: string,
    authCode: string,
    state?: string
  ) => {
    const codeVerifier = localStorage.getItem(STORAGE_CODE_VERIFIER) || '';

    if (!codeVerifier) {
      throw new Error('Code verifier not found');
    }

    /** @deprecated, use localStorage, will be removed in v3 */
    this.codeVerifier = codeVerifier;

    this.state = state;

    localStorage.removeItem(STORAGE_CODE_VERIFIER);

    // Remove auth code from URL.
    return await this.#grantAccess({
      code: authCode,
      redirect_uri: redirectUrl as string,
      client_id: clientId,
      code_verifier: codeVerifier,
    });
  };

  #clientCredentialsAuthorization = async ({
    clientId,
    clientSecret,
  }: ClientCredentials) => {
    return await this.#grantAccess({
      client_id: clientId,
      client_secret: clientSecret as string,
    });
  };

  #refreshTokenAuthorization = async (
    clientId: string,
    refreshToken: string
  ) => {
    return await this.#grantAccess({
      refresh_token: refreshToken,
      client_id: clientId,
    });
  };

  // -- Notifications
  /**
   * Connects to the order notifications socket
   * @category Orders
   */
  async connectOrderSocket() {
    // When the user is authenticated, we connect to the order notifications socket in case
    // the user has subscribed to any event
    if (this.bearerProfile?.access_token && this.#subscriptions.size > 0) {
      this.#socket = this.subscribeToOrderNotifications();
    }
  }
  /**
   * Subscribes to the order notifications socket
   * @category Orders
   */
  subscribeToOrderNotifications = (): WebSocket => {
    const socketUrl = `${this.#env.wss}/profiles/${this.bearerProfile?.profile}/orders?access_token=${this.bearerProfile?.access_token}`;

    const socket = new WebSocket(socketUrl);

    socket.addEventListener('open', () => {
      console.info(`Socket connected: ${socketUrl}`);
    });

    socket.addEventListener('error', (event) => {
      console.error(event);
      throw new Error(`Socket error: ${socketUrl}`);
    });

    socket.addEventListener('message', (event) => {
      const notification = JSON.parse(event.data) as OrderNotification;

      this.#subscriptions.get(notification.meta.state as OrderState)?.(
        notification
      );
    });

    socket.addEventListener('close', () => {
      console.info(`Socket connection closed: ${socketUrl}`);
    });

    return socket;
  };
  /**
   * Cleanups the socket and the subscriptions
   * @category Auth
   */
  async disconnect() {
    if (!isServer) {
      localStorage.removeItem(STORAGE_CODE_VERIFIER);
    }
    this.#subscriptions.clear();
    this.#socket?.close();
    this.#authorizationHeader = undefined;
    this.bearerProfile = undefined;
  }
  /**
   * Revokes access
   * @category Auth
   */
  async revokeAccess() {
    if (!isServer) {
      localStorage.removeItem(STORAGE_REFRESH_TOKEN);
    }
    this.disconnect();
  }

  /**
   * Subscribe to MoneriumEvent to receive notifications using the Monerium API (WebSocket)
   * We are setting a subscription map because we need the user to have a token to start the WebSocket connection
   * {@link https://monerium.dev/api-docs#operation/profile-orders-notifications}
   * @param event The event to subscribe to
   * @param handler The handler to be called when the event is triggered
   * @category Orders
   */

  subscribeOrders(event: MoneriumEvent, handler: MoneriumEventListener): void {
    this.#subscriptions.set(event as OrderState, handler);
  }

  /**
   * Unsubscribe from MoneriumEvent and close the socket if there are no more subscriptions
   * @param event The event to unsubscribe from
   * @category Orders
   */
  unsubscribeOrders(event: MoneriumEvent): void {
    this.#subscriptions.delete(event as OrderState);

    if (this.#subscriptions.size === 0) {
      this.#socket?.close();
      this.#socket = undefined;
    }
  }
  // -- Deprecated methods

  /**
   * @deprecated since v2.6.4, will be removed in 2.7.2+, use {@link getAccess} instead.
   * @hidden
   */
  auth = async (args: AuthArgs) => await this.#grantAccess(args);

  /**
   * @deprecated since v2.7.1, will be removed in 2.7.2+, use {@link getAccess} instead.
   * @hidden
   */
  connect = async (args: AuthArgs) => await this.#grantAccess(args);

  /**
   * @deprecated since v2.6.4, will be removed in 2.7.2+, use {@link authorize} instead.
   * @hidden
   */
  getAuthFlowURI = (args: PKCERequestArgs): string => {
    const url = getAuthFlowUrlAndStoreCodeVerifier(this.#env.api, args);
    this.codeVerifier = localStorage.getItem(STORAGE_CODE_VERIFIER) as string;
    return url;
  };

  /**
   * @deprecated since v2.0.7, will be removed in 2.7.2+, use {@link getAuthFlowURI} instead.
   * @hidden
   */
  pkceRequest = (args: PKCERequestArgs) => this.getAuthFlowURI(args);

  // -- Getters (mainly for testing)
  /**
   * @hidden
   */
  getEnvironment = (): Environment => this.#env;
}
