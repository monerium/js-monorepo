# SDK Agent Context

`compat.ts` is v3.x code, current version. v4 is in `client.ts`

## Runtime Compatibility

All code in `src/` must be runtime-agnostic. The SDK is designed to work in Node.js, Cloudflare Workers, MetaMask Snaps, and React Native without polyfills.

**Do not use:**

- `window`, `document`, `localStorage`, `sessionStorage`
- `URL` or `URLSearchParams` (not available without node globals)
- `TextEncoder` / `TextDecoder`
- Any other browser globals

**Use instead:**

- `urlEncoded()` from `src/utils.ts` is built to replace `URLSearchParams` where node-globals are not available.
- `encodeURIComponent` / `decodeURIComponent` for individual values

The one intentional exception is `uploadSupportingDocument` in `src/client.ts`, which requires `Blob` and `FormData`. This is documented in its JSDoc and is acceptable because file uploads are not a MetaMask Snap use case.
