import { MoneriumApiError } from './errors';
import { queryParams } from './helpers';
import { getEnv } from './helpers/internal.helpers';
import type { Transport, TransportResponse } from './transport';
import { defaultTransport } from './transport';
import type { BearerProfile, ENV } from './types';
import { urlEncoded } from './utils';

// ─── URL builders ─────────────────────────────────────────────────────────────

/**
 * @group Auth
 * @category Types
 */
export interface BuildAuthorizationUrlOptions {
  environment?: ENV;
  clientId: string;
  redirectUri: string;
  codeChallenge: string;
  state?: string;
  email?: string;
  skipKyc?: boolean;
}

/**
 * Build the authorization redirect URL.
 * Returns a URL string — the caller navigates to it.
 * The SDK does not redirect.
 * @group Auth
 * @category Functions
 */
export const buildAuthorizationUrl = (
  options: BuildAuthorizationUrlOptions
): string => {
  const env = getEnv(options.environment);

  const params = queryParams({
    client_id: options.clientId,
    redirect_uri: options.redirectUri,
    code_challenge: options.codeChallenge,
    code_challenge_method: 'S256',
    response_type: 'code',
    state: options.state,
    skip_kyc: options.skipKyc,
    email: options.email,
  });

  return `${env.api}/auth${params}`;
};

/**
 * @group Auth
 * @category Types
 */
export interface BuildSiweAuthorizationUrlOptions {
  environment?: ENV;
  clientId: string;
  redirectUri: string;
  codeChallenge: string;
  message: string;
  signature: string;
  state?: string;
}

/**
 * Build the SIWE authorization redirect URL.
 * Returns a URL string — the caller navigates to it.
 * The SDK does not redirect.
 *
 * @group Auth
 * @category Functions
 */
export const buildSiweAuthorizationUrl = (
  options: BuildSiweAuthorizationUrlOptions
): string => {
  const env = getEnv(options.environment);

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

  return `${env.api}/auth${params}`;
};

// ─── Token requests ───────────────────────────────────────────────────────────

/** @internal */
async function tokenRequest(
  url: string,
  body: Record<string, string | undefined>,
  transport: Transport = defaultTransport
): Promise<BearerProfile> {
  const encoded = urlEncoded(
    Object.fromEntries(
      Object.entries(body).filter(([, v]) => v !== undefined)
    ) as Record<string, string>
  );

  const { status, bodyText }: TransportResponse = await transport({
    method: 'POST',
    url,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/vnd.monerium.api-v2+json',
    },
    body: encoded,
  });

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

  return json as BearerProfile;
}

// ─── Grant types ──────────────────────────────────────────────────────────────

/**
 * @group Auth
 * @category Types
 */
export interface AuthorizationCodeGrantOptions {
  environment?: ENV;
  clientId: string;
  redirectUri: string;
  code: string;
  codeVerifier: string;
  transport?: Transport;
}

/**
 * Exchange an authorization code for tokens.
 * The caller stores the returned BearerProfile — the SDK does not write to any storage.
 *
 * @group Auth
 * @category Functions
 */
export const authorizationCodeGrant = (
  options: AuthorizationCodeGrantOptions
): Promise<BearerProfile> => {
  const env = getEnv(options.environment);

  return tokenRequest(
    `${env.api}/auth/token`,
    {
      grant_type: 'authorization_code',
      client_id: options.clientId,
      redirect_uri: options.redirectUri,
      code: options.code,
      code_verifier: options.codeVerifier,
    },
    options.transport
  );
};

/**
 * @group Auth
 * @category Types
 */
export interface RefreshTokenGrantOptions {
  environment?: ENV;
  clientId: string;
  refreshToken: string;
  transport?: Transport;
}

/**
 * Get a new access token using a refresh token.
 * The caller stores the returned BearerProfile — the SDK does not write to any storage.
 * @group Auth
 * @category Functions
 */
export const refreshTokenGrant = (
  options: RefreshTokenGrantOptions
): Promise<BearerProfile> => {
  const env = getEnv(options.environment);

  return tokenRequest(
    `${env.api}/auth/token`,
    {
      grant_type: 'refresh_token',
      client_id: options.clientId,
      refresh_token: options.refreshToken,
    },
    options.transport
  );
};

/**
 * @group Auth
 * @category Types
 */
export interface ClientCredentialsGrantOptions {
  environment?: ENV;
  clientId: string;
  clientSecret: string;
  transport?: Transport;
}

/**
 * Get an access token using client credentials. Server-side only.
 * clientSecret must never be used in a browser context.
 *
 * @group Auth
 * @category Functions
 */
export const clientCredentialsGrant = (
  options: ClientCredentialsGrantOptions
): Promise<BearerProfile> => {
  const env = getEnv(options.environment);

  return tokenRequest(
    `${env.api}/auth/token`,
    {
      grant_type: 'client_credentials',
      client_id: options.clientId,
      client_secret: options.clientSecret,
    },
    options.transport
  );
};

// ─── Callback parsing ─────────────────────────────────────────────────────────

/**
 * @group Auth
 * @category Types
 */
export interface ParsedAuthorizationResponse {
  code?: string;
  state?: string;
  error?: string;
  errorDescription?: string;
}

/**
 * Parse a callback URL or query string into structured fields.
 *
 * - Returns an empty object if none of the expected parameters are present.
 * - Check for the presence of `code` or `error` to determine if the URL
 *   contains an OAuth2 authorization response.
 *
 * @example
 * const { code, error } = parseAuthorizationResponse(req.url);
 * const { code, error } = parseAuthorizationResponse('?code=abc&state=xyz');
 * @group Auth
 * @category Functions
 */
export const parseAuthorizationResponse = (
  input: string
): ParsedAuthorizationResponse => {
  // Runtime-agnostic string parser
  if (typeof input !== 'string') return {};
  const str = input;

  // Extract the query string from a full URL, or use the input as-is
  const queryString = str.includes('?') ? str.split('?')[1] : str;
  if (!queryString) return {};

  const map: Record<string, string> = {};
  for (const pair of queryString.split('&')) {
    const eqIndex = pair.indexOf('=');
    if (eqIndex === -1) continue;
    const key = decodeURIComponent(pair.slice(0, eqIndex));
    const value = decodeURIComponent(
      pair.slice(eqIndex + 1).replace(/\+/g, ' ')
    );
    map[key] = value;
  }

  const result: ParsedAuthorizationResponse = {};
  if (map['code']) result.code = map['code'];
  if (map['state']) result.state = map['state'];
  if (map['error']) result.error = map['error'];
  if (map['error_description'])
    result.errorDescription = map['error_description'];

  return result;
};
