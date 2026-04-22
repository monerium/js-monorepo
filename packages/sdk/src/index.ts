/**
 * @packageDocumentation
 * A library to interact with the Monerium API.
 *
 * ![npm version](https://img.shields.io/npm/v/@monerium/sdk)
 *
 * ## Installation
 *
 * ```bash
 * pnpm add @monerium/sdk
 * ```
 *
 * @example
 * ```ts
 * import {
 *   randomPKCECodeVerifier,
 *   calculatePKCECodeChallenge,
 *   buildAuthorizationUrl,
 *   authorizationCodeGrant,
 *   parseAuthorizationResponse,
 *   refreshTokenGrant,
 *   createMoneriumClient,
 * } from '@monerium/sdk';
 *
 * // --- Initiate login (server route) ---
 * const codeVerifier = randomPKCECodeVerifier();
 * const codeChallenge = calculatePKCECodeChallenge(codeVerifier);
 * session.set('pkce_verifier', codeVerifier); // server-side session
 *
 * const url = buildAuthorizationUrl({
 *   environment: 'sandbox',
 *   clientId: 'your-client-id',
 *   redirectUri: 'https://your-app.com/callback',
 *   codeChallenge,
 * });
 * res.redirect(url);
 *
 * // --- Handle the callback (server route) ---
 * const { code } = parseAuthorizationResponse(req.url);
 * const codeVerifier = session.get('pkce_verifier');
 * session.delete('pkce_verifier');
 *
 * const bearerProfile = await authorizationCodeGrant({
 *   environment: 'sandbox',
 *   clientId: 'your-client-id',
 *   redirectUri: 'https://your-app.com/callback',
 *   code,
 *   codeVerifier,
 * });
 *
 * req.session.accessToken = bearerProfile.access_token;
 * req.session.refreshToken = bearerProfile.refresh_token;
 * req.session.accessExpiry = Date.now() + bearerProfile.expires_in * 1000;
 *
 * // --- Use the API ---
 * const client = createMoneriumClient({
 *   environment: 'sandbox',
 *   getAccessToken: async () => {
 *     if (Date.now() > session.accessExpiry) {
 *       const newProfile = await refreshTokenGrant({
 *         environment: 'sandbox',
 *         clientId: 'your-client-id',
 *         refreshToken: session.refreshToken,
 *       });
 *       session.accessToken = newProfile.access_token;
 *       session.accessExpiry = Date.now() + newProfile.expires_in * 1000;
 *       return newProfile.access_token;
 *     }
 *     return session.accessToken;
 *   },
 * });
 *
 * const profiles = await client.getProfiles();
 * ```
 */

// ─── Client ───────────────────────────────────────────────────────────────────

export { createMoneriumClient } from './client';
export type { MoneriumClientOptions } from './client';

// ─── Auth helpers ─────────────────────────────────────────────────────────────

export {
  authorizationCodeGrant,
  buildAuthorizationUrl,
  buildSiweAuthorizationUrl,
  clientCredentialsGrant,
  parseAuthorizationResponse,
  refreshTokenGrant,
} from './auth';

export {
  calculatePKCECodeChallenge,
  randomPKCECodeVerifier,
} from './helpers/auth.helpers';

export type {
  AuthorizationCodeGrantOptions,
  BuildAuthorizationUrlOptions,
  BuildSiweAuthorizationUrlOptions,
  ClientCredentialsGrantOptions,
  ParsedAuthorizationResponse,
  RefreshTokenGrantOptions,
} from './auth';

// ─── Errors ───────────────────────────────────────────────────────────────────

export { MoneriumApiError, MoneriumSdkError } from './errors';
export type { MoneriumSdkErrorType } from './errors';

// ─── Transport ────────────────────────────────────────────────────────────────

export type {
  Transport,
  TransportRequest,
  TransportResponse,
} from './transport';

// ─── Public API ───────────────────────────────────────────────────────────────

export { default as constants } from './constants';
export * from './types';
export {
  getChain,
  parseChain,
  placeOrderMessage,
  rfc3339,
  shortenAddress,
  shortenIban,
  siweMessage,
} from './utils';
