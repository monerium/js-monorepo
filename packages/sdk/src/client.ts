import { Chain, ChainId } from './chains';
import { MoneriumApiError, MoneriumSdkError } from './errors';
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
  FilesResponse,
  GetBalancesParams,
  GetProfilesParams,
  IBAN,
  IbansParams,
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
  SignaturesResponse,
  Token,
  UpdateProfileDetailsInput,
  UpdateProfileFormInput,
  UpdateProfileVerificationsInput,
} from './types';
import { parseChain } from './utils';

function buildQueryString(params?: Record<string, any>): string {
  if (!params) return '';
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') {
      if (Array.isArray(v)) v.forEach((item) => qs.append(k, String(item)));
      else qs.append(k, String(v));
    }
  }
  const str = qs.toString();
  return str ? `?${str}` : '';
}

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
export type MoneriumApiClientOptions =
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

// ─── Request Context ──────────────────────────────────────────────────────────

function createRequestContext(options: MoneriumApiClientOptions) {
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
    } else if (!path.startsWith('tokens')) {
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

  return { env, request, requestFormData };
}

// ─── Standalone Functions ─────────────────────────────────────────────────────

// Auth
/**
 * Get the current auth context.
 *
 * @group Auth
 * @see {@link https://docs.monerium.com/api#tag/auth/operation/auth-context | API Documentation}
 */
export async function getAuthContext(
  options: MoneriumApiClientOptions
): Promise<AuthContext> {
  const { request } = createRequestContext(options);
  return request<AuthContext>('GET', 'auth/context');
}

// Profiles
/**
 * Get a profile by its id.
 *
 * @group Profiles
 * @param options - The client options.
 * @param id - The id of the profile to fetch.
 * @see {@link https://docs.monerium.com/api#tag/profiles/operation/profile | API Documentation}
 */
export async function getProfile(
  options: MoneriumApiClientOptions,
  id: string
): Promise<Profile> {
  const { request } = createRequestContext(options);
  return request<Profile>('GET', `profiles/${id}`);
}

/**
 * Get all profiles.
 *
 * @group Profiles
 * @see {@link https://docs.monerium.com/api#tag/profiles/operation/profiles | API Documentation}
 */
export async function getProfiles(
  options: MoneriumApiClientOptions,
  params?: GetProfilesParams
): Promise<ProfilesResponse> {
  const { request } = createRequestContext(options);
  return request<ProfilesResponse>(
    'GET',
    `profiles${buildQueryString(params)}`
  );
}

/**
 * Creates a new profile.
 *
 * @group Profiles
 * @see {@link https://docs.monerium.com/api#tag/profiles/operation/create-profile | API Documentation}
 */
export async function createProfile(
  options: MoneriumApiClientOptions,
  input: CreateProfileInput
): Promise<Profile> {
  const { request } = createRequestContext(options);
  return request<Profile>('POST', 'profiles', input);
}

/**
 * Share KYC data
 *
 * @group Profiles
 * @returns {Promise<AcceptedResponse>} The KYC data import has been initiated. Subscribe to `profile.update` webhook to monitor the progress.
 * @see {@link https://docs.monerium.com/api#tag/profiles/operation/share-profile-kyc | API Documentation}
 *
 * @ignore NOT YET LIVE
 */
export async function shareProfileKYC(
  options: MoneriumApiClientOptions,
  input: ShareProfileKYCInput
): Promise<AcceptedResponse> {
  const { request } = createRequestContext(options);
  const { profile, ...body } = input;
  return request<AcceptedResponse>('POST', `profiles/${profile}/share`, body);
}

/**
 * Submit the compliance details for a profile. Updates only the `details` section without affecting other sections.
 *
 * > **KYC reliance model only.** Most integrations should use `shareProfileKYC()` to populate details via Sumsub instead.
 *
 * @group Profiles
 * @see {@link https://docs.monerium.com/api#tag/profiles/operation/patch-profile-details | API Documentation}
 * @returns {Promise<AcceptedResponse>} The applicant details have been received and will be processed by Monerium.
 */
