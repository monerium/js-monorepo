/**
 * @jest-environment node
 */

// Login: monerium-test-sdk@maildrop.cc
// Password: Passw0rd!

// punkWallet: https://punkwallet.io/pk#0x30fa9f64fb85dab6b4bf045443e08315d6570d4eabce7c1363acda96042a6e1a

import 'jest-localstorage-mock';

import constants from '../src/constants';
import { MoneriumClient } from '../src/index';
import {
  Currency,
  CurrencyAccounts,
  Individual,
  Order,
  PaymentStandard,
} from '../src/types';
import { rfc3339 } from '../src/utils';
import {
  APP_ONE_CREDENTIALS_CLIENT_ID,
  APP_ONE_CREDENTIALS_SECRET,
  APP_ONE_OWNER_USER_ID,
  DEFAULT_PROFILE,
  OWNER_SIGNATURE,
  PUBLIC_KEY,
} from './constants.js';

const { LINK_MESSAGE } = constants;

const message = LINK_MESSAGE;

let client: MoneriumClient;

// Can't run in CI because of Cloudflare
process.env.CI !== 'true' &&
  beforeAll(async () => {
    client = new MoneriumClient({
      clientId: APP_ONE_CREDENTIALS_CLIENT_ID,
      clientSecret: APP_ONE_CREDENTIALS_SECRET,
      // version: 'v2',
    });
    try {
      await client.getAccess();
    } catch (error) {
      console.error('Error, could not authenticate');
    }
  });

process.env.CI !== 'true' &&
  describe('MoneriumClient', () => {
    test('authenticate with client credentials', async () => {
      const authContext = await client.getAuthContext();

      expect(authContext.userId).toBe(APP_ONE_OWNER_USER_ID);
    });
    // TODO:
    // something off with this endpoint
    test.skip('link address', async () => {
      const authContext = await client.getAuthContext();

      const res = await client.linkAddress({
        profile: authContext.defaultProfile as string,
        address: PUBLIC_KEY,
        message: message,
        chain: 11155111,
        signature: OWNER_SIGNATURE,
      });

      expect(res).toMatchObject({
        address: '0xBd78A5C7efBf7f84C75ef638689A006512E1A6c4',
        id: 'ebec4eed-6dcb-11ee-8aa6-5273f65ed05b',
        message: 'I hereby declare that I am the address owner.',
        meta: {
          linkedBy: '9fdfd981-6dca-11ee-8aa6-5273f65ed05b',
        },
        profile: '9fdfd8f1-6dca-11ee-8aa6-5273f65ed05b',
      });
    });

    test('get profile', async () => {
      const authContext = await client.getAuthContext();
      const profile = await client.getProfile(
        authContext.defaultProfile as string
      );

      expect(profile.id).toBe(authContext.defaultProfile);
    });

    test('get balances', async () => {
      const balances = await client.getBalances();

      expect(balances).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            // id: '4b208818-44e3-11ed-adac-b2efc0e6677d',
            chain: 'ethereum',
            address: PUBLIC_KEY,
          }),
        ])
      );
    }, 15000);

    test('get orders', async () => {
      const orders = await client.getOrders();
      const order = orders.find((o: Order) => o.memo === 'UNIT-TEST') as Order;

      expect(order.kind).toBe('redeem');
      expect((order.counterpart.details as Individual).firstName).toBe('Test');
      expect((order.counterpart.details as Individual).lastName).toBe(
        'Testerson'
      );
      expect(order.amount).toBe('1.33');
      expect(order.memo).toBe('UNIT-TEST');
    });

    test('get orders by profileId', async () => {
      const orders = await client.getOrders({
        profile: DEFAULT_PROFILE,
      });

      orders.map((o: Order) => {
        expect(DEFAULT_PROFILE).toBe(o.profile);
      });
    });

    test('get order', async () => {
      const order = await client.getOrder(
        '7859502a-4b5d-11ef-88d4-46da5b198e23'
      );

      expect(order.kind).toBe('redeem');
      expect(order.amount).toBe('1.33');
      expect(order.memo).toBe('UNIT-TEST');
    });

    test('get tokens', async () => {
      const tokens = await client.getTokens();

      const expected = [
        {
          address: '0x67b34b93ac295c985e856E5B8A20D83026b580Eb',
          chain: 'ethereum',
          currency: 'eur',
          decimals: 18,
          symbol: 'EURe',
          ticker: 'EUR',
        },
      ];
      expect(tokens).toEqual(expect.arrayContaining(expected));
    });

    // there is no way to test this without a real time signature, the date is now verified
    test('place order signature error', async () => {
      const date = new Date().toISOString();
      const rfc3339date = rfc3339(new Date(date));

      const placeOrderMessage = `Send EUR 10 to GR1601101250000000012300695 at ${rfc3339date}`;
      const placeOrderSignatureHash =
        '0x23bf7e1b240d238b13cb293673c3419915402bb34435af62850b1d8e63f82c564fb73ab19691cf248594423dd01e441bb2ccb38ce2e2ecc514dfc3075bea829e1c';

      await client
        .placeOrder({
          amount: '10',
          signature: placeOrderSignatureHash,
          currency: Currency.eur,
          address: PUBLIC_KEY,
          counterpart: {
            identifier: {
              standard: PaymentStandard.iban,
              iban: 'GR1601101250000000012300695',
            },
            details: {
              firstName: 'Mockbank',
              lastName: 'Testerson',
            },
          },
          message: placeOrderMessage,
          memo: 'Powered by Monerium SDK',
          chain: 11155111,
        })
        .catch((err) => {
          expect(err.errors?.signature).toBe('invalid signature');
        });
    });

    test('place order timestamp error', async () => {
      const date = 'Thu, 29 Dec 2022 14:58 +00:00';
      const placeOrderMessage = `Send EUR 10 to GR1601101250000000012300695 at ${date}`;
      const placeOrderSignatureHash =
        '0x23bf7e1b240d238b13cb293673c3419915402bb34435af62850b1d8e63f82c564fb73ab19691cf248594423dd01e441bb2ccb38ce2e2ecc514dfc3075bea829e1c';

      await client
        .placeOrder(
          {
            amount: '10',
            signature: placeOrderSignatureHash,
            currency: Currency.eur,
            address: PUBLIC_KEY,
            counterpart: {
              identifier: {
                standard: PaymentStandard.iban,
                iban: 'GR1601101250000000012300695',
              },
              details: {
                firstName: 'Mockbank',
                lastName: 'Testerson',
              },
            },
            message: placeOrderMessage,
            memo: 'Powered by Monerium SDK',
            chain: 'ethereum',
          } as any /** to bypass typeerror for chain and network */
        )
        .catch((err) => {
          expect(err.errors?.message).toBe('timestamp is expired');
        });
    });
  });
// TODO:
// test("upload supporting document", async () => {

//   // const document = client.uploadSupportingDocument();
//   // assertObjectMatch(document, {});
// });

process.env.CI === 'true' &&
  it('SKIPPED', () => {
    expect(true).toBe(true);
  });
