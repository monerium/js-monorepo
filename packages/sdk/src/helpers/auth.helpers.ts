import encodeBase64Url from 'crypto-js/enc-base64url.js';
import SHA256 from 'crypto-js/sha256.js';

import constants from '../constants';
import {
  AuthArgs,
  AuthCodePayload,
  ClientCredentialsPayload,
  PKCERequest,
  PKCERequestArgs,
  RefreshTokenPayload,
} from '../types';
import { parseChain, urlEncoded } from '../utils';

/** Structure the Auth Flow params */
export const getAuthFlowParams = (
  args: PKCERequestArgs,
  codeChallenge: string
) => {
  const {
    client_id,
    redirect_uri,
    scope,
    state,
    address,
    signature,
    chain,
    skip_create_account,
    skip_kyc,
  } = args;

  const autoLink = address
    ? {
        address: address,
        ...(signature !== undefined ? { signature: signature } : {}),
        ...(chain !== undefined ? { chain: parseChain(chain) } : {}),
      }
    : {};

  return urlEncoded({
    client_id,
    redirect_uri,
    ...(scope !== undefined ? { scope: scope } : {}),
    ...(state !== undefined ? { state: state } : {}),
    ...(skip_create_account !== undefined
      ? { skip_create_account: skip_create_account }
      : {}),
    ...(skip_kyc !== undefined ? { skip_kyc: skip_kyc } : {}),
    code_challenge: codeChallenge,
    code_challenge_method: 'S256' as PKCERequest['code_challenge_method'],
    response_type: 'code' as PKCERequest['response_type'],

    ...autoLink,
  });
};

/**
 * Find a more secure way to generate a random string
 * Using crypto-js to generate a random string was causing the following error:
 * `Error: Native crypto module could not be used to get secure random number.`
 * https://github.com/brix/crypto-js/issues/256
 */
export const generateRandomString = () => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < 128) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

/** Generate the PKCE code challenge */
export const generateCodeChallenge = (codeVerifier: string) => {
  return encodeBase64Url.stringify(SHA256(codeVerifier as string));
};

/**
 * Constructs the Auth Flow URL and stores the code verifier in the local storage
 */
export const getAuthFlowUrlAndStoreCodeVerifier = (
  baseUrl: string,
  args: PKCERequestArgs
): string => {
  const codeVerifier = generateRandomString();
  const codeChallenge = generateCodeChallenge(codeVerifier);

  localStorage.setItem(constants.STORAGE_CODE_VERIFIER, codeVerifier || '');

  return `${baseUrl}/auth?${getAuthFlowParams(args, codeChallenge)}`;
};

/**
 * Clean the query string from the URL
 */
export const cleanQueryString = () => {
  const url = window.location.href;
  if (!url || !url?.includes('?')) return;
  const [baseUrl, queryString] = url.split('?');

  // Check if there is a query string
  if (queryString) {
    window.history.replaceState(null, '', baseUrl);
  }
};

export const isAuthCode = (args: AuthArgs): args is AuthCodePayload => {
  return (args as AuthCodePayload).code != undefined;
};

export const isRefreshToken = (args: AuthArgs): args is RefreshTokenPayload => {
  return (args as RefreshTokenPayload).refresh_token != undefined;
};

export const isClientCredentials = (
  args: AuthArgs
): args is ClientCredentialsPayload => {
  return (args as ClientCredentialsPayload).client_secret != undefined;
};
