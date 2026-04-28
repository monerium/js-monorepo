import { BearerProfile } from '@monerium/sdk';
import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'monerium_session';

export async function setSession(profile: BearerProfile) {
  const cookieStore = await cookies();
  const expires = new Date(Date.now() + profile.expires_in * 1000);

  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(profile), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires,
    path: '/',
  });
}

export async function getSession(): Promise<BearerProfile | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie) {
    return null;
  }

  try {
    return JSON.parse(sessionCookie.value) as BearerProfile;
  } catch (_error) {
    return null;
  }
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
