/**
 * @packageDocumentation
 * A library to interact with Monerium API.
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
 * // Current version - Deprecated in v4
 * import { MoneriumClient } from '@monerium/sdk';
 * const monerium = new MoneriumClient({
 *  clientId: '...',
 *  redirectUri: '...',
 *  environment: 'sandbox',
 * });
 *
 * // Will redirect the user to Monerium's authentication code flow.
 * await monerium.authorize();
 *
 * // Will use the authorization code flow code to get access token
 * await monerium.getAccess();
 *
 * // or use refresh token to get access token if provided.
 * await monerium.getAccess(refreshToken);
 *
 * // Retrieve profiles the client has access to.
 * await monerium.getProfiles();
 * ```
 * ```ts
 * // Upcoming v4 — factory function
 * import {
 *   randomPKCECodeVerifier,
 *   calculatePKCECodeChallenge,
 *   buildAuthorizationUrl,
 *   authorizationCodeGrant,
 *   refreshTokenGrant,
 *   createMoneriumClient,
 * } from '@monerium/sdk';
 *
 * // --- Initiate login ---
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
 * // --- On the callback page ---
 * const { code } = parseAuthorizationResponse(
 *   new URL(req.url, 'https://your-app.com')
 * );
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

// ─── New v4 API ───────────────────────────────────────────────────────────────

// Client
export { createMoneriumClient } from './client';
export type { MoneriumClientOptions } from './client';

// Auth helpers
export {
  authorizationCodeGrant,
  buildAuthorizationUrl,
  buildSiweAuthorizationUrl,
  calculatePKCECodeChallenge,
  clientCredentialsGrant,
  exchangeAuthorizationCode, // alias for authorizationCodeGrant
  parseAuthorizationResponse,
  randomPKCECodeVerifier,
  refreshAccessToken, // alias for refreshTokenGrant
  refreshTokenGrant,
} from './auth';

export type {
  AuthorizationCodeGrantOptions,
  BuildAuthorizationUrlOptions,
  BuildSiweAuthorizationUrlOptions,
  ClientCredentialsGrantOptions,
  ParsedAuthorizationResponse,
  RefreshTokenGrantOptions,
} from './auth';

// Errors
export { MoneriumApiError, MoneriumSdkError } from './errors';
export type { MoneriumSdkErrorType } from './errors';

// Transport
export type {
  Transport,
  TransportRequest,
  TransportResponse,
} from './transport';

// ─── Deprecated — will be removed in v4.0 ────────────────────────────────────

import { MoneriumClient } from './compat';

export { MoneriumClient };
export default MoneriumClient;

// ─── Unchanged public API ─────────────────────────────────────────────────────

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
