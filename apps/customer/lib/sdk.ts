import {
  BearerProfile,
  createMoneriumApiClient,
  createMoneriumAuthClient,
  ENV,
} from '@monerium/sdk';
import { cookies } from 'next/headers';

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
      const cookieStore = await cookies();
      const sessionCookie = cookieStore.get('monerium_session');

      if (!sessionCookie) {
        throw new Error('No active session found.');
      }

      try {
        const session = JSON.parse(sessionCookie.value) as BearerProfile;
        return session.access_token;
      } catch (_error) {
        throw new Error('No active session found.');
      }
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
