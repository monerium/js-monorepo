/**
 * @jest-environment jsdom
 */

// For credentials used here,
// see 'Monerium SDK Test user' in 1Password

// punkWallet: https://punkwallet.io/pk#0x30fa9f64fb85dab6b4bf045443e08315d6570d4eabce7c1363acda96042a6e1a

import 'jest-localstorage-mock';

import constants from '../src/constants';
import { MoneriumClient } from '../src/index';
import { getChain } from '../src/utils';
import { APP_ONE_AUTH_FLOW_CLIENT_ID, APP_ONE_REDIRECT_URL } from './constants';

const { LINK_MESSAGE, STORAGE_CODE_VERIFIER, STORAGE_ACCESS_TOKEN } = constants;

const message = LINK_MESSAGE;

// Can't run in CI because of Cloudflare
process.env.CI !== 'true' &&
  describe('MoneriumClient', () => {
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

    test('authorize with refresh token attempt', async () => {
      const client = new MoneriumClient({
        clientId: APP_ONE_AUTH_FLOW_CLIENT_ID,
        redirectUri: APP_ONE_REDIRECT_URL,
      });
      localStorage.setItem(STORAGE_ACCESS_TOKEN, 'testRefreshToken');

      const getItemSpy = jest.spyOn(window.localStorage, 'getItem');

      try {
        await client.getAccess();
      } catch (err) {
        expect((err as Error).message).toBe(
          'Failed to handle access request: Unable to load refresh token info: Access not found via code: testRefreshToken'
        );
      }

      expect(getItemSpy).toHaveBeenCalledWith(STORAGE_ACCESS_TOKEN);

      getItemSpy.mockRestore();
    });

    test('get chain and network from chainId', () => {
      expect(getChain(1)).toBe('ethereum');
      expect(getChain(137)).toBe('polygon');
      expect(getChain(80002)).toBe('amoy');
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
