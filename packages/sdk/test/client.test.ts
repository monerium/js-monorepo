/**
 * @jest-environment jsdom
 */

// Login: monerium-test-sdk@maildrop.cc
// Password: Passw0rd!

// punkWallet: https://punkwallet.io/pk#0x30fa9f64fb85dab6b4bf045443e08315d6570d4eabce7c1363acda96042a6e1a

import 'jest-localstorage-mock';

import constants from '../src/constants';
import { generateCodeChallenge } from '../src/helpers';
import { MoneriumClient } from '../src/index';
import { getChain } from '../src/utils';
import { APP_ONE_AUTH_FLOW_CLIENT_ID, APP_ONE_REDIRECT_URL } from './constants';

const { LINK_MESSAGE, STORAGE_CODE_VERIFIER, STORAGE_REFRESH_TOKEN } =
  constants;

const message = LINK_MESSAGE;

const assignMock = jest.fn();

// Can't run in CI because of Cloudflare
process.env.CI !== 'true' &&
  describe('MoneriumClient', () => {
    beforeAll(() => {
      Object.defineProperty(window, 'location', {
        value: {
          assign: assignMock,
        },
        writable: true,
      });
    });
    afterEach(() => {
      window.localStorage.clear();
      jest.restoreAllMocks();
    });

    test('client initialization', () => {
      const client = new MoneriumClient();

      expect(client).toBeInstanceOf(MoneriumClient);
    });

    test(`verify link message`, () => {
      expect(LINK_MESSAGE).toBe(message);
    });

    test('sandbox environment', () => {
      const client = new MoneriumClient('sandbox');
      const defaultClient = new MoneriumClient();
      const url = client.getAuthFlowURI({
        client_id: '',
        redirect_uri: '',
      });
      const defaultUrl = defaultClient.getAuthFlowURI({
        client_id: '',
        redirect_uri: '',
      });
      expect(defaultUrl).toContain('https://api.monerium.dev');
      expect(url).toContain('https://api.monerium.dev');
    });

    test('production environment', () => {
      const client = new MoneriumClient('production');

      const url = client.getAuthFlowURI({
        client_id: '',
        redirect_uri: '',
      });
      expect(url).toContain('https://api.monerium.app');
    });

    test('class instance with auth flow auth', async () => {
      const client = new MoneriumClient({
        clientId: 'testClientId',
        redirectUrl: 'http://example.com',
      });

      await client.authorize();

      const codeVerifier = window.localStorage.getItem(STORAGE_CODE_VERIFIER);
      const challenge = generateCodeChallenge(codeVerifier as string);

      expect(assignMock).toHaveBeenCalledWith(
        `https://api.monerium.dev/auth?client_id=testClientId&redirect_uri=http%3A%2F%2Fexample.com&code_challenge=${challenge}&code_challenge_method=S256&response_type=code`
      );
      assignMock.mockRestore();
    });

    test('authorization code flow with chainId', async () => {
      const client = new MoneriumClient();

      const authFlowUrl = client.getAuthFlowURI({
        redirect_uri: 'http://example.com',
        client_id: 'testClientId',
        address: '0x',
        chain: 11155111,
      });
      const codeVerifier = window.localStorage.getItem(STORAGE_CODE_VERIFIER);
      const challenge = generateCodeChallenge(codeVerifier as string);

      expect(authFlowUrl).toBe(
        `https://api.monerium.dev/auth?client_id=testClientId&redirect_uri=http%3A%2F%2Fexample.com&code_challenge=${challenge}&code_challenge_method=S256&response_type=code&address=0x&chain=ethereum`
      );
    });

    test('authorization code flow with chain and network', async () => {
      const client = new MoneriumClient();

      const authFlowUrl = client.getAuthFlowURI({
        redirect_uri: 'http://example.com',
        client_id: 'testClientId',
        address: '0x',
        chain: 'ethereum',
      });

      const codeVerifier = window.localStorage.getItem(STORAGE_CODE_VERIFIER);
      const challenge = generateCodeChallenge(codeVerifier as string);

      expect(authFlowUrl).toBe(
        `https://api.monerium.dev/auth?client_id=testClientId&redirect_uri=http%3A%2F%2Fexample.com&code_challenge=${challenge}&code_challenge_method=S256&response_type=code&address=0x&chain=ethereum`
      );
    });

    test('authorization code flow without chain info', async () => {
      const client = new MoneriumClient();

      const test = client.getAuthFlowURI({
        redirect_uri: 'http://example.com',
        client_id: 'testClientId',
      });

      const codeVerifier = window.localStorage.getItem(STORAGE_CODE_VERIFIER);
      const challenge = generateCodeChallenge(codeVerifier as string);

      expect(test).toBe(
        `https://api.monerium.dev/auth?client_id=testClientId&redirect_uri=http%3A%2F%2Fexample.com&code_challenge=${challenge}&code_challenge_method=S256&response_type=code`
      );
    });

    test('redirect', async () => {
      const client = new MoneriumClient();

      await client.authorize({
        redirectUrl: 'http://example.com',
        clientId: 'testClientId',
      });

      const codeVerifier = localStorage.getItem(STORAGE_CODE_VERIFIER);
      const challenge = generateCodeChallenge(codeVerifier as string);

      expect(assignMock).toHaveBeenCalledWith(
        `https://api.monerium.dev/auth?client_id=testClientId&redirect_uri=http%3A%2F%2Fexample.com&code_challenge=${challenge}&code_challenge_method=S256&response_type=code`
      );
      assignMock.mockRestore();
    });
    test('redirect w auto-link', async () => {
      const client = new MoneriumClient();

      await client.authorize({
        redirectUrl: 'http://example.com',
        clientId: 'testClientId',
        address: '0x1234',
        signature: '0x5678',
        chain: 137,
      });

      const codeVerifier = localStorage.getItem(STORAGE_CODE_VERIFIER);
      const challenge = generateCodeChallenge(codeVerifier as string);

      expect(assignMock).toHaveBeenCalledWith(
        `https://api.monerium.dev/auth?client_id=testClientId&redirect_uri=http%3A%2F%2Fexample.com&code_challenge=${challenge}&code_challenge_method=S256&response_type=code&address=0x1234&signature=0x5678&chain=polygon`
      );
      assignMock.mockRestore();
    });

    test('authorize with refresh token attempt', async () => {
      const client = new MoneriumClient();
      localStorage.setItem(STORAGE_REFRESH_TOKEN, 'testRefreshToken');

      const getItemSpy = jest.spyOn(window.localStorage, 'getItem');

      try {
        await client.getAccess({
          clientId: APP_ONE_AUTH_FLOW_CLIENT_ID,
          redirectUrl: APP_ONE_REDIRECT_URL,
        });
      } catch (err) {
        expect((err as Error).message).toBe(
          'Unable to load refresh token info'
        );
      }

      expect(getItemSpy).toHaveBeenCalledWith(STORAGE_REFRESH_TOKEN);

      getItemSpy.mockRestore();
    });

    test('get chain and network from chainId', () => {
      expect(getChain(1)).toBe('ethereum');
      expect(getChain(137)).toBe('polygon');
      expect(getChain(80002)).toBe('polygon');
    });
  });

process.env.CI !== 'true' &&
  describe('disconnect()', () => {
    it('should remove the codeVerifier from the storage', async () => {
      const localStorageSpy = jest.spyOn(window.localStorage, 'removeItem');
      const client = new MoneriumClient();

      await client.disconnect();

      expect(localStorageSpy).toHaveBeenCalledWith(STORAGE_CODE_VERIFIER);
    });
    it('should remove bearerProfile from the class instance', async () => {
      const client = new MoneriumClient();

      await client.disconnect();

      expect(client.bearerProfile).toBeUndefined();
    });
  });

process.env.CI === 'true' &&
  it('SKIPPED', () => {
    expect(true).toBe(true);
  });
