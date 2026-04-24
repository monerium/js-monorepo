import { Chain, ChainId } from './chains';
import { MoneriumApiError, MoneriumSdkError } from './errors';
import { queryParams } from './helpers';
import { getEnv } from './helpers/internal.helpers';
import type { Transport } from './transport';
import { defaultTransport } from './transport';
import type {
  AcceptedResponse,
  Address,
  AddressesQueryParams,
  AddressesResponse,
  AuthContext,
  Balances,
  CreateProfileBody,
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
  ShareProfileKYCBody,
  SignaturesQueryParams,
  SignaturesResponse,
  SubmitProfileDetailsPayload,
  SupportingDoc,
  Token,
  UpdateProfileDetailsBody,
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

/**
 * @group Client
 * @category Types
 */
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

// ─── Client interface ─────────────────────────────────────────────────────────

/**
 * The client instance returned by {@link createMoneriumClient}.
 * Provides typed methods for every Monerium REST API endpoint.
 * @group Client
 * @category Interface
 */
export interface MoneriumClient {
  // ─── Auth ────────────────────────────────────────────────────────────────
  /**
   * Get the current auth context.
   *
   * @group Auth
   * @see {@link https://docs.monerium.com/api#tag/auth/operation/auth-context | API Documentation}
   */
  getAuthContext(): Promise<AuthContext>;

  // ─── Profiles ────────────────────────────────────────────────────────────
  /**
   * Get a profile by its id.
   *
   * @group Profiles
   * @param id - The id of the profile to fetch.
   * @see {@link https://docs.monerium.com/api#tag/profiles/operation/profile | API Documentation}
   */
  getProfile(id: string): Promise<Profile>;

  /**
   * Get all profiles.
   *
   * @group Profiles
   * @see {@link https://docs.monerium.com/api#tag/profiles/operation/profiles | API Documentation}
   */
  getProfiles(params?: ProfilesQueryParams): Promise<ProfilesResponse>;

  /**
   * Creates a new profile.
   *
   * @group Profiles
   * @see {@link https://docs.monerium.com/api#tag/profiles/operation/create-profile | API Documentation}
   */
  createProfile(body: CreateProfileBody): Promise<Profile>;

  /**
   * Share KYC data
   *
   * @group Profiles
   * @returns {Promise<AcceptedResponse>} The KYC data import has been initiated. Subscribe to `profile.update` webhook to monitor the progress.
   * @see {@link https://docs.monerium.com/api#tag/profiles/operation/share-profile-kyc | API Documentation}
   */
  shareProfileKYC(
    profileId: string,
    body: ShareProfileKYCBody
  ): Promise<AcceptedResponse>;

  /**
   * Submit the compliance details for a profile. Updates only the `details` section without affecting other sections.
   *
   * > **KYC reliance model only.** Most integrations should use `shareProfileKYC()` to populate details via Sumsub instead.
   *
   * @group Profiles
   * @see {@link https://docs.monerium.com/api#tag/profiles/operation/patch-profile-details | API Documentation}
   */
  updateProfileDetails(
    profileId: string,
    body: UpdateProfileDetailsBody
  ): Promise<AcceptedResponse>;

  /**
   * Submit profile details.
   *
   * @group Profiles
   * @see {@link https://docs.monerium.com/api#tag/profiles/operation/patch-profile-details | API Documentation}
   */
  submitProfileDetails(
    profileId: string,
    body: SubmitProfileDetailsPayload
  ): Promise<AcceptedResponse>;

  // ─── Addresses ───────────────────────────────────────────────────────────
  /**
   * Get details for a single address after it has been linked to Monerium.
   * @param address - The public key of the blockchain account.
   * @see {@link https://docs.monerium.com/api#tag/addresses/operation/address | API Documentation}
   */
  getAddress(address: string): Promise<Address>;

  /**
   * @see {@link https://docs.monerium.com/api#tag/addresses/operation/addresses | API Documentation}
   */
  getAddresses(params?: AddressesQueryParams): Promise<AddressesResponse>;

  /**
   * @see {@link https://docs.monerium.com/api#tag/addresses/operation/balances | API Documentation}
   */
  getBalances(
    address: string,
    chain: Chain | ChainId,
    currencies?: Currency | Currency[]
  ): Promise<Balances>;

  /**
   * Add a new address to the profile.
   * @see {@link https://docs.monerium.com/api#tag/addresses/operation/link-address | API Documentation}
   */
  linkAddress(payload: LinkAddress): Promise<LinkedAddress>;

  // ─── IBANs ───────────────────────────────────────────────────────────────
  /**
   * Fetch details about a single IBAN.
   * @param iban - The IBAN to fetch.
   * @see {@link https://docs.monerium.com/api#tag/ibans/operation/iban | API Documentation}
   */
  getIban(iban: string): Promise<IBAN>;

  /**
   * Fetch all IBANs for the profile.
   * @see {@link https://docs.monerium.com/api#tag/ibans/operation/ibans | API Documentation}
   */
  getIbans(params?: IbansQueryParams): Promise<IBANsResponse>;

  /**
   * @see {@link https://docs.monerium.com/api#tag/ibans/operation/request-iban | API Documentation}
   */
  requestIban(payload: RequestIbanPayload): Promise<AcceptedResponse>;

  /**
   * @param iban - The IBAN to move.
   * @param payload - The destination address and chain.
   * @see {@link https://docs.monerium.com/api#tag/ibans/operation/move-iban | API Documentation}
   */
  moveIban(iban: string, payload: MoveIbanPayload): Promise<AcceptedResponse>;

  // ─── Orders ──────────────────────────────────────────────────────────────
  /**
   * @see {@link https://docs.monerium.com/api/#tag/orders/operation/order | API Documentation}
   */
  getOrder(orderId: string): Promise<Order>;

  /**
   * @see {@link https://docs.monerium.com/api/#tag/orders/operation/orders | API Documentation}
   */
  getOrders(filter?: OrderFilter): Promise<OrdersResponse>;

  /**
   * Place a new order.
   *
   * **Note:** For multi-signature orders, the API returns a 202 Accepted response
   * with `{ status: 202, statusText: "Accepted" }` instead of the full Order object.
   *
   * @returns `Order` for regular orders; `AcceptedResponse` for multi-sig orders.
   * @see {@link https://docs.monerium.com/api#tag/orders/operation/post-orders | API Documentation}
   */
  placeOrder(order: NewOrder): Promise<Order | AcceptedResponse>;

  // ─── Tokens ──────────────────────────────────────────────────────────────
  /**
   * @see {@link https://docs.monerium.com/api#tag/tokens | API Documentation}
   */
  getTokens(): Promise<Token[]>;

  // ─── Signatures ──────────────────────────────────────────────────────────
  /**
   * Get pending signatures for the authenticated user.
   * @see {@link https://docs.monerium.com/api#tag/signatures/operation/get-signatures | API Documentation}
   */
  getSignatures(params?: SignaturesQueryParams): Promise<SignaturesResponse>;

  // ─── Files ───────────────────────────────────────────────────────────────
  /**
   * Upload a supporting document for KYC onboarding or order support using `multipart/form-data`.
   *
   * Accepts binary data in multiple formats and normalizes it to a {@link Blob}
   * internally before sending the request.
   *
   * @param file - The document to upload. Can be a {@link Blob}, {@link Uint8Array}, or {@link ArrayBuffer}.
   * @param filename - Optional filename to associate with the uploaded file.
   * If not provided, a default name will be inferred when possible, otherwise `"document"` is used.
   * @see {@link https://docs.monerium.com/api/#tag/files | API Documentation}
   * @remarks
   * This method constructs a {@link FormData} payload internally and sends it to the `POST /files` endpoint.
   * Consumers do not need to manually create or manage multipart form data.
   *
   */
  uploadSupportingDocument(
    file: Blob | Uint8Array | ArrayBuffer,
    filename?: string
  ): Promise<SupportingDoc>;
}

// ─── Factory ──────────────────────────────────────────────────────────────────

/**
 * Creates a Monerium API client.
 * @group Client
 * @category Functions
 */
export function createMoneriumClient(
  options: MoneriumClientOptions
): MoneriumClient {
  const env = getEnv(options.environment);
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

  async function requestFormData<T>(
    method: string,
    path: string,
    form: FormData
  ): Promise<T> {
    const token = await getToken();
    const headers: Record<string, string> = {
      Accept: 'application/vnd.monerium.api-v2+json',
      // Content-Type intentionally omitted — fetch sets multipart/form-data + boundary
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const { status, bodyText } = await transport({
      method: method.toUpperCase(),
      url: `${env.api}/${path}`,
      headers,
      body: form as unknown as BodyInit,
    });

    if (!bodyText) return { status } as unknown as T;

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

  async function request<T>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<T> {
    const token = await getToken();

    const headers: Record<string, string> = {
      Accept: 'application/vnd.monerium.api-v2+json',
      'Content-Type': 'application/json',
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
      body: body ? JSON.stringify(body) : undefined,
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
    getAuthContext: () => request<AuthContext>('GET', 'auth/context'),

    getProfile: (id: string) => request<Profile>('GET', `profiles/${id}`),

    getProfiles: (params?: ProfilesQueryParams) =>
      request<ProfilesResponse>('GET', `profiles${queryParams(params)}`),

    createProfile: (body: CreateProfileBody) =>
      request<Profile>('POST', 'profiles', body),

    shareProfileKYC: (profileId: string) =>
      request<AcceptedResponse>('POST', `profiles/${profileId}/share`),

    updateProfileDetails: (
      profileId: string,
      body: SubmitProfileDetailsPayload // TODO:!!!
    ) =>
      request<AcceptedResponse>('PATCH', `profiles/${profileId}/details`, body),

    // TODO REMOVE
    submitProfileDetails: (
      profileId: string,
      body: SubmitProfileDetailsPayload
    ) =>
      request<AcceptedResponse>('PATCH', `profiles/${profileId}/details`, body),

    getAddress: (address: string) =>
      request<Address>('GET', `addresses/${address}`),

    getAddresses: (params?: AddressesQueryParams) =>
      request<AddressesResponse>(
        'GET',
        `addresses${queryParams(params ? resolveChain(params as Record<string, unknown>) : undefined)}`
      ),

    getBalances: (
      address: string,
      chain: Chain | ChainId,
      currencies?: Currency | Currency[]
    ) => {
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

    linkAddress: (payload: LinkAddress) =>
      request<LinkedAddress>(
        'POST',
        'addresses',
        resolveChain(payload as unknown as Record<string, unknown>)
      ),

    getIban: (iban: string) => request<IBAN>('GET', `ibans/${encodeURI(iban)}`),

    getIbans: (params?: IbansQueryParams) => {
      const resolved = params
        ? resolveChain(params as unknown as Record<string, unknown>)
        : undefined;
      return request<IBANsResponse>('GET', `ibans${queryParams(resolved)}`);
    },

    requestIban: ({
      address,
      chain,
      emailNotifications = true,
    }: RequestIbanPayload) =>
      request<AcceptedResponse>('POST', 'ibans', {
        address,
        chain: parseChain(chain),
        emailNotifications,
      }),

    moveIban: (iban: string, { address, chain }: MoveIbanPayload) =>
      request<AcceptedResponse>('PATCH', `ibans/${iban}`, {
        address,
        chain: parseChain(chain),
      }),

    getOrder: (orderId: string) => request<Order>('GET', `orders/${orderId}`),

    getOrders: (filter?: OrderFilter) =>
      request<OrdersResponse>('GET', `orders${queryParams(filter)}`),

    placeOrder: (order: NewOrder) => {
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
      return request<Order | AcceptedResponse>('POST', 'orders', body);
    },

    getTokens: () => request<Token[]>('GET', 'tokens'),

    getSignatures: (params?: SignaturesQueryParams) => {
      const resolved = params
        ? resolveChain(params as unknown as Record<string, unknown>)
        : undefined;
      return request<SignaturesResponse>(
        'GET',
        `signatures${queryParams(resolved)}`
      );
    },

    uploadSupportingDocument: (
      file: Blob | Uint8Array | ArrayBuffer,
      filename?: string
    ) => {
      const blob = file instanceof Blob ? file : new Blob([file]);
      const formData = new FormData();
      formData.append(
        'file',
        blob,
        filename ?? ('name' in file ? String(file.name) : 'document')
      );
      return requestFormData<SupportingDoc>('POST', 'files', formData);
    },
  };
}
