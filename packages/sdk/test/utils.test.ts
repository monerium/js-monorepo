import encodeBase64Url from 'crypto-js/enc-base64url.js';
import SHA256 from 'crypto-js/sha256.js';
import timezone_mock from 'timezone-mock';

import { generateRandomString } from '../src/helpers';
import { Balances, Currency } from '../src/types';
import {
  getAmount,
  getChain,
  mapChainIdToChain,
  parseChain,
  placeOrderMessage,
  rfc3339,
  shortenIban,
  urlEncoded,
} from '../src/utils';

const timestampRegex =
  '\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(Z|[-+]\\d{2}:\\d{2})';
describe('rfc3339', () => {
  test('should format Date to RFC 3339 format', () => {
    timezone_mock.register('UTC');
    const date = new Date(1682820495 * 1000);
    timezone_mock.unregister();

    expect(rfc3339(date)).toEqual('2023-04-30T02:08:15Z');
  });

  test('should handle timezone offset for positive offset', () => {
    timezone_mock.register('Europe/London');
    const date = new Date('2023-04-30T12:00:00+01:00');
    timezone_mock.unregister();

    expect(rfc3339(date)).toEqual('2023-04-30T12:00:00+01:00');
  });

  test('should handle timezone offset for negative offset', () => {
    timezone_mock.register('US/Pacific');
    const date = new Date('2023-04-30T12:00:00-07:00');
    timezone_mock.unregister();

    expect(rfc3339(date)).toEqual('2023-04-30T12:00:00-07:00');
  });
  test('should throw an error if date is not provided', () => {
    expect(() => rfc3339(new Date('what'))).toThrow('Invalid Date');
  });
});

describe('getMessage', () => {
  test('should format message with valid inputs', () => {
    const message = placeOrderMessage(
      100,
      'eur' as Currency,
      'DE89370400440532013000'
    );
    expect(message).toMatch(
      /^Send EUR 100 to DE89...3000 at \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(Z|[-+]\d{2}:\d{2})$/
    );
  });
});

describe('url params', () => {
  test('should create a query string from an object', () => {
    const obj = { foo: 'bar', bar: 'foo' };
    const params = new URLSearchParams(obj);
    expect(params.toString()).toEqual(urlEncoded(obj));
  });
  test('should create an empty query string when given an empty object', () => {
    const obj = {};
    const params = new URLSearchParams(obj);
    expect(params.toString()).toEqual(urlEncoded(obj));
  });
  test('handle spaces as plus', () => {
    const obj = { foobar: 'bazqux 4quux' };
    const params = new URLSearchParams(obj);
    expect(params.toString().replace('+', '%20')).toEqual(urlEncoded(obj));
  });
  test('handles special characters in code challenge', () => {
    const codeVerifier = generateRandomString();
    const challenge = encodeBase64Url.stringify(SHA256(codeVerifier as string));

    const obj = {
      client_id: '',
      code_challenge: challenge,
      code_challenge_method: 'S256',
      response_type: 'code',
    };
    const params = new URLSearchParams(obj);
    expect(params.toString()).toEqual(urlEncoded(obj));
  });

  describe('getAmount', () => {
    test('getAmount returns the correct amount', () => {
      const balances: Balances[] = [
        {
          id: 'testId',
          address: 'testAddress',
          chain: 'ethereum',
          balances: [
            {
              currency: Currency.eur,
              amount: '100',
            },
          ],
        },
      ];

      const result = getAmount(balances, 'testAddress', 1);

      expect(result).toBe('100');
    });
    test('getAmount returns 0 for no balance', () => {
      const balances: Balances[] = [
        {
          id: 'testId',
          address: 'testAddress',
          chain: 'polygon',
          balances: [
            {
              currency: Currency.eur,
              amount: '100',
            },
          ],
        },
      ];

      const result = getAmount(balances, 'testAddress', 1);

      expect(result).toBe('0');
    });
  });
});

