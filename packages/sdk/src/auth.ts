import encodeBase64Url from 'crypto-js/enc-base64url.js';
import WordArray from 'crypto-js/lib-typedarrays.js';
import SHA256 from 'crypto-js/sha256.js';

import { MONERIUM_CONFIG } from './config';
import { MoneriumApiError } from './errors';
import type { Transport, TransportResponse } from './transport';
import { defaultTransport } from './transport';
import type { BearerProfile, ENV } from './types';
import { urlEncoded } from './utils';

// ─── PKCE ─────────────────────────────────────────────────────────────────────

/**
 * Generate a cryptographically random PKCE code verifier (RFC 7636).
 * Returns a base64url-encoded string of 32 random bytes (256 bits of entropy).
 * The caller is responsible for storing this until the callback.
 * @group v4
 * @category v4 - PKCE
 */
export const randomPKCECodeVerifier = (): string => {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return encodeBase64Url.stringify(WordArray.create(bytes));
};

/**
 * Derive the S256 code challenge from a code verifier.
 * Synchronous. Returns a base64url-encoded SHA-256 hash.
 * @group v4
 * @category v4 - PKCE
 */
export const calculatePKCECodeChallenge = (codeVerifier: string): string => {
  return encodeBase64Url.stringify(SHA256(codeVerifier));
};

// ─── URL builders ─────────────────────────────────────────────────────────────

/**
 * @group v4
 * @category v4 - Authorization
 * @beta
 */
export interface BuildAuthorizationUrlOptions {
  environment?: ENV;
  clientId: string;
  redirectUri: string;
  codeChallenge: string;
  state?: string;
  email?: string;
  skipKyc?: boolean;
  address?: string;
  signature?: string;
  chain?: string;
}

/**
 * Build the authorization redirect URL.
 * Returns a URL string — the caller navigates to it.
 * The SDK does not redirect.
 * @group v4
 * @category v4 - Authorization
 * @beta
 */
export const buildAuthorizationUrl = (
  options: BuildAuthorizationUrlOptions
): string => {
  const env = MONERIUM_CONFIG.environments[options.environment ?? 'sandbox'];

  const params = urlEncoded({
    client_id: options.clientId,
    redirect_uri: options.redirectUri,
    code_challenge: options.codeChallenge,
    code_challenge_method: 'S256',
    response_type: 'code',
    state: options.state,
    skip_kyc: options.skipKyc,
    email: options.email,
    address: options.address,
    signature: options.signature,
    chain: options.chain,
  });

  return `${env.api}/auth?${params}`;
};

/**
 * @group v4
 * @category v4 - Authorization
 * @beta
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
 * @group v4
 * @category v4 - Authorization
 * @beta
 */
export const buildSiweAuthorizationUrl = (
  options: BuildSiweAuthorizationUrlOptions
): string => {
  const env = MONERIUM_CONFIG.environments[options.environment ?? 'sandbox'];

  const params = urlEncoded({
    client_id: options.clientId,
    redirect_uri: options.redirectUri,
    message: options.message,
    signature: options.signature,
    code_challenge: options.codeChallenge,
    code_challenge_method: 'S256',
    authentication_method: 'siwe',
    state: options.state,
  });

  return `${env.api}/auth?${params}`;
};

// ─── Token requests ───────────────────────────────────────────────────────────

/**
 *
 * @group v4
 * @category v4 - Authorization
 * @beta
 */
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
 * @group v4
 * @category v4 - Authorization
 * @beta
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
 * @group v4
 * @category v4 - Authorization
 * @beta
 */
export const authorizationCodeGrant = (
  options: AuthorizationCodeGrantOptions
): Promise<BearerProfile> => {
  const env = MONERIUM_CONFIG.environments[options.environment ?? 'sandbox'];

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

/** Friendly alias for {@link authorizationCodeGrant}. */
export const exchangeAuthorizationCode = authorizationCodeGrant;

export interface RefreshTokenGrantOptions {
  environment?: ENV;
  clientId: string;
  refreshToken: string;
  transport?: Transport;
}

/**
 * Get a new access token using a refresh token.
 * The caller stores the returned BearerProfile — the SDK does not write to any storage.
 * @beta
 */
export const refreshTokenGrant = (
  options: RefreshTokenGrantOptions
): Promise<BearerProfile> => {
  const env = MONERIUM_CONFIG.environments[options.environment ?? 'sandbox'];

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

/** Friendly alias for {@link refreshTokenGrant}. */
export const refreshAccessToken = refreshTokenGrant;

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
 * @group v4
 * @category v4 - Authorization
 * @beta
 */
export const clientCredentialsGrant = (
  options: ClientCredentialsGrantOptions
): Promise<BearerProfile> => {
  const env = MONERIUM_CONFIG.environments[options.environment ?? 'sandbox'];

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
 * @group v4
 * @category v4 - Authorization
 * @beta
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
 * - No globals. No side effects. Never throws.
 * - Returns an empty object if none of the expected parameters are present.
 * - Check for the presence of `code` or `error` to determine if the URL
 *   contains an OAuth2 authorization response.
 *
 * @example
 * const { code, error } = parseAuthorizationResponse(window.location.href);
 * const { code, error } = parseAuthorizationResponse('?code=abc&state=xyz');
 * @experimental  may not be included in v4
 * @group v4
 * @category v4 - Helpers
 */
export const parseAuthorizationResponse = (
  input: string | URL
): ParsedAuthorizationResponse => {
  let params: URLSearchParams;

  try {
    // Handles full URLs: https://example.com/callback?code=abc
    params = new URL(typeof input === 'string' ? input : input.toString())
      .searchParams;
  } catch {
    // Handles bare query strings: ?code=abc or code=abc
    params = new URLSearchParams(
      typeof input === 'string' ? input : input.toString()
    );
  }

  const result: ParsedAuthorizationResponse = {};

  if (params.has('code')) result.code = params.get('code')!;
  if (params.has('state')) result.state = params.get('state')!;
  if (params.has('error')) result.error = params.get('error')!;
  if (params.has('error_description'))
    result.errorDescription = params.get('error_description')!;

  return result;
};
