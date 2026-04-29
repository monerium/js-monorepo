import {
  BearerProfile,
  createMoneriumApiClient,
  createMoneriumAuthClient,
  ENV,
} from '@monerium/sdk';
import { cookies } from 'next/headers';
import { setSession } from '../app/actions/auth';

const environment: ENV =
  (process.env.NEXT_PUBLIC_MONERIUM_ENV as ENV) || 'sandbox';

const CLIENT_ID =
  process.env.NEXT_PUBLIC_MONERIUM_CLIENT_ID ||
  '9ee602d1-cc19-11ef-92b5-aae55502171d';

function isTokenExpired(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    const payload = JSON.parse(
      Buffer.from(parts[1] as string, 'base64').toString()
    );
    return payload.exp * 1000 < Date.now() + 60000; // 1 minute buffer
  } catch (_e) {
    return true; // If we can't parse it, assume it's expired to force a refresh
  }
}

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
        let session = JSON.parse(sessionCookie.value) as BearerProfile;

        // Automatically refresh the token if it's expired or within 1 minute of expiring
        if (isTokenExpired(session.access_token) && session.refresh_token) {
          console.log('Access token expired, refreshing...');
          const authClient = getMoneriumAuthClient();
          session = await authClient.refreshTokenGrant({
            clientId: CLIENT_ID,
            refreshToken: session.refresh_token,
          });
          await setSession(session);
        }

        return session.access_token;
      } catch (error) {
        console.error('Session retrieve/refresh error:', error);
        throw new Error('Failed to retrieve or refresh access token.');
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
