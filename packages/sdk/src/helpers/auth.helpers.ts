import encodeBase64Url from 'crypto-js/enc-base64url.js';
import WordArray from 'crypto-js/lib-typedarrays.js';
import SHA256 from 'crypto-js/sha256.js';

/**
 * Generate a cryptographically random PKCE code verifier (RFC 7636).
 * Returns a base64url-encoded string of 32 random bytes (256 bits of entropy).
 * The caller is responsible for storing this until the callback.
 * @group Auth
 * @category Functions
 */
export const randomPKCECodeVerifier = (): string => {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return encodeBase64Url.stringify(WordArray.create(bytes));
};

/**
 * Derive the S256 code challenge from a code verifier.
 * Synchronous. Returns a base64url-encoded SHA-256 hash.
 * @group Auth
 * @category Functions
 */
export const calculatePKCECodeChallenge = (codeVerifier: string): string => {
  return encodeBase64Url.stringify(SHA256(codeVerifier as string));
};

/**
 * Generate a new PKCE code verifier and its corresponding challenge.
 * @group Auth
 * @category Functions
 */
export const generatePKCE = (): {
  codeVerifier: string;
  codeChallenge: string;
} => {
  const codeVerifier = randomPKCECodeVerifier();
  const codeChallenge = calculatePKCECodeChallenge(codeVerifier);
  return { codeVerifier, codeChallenge };
};

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
  if (typeof input !== 'string') return {};
  const str = input;

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
