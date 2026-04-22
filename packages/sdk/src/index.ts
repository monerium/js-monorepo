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
 * ## Overview
 *
 * The SDK is designed for **Node.js and server-side runtimes**. Most Monerium API
 * endpoints will eventually be CORS-locked and cannot be called directly from a browser.
 *
 * The auth flow is a explicit sequence of function calls that you orchestrate.
 * Each function returns a value — nothing is stored, redirected, or mutated
 * unless you explicitly do so. Tokens, verifiers, and expiry values are returned
 * as plain objects for you to store however you choose.
 *
 * ## Custom transport
 *
 * By default the SDK uses the platform's built-in `fetch`. You can replace it
 * with a `transport` option on {@link createMoneriumClient} — useful for
 * injecting custom headers, routing requests through a proxy, or testing:
 *
 * ```ts
 * const client = createMoneriumClient({
 *   environment: 'sandbox',
 *   accessToken: token,
 *   transport: async ({ method, url, headers, body }) => {
 *     const res = await myFetch(url, { method, headers, body });
 *     return { status: res.status, bodyText: await res.text() };
 *   },
 * });
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
export type { MoneriumClient, MoneriumClientOptions } from './client';

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

export type { Chain, ProductionChain, SandboxChain } from './chains';
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
