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
  CreateProfileInput,
  ENV,
  FileResponse,
  GetBalancesParams,
  GetProfilesParams,
  IBAN,
  IbansParams,
  IbansQueryParams,
  IBANsResponse,
  LinkAddressInput,
  LinkAddressResponse,
  MoveIbanInput,
  Order,
  OrderParams,
  OrdersResponse,
  PlaceOrderInput,
  Profile,
  ProfilesResponse,
  RequestIbanInput,
  ShareProfileKYCInput,
  SignaturesParams,
  SignaturesQueryParams,
  SignaturesResponse,
  SupportingDoc,
  Token,
  UpdateProfileDetailsInput,
  UpdateProfileFormInput,
  UpdateProfileVerificationsInput,
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
   * @param profileId - The id of the profile to fetch.
   * @see {@link https://docs.monerium.com/api#tag/profiles/operation/profile | API Documentation}
   */
  getProfile(profileId: string): Promise<Profile>;

  /**
   * Get all profiles.
   *
   * @group Profiles
   * @see {@link https://docs.monerium.com/api#tag/profiles/operation/profiles | API Documentation}
   */
  getProfiles(params?: GetProfilesParams): Promise<ProfilesResponse>;

  /**
   * Creates a new profile.
   *
   * @group Profiles
   * @see {@link https://docs.monerium.com/api#tag/profiles/operation/create-profile | API Documentation}
   */
  createProfile(input: CreateProfileInput): Promise<Profile>;

  // TODO: Body is most likely incomplete, missing corporate, endpoint is not live yet.

  /**
   * Share KYC data
   *
   * @group Profiles
   * @returns {Promise<AcceptedResponse>} The KYC data import has been initiated. Subscribe to `profile.update` webhook to monitor the progress.
   * @see {@link https://docs.monerium.com/api#tag/profiles/operation/share-profile-kyc | API Documentation}
   *
   * @ignore NOT YET LIVE
   */
  shareProfileKYC(input: ShareProfileKYCInput): Promise<AcceptedResponse>;

  /**
   * Submit the compliance details for a profile. Updates only the `details` section without affecting other sections.
   *
   * > **KYC reliance model only.** Most integrations should use `shareProfileKYC()` to populate details via Sumsub instead.
   *
   * @group Profiles
   * @see {@link https://docs.monerium.com/api#tag/profiles/operation/patch-profile-details | API Documentation}
   * @returns {Promise<AcceptedResponse>} The applicant details have been received and will be processed by Monerium.
   */
  updateProfileDetails(
    input: UpdateProfileDetailsInput
  ): Promise<AcceptedResponse>;

  /**
   * Submit additional data for a profile used for risk calculations (e.g. purpose of account, source of funds). Updates only the `form` section without affecting other sections.
   *
   * @group Profiles
   * @see {@link https://docs.monerium.com/api#tag/profiles/operation/patch-profile-form | API Documentation}
   * @returns {Promise<AcceptedResponse>} The profile form has been received and will be processed by Monerium.
   */
  updateProfileForm(input: UpdateProfileFormInput): Promise<AcceptedResponse>;

  /**
   * Submit verifications for a profile. Only the verifications provided are updated. `sourceOfFunds is submitted here by all partners when required; other verification kinds are populated automatically when using the Sumsub share flow.
   *
   * @group Profiles
   * @see {@link https://docs.monerium.com/api#tag/profiles/operation/patch-profile-verifications | API Documentation}
   * @returns {Promise<AcceptedResponse>} The verification data has been received and will be processed by Monerium.
   */
  updateProfileVerifications(
    input: UpdateProfileVerificationsInput
  ): Promise<AcceptedResponse>;

  // ─── Addresses ───────────────────────────────────────────────────────────
  /**
   * Get details for a single address after it has been linked to Monerium.
   * @param address - The public key of the blockchain account.
   *
   * @group Addresses
   * @see {@link https://docs.monerium.com/api#tag/addresses/operation/address | API Documentation}
   */
  getAddress(address: string): Promise<Address>;

  /**
   * Get a list of all addresses linked to the profile.
   *
   * @group Addresses
   * @see {@link https://docs.monerium.com/api#tag/addresses/operation/addresses | API Documentation}
   */
  getAddresses(params?: AddressesQueryParams): Promise<AddressesResponse>;

  /**
   * Add a new address to the profile.
   *
   * @group Addresses
   * @see {@link https://docs.monerium.com/api#tag/addresses/operation/link-address | API Documentation}
   * @returns {LinkAddressResponse | AcceptedResponse} - The address was linked successfully or an accepted response if the address is being processed asynchronously.
   */
  linkAddress(
    body: LinkAddressInput
  ): Promise<LinkAddressResponse | AcceptedResponse>;

  /**
   * Get the balances for a given address on a specific chain.
   *
   * @group Addresses
   * @see {@link https://docs.monerium.com/api#tag/addresses/operation/balances | API Documentation}
   */
  getBalances(params: GetBalancesParams): Promise<Balances>;

  // ─── IBANs ───────────────────────────────────────────────────────────────
  /**
   * Fetch details about a single IBAN.
   * @param iban - The IBAN to fetch.
   *
   * @group IBANs
   * @see {@link https://docs.monerium.com/api#tag/ibans/operation/iban | API Documentation}
   */
  getIban(iban: string): Promise<IBAN>;

  /**
   * Fetch all IBANs for the profile.
   *
   * @group IBANs
   * @see {@link https://docs.monerium.com/api#tag/ibans/operation/ibans | API Documentation}
   */
  getIbans(params?: IbansParams): Promise<IBANsResponse>;

  /**
   * Request an IBAN for the profile.
   *
   * @group IBANs
   * @see {@link https://docs.monerium.com/api#tag/ibans/operation/request-iban | API Documentation}
   */
  requestIban(input: RequestIbanInput): Promise<AcceptedResponse>;

  /**
   * Move an IBAN to a different address and chain.
   *
   * @group IBANs
   * @see {@link https://docs.monerium.com/api#tag/ibans/operation/move-iban | API Documentation}
   */
  moveIban(input: MoveIbanInput): Promise<AcceptedResponse>;

  // ─── Orders ──────────────────────────────────────────────────────────────
  /**
   * Get an order by its ID.
   *
   * @group Orders
   * @see {@link https://docs.monerium.com/api/#tag/orders/operation/order | API Documentation}
   */
  getOrder(orderId: string): Promise<Order>;

  /**
   * Get a list of orders.
   *
   * @group Orders
   * @see {@link https://docs.monerium.com/api/#tag/orders/operation/orders | API Documentation}
   */
  getOrders(params?: OrderParams): Promise<OrdersResponse>;

  /**
   * Place a new order.
   *
   * **Note:** For multi-signature orders, the API returns a 202 Accepted response
   * with `{ status: 202, statusText: "Accepted" }` instead of the full Order object.
   *
   * @returns `Order` for regular orders; `AcceptedResponse` for multi-sig orders.
   * @group Orders
   * @see {@link https://docs.monerium.com/api#tag/orders/operation/post-orders | API Documentation}
   */
  placeOrder(input: PlaceOrderInput): Promise<Order | AcceptedResponse>;

  // ─── Tokens ──────────────────────────────────────────────────────────────
  /**
   * Get Monerium tokens with contract addresses and chain details.
   *
   * @group Tokens
   * @see {@link https://docs.monerium.com/api#tag/tokens | API Documentation}
   */
  getTokens(): Promise<Token[]>;

  // ─── Signatures ──────────────────────────────────────────────────────────
  /**
   * Get pending signatures for the authenticated user.
   *
   * @group Signatures
   * @see {@link https://docs.monerium.com/api#tag/signatures/operation/get-signatures | API Documentation}
   */
  getSignatures(params?: SignaturesParams): Promise<SignaturesResponse>;

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
   * @group Files
   */
  uploadSupportingDocument(
    file: Blob | Uint8Array | ArrayBuffer,
    filename?: string
  ): Promise<FileResponse>;
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

    getProfiles: (params?: GetProfilesParams) =>
      request<ProfilesResponse>('GET', `profiles${queryParams(params)}`),

    createProfile: (input: CreateProfileInput) =>
      request<Profile>('POST', 'profiles', input),

    shareProfileKYC: ({ profile, ...body }: ShareProfileKYCInput) =>
      request<AcceptedResponse>('POST', `profiles/${profile}/share`, body),

    updateProfileDetails: ({ profile, ...body }: UpdateProfileDetailsInput) =>
      request<AcceptedResponse>('PATCH', `profiles/${profile}/details`, body),

    updateProfileForm: ({ profile, ...body }: UpdateProfileFormInput) =>
      request<AcceptedResponse>('PATCH', `profiles/${profile}/form`, body),

    updateProfileVerifications: ({
      profile,
      ...body
    }: UpdateProfileVerificationsInput) =>
      request<AcceptedResponse>(
        'PATCH',
        `profiles/${profile}/verifications`,
        body
      ),

    getAddress: (address: string) =>
      request<Address>('GET', `addresses/${address}`),

    getAddresses: (params?: AddressesQueryParams) =>
      request<AddressesResponse>(
        'GET',
        `addresses${queryParams(params ? resolveChain(params as Record<string, unknown>) : undefined)}`
      ),

    getBalances: ({ address, chain, currencies }: GetBalancesParams) => {
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

    linkAddress: (body: LinkAddressInput) =>
      request<LinkAddressResponse | AcceptedResponse>(
        'POST',
        'addresses',
        resolveChain(body as unknown as Record<string, unknown>)
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
    }: RequestIbanInput) =>
      request<AcceptedResponse>('POST', 'ibans', {
        address,
        chain: parseChain(chain),
        emailNotifications,
      }),

    moveIban: ({ iban, address, chain }: MoveIbanInput) =>
      request<AcceptedResponse>('PATCH', `ibans/${iban}`, {
        address,
        chain: parseChain(chain),
      }),

    getOrder: (orderId: string) => request<Order>('GET', `orders/${orderId}`),

    getOrders: (params?: OrderParams) =>
      request<OrdersResponse>('GET', `orders${queryParams(params)}`),

    placeOrder: (input: PlaceOrderInput) => {
      const body = {
        kind: 'redeem',
        ...resolveChain(input as unknown as Record<string, unknown>),
        ...(input.counterpart && {
          counterpart: {
            ...input.counterpart,
            identifier: resolveChain(
              input.counterpart.identifier as unknown as Record<string, unknown>
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