describe('placeOrderMessage', () => {
  test('should format message with valid inputs', () => {
    const amount = 100;
    const iban = 'DE89370400440532013000';
    const message = placeOrderMessage(amount, 'eur' as Currency, iban);
    expect(message).toMatch(
      new RegExp(
        `^Send EUR ${amount} to ${shortenIban(iban)} at ${timestampRegex}$`
      )
    );
  });

  test('should handle string amount', () => {
    const amount = '100';
    const iban = 'DE89370400440532013000';
    const message = placeOrderMessage(amount, 'eur' as Currency, iban);
    expect(message).toMatch(
      new RegExp(
        `^Send EUR ${amount} to ${shortenIban(iban)} at ${timestampRegex}$`
      )
    );
  });

  test('should handle number amount', () => {
    const amount = 100;
    const iban = 'DE89370400440532013000';
    const message = placeOrderMessage(amount, 'eur' as Currency, iban);
    expect(message).toMatch(
      new RegExp(
        `^Send EUR ${amount} to ${shortenIban(iban)} at ${timestampRegex}$`
      )
    );
  });
  test('should format message with chainId', () => {
    const amount = 100;
    const receiver = 'DE89370400440532013000';
    const chain = 137;
    const message = placeOrderMessage(
      amount,
      'eur' as Currency,
      receiver,
      chain
    );
    expect(message).toMatch(
      new RegExp(
        `^Send EUR ${amount} to ${receiver} on polygon at ${timestampRegex}$`
      )
    );
  });
  test('should format message with chainId as string', () => {
    const amount = 100;
    const receiver = '0x1234';
    const chain = 'gnosis';
    const message = placeOrderMessage(
      amount,
      'eur' as Currency,
      receiver,
      chain
    );
    expect(message).toMatch(
      new RegExp(
        `^Send EUR ${amount} to ${receiver} on gnosis at ${timestampRegex}$`
      )
    );
  });

  test('should format message with currency', () => {
    const amount = 100;
    const receiver = 'DE89370400440532013000';
    const chain = 137;
    const currency = 'gbp' as Currency;
    const message = placeOrderMessage(amount, currency, receiver, chain);
    expect(message).toMatch(
      new RegExp(
        `^Send GBP ${amount} to ${receiver} on polygon at ${timestampRegex}$`
      )
    );
  });
});

describe('mapChainIdToChain', () => {
  it('should add network and chain properties and remove chainId if chainId is present', () => {
    const body = { chain: 11155111 };
    const expectedBody = {
      chain: getChain(11155111),
    };

    expect(mapChainIdToChain('sandbox', body)).toEqual(expectedBody);
  });
  it('should be backwards compatible', () => {
    const body = { chain: 'ethereum' };
    const expectedBody = {
      chain: 'sepolia',
    };

    expect(mapChainIdToChain('sandbox', body)).toEqual(expectedBody);
  });

  it('should work on prod', () => {
    const body = { chain: 'ethereum' };
    const expectedBody = {
      chain: 'ethereum',
    };

    expect(mapChainIdToChain('production', body)).toEqual(expectedBody);
  });

  it('should not modify the body object if chainId is not present', () => {
    const body = { someProperty: 'someValue' };
    const expectedBody = { ...body };

    expect(mapChainIdToChain('sandbox', body)).toEqual(expectedBody);
  });
});
describe('parseChain', () => {
  it('chainIds to should be parsed to monerium chain identifier', () => {
    expect(parseChain(1)).toBe('ethereum');
    expect(parseChain(11155111)).toBe('sepolia');
    expect(parseChain(59144)).toBe('linea');
    expect(parseChain(534352)).toBe('scroll');
    expect(parseChain(501)).toBe('columbus');
    expect(parseChain(500)).toBe('camino');
    expect(parseChain(137)).toBe('polygon');
    expect(parseChain(80002)).toBe('amoy');
    expect(parseChain('ethereum')).toBe('ethereum');
    expect(parseChain('noble')).toBe('noble');
    expect(parseChain('noble-1')).toBe('noble');
    expect(parseChain('grand-1')).toBe('grand');
    expect(parseChain('1')).toBe('ethereum');
    expect(() => parseChain(2)).toThrow('Chain not supported: 2');
  });
});