export async function updateProfileDetails(
  options: MoneriumApiClientOptions,
  input: UpdateProfileDetailsInput
): Promise<AcceptedResponse> {
  const { request } = createRequestContext(options);
  const { profile, ...body } = input;
  return request<AcceptedResponse>(
    'PATCH',
    `profiles/${profile}/details`,
    body
  );
}

/**
 * Submit additional data for a profile used for risk calculations (e.g. purpose of account, source of funds). Updates only the `form` section without affecting other sections.
 *
 * @group Profiles
 * @see {@link https://docs.monerium.com/api#tag/profiles/operation/patch-profile-form | API Documentation}
 * @returns {Promise<AcceptedResponse>} The profile form has been received and will be processed by Monerium.
 */
export async function updateProfileForm(
  options: MoneriumApiClientOptions,
  input: UpdateProfileFormInput
): Promise<AcceptedResponse> {
  const { request } = createRequestContext(options);
  const { profile, ...body } = input;
  return request<AcceptedResponse>('PATCH', `profiles/${profile}/form`, body);
}

/**
 * Submit verifications for a profile. Only the verifications provided are updated. `sourceOfFunds` is submitted here by all partners when required; other verification kinds are populated automatically when using the Sumsub share flow.
 *
 * @group Profiles
 * @see {@link https://docs.monerium.com/api#tag/profiles/operation/patch-profile-verifications | API Documentation}
 * @returns {Promise<AcceptedResponse>} The verification data has been received and will be processed by Monerium.
 */
export async function updateProfileVerifications(
  options: MoneriumApiClientOptions,
  input: UpdateProfileVerificationsInput
): Promise<AcceptedResponse> {
  const { request } = createRequestContext(options);
  const { profile, ...body } = input;
  return request<AcceptedResponse>(
    'PATCH',
    `profiles/${profile}/verifications`,
    body
  );
}

// Addresses
/**
 * Get details for a single address after it has been linked to Monerium.
 * @param options - The client options.
 * @param address - The public key of the blockchain account.
 *
 * @group Addresses
 * @see {@link https://docs.monerium.com/api#tag/addresses/operation/address | API Documentation}
 */
export async function getAddress(
  options: MoneriumApiClientOptions,
  address: string
): Promise<Address> {
  const { request } = createRequestContext(options);
  return request<Address>('GET', `addresses/${address}`);
}

/**
 * Get a list of all addresses linked to the profile.
 *
 * @group Addresses
 * @see {@link https://docs.monerium.com/api#tag/addresses/operation/addresses | API Documentation}
 */
export async function getAddresses(
  options: MoneriumApiClientOptions,
  params?: AddressesQueryParams
): Promise<AddressesResponse> {
  const { request } = createRequestContext(options);
  const resolvedParams = params
    ? resolveChain(params as Record<string, unknown>)
    : undefined;
  return request<AddressesResponse>(
    'GET',
    `addresses${buildQueryString(resolvedParams)}`
  );
}

/**
 * Add a new address to the profile.
 *
 * @group Addresses
 * @see {@link https://docs.monerium.com/api#tag/addresses/operation/link-address | API Documentation}
 * @returns {LinkAddressResponse | AcceptedResponse} - The address was linked successfully or an accepted response if the address is being processed asynchronously.
 */
export async function linkAddress(
  options: MoneriumApiClientOptions,
  body: LinkAddressInput
): Promise<LinkAddressResponse | AcceptedResponse> {
  const { request } = createRequestContext(options);
  return request<LinkAddressResponse | AcceptedResponse>(
    'POST',
    'addresses',
    resolveChain(body as unknown as Record<string, unknown>)
  );
}

/**
 * Get the balances for a given address on a specific chain.
 *
 * @group Addresses
 * @see {@link https://docs.monerium.com/api#tag/addresses/operation/balances | API Documentation}
 */
export async function getBalances(
  options: MoneriumApiClientOptions,
  params: GetBalancesParams
): Promise<Balances> {
  const { address, chain, currencies } = params;
  const { request } = createRequestContext(options);
  const resolvedChain = parseChain(chain);

  return request<Balances>(
    'GET',
    `balances/${resolvedChain}/${address}${buildQueryString({ currency: currencies })}`
  );
}

