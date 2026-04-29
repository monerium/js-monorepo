import {
  AuthorizationCodeGrantOptions,
  BuildAuthorizationUrlOptions,
  BuildSiweAuthorizationUrlOptions,
  parseAuthorizationResponse,
  ParsedAuthorizationResponse,
  RefreshTokenGrantOptions,
} from './auth';
import { Chain, ChainId } from './chains';
import { MoneriumApiError, MoneriumSdkError } from './errors';
import { queryParams, urlEncoded } from './helpers';
import { getEnv } from './helpers/internal.helpers';
import type { Transport } from './transport';
import { defaultTransport } from './transport';
import type {
  AcceptedResponse,
  Address,
  AddressesQueryParams,
  AddressesResponse,
  Balances,
  BearerProfile,
  CreateProfileInput,
  CreateWebhookSubscriptionInput,
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
  UpdateWebhookSubscriptionInput,
  WebhookSubscription,
  WebhookSubscriptionsResponse,
} from './types';
import { parseChain } from './utils';

/** Resolve chain field in an object without backwards-compat remapping. */
function resolveChain<T extends Record<string, unknown>>(obj: T): T {
  if (obj?.chain !== undefined) {
    return { ...obj, chain: parseChain(obj.chain as Chain | ChainId) };
  }
  return obj;
}

export interface MoneriumApiClientOptions {
  environment?: ENV;
  getAccessToken: () => Promise<string | undefined> | string | undefined;
  transport?: Transport;
}

/**
 * Base abstract client containing the shared configuration and request logic.
 */
export abstract class MoneriumBaseClient {
  protected options: MoneriumApiClientOptions;
  protected env: ReturnType<typeof getEnv>;
  protected transport: Transport;

  constructor(options: MoneriumApiClientOptions) {
    this.options = options;
    this.env = getEnv(options.environment);
    this.transport = options.transport ?? defaultTransport;
  }

  protected async getToken(): Promise<string | undefined> {
    return this.options.getAccessToken();
  }

