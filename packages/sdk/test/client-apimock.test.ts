/**
 * @jest-environment jsdom
 */

import 'jest-localstorage-mock';
import fetchMock from 'jest-fetch-mock';

import { constants, MoneriumClient } from '../src/index';
import { Currency, NewOrder, PaymentStandard } from '../src/types';
import { OWNER_SIGNATURE, PUBLIC_KEY } from './constants';

const message = constants.LINK_MESSAGE;

let client: MoneriumClient;
describe('MoneriumClient', () => {
  beforeEach(async () => {
    client = new MoneriumClient();
    fetchMock.resetMocks();
  });

  test('link address using chainId', async () => {
    const body = {
      address: PUBLIC_KEY,
      message: message,
      signature: OWNER_SIGNATURE,
      accounts: [
        {
          chain: 11155111,
          currency: Currency.eur,
        },
        {
          chain: 10200,
          currency: Currency.eur,
        },
        {
          chain: 80002,
          currency: Currency.eur,
        },
      ],
    };
    await client.linkAddress('testProfile', body).catch(() => ({}));

    // TODO: Client initialization should be done in a beforeEach.
    expect(fetchMock?.mock?.calls?.length).toEqual(1);

    expect(fetchMock?.mock?.calls?.[0]?.[0]).toEqual(
      `https://api.monerium.dev/profiles/testProfile/addresses`
    );
    expect(fetchMock?.mock?.calls?.[0]?.[1]).toEqual(
      expect.objectContaining({
        method: 'post',
        body: JSON.stringify({
          address: PUBLIC_KEY,
          message: message,
          signature: OWNER_SIGNATURE,
          accounts: [
            {
              currency: Currency.eur,
              chain: 'ethereum',
            },
            {
              currency: Currency.eur,
              chain: 'gnosis',
            },
            {
              currency: Currency.eur,
              chain: 'polygon',
            },
          ],
        }),
      })
    );
  });

  test('place order with chainId', async () => {
    const date = 'Thu, 29 Dec 2022 14:58 +00:00';
    const placeOrderMessage = `Send EUR 10 to GR1601101250000000012300695 at ${date}`;
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
      .catch(() => ({}));

    expect(fetchMock?.mock?.calls?.[0]?.[0]).toEqual(
      `https://api.monerium.dev/orders`
    );
    expect(fetchMock?.mock?.calls?.[0]?.[1]).toEqual(
      expect.objectContaining({
        method: 'post',
        body: JSON.stringify({
          kind: 'redeem',
          amount: '10',
          signature: placeOrderSignatureHash,
          currency: 'eur',
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
        }),
      })
    );
  });
  test('place cross chain order with chainId', async () => {
    const date = 'Thu, 29 Dec 2022 14:58 +00:00';
    const placeOrderMessage = `Send EUR 10 to GR1601101250000000012300695 at ${date}`;
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
            standard: PaymentStandard.chain,
            address: '0x1234567890123456789012345678901234567890',
            chain: 11155111,
          },
          details: {
            firstName: 'Mockbank',
            lastName: 'Testerson',
          },
        },
        message: placeOrderMessage,
        memo: 'Powered by Monerium SDK',
        chain: 'ethereum',
      } as NewOrder)
      .catch(() => ({}));

    expect(fetchMock?.mock?.calls?.[0]?.[0]).toEqual(
      `https://api.monerium.dev/orders`
    );
    expect(fetchMock?.mock?.calls?.[0]?.[1]).toEqual(
      expect.objectContaining({
        method: 'post',
        body: JSON.stringify({
          kind: 'redeem',
          amount: '10',
          signature: placeOrderSignatureHash,
          currency: 'eur',
          address: PUBLIC_KEY,
          counterpart: {
            identifier: {
              standard: PaymentStandard.chain,
              address: '0x1234567890123456789012345678901234567890',
              chain: 'ethereum',
            },
            details: {
              firstName: 'Mockbank',
              lastName: 'Testerson',
            },
          },
          message: placeOrderMessage,
          memo: 'Powered by Monerium SDK',
          chain: 'ethereum',
        }),
      })
    );
  });
  test('place cross chain order with incorrect chainId', async () => {
    const date = 'Thu, 29 Dec 2022 14:58 +00:00';
    const placeOrderMessage = `Send EUR 10 to GR1601101250000000012300695 at ${date}`;
    const placeOrderSignatureHash =
      '0x23bf7e1b240d238b13cb293673c3419915402bb34435af62850b1d8e63f82c564fb73ab19691cf248594423dd01e441bb2ccb38ce2e2ecc514dfc3075bea829e1c';

    await expect(
      Promise.resolve().then(() =>
        client.placeOrder({
          amount: '10',
          signature: placeOrderSignatureHash,
          currency: Currency.eur,
          address: PUBLIC_KEY,
          counterpart: {
            identifier: {
              standard: PaymentStandard.chain,
              address: '0x1234567890123456789012345678901234567890',
              chain: 7,
            },
            details: {
              firstName: 'Mockbank',
              lastName: 'Testerson',
            },
          },
          message: placeOrderMessage,
          memo: 'Powered by Monerium SDK',
          chain: 'ethereum',
        } as NewOrder)
      )
    ).rejects.toThrow('Chain not supported: 7');
  });
});
