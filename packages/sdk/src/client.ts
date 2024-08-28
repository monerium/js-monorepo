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

/**
 * In the [Monerium UI](https://monerium.app/), create an application to get the `clientId` and register your `redirectUri`.
 * ```ts
 * import { MoneriumClient } from '@monerium/sdk';
 *
 * const monerium = new MoneriumClient() // defaults to `sandbox`
 *
 * // or
 * new MoneriumClient('production')
 *
 * // or
 * new MoneriumClient({
 *  environment: 'sandbox',
 *  clientId: 'your-client-id',
 *  redirectUri: 'http://your-redirect-url.com/monerium'
 * });
 *
 * // or - server only
 * new MoneriumClient({
 *  environment: 'sandbox',
 *  clientId: 'your-client-id',
 *  clientSecret: 'your-client-secret'
 * })
 *```
 */
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
  /**
   * The client is authorized if the bearer profile is available
   */
  isAuthorized = !!this.bearerProfile;

  #client?: BearerTokenCredentials;
  /**
   * The state parameter is used to maintain state between the request and the callback.
   * */
  state: string | undefined;

  /**
   * @defaultValue `sandbox`
   * */
  constructor(envOrOptions?: ENV | ClassOptions) {
    // No arguments, default to sandbox
    if (!envOrOptions) {
      this.#env = MONERIUM_CONFIG.environments['sandbox'];
      return;
    }

    if (typeof envOrOptions === 'string') {
      this.#env = MONERIUM_CONFIG.environments[envOrOptions];
    } else {
      this.#env =
        MONERIUM_CONFIG.environments[envOrOptions.environment || 'sandbox'];

      if (!isServer && !(envOrOptions as ClientCredentials)?.clientSecret) {
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
   *
   * Construct the url to the authorization code flow and redirects,
   * Code Verifier needed for the code challenge is stored in local storage
   * For automatic wallet link, add the following properties: `address`, `signature` & `chain`
   *
   * @group Authentication
   * @see {@link https://monerium.dev/api-docs-v2#tag/auth/operation/auth | API Documentation}
   * @param {AuthFlowOptions} [params] - the auth flow params
   * @returns string
   *
   */
  async authorize(params?: AuthFlowOptions) {
    const clientId =
      params?.clientId ||
      (this.#client as AuthorizationCodeCredentials)?.clientId;
    const redirectUri =
      params?.redirectUri ||
      (this.#client as AuthorizationCodeCredentials)?.redirectUri;

    if (!clientId) {
      throw new Error('Missing ClientId');
    }

    const authFlowUrl = getAuthFlowUrlAndStoreCodeVerifier(this.#env.api, {
      client_id: clientId,
      redirect_uri: redirectUri,
      address: params?.address,
      signature: params?.signature,
      chain: params?.chain,
      state: params?.state,
      skipCreateAccount: params?.skipCreateAccount,
    });

    // Redirect to the authFlow
    window.location.assign(authFlowUrl);
  }

  /**
   * Will redirect to the authorization code flow and store the code verifier in the local storage
   *
   * @group Authentication
   *
   * @param {AuthorizationCodeCredentials | ClientCredentials} client - the client credentials
   *
   * @returns boolean to indicate if access has been granted
   *
   * @example
   * ```ts
   *   import { MoneriumClient } from '@monerium/sdk';
   *  // Initialize the client with credentials
   *  const monerium = new MoneriumClient({
   *    environment: 'sandbox',
   *    clientId: 'your_client_credentials_uuid', // replace with your client ID
   *    clientSecret: 'your_client_secret', // replace with your client secret
   *  });
   *
   * await monerium.getAccess();
   * ```
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
      if (isServer) {
        await this.#clientCredentialsAuthorization(
          this.#client as ClientCredentials
        );
      }
      return !!this?.bearerProfile;
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
   * https://monerium.dev/api-docs-v2#tag/auth/operation/auth-token
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

  /**
   * @group Profiles
   * @param {string} profile - the id of the profile to fetch.
   * @see {@link https://monerium.dev/api-docs-v2#tag/profiles/operation/profile | API Documentation}
   */
  getProfile(profile: string): Promise<Profile> {
    return this.#api<Profile>('get', `profiles/${profile}`);
  }
  /**
   * @group Profiles
   * @see {@link https://monerium.dev/api-docs-v2#tag/profiles/operation/profiles | API Documentation}
   */
  getProfiles(params?: ProfilesQueryParams): Promise<ProfilesResponse> {
    return this.#api<ProfilesResponse>('get', `profiles${queryParams(params)}`);
  }
  /**
   *
   * Get details for a single address by using the address public key after the address has been successfully linked to Monerium.
   *
   * @group Addresses
   * @param {string} address - The public key of the blockchain account.
   *
   * @see {@link https://monerium.dev/api-docs-v2#tag/addresses/operation/address | API Documentation}
   *
   * @example
   * ```ts
   *  monerium.getAddress('0x1234567890abcdef1234567890abcdef12345678')
   * ```
   */
  getAddress(address: string): Promise<Address> {
    return this.#api<Address>('get', `addresses/${address}`);
  }

  /**
   * @group Addresses
   * @param {AddressesQueryParams} [params] - No required parameters.
   * @see {@link https://monerium.dev/api-docs-v2#tag/addresses/operation/addresses | API Documentation}
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
   * @group Addresses
   * @param {string} profile - the id of the profile to fetch balances.
   * @see {@link https://monerium.dev/api-docs-v2#tag/addresses/operation/profile-balances | API Documentation}
   */
  getBalances(profile: string): Promise<Balances[]> {
    return this.#api<Balances[]>('get', `profiles/${profile}/balances`);
  }

  /**
   * Fetch details about a single IBAN
   *
   * @group IBANs
   * @param {string} iban - the IBAN to fetch.
   * @see {@link https://monerium.dev/api-docs-v2#tag/ibans/operation/iban | API Documentation}
   */
  getIban(iban: string): Promise<IBAN> {
    return this.#api<IBAN>('get', `ibans/${encodeURI(iban)}`);
  }
  /**
   * Fetch all IBANs for the profile
   * @group IBANs
   * @see {@link https://monerium.dev/api-docs-v2#tag/ibans/operation/ibans | API Documentation}
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
   * @group Orders
   * @see {@link https://monerium.dev/api-docs-v2#tag/orders | API Documentation}
   */
  getOrders(filter?: OrderFilter): Promise<Order[]> {
    return this.#api<Order[]>('get', `orders${queryParams(filter)}`);
  }
  /**
   * @group Orders
   * @see {@link https://monerium.dev/api-docs-v2#tag/order | API Documentation}
   */
  getOrder(orderId: string): Promise<Order> {
    return this.#api<Order>('get', `orders/${orderId}`);
  }

  /**
   * @group Tokens
   * @see {@link https://monerium.dev/api-docs-v2#tag/tokens | API Documentation}
   */
  getTokens(): Promise<Token[]> {
    return this.#api<Token[]>('get', 'tokens');
  }

  /**
   * Add a new address to the profile
   * @group Addresses
   * @see {@link https://monerium.dev/api-docs-v2#tag/addresses/operation/link-address | API Documentation}
   */
  linkAddress(payload: LinkAddress): Promise<ResponseStatus> {
    payload = mapChainIdToChain(payload);
    return this.#api<ResponseStatus>(
      'post',
      `addresses`,
      JSON.stringify(payload)
    );
  }

  /**
   * @see {@link https://monerium.dev/api-docs-v2#tag/orders/operation/post-orders | API Documentation}
   *
   * @group Orders
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
   * @group IBANs
   * @param {string} iban - the IBAN to move.
   * @param {MoveIbanPayload} payload - the payload to move the IBAN.
   * @see {@link https://monerium.dev/api-docs-v2#tag/ibans/operation/move-iban | API Documentation}
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
   * @group IBANs
   * @param {RequestIbanPayload} payload
   * @see {@link https://monerium.dev/api-docs-v2#tag/ibans/operation/request-iban | API Documentation}
   */
  requestIban({
    address,
    chain,
    emailNotifications = true,
  }: RequestIbanPayload): Promise<ResponseStatus> {
    return this.#api<ResponseStatus>(
      'post',
      `ibans`,
      JSON.stringify({ address, chain: parseChain(chain), emailNotifications })
    );
  }

  /**
   * @group Authentication
   * @see {@link https://monerium.dev/api-docs-v2#tag/auth/operation/auth-signup | API Documentation}
   */
  signUp(payload: SignUpPayload): Promise<SignUpResponse> {
    return this.#api<SignUpResponse>(
      'post',
      `auth/signup`,
      JSON.stringify(payload)
    );
  }

  /**
   * @group Profiles
   * @see {@link https://monerium.dev/api-docs-v2#tag/profiles/operation/profile-details | API Documentation}
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
   * @group Orders
   * @see {@link https://monerium.dev/api-docs-v2#tag/orders/operation/supporting-document | API Documentation}
   */
  uploadSupportingDocument(document: File): Promise<SupportingDoc> {
    const formData = new FormData();

    formData.append('file', document as unknown as Blob);

    return rest<SupportingDoc>(`${this.#env.api}/files`, 'post', formData, {
      Authorization: this.#authorizationHeader || '',
    });
  }

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

  /**
   * Connects to the order notifications socket
   *
   * @group Orders
   * @param {OrderNotificationQueryParams} [params]
   * @see {@link https://monerium.dev/api-docs-v2#tag/orders/operation/orders-notifications | API Document - Websocket}

   */
  connectOrderNotifications({
    filter,
    onMessage,
    onError,
  }: {
    /** specify which type of orders to listen to */
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
   *
   * @group Orders
   * @param {OrderNotificationQueryParams} [params] - specify which socket to close or close all if not provided
   * @see {@link https://monerium.dev/api-docs-v2#tag/orders/operation/orders-notifications | API Document - Websocket}
   */
  disconnectOrderNotifications(params?: OrderNotificationQueryParams) {
    if (params) {
      const key = getKey({
        profile: params?.profile,
        state: params?.state,
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
   * Cleanups the localstorage and websocket connections
   *
   * @group Authentication
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
   *
   * @group Authentication
   */
  async revokeAccess() {
    if (!isServer) {
      localStorage.removeItem(STORAGE_REFRESH_TOKEN);
    }
    this.disconnect();
  }

  /**
   *
   * @hidden
   */
  getEnvironment = (): Environment => this.#env;
  /**
   *
   * @hidden
   */
  getAuthFlowURI = (args: PKCERequestArgs): string => {
    const url = getAuthFlowUrlAndStoreCodeVerifier(this.#env.api, args);
    this.codeVerifier = localStorage.getItem(STORAGE_CODE_VERIFIER) as string;
    return url;
  };
}
