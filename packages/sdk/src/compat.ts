import constants from './constants';
import { calculatePKCECodeChallenge, randomPKCECodeVerifier } from './helpers';

/**
 * @deprecated Use `randomPKCECodeVerifier()` and `calculatePKCECodeChallenge()` instead.
 * Will be removed in v3.0.
 *
 * Before:
 *   const codeChallenge = preparePKCEChallenge();
 *
 * After:
 *   const codeVerifier = randomPKCECodeVerifier();
 *   const codeChallenge = calculatePKCECodeChallenge(codeVerifier);
 *   sessionStorage.setItem('pkce_verifier', codeVerifier); // you own storage
 */
export const preparePKCEChallenge = (): string => {
  const codeVerifier = randomPKCECodeVerifier();
  const codeChallenge = calculatePKCECodeChallenge(codeVerifier);
  localStorage.setItem(constants.STORAGE_CODE_VERIFIER, codeVerifier);
  return codeChallenge;
};
