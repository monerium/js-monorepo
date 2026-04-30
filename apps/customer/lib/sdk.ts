import { BearerProfile, MoneriumOAuthClient, ENV } from '@monerium/sdk';
import { cookies } from 'next/headers';

const environment: ENV =
  (process.env.NEXT_PUBLIC_MONERIUM_ENV as ENV) || 'sandbox';

/**
 * Configured Monerium OAuth client for server-side usage.
 * Automatically fetches the access token from the secure HTTP-only session cookie.
 */
export const moneriumClient = new MoneriumOAuthClient({
  environment,
  getAccessToken: async () => {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('monerium_session');

    if (!sessionCookie) {
      return undefined;
    }

    try {
      const session = JSON.parse(sessionCookie.value) as BearerProfile;
      return session.access_token;
    } catch (_error) {
      return undefined;
    }
  },
});
