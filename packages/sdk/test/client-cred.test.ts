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
  Individual,
  Order,
  PaymentStandard,
  PersonalProfileDetails,
} from '../src/types';
import { rfc3339 } from '../src/utils';
import {
  APP_ONE_CREDENTIALS_CLIENT_ID,
  APP_ONE_CREDENTIALS_SECRET,
  APP_ONE_OWNER_USER_ID,
  DEFAULT_PROFILE,
  IBAN,
  OWNER_SIGNATURE,
  PUBLIC_KEY,
} from './constants.js';

const { LINK_MESSAGE } = constants;

const message = LINK_MESSAGE;

let client: MoneriumClient;

process.env.CI !== 'true' &&
  beforeAll(async () => {
    client = new MoneriumClient({
      clientId: APP_ONE_CREDENTIALS_CLIENT_ID,
      clientSecret: APP_ONE_CREDENTIALS_SECRET,
    });
    try {
      await client.getAccess();
    } catch (error) {
      console.error('Error, could not authenticate');
    }
  });

process.env.CI !== 'true' &&
  describe('MoneriumClient', () => {
    test('get tokens', async () => {
      const tokens = await client.getTokens();

      const ethToken = tokens.find(
        (t) => t.chain === 'sepolia' && t.symbol === 'EURe'
      );

      expect(ethToken).toMatchObject({
        address: '0x67b34b93ac295c985e856E5B8A20D83026b580Eb',
        chain: 'sepolia',
        currency: 'eur',
        decimals: 18,
        symbol: 'EURe',
        ticker: 'EUR',
      });
    });
    describe('Addresses', () => {
      test('link address', async () => {
        const { profiles } = await client.getProfiles();

        const res = await client.linkAddress({
          // profile: profiles?.[0]?.id as string,
          address: PUBLIC_KEY,
          // message: message,
          chain: 11155111,
          signature: OWNER_SIGNATURE,
        });

        expect(res).toEqual(
          expect.objectContaining({
            address: PUBLIC_KEY,
            meta: expect.objectContaining({
              linkedBy: APP_ONE_OWNER_USER_ID,
            }),
            profile: profiles?.[0]?.id as string,
            state: 'linked',
          })
        );
      });
      test('link address - support old chain translation', async () => {
        const { profiles } = await client.getProfiles();

        const res = await client.linkAddress({
          // profile: profiles?.[0]?.id as string,
          address: PUBLIC_KEY,
          // message: message,
          chain: 'ethereum',
          signature: OWNER_SIGNATURE,
        });

        expect(res).toEqual(
          expect.objectContaining({
            address: PUBLIC_KEY,
            meta: expect.objectContaining({
              linkedBy: APP_ONE_OWNER_USER_ID,
            }),
            profile: profiles?.[0]?.id as string,
            state: 'linked',
          })
        );
      });
      test('get address', async () => {
        const address = await client.getAddress(PUBLIC_KEY).catch(() => ({}));

        expect(address).toMatchObject({
          chains: ['arbitrumsepolia', 'chiado', 'sepolia'],
          address: PUBLIC_KEY,
          profile: DEFAULT_PROFILE,
        });
      });
      test('get addresses', async () => {
        const { addresses } = await client.getAddresses({
          profile: DEFAULT_PROFILE,
          chain: 10200,
        });

        expect(addresses).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              chains: ['chiado'],
              address: PUBLIC_KEY,
            }),
          ])
        );
      });
      test('get addresses - support old chain translation', async () => {
        const { addresses } = await client.getAddresses({
          profile: DEFAULT_PROFILE,
          chain: 'gnosis',
        });

        expect(addresses).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              chains: ['chiado'],
              address: PUBLIC_KEY,
            }),
          ])
        );
      });

      test('get balances', async () => {
        const balances = await client.getBalances(PUBLIC_KEY, 11155111);

        expect(balances).toEqual(
          expect.objectContaining({
            // id: '4b208818-44e3-11ed-adac-b2efc0e6677d',
            chain: 'sepolia',
            address: PUBLIC_KEY,
            balances: expect.arrayContaining([
              expect.objectContaining({
                amount: expect.any(String),
                currency: expect.any(String),
              }),
            ]),
          })
        );
      }, 15000);
    });
    describe('IBANs', () => {
      test('get IBANs', async () => {
        const { ibans } = await client.getIbans({ profile: DEFAULT_PROFILE });

        expect(ibans).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              chain: 'chiado',
              profile: DEFAULT_PROFILE,
              iban: IBAN,
            }),
          ])
        );
      });
      test('get IBAN', async () => {
        const iban = await client.getIban(IBAN);
        expect(iban).toEqual(
          expect.objectContaining({
            chain: 'chiado',
            profile: DEFAULT_PROFILE,
            iban: IBAN,
          })
        );
      });
      test('move iban with chain', async () => {
        const res = await client.moveIban(IBAN, {
          address: PUBLIC_KEY,
          chain: 10200,
        });
        expect(res).toEqual({ code: 202, status: 'Accepted' });
      });
      test('request iban', async () => {
        // No way to do this in Sandbox since profiles can't be approved?
        await expect(
          client.requestIban({
            address: PUBLIC_KEY,
            chain: 11155111,
            emailNotifications: true,
          })
        ).rejects.toEqual({
          code: 400,
          status: 'Bad Request',
          message: 'IBAN already requested or provisioned for this profile',
        });
      });
    });
    describe('Orders', () => {
      test('get orders', async () => {
        const { orders } = await client.getOrders();

        const order = orders.find(
          (o: Order) => o.memo === 'UNIT-TEST'
        ) as Order;

        expect(order.kind).toBe('redeem');
        expect((order.counterpart.details as Individual).firstName).toBe(
          'Test'
        );
        expect((order.counterpart.details as Individual).lastName).toBe(
          'Testerson'
        );
        expect(order.amount).toBe('1.33');
        expect(order.memo).toBe('UNIT-TEST');
      });

      test('get orders by profileId', async () => {
        const { orders } = await client.getOrders({
          profile: DEFAULT_PROFILE,
        });

        orders.map((o: Order) => {
          expect(DEFAULT_PROFILE).toBe(o.profile);
        });
      });

      test('get order', async () => {
        const order = await client.getOrder(
          '48525446-cc1f-11ef-92b5-aae55502171d'
        );

        expect(order.kind).toBe('redeem');
        expect(order.amount).toBe('1.33');
        expect(order.memo).toBe('UNIT-TEST');
      });
      // there is no way to test this without a real time signature, the date is now verified
      test('place order signature error', async () => {
        const date = new Date().toISOString();
        const rfc3339date = rfc3339(new Date(date));

        const placeOrderMessage = `Send EUR 10 to GR1601101250000000012300695 at ${rfc3339date}`;
        const placeOrderSignatureHash =
          '0x23bf7e1b240d238b13cb293673c3419915402bb34435af62850b1d8e63f82c564fb73ab19691cf248594423dd01e441bb2ccb38ce2e2ecc514dfc3075bea829e1c';

        await expect(
          client.placeOrder({
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
        ).rejects.toMatchObject({
          errors: {
            signature: 'invalid signature',
          },
        });
      });
      test('place order timestamp error', async () => {
        const date = 'Thu, 29 Dec 2022 14:58 +00:00';
        const placeOrderMessage = `Send EUR 10 to GR1601101250000000012300695 at ${date}`;
        const placeOrderSignatureHash =
          '0x23bf7e1b240d238b13cb293673c3419915402bb34435af62850b1d8e63f82c564fb73ab19691cf248594423dd01e441bb2ccb38ce2e2ecc514dfc3075bea829e1c';

        await expect(
          client.placeOrder({
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
            chain: 'sepolia',
          })
        ).rejects.toMatchObject({
          errors: {
            message: 'timestamp is expired',
          },
        });
      });
      test('place order timestamp error - support old chain translation', async () => {
        const date = 'Thu, 29 Dec 2022 14:58 +00:00';
        const placeOrderMessage = `Send EUR 10 to GR1601101250000000012300695 at ${date}`;
        const placeOrderSignatureHash =
          '0x23bf7e1b240d238b13cb293673c3419915402bb34435af62850b1d8e63f82c564fb73ab19691cf248594423dd01e441bb2ccb38ce2e2ecc514dfc3075bea829e1c';

        await expect(
          client.placeOrder({
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
          })
        ).rejects.toMatchObject({
          errors: {
            message: 'timestamp is expired',
          },
        });
      });
      // TODO: Not working, there is some proper validation in the backend
      test.skip('upload supporting document', async () => {
        const blob = new Blob(['test'], { type: 'application/pdf' });
        const file = new File([blob], 'values.pdf', {
          type: 'application/pdf',
          lastModified: new Date().getTime(),
        });

        try {
          await client.uploadSupportingDocument(file);
        } catch (error) {
          console.error(error);
        }
      });
    });

    describe('Profiles', () => {
      /**
       * TODO: submit profile details
       */
      test('get profiles', async () => {
        const { profiles } = await client.getProfiles();

        expect(profiles?.[0]?.id).toBe(DEFAULT_PROFILE);
      });

      test('get profile', async () => {
        const { profiles } = await client.getProfiles();
        const profile = await client.getProfile(profiles?.[0]?.id as string);

        expect(profile?.id).toBe(profiles?.[0]?.id);
      });
      test('submit profile details', async () => {
        const body = {
          personal: {
            idDocument: {
              number: 'A1234566787',
              kind: 'passport',
            },
            firstName: 'Jane',
            lastName: 'Doe',
            address: 'Pennylane 123',
            postalCode: '7890',
            city: 'Liverpool',
            country: 'FR',
            countryState: 'SDKTest',
            nationality: 'FR',
            birthday: '1990-05-15',
          } as PersonalProfileDetails,
        };

        // const response = await client.submitProfileDetails(DEFAULT_PROFILE, body);

        // expect(response).toBe({ code: 202, status: 'Accepted' });

        // No way to do this in Sandbox since profiles can't be approved?
        await expect(
          client.submitProfileDetails(DEFAULT_PROFILE, body)
        ).rejects.toEqual({
          code: 409,
          status: 'Conflict',
          message:
            'The profile details have already been approved and need not be submitted again',
        });
      });
    });
  });

process.env.CI === 'true' &&
  it('SKIPPED', () => {
    expect(true).toBe(true);
  });
