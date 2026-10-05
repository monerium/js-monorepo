import { createHash } from 'crypto';
import {
  sha256,
  toUtf8Bytes,
  base64UrlEncode,
} from '../src/helpers/crypto.helpers';

const toHex = (bytes: Uint8Array): string =>
  Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

describe('toUtf8Bytes', () => {
  test('encodes ASCII strings identically to their char codes', () => {
    expect(Array.from(toUtf8Bytes('abc'))).toEqual([97, 98, 99]);
  });

  test('encodes an empty string to an empty array', () => {
    expect(toUtf8Bytes('').length).toBe(0);
  });

  test('encodes multi-byte UTF-8 characters correctly', () => {
    // '€' (U+20AC) -> E2 82 AC in UTF-8
    expect(Array.from(toUtf8Bytes('€'))).toEqual([0xe2, 0x82, 0xac]);
    // '✓' (U+2713) -> E2 9C 93 in UTF-8
    expect(Array.from(toUtf8Bytes('✓'))).toEqual([0xe2, 0x9c, 0x93]);
  });
});

describe('sha256', () => {
  // RFC 6234 / NIST test vectors
  test('matches known vector for empty input', () => {
    expect(toHex(sha256(toUtf8Bytes('')))).toBe(
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    );
  });

  test('matches known vector for "abc"', () => {
    expect(toHex(sha256(toUtf8Bytes('abc')))).toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'
    );
  });

  test('matches known vector for a 56-char input requiring padding block', () => {
    const input = 'abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq';
    expect(toHex(sha256(toUtf8Bytes(input)))).toBe(
      '248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1'
    );
  });

  test('matches known vector for a message spanning multiple 64-byte blocks', () => {
    const input = 'a'.repeat(1000000);
    expect(toHex(sha256(toUtf8Bytes(input)))).toBe(
      'cdc76e5c9914fb9281a1c7e284d73e67f1809a48a497200e046d39ccc7112cd0'
    );
  }, 20000);
});

describe('sha256 (fuzz parity against node:crypto)', () => {
  // node:crypto is an independent, battle-tested SHA-256 implementation.
  // Cross-checking against it (rather than only fixed vectors) catches
  // edge cases we might not have thought to hard-code.
  const randomUnicodeString = (length: number): string => {
    let result = '';
    for (let i = 0; i < length; i++) {
      // Random code point across the full Unicode range, including
      // surrogate-pair-forming ranges (emoji, math alphanumerics, etc.)
      const codePoint = Math.floor(Math.random() * 0x10ffff);
      try {
        result += String.fromCodePoint(codePoint);
      } catch {
        // Skip invalid/unpaired surrogate code points.
      }
    }
    return result;
  };

  const edgeCaseInputs = [
    '',
    ' ',
    '\0',
    '\n\r\t',
    'a'.repeat(63), // one byte short of a 64-byte block after padding
    'a'.repeat(64), // exactly one block
    'a'.repeat(65), // one byte into a second block
    'a'.repeat(55), // longest input fitting a single padded block
    'a'.repeat(56), // shortest input spilling into a second block
    '\u{1F600}', // emoji requiring a surrogate pair / 4-byte UTF-8 sequence
    '\u0000\u0001\u0002\uFFFD',
    'München, Zürich, Malmö',
  ];

  test.each(edgeCaseInputs)('matches node:crypto sha256 for %j', (input) => {
    const expected = createHash('sha256').update(input, 'utf8').digest('hex');
    const actual = toHex(sha256(toUtf8Bytes(input)));
    expect(actual).toBe(expected);
  });

  test('matches node:crypto sha256 for 200 random unicode strings', () => {
    for (let i = 0; i < 200; i++) {
      const input = randomUnicodeString(Math.floor(Math.random() * 40));
      const expected = createHash('sha256').update(input, 'utf8').digest('hex');
      const actual = toHex(sha256(toUtf8Bytes(input)));
      expect(actual).toBe(expected);
    }
  });
});

describe('base64UrlEncode', () => {
  test('produces only base64url-safe characters and no padding', () => {
    const bytes = new Uint8Array([251, 255, 191, 0, 1, 2, 3]);
    const encoded = base64UrlEncode(bytes);
    expect(encoded).toMatch(/^[A-Za-z0-9\-_]+$/);
    expect(encoded).not.toContain('=');
  });

  test('matches known crypto-js output for a fixed byte sequence', () => {
    const bytes = new Uint8Array(Array.from({ length: 32 }, (_, i) => i));
    expect(base64UrlEncode(bytes)).toBe(
      'AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8'
    );
  });

  test('encodes an empty array to an empty string', () => {
    expect(base64UrlEncode(new Uint8Array())).toBe('');
  });

  test('matches Buffer-based base64url encoding for random byte lengths', () => {
    for (let length = 0; length < 40; length++) {
      const bytes = new Uint8Array(length);
      for (let i = 0; i < length; i++) {
        bytes[i] = Math.floor(Math.random() * 256);
      }
      const expected = Buffer.from(bytes).toString('base64url');
      expect(base64UrlEncode(bytes)).toBe(expected);
    }
  });
});
