import { MONERIUM_CONFIG } from '../config';
import { ENV, Environment } from '../types';

/**
 * Get Environment configuration for the given environment. Defaults to 'sandbox' if not specified.
 * @param env - The target environment (`'sandbox'` or `'production'`). Defaults to `'sandbox'`.
 * @returns Environment configuration
 */
export function getEnv(env: ENV = 'sandbox'): Environment {
  return MONERIUM_CONFIG.environments[env];
}
