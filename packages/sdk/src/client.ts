import { MONERIUM_CONFIG } from './config';
import { MoneriumApiError, MoneriumSdkError } from './errors';
import { queryParams } from './helpers';
import type { Transport } from './transport';
import { defaultTransport } from './transport';
import type {
  Address,
  AddressesQueryParams,
  AddressesResponse,
  AuthContext,
  Balances,
  Chain,
  ChainId,
  Currency,
  ENV,
  IBAN,
  IbansQueryParams,
  IBANsResponse,
  LinkAddress,
  LinkedAddress,
  MoveIbanPayload,
  NewOrder,
  Order,
  OrderFilter,
  OrdersResponse,
  Profile,
  ProfilesQueryParams,
  ProfilesResponse,
  RequestIbanPayload,
  ResponseStatus,
  SignaturesQueryParams,
  SignaturesResponse,
  SubmitProfileDetailsPayload,
  SupportingDoc,
  Token,
} from './types';
import { parseChain } from './utils';

/** Resolve chain field in an object without backwards-compat remapping. */
function resolveChain<T extends Record<string, unknown>>(obj: T): T {
  if (obj?.chain !== undefined) {
    return { ...obj, chain: parseChain(obj.chain as Chain | ChainId) };
  }
  return obj;
}

// ─── Client options ───────────────────────────────────────────────────────────

export type MoneriumClientOptions =
  | {
      environment?: ENV;
      getAccessToken: () => string | Promise<string>;
      accessToken?: never;
      transport?: Transport;
    }
  | {
      environment?: ENV;
      accessToken: string;
      getAccessToken?: never;
      transport?: Transport;
    }
  | {
      environment?: ENV;
      accessToken?: never;
      getAccessToken?: never;
      transport?: Transport;
    };

// ─── Factory ──────────────────────────────────────────────────────────────────