// IBANs
/**
 * Fetch details about a single IBAN.
 * @param options - The client options.
 * @param iban - The IBAN to fetch.
 *
 * @group IBANs
 * @see {@link https://docs.monerium.com/api#tag/ibans/operation/iban | API Documentation}
 */
export async function getIban(
  options: MoneriumApiClientOptions,
  iban: string
): Promise<IBAN> {
  const { request } = createRequestContext(options);
  return request<IBAN>('GET', `ibans/${encodeURIComponent(iban)}`);
}

/**
 * Fetch all IBANs for the profile.
 *
 * @group IBANs
 * @see {@link https://docs.monerium.com/api#tag/ibans/operation/ibans | API Documentation}
 */
export async function getIbans(
  options: MoneriumApiClientOptions,
  params?: IbansParams
): Promise<IBANsResponse> {
  const { request } = createRequestContext(options);
  const resolved = params
    ? resolveChain(params as unknown as Record<string, unknown>)
    : undefined;
  return request<IBANsResponse>('GET', `ibans${buildQueryString(resolved)}`);
}

/**
 * Request an IBAN for the profile.
 *
 * @group IBANs
 * @see {@link https://docs.monerium.com/api#tag/ibans/operation/request-iban | API Documentation}
 */
export async function requestIban(
  options: MoneriumApiClientOptions,
  { address, chain, emailNotifications = true }: RequestIbanInput
): Promise<AcceptedResponse> {
  const { request } = createRequestContext(options);
  return request<AcceptedResponse>('POST', 'ibans', {
    address,
    chain: parseChain(chain),
    emailNotifications,
  });
}

/**
 * Move an IBAN to a different address and chain.
 *
 * @group IBANs
 * @see {@link https://docs.monerium.com/api#tag/ibans/operation/move-iban | API Documentation}
 */
export async function moveIban(
  options: MoneriumApiClientOptions,
  { iban, address, chain }: MoveIbanInput
): Promise<AcceptedResponse> {
  const { request } = createRequestContext(options);
  return request<AcceptedResponse>('PATCH', `ibans/${iban}`, {
    address,
    chain: parseChain(chain),
  });
}

// Orders
/**
 * Get an order by its ID.
 *
 * @group Orders
 * @see {@link https://docs.monerium.com/api/#tag/orders/operation/order | API Documentation}
 */
export async function getOrder(
  options: MoneriumApiClientOptions,
  orderId: string
): Promise<Order> {
  const { request } = createRequestContext(options);
  return request<Order>('GET', `orders/${orderId}`);
}

/**
 * Get a list of orders.
 *
 * @group Orders
 * @see {@link https://docs.monerium.com/api/#tag/orders/operation/orders | API Documentation}
 */
export async function getOrders(
  options: MoneriumApiClientOptions,
  params?: OrderParams
): Promise<OrdersResponse> {
  const { request } = createRequestContext(options);
  return request<OrdersResponse>('GET', `orders${buildQueryString(params)}`);
}

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
export async function placeOrder(
  options: MoneriumApiClientOptions,
  input: PlaceOrderInput
): Promise<Order | AcceptedResponse> {
  const { request } = createRequestContext(options);
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
}

// Tokens
/**
 * Get Monerium tokens with contract addresses and chain details.
 *
 * @group Tokens
 * @see {@link https://docs.monerium.com/api#tag/tokens | API Documentation}
 */
export async function getTokens(
  options: MoneriumApiClientOptions
): Promise<Token[]> {
  const { request } = createRequestContext(options);
  return request<Token[]>('GET', 'tokens');
}

// Signatures
/**
 * Get pending signatures for the authenticated user.
 *
 * @group Signatures
 * @see {@link https://docs.monerium.com/api#tag/signatures/operation/get-signatures | API Documentation}
 */
export async function getSignatures(
  options: MoneriumApiClientOptions,
  params?: SignaturesParams
): Promise<SignaturesResponse> {
  const { request } = createRequestContext(options);
  const resolved = params
    ? resolveChain(params as Record<string, unknown>)
    : undefined;
  return request<SignaturesResponse>(
    'GET',
    `signatures${buildQueryString(resolved)}`
  );
}

