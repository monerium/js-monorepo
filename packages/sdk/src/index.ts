/**
 * @packageDocumentation
 * A library to interact with Monerium API.
 *
 *
 * ## Installation
 *
 * ```bash
 * pnpm add @monerium/sdk
 * ```
 *
 * @example
 * ```tsx
 * import { MoneriumClient } from '@monerium/sdk';
 *
 * const monerium = new MoneriumClient({
 *  clientId: '...',
 *  redirectUri: '...',
 *  environment: 'sandbox',
 * })
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
 */

import { createMoneriumClient } from './client';
import { MoneriumClient } from './compat';
export { default as constants } from './constants';
export * from './types';
export {
  placeOrderMessage,
  rfc3339,
  getChain,
  parseChain,
  shortenIban,
  shortenAddress,
  siweMessage,
} from './utils';

export { createMoneriumClient };

export { MoneriumApiError, MoneriumSdkError } from './errors';
export type { MoneriumSdkErrorType } from './errors';

export type {
  Transport,
  TransportRequest,
  TransportResponse,
} from './transport';

/** @deprecated will be remvoed in v3. Use `createMoneriumClient` instead. */
export { MoneriumClient };
/** @deprecated will be remvoed in v3. Use `createMoneriumClient` instead. */
export default MoneriumClient;
