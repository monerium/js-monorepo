/**
 * Internal helpers used by the PKCE functions.
 * SHA-256 is delegated to the audited, zero-dependency `@noble/hashes`
 * library rather than a hand-rolled implementation. Base64url encoding
 * is trivial enough to keep dependency-free.
 * Not exported from the package.
 */
import { sha256 as nobleSha256 } from '@noble/hashes/sha2';
import { utf8ToBytes } from '@noble/hashes/utils';

export const toUtf8Bytes = utf8ToBytes;

/**
 * Compute the SHA-256 digest of the given bytes.
 */
export const sha256 = (message: Uint8Array): Uint8Array => nobleSha256(message);

const BASE64_ALPHABET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

/**
 * Encode bytes as an unpadded base64url string (RFC 4648 §5).
 */
export const base64UrlEncode = (bytes: Uint8Array): string => {
  let result = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const b0 = bytes[i] as number;
    const b1 = bytes[i + 1];
    const b2 = bytes[i + 2];

    result += BASE64_ALPHABET[b0 >> 2];
    result +=
      BASE64_ALPHABET[((b0 & 0x03) << 4) | (b1 === undefined ? 0 : b1 >> 4)];
    if (b1 !== undefined) {
      result +=
        BASE64_ALPHABET[((b1 & 0x0f) << 2) | (b2 === undefined ? 0 : b2 >> 6)];
    }
    if (b2 !== undefined) {
      result += BASE64_ALPHABET[b2 & 0x3f];
    }
  }
  return result;
};