// Files
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
export async function uploadSupportingDocument(
  options: MoneriumApiClientOptions,
  file: Blob | Uint8Array | ArrayBuffer,
  filename?: string
): Promise<FilesResponse> {
  const { requestFormData } = createRequestContext(options);
  const blob = file instanceof Blob ? file : new Blob([file]);
  const formData = new FormData();
  formData.append(
    'file',
    blob,
    filename ?? ('name' in file ? String(file.name) : 'document')
  );
  return requestFormData<FilesResponse>('POST', 'files', formData);
}

// ─── Client interface & Factory ───────────────────────────────────────────────

/**
 * The client instance returned by {@link createMoneriumApiClient}.
 * Provides typed methods for every Monerium REST API endpoint.
 * @group Client
 * @category Interface
 */
export interface MoneriumApiClient {
  /**
   * Get the current auth context.
   *
   * @group Auth
   * @see {@link https://docs.monerium.com/api#tag/auth/operation/auth-context | API Documentation}
   */
  getAuthContext(): Promise<AuthContext>;
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
   * Submit verifications for a profile. Only the verifications provided are updated. `sourceOfFunds` is submitted here by all partners when required; other verification kinds are populated automatically when using the Sumsub share flow.
   *
   * @group Profiles
   * @see {@link https://docs.monerium.com/api#tag/profiles/operation/patch-profile-verifications | API Documentation}
   * @returns {Promise<AcceptedResponse>} The verification data has been received and will be processed by Monerium.
   */
  updateProfileVerifications(
    input: UpdateProfileVerificationsInput
  ): Promise<AcceptedResponse>;
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
  /**
   * Get Monerium tokens with contract addresses and chain details.
   *
   * @group Tokens
   * @see {@link https://docs.monerium.com/api#tag/tokens | API Documentation}
   */
  getTokens(): Promise<Token[]>;
  /**
   * Get pending signatures for the authenticated user.
   *
   * @group Signatures
   * @see {@link https://docs.monerium.com/api#tag/signatures/operation/get-signatures | API Documentation}
   */
  getSignatures(params?: SignaturesParams): Promise<SignaturesResponse>;
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
  ): Promise<FilesResponse>;
}

/**
 * Creates a {@link MoneriumApiClient} instance.
 * @group Client
 * @category Functions
 */
export function createMoneriumApiClient(
  options: MoneriumApiClientOptions
): MoneriumApiClient {
  return {
    getAuthContext: () => getAuthContext(options),
    getProfile: (id: string) => getProfile(options, id),
    getProfiles: (params?: GetProfilesParams) => getProfiles(options, params),
    createProfile: (input: CreateProfileInput) => createProfile(options, input),
    shareProfileKYC: (input: ShareProfileKYCInput) =>
      shareProfileKYC(options, input),
    updateProfileDetails: (input: UpdateProfileDetailsInput) =>
      updateProfileDetails(options, input),
    updateProfileForm: (input: UpdateProfileFormInput) =>
      updateProfileForm(options, input),
    updateProfileVerifications: (input: UpdateProfileVerificationsInput) =>
      updateProfileVerifications(options, input),
    getAddress: (address: string) => getAddress(options, address),
    getAddresses: (params?: AddressesQueryParams) =>
      getAddresses(options, params),
    linkAddress: (body: LinkAddressInput) => linkAddress(options, body),
    getBalances: (params: GetBalancesParams) => getBalances(options, params),
    getIban: (iban: string) => getIban(options, iban),
    getIbans: (params?: IbansParams) => getIbans(options, params),
    requestIban: (input: RequestIbanInput) => requestIban(options, input),
    moveIban: (input: MoveIbanInput) => moveIban(options, input),
    getOrder: (orderId: string) => getOrder(options, orderId),
    getOrders: (params?: OrderParams) => getOrders(options, params),
    placeOrder: (input: PlaceOrderInput) => placeOrder(options, input),
    getTokens: () => getTokens(options),
    getSignatures: (params?: SignaturesParams) =>
      getSignatures(options, params),
    uploadSupportingDocument: (
      file: Blob | Uint8Array | ArrayBuffer,
      filename?: string
    ) => uploadSupportingDocument(options, file, filename),
  };
}
