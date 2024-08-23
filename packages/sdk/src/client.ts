import { MONERIUM_CONFIG } from './config';
import constants from './constants';
import {
  cleanQueryString,
  getAuthFlowUrlAndStoreCodeVerifier,
  isAuthCode,
  isClientCredentials,
  isRefreshToken,
  queryParams,
  rest,
} from './helpers';
import { getKey } from './helpers/internal.helpers';
import type {
  Address,
  Addresses,
  AddressesQueryParams,
  AuthArgs,
  AuthCodePayload,
  AuthFlowOptions,
  AuthorizationCodeCredentials,
  Balances,
  BearerProfile,
  BearerTokenCredentials,
  ClassOptions,
  ClientCredentials,
  ClientCredentialsPayload,
  ENV,
  Environment,
  IBAN,
  IbansQueryParams,
  IBANsResponse,
  LinkAddress,
  MoveIbanPayload,
  NewOrder,
  Order,
  OrderFilter,
  OrderNotificationQueryParams,
  PKCERequestArgs,
  Profile,
  ProfilesQueryParams,
  ProfilesResponse,
  RefreshTokenPayload,
  RequestIbanPayload,
  ResponseStatus,
  SignUpPayload,
  SignUpResponse,
  SubmitProfileDetailsPayload,
  SupportingDoc,
  Token,
} from './types';
import { mapChainIdToChain, parseChain, urlEncoded } from './utils';

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
   * Sockets will be available after subscribing to an event
   * */
  #sockets?: Map<string, WebSocket> = new Map();

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
   *  redirectUri: 'your-redirect-url'
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

      // if (!isServer) {
      if (!(envOrOptions as ClientCredentials)?.clientSecret) {
        const { clientId, redirectUri } =
          envOrOptions as AuthorizationCodeCredentials;
        this.#client = {
          clientId,
          redirectUri,
        };
      } else {
        console.error(
          '\x1b[31m%s\x1b[0m',
          'Use client credentials only on the server where the secret is secure!'
        );
        const { clientId, clientSecret } = envOrOptions as ClientCredentials;
        this.#client = {
          clientId: clientId as string,
          clientSecret: clientSecret as string,
        };
      }
    }
  }

  /**
   * Construct the url to the authorization code flow and redirects,
   * Code Verifier needed for the code challenge is stored in local storage
   * For automatic wallet link, add the following properties: `address`, `signature` & `chain`
   * @returns string
   * {@link https://monerium.dev/api-docs-v2#tag/auth/operation/auth}
   * @category Authentication
   */
  async authorize(client?: AuthFlowOptions) {
    const clientId =
      client?.clientId ||
      (this.#client as AuthorizationCodeCredentials)?.clientId;
    const redirectUri =
      client?.redirectUri ||
      (this.#client as AuthorizationCodeCredentials)?.redirectUri;

    if (!clientId) {
      throw new Error('Missing ClientId');
    }

    const authFlowUrl = getAuthFlowUrlAndStoreCodeVerifier(this.#env.api, {
      client_id: clientId,
      redirect_uri: redirectUri,
      address: client?.address,
      signature: client?.signature,
      chain: client?.chain,
      state: client?.state,
      skipCreateAccount: client?.skipCreateAccount,
    });

    // Redirect to the authFlow
    window.location.assign(authFlowUrl);
  }

  /**
   * Will redirect to the authorization code flow and store the code verifier in the local storage
   * @param {AuthorizationCodeCredentials | ClientCredentials} client - the client credentials
   * @returns boolean to indicate if access has been granted
   * @category Authentication
   * @example
   *   import { MoneriumClient } from '@monerium/sdk';
   *  // Initialize the client with credentials
   *  const monerium = new MoneriumClient({
   *    environment: 'sandbox',
   *    clientId: 'your_client_credentials_uuid', // replace with your client ID
   *    clientSecret: 'your_client_secret', // replace with your client secret
   *  });
   *
   * await monerium.getAccess();
   */
  async getAccess(
    client?: AuthorizationCodeCredentials | ClientCredentials
  ): Promise<boolean> {
    const clientId = client?.clientId || this.#client?.clientId;
    const clientSecret =
      (client as ClientCredentials)?.clientSecret ||
      (this.#client as ClientCredentials)?.clientSecret;

    if (clientSecret) {
      console.error(
        '\x1b[31m%s\x1b[0m',
        'Use client credentials only on the server where the secret is secure!'
      );

      await this.#clientCredentialsAuthorization(
        this.#client as ClientCredentials
      );
      return !!this.bearerProfile;
    }

    const redirectUri =
      (client as AuthorizationCodeCredentials)?.redirectUri ||
      (this.#client as AuthorizationCodeCredentials)?.redirectUri;

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
      await this.#authCodeAuthorization(
        clientId,
        redirectUri as string,
        authCode,
        state
      );
    }

    return !!this.bearerProfile;
  }

  /**
   * {@link https://monerium.dev/api-docs-v2#tag/auth/operation/auth-token}
   */
  async #grantAccess(args: AuthArgs): Promise<BearerProfile> {
    let params:
      | AuthCodePayload
      | RefreshTokenPayload
      | ClientCredentialsPayload;

    if (isAuthCode(args)) {
      params = { ...args, grant_type: 'authorization_code' } as AuthCodePayload;
    } else if (isRefreshToken(args)) {
      params = { ...args, grant_type: 'refresh_token' } as RefreshTokenPayload;
    } else if (isClientCredentials(args)) {
      params = {
        ...args,
        grant_type: 'client_credentials',
      } as ClientCredentialsPayload;
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
   * {@link https://monerium.dev/api-docs-v2#tag/profiles/operation/profile}
   * @param {string} profile - the id of the profile to fetch.
   * @category Profiles
   */
  getProfile(profile: string): Promise<Profile> {
    return this.#api<Profile>('get', `profiles/${profile}`);
  }
  /**
   * {@link https://monerium.dev/api-docs-v2#tag/profiles/operation/profiles}
   * @category Profiles
   */
  getProfiles(params?: ProfilesQueryParams): Promise<ProfilesResponse> {
    return this.#api<ProfilesResponse>('get', `profiles${queryParams(params)}`);
  }
  /**
   * {@link https://monerium.dev/api-docs-v2#tag/addresses/operation/address}
   * @param {string} address - The public key of the blockchain account.
   * @category Addresses
   */
  getAddress(address: string): Promise<Address> {
    return this.#api<Address>('get', `addresses/${address}`);
  }

  /**
   * {@link https://monerium.dev/api-docs-v2#tag/addresses/operation/addresses}
   * @param {string} profile - the id of the profile to filter.
   * @param {Chain | ChainId} chain - the chain to filter.
   * @category Addresses
   */
  getAddresses({
    profile,
    chain,
  }: AddressesQueryParams = {}): Promise<Addresses> {
    const params = queryParams({
      profile,
      chain: chain ? parseChain(chain) : chain,
    });
    return this.#api<Addresses>('get', `addresses${params}`);
  }

  /**
   * {@link https://monerium.dev/api-docs-v2#tag/addresses/operation/profile-balances}
   * @param {string} profileId - the id of the profile to fetch balances.
   * @category Addresses
   */
  getBalances(profile: string): Promise<Balances[]> {
    return this.#api<Balances[]>('get', `profiles/${profile}/balances`);
  }

  /**
   * {@link "https://monerium.dev/api-docs-v2#tag/ibans/operation/iban"}
   * @category IBANs
   */
  getIban(iban: string): Promise<IBAN> {
    return this.#api<IBAN>('get', `ibans/${encodeURI(iban)}`);
  }
  /**
   * {@link "https://monerium.dev/api-docs-v2#tag/ibans/operation/ibans"}
   * @category IBANs
   */
  getIbans(queryParameters?: IbansQueryParams): Promise<IBANsResponse> {
    const { profile, chain } = queryParameters || {};
    const params = queryParams({
      profile,
      chain: chain ? parseChain(chain) : '',
    });
    return this.#api<IBANsResponse>('get', `ibans${params}`);
  }

  /**
   * {@link https://monerium.dev/api-docs-v2#tag/orders}
   * @category Orders
   */
  getOrders(filter?: OrderFilter): Promise<Order[]> {
    return this.#api<Order[]>('get', `orders${queryParams(filter)}`);
  }
  /**
   * {@link https://monerium.dev/api-docs-v2#tag/order}
   * @category Orders
   */
  getOrder(orderId: string): Promise<Order> {
    return this.#api<Order>('get', `orders/${orderId}`);
  }

  /**
   * {@link https://monerium.dev/api-docs-v2#tag/tokens}
   * @category Tokens
   */
  getTokens(): Promise<Token[]> {
    return this.#api<Token[]>('get', 'tokens');
  }

  // -- Write Methods

  /**
   * {@link https://monerium.dev/api-docs-v2#tag/addresses/operation/link-address}
   * @category Addresses
   */
  linkAddress(body: LinkAddress): Promise<ResponseStatus> {
    body = mapChainIdToChain(body);
    return this.#api<ResponseStatus>('post', `addresses`, JSON.stringify(body));
  }

  /**
   * {@link https://monerium.dev/api-docs-v2#tag/orders/operation/post-orders}
   * @category Orders
   */
  placeOrder(order: NewOrder): Promise<Order> {
    const body = {
      kind: 'redeem',
      ...mapChainIdToChain(order),
      counterpart: {
        ...order.counterpart,
        identifier: mapChainIdToChain(order.counterpart.identifier),
      },
    };

    return this.#api<Order>('post', `orders`, JSON.stringify(body));
  }

  /**
   * {@link https://monerium.dev/api-docs-v2#tag/ibans/operation/move-iban}
   * @category IBANs
   */
  moveIban(
    iban: string,
    { address, chain }: MoveIbanPayload
  ): Promise<ResponseStatus> {
    return this.#api<ResponseStatus>(
      'patch',
      `ibans/${iban}`,
      JSON.stringify({ address, chain: parseChain(chain) })
    );
  }
  /**
   * {@link https://monerium.dev/api-docs-v2#tag/ibans/operation/request-iban}
   * @category IBANs
   */
  requestIban({
    address,
    chain,
    emailNotifications = true, // TODO: needs documentation
  }: RequestIbanPayload): Promise<ResponseStatus> {
    return this.#api<ResponseStatus>(
      'post',
      `ibans`,
      JSON.stringify({ address, chain: parseChain(chain), emailNotifications })
    );
  }

  /**
   * {@link https://monerium.dev/api-docs-v2#tag/auth/operation/auth-signup}
   * @category Authentication
   */
  signUp(body: SignUpPayload): Promise<SignUpResponse> {
    return this.#api<SignUpResponse>(
      'post',
      `auth/signup`,
      JSON.stringify(body)
    );
  }

  /**
   * {@link https://monerium.dev/api-docs-v2#tag/profiles/operation/profile-details}
   * @category Profiles
   */
  submitProfileDetails(
    profile: string,
    body: SubmitProfileDetailsPayload
  ): Promise<ResponseStatus> {
    return this.#api<ResponseStatus>(
      'put',
      `profiles/${profile}/details`,
      JSON.stringify(body)
    );
  }

  /**
   * {@link https://monerium.dev/api-docs-v2#tag/orders/operation/supporting-document}
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
    const headers: Record<string, string> = {
      Authorization: this.#authorizationHeader || '',
      Accept: 'application/vnd.monerium.api-v2+json',
      'Content-Type': `application/${
        isFormEncoded ? 'x-www-form-urlencoded' : 'json'
      }`,
    };

    return rest<T>(
      `${this.#env.api}/${resource}`,
      method,
      isFormEncoded ? urlEncoded(body as Record<string, string>) : body,
      headers
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
    redirectUri: string,
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
      redirect_uri: redirectUri as string,
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
   * [Websocket](https://monerium.dev/api-docs-v2#tag/orders/operation/orders-notifications)
   */
  connectOrderNotifications({
    filter,
    onMessage,
    onError,
  }: {
    filter?: OrderNotificationQueryParams;
    onMessage?: (data: Order) => void;
    onError?: (err: Event) => void;
  } = {}): WebSocket | undefined {
    if (!this.bearerProfile?.access_token) return;

    const { profile, state } = filter || {};
    const params = queryParams({
      access_token: this.bearerProfile?.access_token,
      profile,
      state,
    });

    let socket;
    const key = getKey({ profile, state });
    if (this.#sockets?.has(key)) {
      socket = this.#sockets.get(key) as WebSocket;
    } else {
      const socketUrl = `${this.#env.wss}/orders${params}`;
      socket = new WebSocket(socketUrl);
      this.#sockets?.set(key, socket);
    }

    socket.onopen = () => {
      console.log('Connected to WebSocket server');
    };
    socket.onmessage = (data) => {
      const parsedData = JSON.parse(data.data);
      if (onMessage) {
        onMessage(parsedData);
      }
    };
    socket.onclose = () => {
      console.log('WebSocket connection closed');
      this.#sockets?.delete(params);
    };
    socket.onerror = (err) => {
      if (onError) {
        onError(err);
      }
      console.error('WebSocket error:', err);
    };
    return socket;
  }

  /**
   * Closes the order notifications sockets
   * @category Orders
   * [Websocket](https://monerium.dev/api-docs-v2#tag/orders/operation/orders-notifications)
   */
  disconnectOrderNotifications(queryParameters?: OrderNotificationQueryParams) {
    if (queryParameters) {
      const key = getKey({
        profile: queryParameters?.profile,
        state: queryParameters?.state,
      });
      const socket = this.#sockets?.get(key);
      if (socket) {
        socket.close();
        this.#sockets?.delete(key);
      }
    } else {
      this.#sockets?.forEach((socket) => {
        socket?.close();
      });

      this.#sockets?.clear();
      this.#sockets = undefined;
    }
  }

  /**
   * Cleanups the socket and the subscriptions
   * @category Authentication
   */
  async disconnect() {
    if (!isServer) {
      localStorage.removeItem(STORAGE_CODE_VERIFIER);
    }
    this.disconnectOrderNotifications();
    this.#authorizationHeader = undefined;
    this.bearerProfile = undefined;
  }
  /**
   * Revokes access
   * @category Authentication
   */
  async revokeAccess() {
    if (!isServer) {
      localStorage.removeItem(STORAGE_REFRESH_TOKEN);
    }
    this.disconnect();
  }

  // -- Getters (mainly for testing)
  /**
   * @hidden
   */
  getEnvironment = (): Environment => this.#env;
  /**
   * @hidden
   */
  getAuthFlowURI = (args: PKCERequestArgs): string => {
    const url = getAuthFlowUrlAndStoreCodeVerifier(this.#env.api, args);
    this.codeVerifier = localStorage.getItem(STORAGE_CODE_VERIFIER) as string;
    return url;
  };
}
