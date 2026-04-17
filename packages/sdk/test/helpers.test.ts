/**
 * @jest-environment jsdom
 */
import 'jest-localstorage-mock';

import constants from '../src/constants';
import { queryParams } from '../src/helpers';
import {
  calculatePKCECodeChallenge,
  generateCodeChallenge,
  randomPKCECodeVerifier,
} from '../src/helpers/auth.helpers';

const { STORAGE_CODE_VERIFIER } = constants;

// Deprecated — will be removed in v3.0
describe('code verifier localStorage', () => {
  afterEach(() => {
    localStorage.clear();
  });

  test('should generate code challenge and store code verifier', () => {
    const codeVerifier = randomPKCECodeVerifier();
    const codeChallenge = calculatePKCECodeChallenge(codeVerifier);

    const codeVerifierFromStorage = localStorage.getItem(STORAGE_CODE_VERIFIER);
    const codeChallengeFromVerifier = generateCodeChallenge(
      codeVerifierFromStorage as string
    );

    expect(codeChallenge).toEqual(codeChallengeFromVerifier);
  });
});

describe('queryParams', () => {
  test('should include all args', () => {
    const args = {
      client_id: 'testClientId',
      redirect_uri: 'http://example.com',
    };
    expect(queryParams(args)).toBe(
      '?client_id=testClientId&redirect_uri=http%3A%2F%2Fexample.com'
    );
  });
  test('should skip undefined', () => {
    const args = {
      client_id: 'testClientId',
      redirect_uri: undefined,
      foo: null,
      bar: '',
    };
    expect(queryParams(args)).toBe('?client_id=testClientId');
  });
  test('return empty if no defined props', () => {
    const args = {
      redirect_uri: undefined,
      foo: null,
      bar: '',
    };
    expect(queryParams(args)).toBe('');
    expect(queryParams({})).toBe('');
  });
});
