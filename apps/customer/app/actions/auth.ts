'use server';

import { generatePKCE } from '@monerium/sdk';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { getMoneriumAuthClient } from '../../lib/sdk';
import { clearSession, getSession, setSession } from '../../lib/session';

const CLIENT_ID =
  process.env.NEXT_PUBLIC_MONERIUM_CLIENT_ID ||
  '9ee602d1-cc19-11ef-92b5-aae55502171d';
const REDIRECT_URI =
  process.env.NEXT_PUBLIC_MONERIUM_REDIRECT_URI ||
  'http://localhost:5000/dashboard';

const CODE_VERIFIER_COOKIE = 'monerium_code_verifier';
const STATE_COOKIE = 'monerium_state';

/**
 * Initiates the standard Monerium Authorization Flow.
 */
export async function authorizeAction(skipKyc: boolean = true) {
  const authClient = getMoneriumAuthClient();

  const { codeVerifier, codeChallenge } = generatePKCE();
  const state = crypto.randomUUID();

  // Store code verifier and state in secure HTTP-only cookies
  // so we can retrieve them in the callback action.
  const cookieStore = await cookies();
  cookieStore.set(CODE_VERIFIER_COOKIE, codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10, // 10 minutes
    path: '/',
  });
  cookieStore.set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10, // 10 minutes
    path: '/',
  });

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

  const { codeVerifier, codeChallenge } = generatePKCE();
  const state = crypto.randomUUID();

  const cookieStore = await cookies();
  cookieStore.set(CODE_VERIFIER_COOKIE, codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10, // 10 minutes
    path: '/',
  });
  cookieStore.set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10, // 10 minutes
    path: '/',
  });

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

/**
 * Logs the user out by clearing the session cookie.
 */
export async function logoutAction() {
  await clearSession();
}

/**
 * Returns the current session if it exists, otherwise null.
 */
export async function getSessionAction() {
  return await getSession();
}
