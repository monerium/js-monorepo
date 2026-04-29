export * from './client';
export {
  MoneriumBaseClient,
  MoneriumServerClient,
  MoneriumPrivateClient,
  MoneriumOAuthClient,
  MoneriumWhitelabelClient,
} from './client.class';
export type { MoneriumApiClientOptions as MoneriumClassClientOptions } from './client.class';

// ─── Auth ─────────────────────────────────────────────────────────────────────

export {
  authorizationCodeGrant,
  buildAuthorizationUrl,
  buildSiweAuthorizationUrl,
  clientCredentialsGrant,
  createMoneriumAuthClient,
  parseAuthorizationResponse,
  refreshTokenGrant,
} from './auth';

export {
  calculatePKCECodeChallenge,
  generatePKCE,
  randomPKCECodeVerifier,
} from './helpers/auth.helpers';

export type {
  AuthorizationCodeGrantOptions,
  BuildAuthorizationUrlOptions,
  BuildSiweAuthorizationUrlOptions,
  ClientCredentialsGrantOptions,
  MoneriumAuthClient,
  MoneriumAuthClientOptions,
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

export type { Chain, ChainId, ProductionChain, SandboxChain } from './chains';
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
