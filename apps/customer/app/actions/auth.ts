'use server';

import { BearerProfile, generatePKCE, siweMessage } from '@monerium/sdk';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { moneriumClient } from '../../lib/sdk';

const SESSION_COOKIE_NAME = 'monerium_session';

export async function setSession(profile: BearerProfile) {
  const cookieStore = await cookies();
  const expires = new Date(Date.now() + profile.expires_in * 1000);

  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(profile), {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
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

const isDeployment = !!process.env.NETLIFY;

const CLIENT_ID = process.env.MONERIUM_CLIENT_ID as string;
const REDIRECT_URI = isDeployment
  ? process.env.URL + '/dashboard'
  : (process.env.MONERIUM_REDIRECT_URI as string);
const APP_DOMAIN = isDeployment
  ? process.env.URL
  : (process.env.MONERIUM_APP_DOMAIN as string);
const APP_NAME = process.env.MONERIUM_APP_NAME as string;
const PRIVACY_POLICY_URL = process.env.MONERIUM_PRIVACY_POLICY_URL as string;
const TOS_URL = process.env.MONERIUM_TOS_URL as string;

if (!CLIENT_ID) {
  throw new Error(
    'MONERIUM_CLIENT_ID environment variable is missing. Please create an application in the Monerium sandbox and add it to your .env.local file.'
  );
}

if (!REDIRECT_URI) {
  throw new Error(
    'MONERIUM_REDIRECT_URI environment variable is missing. Please add it to your .env.local file (e.g., http://localhost:5001/dashboard).'
  );
}

const CODE_VERIFIER_COOKIE = 'monerium_code_verifier';
const STATE_COOKIE = 'monerium_state';

async function prepareAuthFlow() {
  const { codeVerifier, codeChallenge } = generatePKCE();
  const state = crypto.randomUUID();

  const cookieStore = await cookies();
  const options = {
    httpOnly: true,
    secure: true,
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
  const { codeChallenge, state } = await prepareAuthFlow();

  const authUrl = moneriumClient.buildAuthorizationUrl({
    clientId: CLIENT_ID,
    redirectUri: REDIRECT_URI,
    codeChallenge,
    state,
    skipKyc,
  });

  redirect(authUrl);
}

/**
 * Generates the SIWE message using environment variables
 */
export async function getSiweMessageAction(address: string, chainId: number) {
  return siweMessage({
    domain: APP_DOMAIN || 'localhost:5001',
    address,
    appName: APP_NAME || 'SDK TEST APP',
    redirectUri: REDIRECT_URI,
    chainId,
    privacyPolicyUrl:
      PRIVACY_POLICY_URL || 'https://monerium.com/policies/privacy-policy',
    termsOfServiceUrl:
      TOS_URL || 'https://monerium.com/policies/personal-terms-of-service',
  });
}

/**
 * Initiates the SIWE (Sign In With Ethereum) Authorization Flow.
 */
export async function siweAuthorizeAction(message: string, signature: string) {
  const { codeChallenge, state } = await prepareAuthFlow();

  const authUrl = moneriumClient.buildSiweAuthorizationUrl({
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
  const {
    code,
    state: returnedState,
    error,
    errorDescription,
  } = moneriumClient.parseAuthorizationResponse(url);

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

  console.log(
    'Comparing state:',
    returnedState,
    'with stored state:',
    storedState
  );

  if (!storedState || !codeVerifier) {
    console.error('Missing code verifier or state cookie.');
    throw new Error('Missing code verifier or state cookie.');
  }

  if (returnedState !== storedState) {
    console.error('State mismatch.', { returnedState, storedState });
    throw new Error('State mismatch.');
  }

  // Clear the temporary cookies
  cookieStore.delete(CODE_VERIFIER_COOKIE);
  cookieStore.delete(STATE_COOKIE);

  try {
    console.log('Exchanging code for token...');
    const profile = await moneriumClient.authorizationCodeGrant({
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
