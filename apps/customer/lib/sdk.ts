import {
  createMoneriumApiClient,
  createMoneriumAuthClient,
  ENV,
} from '@monerium/sdk';
import { getSession } from '../app/actions/auth';

const environment: ENV =
  (process.env.NEXT_PUBLIC_MONERIUM_ENV as ENV) || 'sandbox';

/**
 * Returns a configured Monerium API client for server-side usage.
 * Automatically fetches the access token from the secure HTTP-only session cookie.
 */
export function getMoneriumClient() {
  return createMoneriumApiClient({
    environment,
    getAccessToken: async () => {
      const session = await getSession();
      if (!session?.access_token) {
        throw new Error('No active session found.');
      }
      return session.access_token;
    },
  });
}

/**
 * Returns a configured Monerium Auth client for server-side usage.
 * Useful for PKCE flows, token exchanges, etc.
 */
export function getMoneriumAuthClient() {
  return createMoneriumAuthClient({ environment });
}
