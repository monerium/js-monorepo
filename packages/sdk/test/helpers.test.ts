import {
  calculatePKCECodeChallenge,
  randomPKCECodeVerifier,
} from '../src/helpers/auth.helpers';

describe('code verifier -> code challenge', () => {
  test('should generate a code verifier and derive a matching code challenge', () => {
    const codeVerifier = randomPKCECodeVerifier();
    const codeChallenge = calculatePKCECodeChallenge(codeVerifier);

    // Re-deriving from the same verifier must produce the same challenge
    expect(calculatePKCECodeChallenge(codeVerifier)).toEqual(codeChallenge);
  });

  test('randomPKCECodeVerifier produces a non-empty base64url string', () => {
    const verifier = randomPKCECodeVerifier();
    expect(typeof verifier).toBe('string');
    expect(verifier.length).toBeGreaterThan(0);
    // base64url characters only
    expect(verifier).toMatch(/^[A-Za-z0-9\-_]+$/);
  });

  test('two calls to randomPKCECodeVerifier produce distinct values', () => {
    const a = randomPKCECodeVerifier();
    const b = randomPKCECodeVerifier();
    expect(a).not.toEqual(b);
  });
});
