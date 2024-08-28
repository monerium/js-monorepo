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
 * await monerium.getAccess();
 *
 * // Retrieve profiles the client has access to.
 * await monerium.getProfiles();
 * ```
 */

import { MoneriumClient } from './client';
export { default as constants } from './constants';
export * from './types';
export { placeOrderMessage, rfc3339, getChain } from './utils';

export { MoneriumClient };
export default MoneriumClient;