  protected async request<T>(
    method: string,
    path: string,
    body?: unknown,
    contentType = 'application/json'
  ): Promise<T> {
    const isUnauthenticatedEndpoint =
      path.startsWith('tokens') || path.startsWith('auth/token');
    const token = isUnauthenticatedEndpoint ? null : await this.getToken();

    const headers: Record<string, string> = {
      Accept: 'application/vnd.monerium.api-v2+json',
      'Content-Type': contentType,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else if (!isUnauthenticatedEndpoint) {
      throw new MoneriumSdkError(
        'authentication_required',
        'No access token provided for authenticated endpoint'
      );
    }

    const { status, bodyText } = await this.transport({
      method: method.toUpperCase(),
      url: `${this.env.api}/${path}`,
      headers,
      body: body
        ? contentType === 'application/json'
          ? JSON.stringify(body)
          : (body as string)
        : undefined,
    });

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

  protected async requestFormData<T>(
    method: string,
    path: string,
    form: FormData
  ): Promise<T> {
    const token = await this.getToken();
    const headers: Record<string, string> = {
      Accept: 'application/vnd.monerium.api-v2+json',
    };

    if (token) headers['Authorization'] = `Bearer ${token}`;

    const { status, bodyText } = await this.transport({
      method: method.toUpperCase(),
      url: `${this.env.api}/${path}`,
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

  /**
   * Get a profile by its id.
   *
   * @group Profiles
   * @param profileId - The id of the profile to fetch.
   * @see {@link https://docs.monerium.com/api#tag/profiles/operation/profile | API Documentation}
   */
  public async getProfile(profileId: string): Promise<Profile> {
    return this.request<Profile>('GET', `profiles/${profileId}`);
  }

  /**
   * Get all profiles.
   *
   * @group Profiles
   * @see {@link https://docs.monerium.com/api#tag/profiles/operation/profiles | API Documentation}
   */
  public async getProfiles(
    params?: GetProfilesParams
  ): Promise<ProfilesResponse> {
    return this.request<ProfilesResponse>(
      'GET',
      `profiles${queryParams(params)}`
    );
  }

  /**
   * Get details for a single address after it has been linked to Monerium.
   * @param address - The public key of the blockchain account.
   *
   * @group Addresses
   * @see {@link https://docs.monerium.com/api#tag/addresses/operation/address | API Documentation}
   */
  public async getAddress(address: string): Promise<Address> {
    return this.request<Address>('GET', `addresses/${address}`);
  }

  /**
   * Get a list of all addresses linked to the profile.
   *
   * @group Addresses
   * @see {@link https://docs.monerium.com/api#tag/addresses/operation/addresses | API Documentation}
   */
  public async getAddresses(
    params?: AddressesQueryParams
  ): Promise<AddressesResponse> {
    const resolvedParams = params
      ? resolveChain(params as Record<string, unknown>)
      : undefined;
    return this.request<AddressesResponse>(
      'GET',
      `addresses${queryParams(resolvedParams)}`
    );
  }

  /**
   * Add a new address to the profile.
   *
   * @group Addresses
   * @see {@link https://docs.monerium.com/api#tag/addresses/operation/link-address | API Documentation}
   * @returns {LinkAddressResponse | AcceptedResponse} - The address was linked successfully or an accepted response if the address is being processed asynchronously.
   */
  public async linkAddress(
    body: LinkAddressInput
  ): Promise<LinkAddressResponse | AcceptedResponse> {
    return this.request<LinkAddressResponse | AcceptedResponse>(
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
  public async getBalances(params: GetBalancesParams): Promise<Balances> {
    const { address, chain, currencies } = params;
    const resolvedChain = parseChain(chain);
    return this.request<Balances>(
      'GET',
      `balances/${resolvedChain}/${address}${queryParams({ currency: currencies })}`
    );
  }

  /**
   * Fetch details about a single IBAN.
   * @param iban - The IBAN to fetch.
   *
   * @group IBANs
   * @see {@link https://docs.monerium.com/api#tag/ibans/operation/iban | API Documentation}
   */
  public async getIban(iban: string): Promise<IBAN> {
    return this.request<IBAN>('GET', `ibans/${encodeURIComponent(iban)}`);
  }

  /**
   * Fetch all IBANs for the profile.
   *
   * @group IBANs
   * @see {@link https://docs.monerium.com/api#tag/ibans/operation/ibans | API Documentation}
   */
  public async getIbans(params?: IbansParams): Promise<IBANsResponse> {
    const resolved = params
      ? resolveChain(params as unknown as Record<string, unknown>)
      : undefined;
    return this.request<IBANsResponse>('GET', `ibans${queryParams(resolved)}`);
  }

  /**
   * Request an IBAN for the profile.
   *
   * @group IBANs
   * @see {@link https://docs.monerium.com/api#tag/ibans/operation/request-iban | API Documentation}
   */
  public async requestIban(input: RequestIbanInput): Promise<AcceptedResponse> {
    return this.request<AcceptedResponse>('POST', 'ibans', {
      address: input.address,
      chain: parseChain(input.chain),
      emailNotifications: input.emailNotifications ?? true,
    });
  }

  /**
   * Move an IBAN to a different address and chain.
   *
   * @group IBANs
   * @see {@link https://docs.monerium.com/api#tag/ibans/operation/move-iban | API Documentation}
   */
  public async moveIban(input: MoveIbanInput): Promise<AcceptedResponse> {
    return this.request<AcceptedResponse>('PATCH', `ibans/${input.iban}`, {
      address: input.address,
      chain: parseChain(input.chain),
    });
  }

  /**
   * Get an order by its ID.
   *
   * @group Orders
   * @see {@link https://docs.monerium.com/api/#tag/orders/operation/order | API Documentation}
   */
  public async getOrder(orderId: string): Promise<Order> {
    return this.request<Order>('GET', `orders/${orderId}`);
  }

  /**
   * Get a list of orders.
   *
   * @group Orders
   * @see {@link https://docs.monerium.com/api/#tag/orders/operation/orders | API Documentation}
   */
  public async getOrders(params?: OrderParams): Promise<OrdersResponse> {
    return this.request<OrdersResponse>('GET', `orders${queryParams(params)}`);
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
  public async placeOrder(
    input: PlaceOrderInput
  ): Promise<Order | AcceptedResponse> {
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
    return this.request<Order | AcceptedResponse>('POST', 'orders', body);
  }

  /**
   * Get Monerium tokens with contract addresses and chain details.
   *
   * @group Tokens
   * @see {@link https://docs.monerium.com/api#tag/tokens | API Documentation}
   */
  public async getTokens(): Promise<Token[]> {
    return this.request<Token[]>('GET', 'tokens');
  }

  /**
   * Get pending signatures for the authenticated user.
   *
   * @group Signatures
   * @see {@link https://docs.monerium.com/api#tag/signatures/operation/get-signatures | API Documentation}
   */
  public async getSignatures(
    params?: SignaturesParams
  ): Promise<SignaturesResponse> {
    const resolved = params
      ? resolveChain(params as Record<string, unknown>)
      : undefined;
    return this.request<SignaturesResponse>(
      'GET',
      `signatures${queryParams(resolved)}`
    );
  }

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
  public async uploadSupportingDocument(
    file: Blob | Uint8Array | ArrayBuffer,
    filename?: string
  ): Promise<FilesResponse> {
    const blob = file instanceof Blob ? file : new Blob([file as BlobPart]);
    const formData = new FormData();
    formData.append(
      'file',
      blob,
      filename ?? ('name' in file ? String(file.name) : 'document')
    );
    return this.requestFormData<FilesResponse>('POST', 'files', formData);
  }
}

/**
 * Server-side client containing operations that require client secrets.
 * Must never be used in a browser context.
 */
export abstract class MoneriumServerClient extends MoneriumBaseClient {
  /**
   * Get an access token using client credentials. Server-side only.
   * clientSecret must never be used in a browser context.
   *
   * @group Auth
   * @category Functions
   */
  public async clientCredentialsGrant(
    clientId: string,
    clientSecret: string
  ): Promise<BearerProfile> {
    const encoded = urlEncoded({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    });

    return this.request<BearerProfile>(
      'POST',
      'auth/token',
      encoded,
      'application/x-www-form-urlencoded'
    );
  }

  /**
   * List all webhook subscriptions for the authenticated user.
   *
   * @group Webhooks
   * @see {@link https://docs.monerium.com/api#tag/webhooks/operation/list-subscriptions | API Documentation}
   */
  public async getSubscriptions(): Promise<WebhookSubscriptionsResponse> {
    return this.request<WebhookSubscriptionsResponse>('GET', 'webhooks');
  }

  /**
   * Create webhook subscription.
   *
   * @group Webhooks
   * @see {@link https://docs.monerium.com/api#tag/webhooks/operation/create-subscription | API Documentation}
   */
  public async createSubscription(
    input: CreateWebhookSubscriptionInput
  ): Promise<WebhookSubscription> {
    return this.request<WebhookSubscription>('POST', 'webhooks', input);
  }

  /**
   * Update an existing webhook subscription.
   *
   * @group Webhooks
   * @see {@link https://docs.monerium.com/api#tag/webhooks/operation/update-subscription | API Documentation}
   */
  public async updateSubscription(
    input: UpdateWebhookSubscriptionInput
  ): Promise<WebhookSubscription> {
    const { subscription, ...body } = input;
    return this.request<WebhookSubscription>(
      'PATCH',
      `webhooks/${subscription}`,
      body
    );
  }
}

export class MoneriumPrivateClient extends MoneriumServerClient {
  // To be populated
}

export class MoneriumOAuthClient extends MoneriumBaseClient {
  /**
   * Build the authorization redirect URL.
   * Returns a URL string — the caller navigates to it.
   * The SDK does not redirect.
   * @group Auth
   * @category Functions
   */
  public buildAuthorizationUrl(
    options: Omit<BuildAuthorizationUrlOptions, 'environment'>
  ): string {
    const params = queryParams({
      client_id: options.clientId,
      redirect_uri: options.redirectUri,
      code_challenge: options.codeChallenge,
      code_challenge_method: 'S256',
      response_type: 'code',
      state: options.state,
      skip_kyc: options.skipKyc,
      email: options.email,
      auth_mode: options.authMode,
    });
    return `${this.env.api}/auth${params}`;
  }

  /**
   * Build the SIWE authorization redirect URL.
   * Returns a URL string — the caller navigates to it.
   * The SDK does not redirect.
   *
   * @group Auth
   * @category Functions
   */
  public buildSiweAuthorizationUrl(
    options: Omit<BuildSiweAuthorizationUrlOptions, 'environment'>
  ): string {
    const params = queryParams({
      client_id: options.clientId,
      redirect_uri: options.redirectUri,
      message: options.message,
      signature: options.signature,
      code_challenge: options.codeChallenge,
      code_challenge_method: 'S256',
      authentication_method: 'siwe',
      state: options.state,
    });
    return `${this.env.api}/auth${params}`;
  }

  /**
   * Exchange an authorization code for tokens.
   * The caller stores the returned BearerProfile — the SDK does not write to any storage.
   *
   * @group Auth
   * @category Functions
   */
  public async authorizationCodeGrant(
    options: Omit<AuthorizationCodeGrantOptions, 'environment' | 'transport'>
  ): Promise<BearerProfile> {
    const encoded = urlEncoded({
      grant_type: 'authorization_code',
      client_id: options.clientId,
      redirect_uri: options.redirectUri,
      code: options.code,
      code_verifier: options.codeVerifier,
    });

    return this.request<BearerProfile>(
      'POST',
      'auth/token',
      encoded,
      'application/x-www-form-urlencoded'
    );
  }

  /**
   * Get a new access token using a refresh token.
   * The caller stores the returned BearerProfile — the SDK does not write to any storage.
   * @group Auth
   * @category Functions
   */
  public async refreshTokenGrant(
    options: Omit<RefreshTokenGrantOptions, 'environment' | 'transport'>
  ): Promise<BearerProfile> {
    const encoded = urlEncoded({
      grant_type: 'refresh_token',
      client_id: options.clientId,
      refresh_token: options.refreshToken,
    });

    return this.request<BearerProfile>(
      'POST',
      'auth/token',
      encoded,
      'application/x-www-form-urlencoded'
    );
  }

  /**
   * Parse a callback URL or query string into structured fields.
   *
   * - Returns an empty object if none of the expected parameters are present.
   * - Check for the presence of `code` or `error` to determine if the URL
   *   contains an OAuth2 authorization response.
   *
   * @example
   * const { code, error } = client.parseAuthorizationResponse(req.url);
   * const { code, error } = client.parseAuthorizationResponse('?code=abc&state=xyz');
   * @group Auth
   * @category Functions
   */
  public parseAuthorizationResponse(
    input: string
  ): ParsedAuthorizationResponse {
    return parseAuthorizationResponse(input);
  }
}

export class MoneriumWhitelabelClient extends MoneriumServerClient {
  /**
   * Creates a new profile.
   *
   * @group Profiles
   * @see {@link https://docs.monerium.com/api#tag/profiles/operation/create-profile | API Documentation}
   */
  public async createProfile(input: CreateProfileInput): Promise<Profile> {
    return this.request<Profile>('POST', 'profiles', input);
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
  public async shareProfileKYC(
    input: ShareProfileKYCInput
  ): Promise<AcceptedResponse> {
    const { profile, ...body } = input;
    return this.request<AcceptedResponse>(
      'POST',
      `profiles/${profile}/share`,
      body
    );
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
  public async updateProfileDetails(
    input: UpdateProfileDetailsInput
  ): Promise<AcceptedResponse> {
    const { profile, ...body } = input;
    return this.request<AcceptedResponse>(
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
  public async updateProfileForm(
    input: UpdateProfileFormInput
  ): Promise<AcceptedResponse> {
    const { profile, ...body } = input;
    return this.request<AcceptedResponse>(
      'PATCH',
      `profiles/${profile}/form`,
      body
    );
  }

  /**
   * Submit verifications for a profile. Only the verifications provided are updated. `sourceOfFunds` is submitted here by all partners when required; other verification kinds are populated automatically when using the Sumsub share flow.
   *
   * @group Profiles
   * @see {@link https://docs.monerium.com/api#tag/profiles/operation/patch-profile-verifications | API Documentation}
   * @returns {Promise<AcceptedResponse>} The verification data has been received and will be processed by Monerium.
   */
  public async updateProfileVerifications(
    input: UpdateProfileVerificationsInput
  ): Promise<AcceptedResponse> {
    const { profile, ...body } = input;
    return this.request<AcceptedResponse>(
      'PATCH',
      `profiles/${profile}/verifications`,
      body
    );
  }
}
