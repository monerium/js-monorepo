'use server';

import { BearerProfile, generatePKCE } from '@monerium/sdk';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { getMoneriumAuthClient } from '../../lib/sdk';

const SESSION_COOKIE_NAME = 'monerium_session';

export async function setSession(profile: BearerProfile) {
  const cookieStore = await cookies();
  const expires_at = Date.now() + profile.expires_in * 1000;

  // The cookie should live long enough to allow refreshing the token
  const cookieExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  cookieStore.set(
    SESSION_COOKIE_NAME,
    JSON.stringify({ ...profile, expires_at }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: cookieExpires,
      path: '/',
    }
  );
}

export async function getSession(): Promise<BearerProfile | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie) {
    return null;
  }

  try {
    const {
      access_token: _accessToken, //omit
      refresh_token: _refreshToken, //omit
      ...safeProfile
    } = JSON.parse(sessionCookie.value) as BearerProfile;

    return safeProfile as BearerProfile;
  } catch (_error) {
    return null;
  }
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

const CLIENT_ID =
  process.env.NEXT_PUBLIC_MONERIUM_CLIENT_ID ||
  '9ee602d1-cc19-11ef-92b5-aae55502171d';
const REDIRECT_URI =
  process.env.NEXT_PUBLIC_MONERIUM_REDIRECT_URI ||
  'http://localhost:5000/dashboard';

const CODE_VERIFIER_COOKIE = 'monerium_code_verifier';
const STATE_COOKIE = 'monerium_state';

async function prepareAuthFlow() {
  const { codeVerifier, codeChallenge } = generatePKCE();
  const state = crypto.randomUUID();

  const cookieStore = await cookies();
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 60 * 10, // 10 minutes
    path: '/',
  };

  // Store code verifier and state in secure HTTP-only cookies
  // so we can retrieve them in the callback action.
  cookieStore.set(CODE_VERIFIER_COOKIE, codeVerifier, options);
  cookieStore.set(STATE_COOKIE, state, options);

  return { codeChallenge, state };
}

/**
 * Initiates the standard Monerium Authorization Flow.
 */
export async function authorizeAction(skipKyc: boolean = true) {
  const authClient = getMoneriumAuthClient();

  const { codeChallenge, state } = await prepareAuthFlow();

  const authUrl = authClient.buildAuthorizationUrl({
    clientId: CLIENT_ID,
    redirectUri: REDIRECT_URI,
    codeChallenge,
    state,
    skipKyc,
  });

  redirect(authUrl);
}

/**
 * Initiates the SIWE (Sign In With Ethereum) Authorization Flow.
 */
export async function siweAuthorizeAction(message: string, signature: string) {
  const authClient = getMoneriumAuthClient();

  const { codeChallenge, state } = await prepareAuthFlow();

  const authUrl = authClient.buildSiweAuthorizationUrl({
    clientId: CLIENT_ID,
    redirectUri: REDIRECT_URI,
    codeChallenge,
    message,
    signature,
    state,
  });

  redirect(authUrl);
}

/**
 * Handles the callback from Monerium, validates state, exchanges the code
 * for an access token, and sets the session cookie.
 */
export async function callbackAction(url: string) {
  console.log('Callback action invoked with URL:', url);
  const authClient = getMoneriumAuthClient();
  const { code, state, error, errorDescription } =
    authClient.parseAuthorizationResponse(url);

  if (error) {
    console.error('Authorization failed:', error, errorDescription);
    throw new Error(`Authorization failed: ${error} - ${errorDescription}`);
  }

  if (!code) {
    console.error('No authorization code found in the response.');
    throw new Error('No authorization code found in the response.');
  }

  const cookieStore = await cookies();
  const storedState = cookieStore.get(STATE_COOKIE)?.value;
  const codeVerifier = cookieStore.get(CODE_VERIFIER_COOKIE)?.value;

  console.log('Comparing state:', state, 'with stored state:', storedState);

  if (!storedState || !codeVerifier) {
    console.error('Missing code verifier or state cookie.');
    throw new Error('Missing code verifier or state cookie.');
  }

  if (state !== storedState) {
    console.error('State mismatch.', { state, storedState });
    throw new Error('State mismatch.');
  }

  // Clear the temporary cookies
  cookieStore.delete(CODE_VERIFIER_COOKIE);
  cookieStore.delete(STATE_COOKIE);

  try {
    console.log('Exchanging code for token...');
    const profile = await authClient.authorizationCodeGrant({
      clientId: CLIENT_ID,
      redirectUri: REDIRECT_URI,
      code,
      codeVerifier,
    });

    console.log('Token exchanged successfully, setting session...');
    await setSession(profile);
  } catch (err) {
    console.error('Failed to exchange authorization code:', err);
    throw new Error('Failed to exchange authorization code.');
  }

  console.log('Session set, redirecting to dashboard...');
  revalidatePath('/');
  revalidatePath('/dashboard');
  redirect('/dashboard');
}
