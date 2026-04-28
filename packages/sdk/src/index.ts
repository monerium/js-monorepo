export {
  createMoneriumApiClient,
  createProfile,
  getAddress,
  getAddresses,
  getAuthContext,
  getBalances,
  getIban,
  getIbans,
  getOrder,
  getOrders,
  getProfile,
  getProfiles,
  getSignatures,
  getTokens,
  linkAddress,
  moveIban,
  placeOrder,
  requestIban,
  shareProfileKYC,
  updateProfileDetails,
  updateProfileForm,
  updateProfileVerifications,
  uploadSupportingDocument,
} from './client';
export type { MoneriumApiClient, MoneriumApiClientOptions } from './client';

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
