/**
 * @packageDocumentation
 * A library to interact with Monerium API.
 *
 * ## Installation
 *
 * ```bash
 * pnpm add @monerium/sdk
 * ```
 *
 * @example
 * ```ts
 * // v3 API — factory function, Node.js-first
 * import { createMoneriumClient, authorizationCodeGrant } from '@monerium/sdk';
 *
 * const client = createMoneriumClient({
 *   environment: 'sandbox',
 *   getAccessToken: () => myStore.get('access_token'),
 * });
 *
 * const profiles = await client.getProfiles();
 * ```
 */

// ─── New v3 API ───────────────────────────────────────────────────────────────

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

// ─── Deprecated — will be removed in v3.0 ────────────────────────────────────

/**
 * @deprecated Use `createMoneriumClient()` instead. Will be removed in v3.0.
 */
export { MoneriumClient } from './compat';

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