export function createMoneriumClient(options: MoneriumClientOptions) {
  const env = MONERIUM_CONFIG.environments[options.environment ?? 'sandbox'];
  const transport = options.transport ?? defaultTransport;

  async function getToken(): Promise<string | null> {
    if ('getAccessToken' in options && options.getAccessToken) {
      return options.getAccessToken();
    }
    if ('accessToken' in options && options.accessToken) {
      return options.accessToken;
    }
    return null;
  }

  async function request<T>(
    method: string,
    path: string,
    body?: unknown,
    isFormEncoded = false
  ): Promise<T> {
    const token = await getToken();

    const headers: Record<string, string> = {
      Accept: 'application/vnd.monerium.api-v2+json',
      'Content-Type': isFormEncoded
        ? 'application/x-www-form-urlencoded'
        : 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else if (path !== 'tokens') {
      // tokens is the only unauthenticated endpoint
      throw new MoneriumSdkError(
        'authentication_required',
        'No access token provided for authenticated endpoint'
      );
    }

    const { status, bodyText } = await transport({
      method: method.toUpperCase(),
      url: `${env.api}/${path}`,
      headers,
      body: body
        ? isFormEncoded
          ? (body as string)
          : JSON.stringify(body)
        : undefined,
    });

    // Empty body — return a minimal status response (e.g. 201, 202)
    if (!bodyText) {
      return { status } as unknown as T;
    }

    let json: unknown;
    try {
      json = JSON.parse(bodyText);
    } catch {
      throw new MoneriumApiError({
        code: status,
        status: 'Parse Error',
        message: bodyText,
      });
    }

    if (status < 200 || status >= 300) {
      throw new MoneriumApiError(
        json as { code: number; status: string; message: string }
      );
    }

    return json as T;
  }

  return {
    // ─── Auth ──────────────────────────────────────────────────────────────

    /**
     * @group Authentication
     * @see {@link https://docs.monerium.com/api#tag/auth/operation/auth-context | API Documentation}
     */
    getAuthContext: (): Promise<AuthContext> =>
      request<AuthContext>('GET', 'auth/context'),

    // ─── Profiles ──────────────────────────────────────────────────────────

    /**
     * @group Profiles
     * @param {string} profile - the id of the profile to fetch.
     * @see {@link https://docs.monerium.com/api#tag/profiles/operation/profile | API Documentation}
     */
    getProfile: (id: string): Promise<Profile> =>
      request<Profile>('GET', `profiles/${id}`),

    /**
     * @group Profiles
     * @see {@link https://docs.monerium.com/api#tag/profiles/operation/profiles | API Documentation}
     */
    getProfiles: (params?: ProfilesQueryParams): Promise<ProfilesResponse> =>
      request<ProfilesResponse>('GET', `profiles${queryParams(params)}`),

    /**
     * @group Profiles
     * @see {@link https://docs.monerium.com/api#tag/profiles/operation/profile-details | API Documentation}
     */
    submitProfileDetails: (
      profileId: string,
      body: SubmitProfileDetailsPayload
    ): Promise<ResponseStatus> =>
      request<ResponseStatus>('PUT', `profiles/${profileId}/details`, body),

    // ─── Addresses ─────────────────────────────────────────────────────────

    /**
     * Get details for a single address by using the address public key after the
     * address has been successfully linked to Monerium.
     *
     * @group Addresses
     * @param {string} address - The public key of the blockchain account.
     * @see {@link https://docs.monerium.com/api#tag/addresses/operation/address | API Documentation}
     */
    getAddress: (address: string): Promise<Address> =>
      request<Address>('GET', `addresses/${address}`),

    /**
     * @group Addresses
     * @param {AddressesQueryParams} [params] - No required parameters.
     * @see {@link https://docs.monerium.com/api#tag/addresses/operation/addresses | API Documentation}
     */
    getAddresses: (params?: AddressesQueryParams): Promise<AddressesResponse> =>
      request<AddressesResponse>(
        'GET',
        `addresses${queryParams(params ? resolveChain(params as Record<string, unknown>) : undefined)}`
      ),

    /**
     * @group Addresses
     * @see {@link https://docs.monerium.com/api#tag/addresses/operation/balances | API Documentation}
     */
    getBalances: (
      address: string,
      chain: Chain | ChainId,
      currencies?: Currency | Currency[]
    ): Promise<Balances> => {
      const resolvedChain = parseChain(chain);
      const currencyParams = Array.isArray(currencies)
        ? currencies.map((c) => `currency=${c}`).join('&')
        : currencies
          ? `currency=${currencies}`
          : '';

      return request<Balances>(
        'GET',
        `balances/${resolvedChain}/${address}${currencyParams ? `?${currencyParams}` : ''}`
      );
    },

    /**
     * Add a new address to the profile.
     *
     * @group Addresses
     * @see {@link https://docs.monerium.com/api#tag/addresses/operation/link-address | API Documentation}
     */
    linkAddress: (payload: LinkAddress): Promise<LinkedAddress> =>
      request<LinkedAddress>(
        'POST',
        'addresses',
        resolveChain(payload as unknown as Record<string, unknown>)
      ),

    // ─── IBANs ─────────────────────────────────────────────────────────────

    /**
     * Fetch details about a single IBAN.
     *
     * @group IBANs
     * @param {string} iban - the IBAN to fetch.
     * @see {@link https://docs.monerium.com/api#tag/ibans/operation/iban | API Documentation}
     */
    getIban: (iban: string): Promise<IBAN> =>
      request<IBAN>('GET', `ibans/${encodeURI(iban)}`),

    /**
     * Fetch all IBANs for the profile.
     *
     * @group IBANs
     * @see {@link https://docs.monerium.com/api#tag/ibans/operation/ibans | API Documentation}
     */
    getIbans: (params?: IbansQueryParams): Promise<IBANsResponse> => {
      const resolved = params
        ? resolveChain(params as unknown as Record<string, unknown>)
        : undefined;
      return request<IBANsResponse>('GET', `ibans${queryParams(resolved)}`);
    },

    /**
     * @group IBANs
     * @param {RequestIbanPayload} payload
     * @see {@link https://docs.monerium.com/api#tag/ibans/operation/request-iban | API Documentation}
     */
    requestIban: ({
      address,
      chain,
      emailNotifications = true,
    }: RequestIbanPayload): Promise<ResponseStatus> =>
      request<ResponseStatus>('POST', 'ibans', {
        address,
        chain: parseChain(chain),
        emailNotifications,
      }),

    /**
     * @group IBANs
     * @param {string} iban - the IBAN to move.
     * @param {MoveIbanPayload} payload - the payload to move the IBAN.
     * @see {@link https://docs.monerium.com/api#tag/ibans/operation/move-iban | API Documentation}
     */
    moveIban: (
      iban: string,
      { address, chain }: MoveIbanPayload
    ): Promise<ResponseStatus> =>
      request<ResponseStatus>('PATCH', `ibans/${iban}`, {
        address,
        chain: parseChain(chain),
      }),

    // ─── Orders ────────────────────────────────────────────────────────────

    /**
     * @group Orders
     * @see {@link https://docs.monerium.com/api#tag/order | API Documentation}
     */
    getOrder: (orderId: string): Promise<Order> =>
      request<Order>('GET', `orders/${orderId}`),

    /**
     * @group Orders
     * @see {@link https://docs.monerium.com/api#tag/orders | API Documentation}
     */
    getOrders: (filter?: OrderFilter): Promise<OrdersResponse> =>
      request<OrdersResponse>('GET', `orders${queryParams(filter)}`),

    /**
     * Place a new order.
     *
     * **Note:** For multi-signature orders, the API returns a 202 Accepted response
     * with `{status: 202, statusText: "Accepted"}` instead of the full Order object.
     *
     * @returns Promise that resolves to either:
     * - `Order` - Full order object for regular orders
     * - `ResponseStatus` - Status object for multi-sig orders
     *
     * @group Orders
     * @see {@link https://docs.monerium.com/api#tag/orders/operation/post-orders | API Documentation}
     */
    placeOrder: (order: NewOrder): Promise<Order | ResponseStatus> => {
      const body = {
        kind: 'redeem' as const,
        ...resolveChain(order as unknown as Record<string, unknown>),
        ...(order.counterpart && {
          counterpart: {
            ...order.counterpart,
            identifier: resolveChain(
              order.counterpart.identifier as unknown as Record<string, unknown>
            ),
          },
        }),
      };
      return request<Order | ResponseStatus>('POST', 'orders', body);
    },

    // ─── Tokens ────────────────────────────────────────────────────────────

    /**
     * @group Tokens
     * @see {@link https://docs.monerium.com/api#tag/tokens | API Documentation}
     */
    getTokens: (): Promise<Token[]> => request<Token[]>('GET', 'tokens'),

    // ─── Signatures ────────────────────────────────────────────────────────

    /**
     * Get pending signatures for the authenticated user.
     *
     * @group Signatures
     * @param {SignaturesQueryParams} [params] - Optional query parameters to filter signatures.
     * @see {@link https://docs.monerium.com/api#tag/signatures/operation/get-signatures | API Documentation}
     */
    getSignatures: (
      params?: SignaturesQueryParams
    ): Promise<SignaturesResponse> => {
      const resolved = params
        ? resolveChain(params as unknown as Record<string, unknown>)
        : undefined;
      return request<SignaturesResponse>(
        'GET',
        `signatures${queryParams(resolved)}`
      );
    },

    // ─── KYC ───────────────────────────────────────────────────────────────

    /**
     * @group Orders
     * @see {@link https://docs.monerium.com/api#tag/orders/operation/supporting-document | API Documentation}
     */
    uploadSupportingDocument: async (
      document: Blob
    ): Promise<SupportingDoc> => {
      const formData = new FormData();
      formData.append('file', document);

      // Bypass request() — FormData must not be JSON.stringified and
      // Content-Type must not be set manually (fetch sets the multipart boundary).
      const token = await getToken();
      const headers: Record<string, string> = {
        Accept: 'application/vnd.monerium.api-v2+json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const { status, bodyText } = await transport({
        method: 'POST',
        url: `${env.api}/files`,
        headers,
        body: formData as unknown as BodyInit,
      });

      const json = JSON.parse(bodyText);
      if (status < 200 || status >= 300) throw new MoneriumApiError(json);
      return json as SupportingDoc;
    },
  };
}
