// Hi! I have read AGENTS.md.
import { Currency } from '../src/types';
import {
  getAmount,
  getChain,
  parseChain,
  placeOrderMessage,
  rfc3339,
  shortenAddress,
  shortenIban,
  siweMessage,
} from '../src/utils';

describe('utils', () => {
  describe('rfc3339', () => {
    test('formats date correctly', () => {
      const date = new Date('2023-01-01T12:00:00Z');
      expect(rfc3339(date)).toMatch(/2023-01-01T12:00:00Z/);
    });
  });

  describe('parseChain', () => {
    test('parses chain id and name', () => {
      expect(parseChain(1)).toBe('ethereum');
      expect(parseChain('polygon')).toBe('polygon');
    });
  });

  describe('getChain', () => {
    test('returns correct chain', () => {
      expect(getChain(1)).toBe('ethereum');
      expect(getChain(137)).toBe('polygon');
    });
  });

  describe('shortenIban', () => {
    test('shortens IBAN correctly', () => {
      expect(shortenIban('GB29XYZ1234567890')).toBe('GB29...7890');
      expect(shortenIban('SHORT')).toBe('SHORT');
    });
  });

  describe('shortenAddress', () => {
    test('shortens address correctly', () => {
      expect(shortenAddress('0x1234567890abcdef1234567890abcdef12345678')).toBe(
        '0x12345...45678'
      );
      expect(shortenAddress('0x123')).toBe('0x123');
    });
  });

  describe('getAmount', () => {
    test('returns amount from balances', () => {
      const balances = [
        {
          address: '0x1',
          chain: 'ethereum' as any,
          balances: [{ currency: Currency.eur, amount: '100' }],
        },
      ];
      expect(getAmount(balances, '0x1', 1, Currency.eur)).toBe('100');
      expect(getAmount(undefined, undefined, undefined)).toBe('0');
    });
  });

  describe('placeOrderMessage', () => {
    test('returns correct message', () => {
      expect(placeOrderMessage('10', Currency.eur, '0x1')).toContain(
        'Send EUR 10 to'
      );
    });
  });

  describe('siweMessage', () => {
    test('returns correctly formatted SIWE message', () => {
      const msg = siweMessage({
        domain: 'example.com',
        address: '0x123',
        appName: 'TestApp',
        redirectUri: 'http://localhost',
        chainId: 1,
        privacyPolicyUrl: 'http://localhost/privacy',
        termsOfServiceUrl: 'http://localhost/tos',
      });
      expect(msg).toContain('example.com wants you to sign in');
    });
  });
});
