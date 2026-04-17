import { MONERIUM_CONFIG } from './config';
import { queryParams } from './helpers';
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

// ─── Errors ───────────────────────────────────────────────────────────────────

/**
 * Thrown when the Monerium API returns a non-2xx response.
 * Fields map directly to the API response body — nothing is translated or normalised.
 */
export class MoneriumApiError extends Error {
  code: number;
  status: string;
  errors?: Record<string, string>;
  details?: unknown;

  constructor(body: {
    code: number;
    status: string;
    message: string;
    errors?: Record<string, string>;
    details?: unknown;
  }) {
    super(body.message);
    this.code = body.code;
    this.status = body.status;
    this.errors = body.errors;
    this.details = body.details;
  }
}

export type MoneriumSdkErrorType =
  | 'network_error' // fetch failed (DNS, timeout, connection refused)
  | 'authentication_required' // authenticated endpoint called with no token
  | 'invalid_configuration'; // bad options passed to createMoneriumClient

/**
 * Thrown for SDK-level failures — no HTTP response involved.
 */
export class MoneriumSdkError extends Error {
  type: MoneriumSdkErrorType;
  cause?: unknown;

  constructor(type: MoneriumSdkErrorType, message: string, cause?: unknown) {
    super(message);
    this.type = type;
    this.cause = cause;
  }
}

// ─── Transport ────────────────────────────────────────────────────────────────

export type TransportRequest = {
  method: string;
  url: string;
  headers: Record<string, string>; // always pre-populated by the SDK
  body?: BodyInit | string;
  signal?: AbortSignal; // for request cancellation
};

export type TransportResponse = {
  status: number;
  headers?: Record<string, string>;
  bodyText: string; // raw response body — SDK handles JSON parsing
};

export type Transport = (
  request: TransportRequest
) => Promise<TransportResponse>;

const defaultTransport: Transport = async ({
  method,
  url,
  headers,
  body,
  signal,
}) => {
  let response: Response;
  try {
    response = await fetch(url, { method, headers, body, signal });
  } catch (err) {
    throw new MoneriumSdkError('network_error', 'Network request failed', err);
  }
  const bodyText = await response.text();
  return { status: response.status, bodyText };
};

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

    getAuthContext: (): Promise<AuthContext> =>
      request<AuthContext>('GET', 'auth/context'),

    // ─── Profiles ──────────────────────────────────────────────────────────

    getProfile: (id: string): Promise<Profile> =>
      request<Profile>('GET', `profiles/${id}`),

    getProfiles: (params?: ProfilesQueryParams): Promise<ProfilesResponse> =>
      request<ProfilesResponse>('GET', `profiles${queryParams(params)}`),

    // ─── Addresses ─────────────────────────────────────────────────────────

    getAddress: (address: string): Promise<Address> =>
      request<Address>('GET', `addresses/${address}`),

    getAddresses: (params?: AddressesQueryParams): Promise<AddressesResponse> =>
      request<AddressesResponse>('GET', `addresses${queryParams(params)}`),

    getBalances: (
      address: string,
      chain: Chain | ChainId,
      currencies?: Currency[]
    ): Promise<Balances> => {
      const currencyParams = currencies?.length
        ? `&currencies=${currencies.join(',')}`
        : '';
      return request<Balances>(
        'GET',
        `addresses/${address}/balances?chain=${chain}${currencyParams}`
      );
    },

    linkAddress: (payload: LinkAddress): Promise<LinkedAddress> =>
      request<LinkedAddress>('POST', 'addresses', payload),

    // ─── IBANs ─────────────────────────────────────────────────────────────

    getIban: (iban: string): Promise<IBAN> =>
      request<IBAN>('GET', `ibans/${iban}`),

    getIbans: (params?: IbansQueryParams): Promise<IBANsResponse> =>
      request<IBANsResponse>('GET', `ibans${queryParams(params)}`),

    requestIban: (payload: RequestIbanPayload): Promise<ResponseStatus> =>
      request<ResponseStatus>('POST', 'ibans', payload),

    moveIban: (
      iban: string,
      payload: MoveIbanPayload
    ): Promise<ResponseStatus> =>
      request<ResponseStatus>('PATCH', `ibans/${iban}`, payload),

    // ─── Orders ────────────────────────────────────────────────────────────

    getOrder: (orderId: string): Promise<Order> =>
      request<Order>('GET', `orders/${orderId}`),

    getOrders: (filter?: OrderFilter): Promise<OrdersResponse> =>
      request<OrdersResponse>('GET', `orders${queryParams(filter)}`),

    placeOrder: (order: NewOrder): Promise<Order | ResponseStatus> =>
      request<Order | ResponseStatus>('POST', 'orders', order),

    // ─── Tokens ────────────────────────────────────────────────────────────

    getTokens: (): Promise<Token[]> => request<Token[]>('GET', 'tokens'),

    // ─── Signatures ────────────────────────────────────────────────────────

    getSignatures: (
      params?: SignaturesQueryParams
    ): Promise<SignaturesResponse> =>
      request<SignaturesResponse>('GET', `signatures${queryParams(params)}`),

    // ─── Profiles / KYC ────────────────────────────────────────────────────

    submitProfileDetails: (
      profileId: string,
      body: SubmitProfileDetailsPayload
    ): Promise<ResponseStatus> =>
      request<ResponseStatus>('PUT', `profiles/${profileId}`, body),

    uploadSupportingDocument: (document: File): Promise<SupportingDoc> => {
      const formData = new FormData();
      formData.append('document', document);
      // FormData is handled directly by fetch — don't JSON.stringify
      return request<SupportingDoc>(
        'POST',
        'files',
        formData as unknown as string,
        false
      );
    },
  };
}
