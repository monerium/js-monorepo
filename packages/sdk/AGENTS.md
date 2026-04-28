# SDK Agent Context

This is the Monerium JavaScript SDK, v4.0.0. The public API is entirely function-based — no classes, no hidden side effects, no browser globals.

## File map

| File                              | Purpose                                                             |
| --------------------------------- | ------------------------------------------------------------------- |
| `src/index.ts`                    | Single public entry point — re-exports everything                   |
| `src/auth.ts`                     | Auth flow functions (PKCE, grants, URL builders)                    |
| `src/client.ts`                   | `createMoneriumClient` factory + `MoneriumClient` interface         |
| `src/types.ts`                    | Monerium domain model types (Order, IBAN, Profile, …)               |
| `src/chains.ts`                   | EVM chain data, derived types, lookup maps                          |
| `src/chains.test-d.ts`            | Compile-time assertions — see Chain types section below             |
| `src/errors.ts`                   | `MoneriumApiError` and `MoneriumSdkError`                           |
| `src/transport.ts`                | `Transport` type and default `fetch` implementation                 |
| `src/utils.ts`                    | Pure utility functions (rfc3339, placeOrderMessage, siweMessage, …) |
| `src/helpers/auth.helpers.ts`     | `randomPKCECodeVerifier` and `calculatePKCECodeChallenge`           |
| `src/helpers/internal.helpers.ts` | `getEnv` — internal only, not exported                              |

## Runtime compatibility

All code in `src/` must be runtime-agnostic. The SDK is designed to work in Node.js, Cloudflare Workers, MetaMask Snaps, and React Native without polyfills.

**Do not use:**

- `window`, `document`, `localStorage`, `sessionStorage`
- `URL` or `URLSearchParams` (not available without node globals)
- `TextEncoder` / `TextDecoder`
- Any other browser globals

**Use instead:**

- `urlEncoded()` from `src/utils.ts` instead of `URLSearchParams`
- `encodeURIComponent` / `decodeURIComponent` for individual values

The one intentional exception is `uploadSupportingDocument` in `src/client.ts`, which requires `Blob` and `FormData`. This is documented in its JSDoc and is acceptable because file uploads are not a MetaMask Snap use case.

## Chain types — keep in sync manually

`ProductionChain` and `SandboxChain` in `src/chains.ts` are **explicit string literal unions**, not derived from `EVM_CHAIN_PAIRS`. This is intentional — derived types render unreadably in TypeDoc.

When adding a new chain:

1. Add the entry to `EVM_CHAIN_PAIRS` in `src/chains.ts`
2. Add the production chain name to `ProductionChain`
3. Add the sandbox chain name to `SandboxChain`

`src/chains.test-d.ts` contains compile-time assertions that will produce a TypeScript error if the explicit unions fall out of sync with `EVM_CHAIN_PAIRS`. These are checked by `tsc --noEmit` which runs as part of `pnpm build` (before `tsup`). If you skip the build and only run `tsup` directly, the assertions will not be checked.

## Build script

```bash
pnpm build   # runs tsc --noEmit (type checks all of src/) then tsup
pnpm test    # jest
```

`tsc --noEmit` runs first and covers all files in `src/`, including `chains.test-d.ts`. `tsup` only follows the entry point graph — it would miss orphaned files like `chains.test-d.ts` on its own.

## TSDoc conventions

The comments need to start with `/**`, starting it with `/*` may be ignored by typedoc/tsdoc.

Groups and categories are used to structure the Docusaurus output. Every exported symbol must have a `@group` tag. Use `@category` only inside groups that contain both functions and types.

| Group        | Contents                                                                           |
| ------------ | ---------------------------------------------------------------------------------- |
| `Client`     | `createMoneriumClient`, `MoneriumClient`, `MoneriumClientOptions`, transport types |
| `Auth`       | Auth grant functions, URL builders, PKCE helpers, option types, `BearerProfile`    |
| `Errors`     | `MoneriumApiError`, `MoneriumSdkError`, `MoneriumSdkErrorType`                     |
| `Profiles`   | Profile, KYC, AuthContext and related types                                        |
| `Addresses`  | Address, Balances, LinkAddress and related types                                   |
| `IBANs`      | IBAN, RequestIbanPayload, MoveIbanPayload and related types                        |
| `Orders`     | Order, NewOrder, Counterpart, placeOrder and related types                         |
| `Tokens`     | Token, Currency, TokenSymbol, Ticker, CurrencyCode                                 |
| `Signatures` | PendingSignature and related types                                                 |
| `Utilities`  | Pure utility functions, `constants`                                                |
| `Primitives` | Chain, ChainId, ENV, Environment, ResponseStatus and low-level types               |

# Function structures and naming conventions

### singular

getX(id: string)
deleteX(id: string)

### lists

getX(params?: GetXParams)

### create

createX(input: CreateXInput)

### update

updateX(input: UpdateXInput)

### other

performX(input: PerformXInput)
submitX(input: SubmitXInput)

### example

getProfile(profileId: string)
getProfiles(params?: GetProfilesParams)

createProfile(input: CreateProfileInput)
updateProfile(input: UpdateProfileInput)
