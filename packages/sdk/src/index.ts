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

import { MoneriumClient } from './client';
export { default as constants } from './constants';
export * from './types';
export {
  placeOrderMessage,
  rfc3339,
  getChain,
  parseChain,
  shortenIban,
  siweMessage,
} from './utils';

export { MoneriumClient };
export default MoneriumClient;
