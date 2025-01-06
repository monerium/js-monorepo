/**
 * @jest-environment jsdom
 */
import 'jest-localstorage-mock';

import constants from '../src/constants';
import { queryParams } from '../src/helpers';
import {
  generateCodeChallenge,
  getAuthFlowUrlAndStoreCodeVerifier,
} from '../src/helpers/auth.helpers';

const { STORAGE_CODE_VERIFIER } = constants;

describe('getAuthFlowUrlAndStoreCodeVerifier', () => {
  afterEach(() => {
    localStorage.clear();
  });

  test('should generate auth flow URL and store code verifier', () => {
    const baseUrl = 'https://api.test.com';
    const args = {
      client_id: 'testClientId',
      redirect_uri: 'http://example.com',
    };

    const url = getAuthFlowUrlAndStoreCodeVerifier(
      { name: 'sandbox', api: baseUrl, web: '', wss: '' },
      args
    );

    const codeVerifier = localStorage.getItem(STORAGE_CODE_VERIFIER);
    const codeChallenge = generateCodeChallenge(codeVerifier as string);

    expect(url).toContain(baseUrl);
    expect(url).toContain(`client_id=${args.client_id}`);
    expect(url).toContain(
      `redirect_uri=${encodeURIComponent(args.redirect_uri)}`
    );
    expect(url).toContain(`code_challenge=${codeChallenge}`);
    expect(codeVerifier).toBeTruthy();
  });
  test('should generate auth flow URL and store code verifier - auto link', () => {
    const baseUrl = 'https://api.test.com';
    const args = {
      client_id: 'testClientId',
      redirect_uri: 'http://example.com/test',
      address: '0x1234',
      chain: 'ethereum',
    };

    const url = getAuthFlowUrlAndStoreCodeVerifier(
      { name: 'sandbox', api: baseUrl, web: '', wss: '' },
      args
    );

    const codeVerifier = localStorage.getItem(STORAGE_CODE_VERIFIER);
    const codeChallenge = generateCodeChallenge(codeVerifier as string);

    expect(url).toContain(baseUrl);
    expect(url).toContain(`client_id=${args.client_id}`);
    expect(url).toContain(
      `redirect_uri=${encodeURIComponent(args.redirect_uri)}`
    );
    expect(url).toContain(`address=0x1234`);
    expect(url).toContain(`chain=sepolia`);
    expect(url).toContain(`code_challenge=${codeChallenge}`);
    expect(codeVerifier).toBeTruthy();
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
