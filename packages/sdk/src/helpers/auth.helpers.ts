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
