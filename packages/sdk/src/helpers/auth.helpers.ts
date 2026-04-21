import encodeBase64Url from 'crypto-js/enc-base64url.js';
import WordArray from 'crypto-js/lib-typedarrays.js';
import SHA256 from 'crypto-js/sha256.js';

import {
  AuthArgs,
  AuthCodePayload,
  ClientCredentialsPayload,
  RefreshTokenPayload,
} from '../types';

/**
 * @deprecated: will be removed in v4, use `randomPKCECodeVerifier` instead
 * Find a more secure way to generate a random string
 * Using crypto-js to generate a random string was causing the following error:
 * `Error: Native crypto module could not be used to get secure random number.`
 * https://github.com/brix/crypto-js/issues/256
 */

export const generateRandomString = () => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < 128) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

/**
 * @deprecated: will be removed in v4, use `calculatePKCECodeChallenge` instead
 * Generate the PKCE code challenge
 *
 */
export const generateCodeChallenge = (codeVerifier: string) => {
  return encodeBase64Url.stringify(SHA256(codeVerifier as string));
};

/**
 * Clean the query string from the URL
 */
export const cleanQueryString = () => {
  const url = window.location.href;
  if (!url || !url?.includes('?')) return;
  const [baseUrl, queryString] = url.split('?');

  // Check if there is a query string
  if (queryString) {
    window.history.replaceState(null, '', baseUrl);
  }
};

export const isAuthCode = (args: AuthArgs): args is AuthCodePayload => {
  return (args as AuthCodePayload).code != undefined;
};

export const isRefreshToken = (args: AuthArgs): args is RefreshTokenPayload => {
  return (args as RefreshTokenPayload).refresh_token != undefined;
};

export const isClientCredentials = (
  args: AuthArgs
): args is ClientCredentialsPayload => {
  return (args as ClientCredentialsPayload).client_secret != undefined;
};

// v4
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
  return encodeBase64Url.stringify(SHA256(codeVerifier as string));
};
