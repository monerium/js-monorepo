# RFC: Full SDK Redesign — `@monerium/sdk`

- **Status:** Proposed
- **Author:** Monerium SDK Team
- **Replaces:** RFC-storage-adapter.md
- **Package:** `@monerium/sdk`

---

## Table of Contents

1. [Motivation](#motivation)
2. [Design Principles](#design-principles)
3. [Non-goals](#non-goals)
4. [Naming Convention](#naming-convention)
5. [Architecture Overview](#architecture-overview)
6. [New API Surface](#new-api-surface)
7. [Auth Flow Redesign](#auth-flow-redesign)
8. [API Client Redesign](#api-client-redesign)
9. [WebSocket Redesign](#websocket-redesign)
10. [Types & Exports](#types--exports)
11. [Deprecation Schedule](#deprecation-schedule)
12. [Migration Guide](#migration-guide)
13. [Prior Art](#prior-art)
14. [Decisions Made](#decisions-made)
15. [Acceptance Criteria](#acceptance-criteria)
16. [Summary](#summary)

---

## Motivation

The current SDK was designed around a single `MoneriumClient` class that tries to do everything: manage the OAuth2/PKCE auth flow, persist tokens, parse the browser URL, redirect the user, call the REST API, and manage WebSocket connections. This made the initial integration fast but has accumulated significant design debt.

### Current Pain Points

| #   | Problem                                                                                      | Impact                                                                              |
| --- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| 1   | `localStorage` is used internally with no way to override it                                 | Breaks in SSR, React Native, and secure-storage environments                        |
| 2   | `window.location.assign()` is called inside `authorize()` and `siwe()`                       | The SDK hijacks navigation; impossible to intercept or test                         |
| 3   | `window.location.search` is parsed inside `getAccess()`                                      | Forces consumers to call `getAccess()` exactly on the callback page; no flexibility |
| 4   | `window.history.replaceState()` is called after token exchange (`cleanQueryString`)          | Unexpected URL mutation that can conflict with routers (Next.js, React Router)      |
| 5   | `preparePKCEChallenge()` silently writes `code_verifier` to `localStorage`                   | Hidden side effect; impossible to trace, test, or override                          |
| 6   | Token expiry is checked and managed inside `getAccess()`                                     | Auth state lifecycle is invisible to the consumer                                   |
| 7   | `MoneriumClient` is stateful (holds `bearerProfile`, `isAuthorized`, sockets internally)     | Hard to use in React, server environments, or with state management libraries       |
| 8   | `isServer` guards are sprinkled throughout the client                                        | SSR support is bolted on, not designed in                                           |
| 9   | WebSockets are stored in an internal `Map` inside the class instance                         | No way to manage lifecycle externally; memory leak risk                             |
| 10  | `clientSecret` and `clientId` are both accepted in the same constructor                      | Leaks server-only credentials into browser bundles if misconfigured                 |
| 11  | `getAccess()` has four different code paths controlled by implicit state                     | Unpredictable; difficult to reason about                                            |
| 12  | Chain backwards-compatibility (`productionToSandbox`) is applied silently inside API methods | Debugging chain resolution issues is opaque                                         |
| 13  | `constants.ts` storage key names are exported as a public API                                | Implementation detail leaking into the public contract                              |

---

## Design Principles

The redesigned SDK is built around six explicit principles:

### 1. No Side Effects by Default

Every function returns a value. Nothing is stored, redirected, or mutated unless the consumer explicitly calls a function that does so. The SDK describes what to do; the consumer decides when and how.

### 2. You Own Your Storage

The SDK never touches `localStorage`, `sessionStorage`, or any other persistence layer. Tokens, verifiers, and expiry values are returned as plain objects. The consumer stores and retrieves them.

### 3. You Own Your Navigation

The SDK produces URLs. The consumer navigates to them. `window.location.assign`, `window.history.replaceState`, and all URL parsing are removed from the SDK entirely.

### 4. Environment Agnostic

The SDK is designed to avoid runtime-specific globals in its core modules and to remain compatible with standards-based runtimes (browser, Node.js, React Native, Web Workers, Cloudflare Workers). Where a function genuinely requires a browser API, it is isolated in an optional helper and documented as browser-only. The SDK makes no absolute guarantees about runtime edge cases involving `crypto`, WebSocket availability, or `fetch`/`FormData` behaviour in exotic environments.

### 5. Explicit Over Implicit

Auth state is not held inside the class. The consumer passes tokens into the client. The flow of data is visible and traceable.

### 6. Tree-Shakeable and Composable

The SDK is organised into focused internal modules but published as a single entry point (`@monerium/sdk`). Consumers only pay for what they import. Modern bundlers handle tree-shaking automatically given `"sideEffects": false` in `package.json`.

---

## Non-goals

The following are explicitly out of scope for v3.0. Recording them prevents scope creep during review.

- **No built-in token cache or store** — token persistence is always the consumer's responsibility
- **No built-in refresh deduplication helper** — the consumer implements deduplication inside their `getAccessToken` callback if needed
- **No framework adapters in v3** — no first-party React hooks, Next.js helpers, or similar; addressed in a separate RFC
- **No auth session manager** — the SDK does not track whether the user is "logged in"
- **No retry policy in core** — retries are the consumer's concern; the injectable `transport` provides the seam for it
- **No automatic URL parsing beyond `parseAuthorizationResponse()`** — that one helper is explicitly opt-in; no further URL magic is introduced
- **No built-in refresh scheduling** — the SDK does not schedule background token refreshes

---

## Naming Convention

Function names follow the conventions established by [`openid-client`](https://github.com/panva/openid-client) by panva, which is the de facto standard for OAuth2/PKCE in the JavaScript ecosystem. This makes the SDK immediately familiar to developers who have used any standard OIDC library, and reduces the learning curve for anyone reading the source code alongside the OAuth2 spec.

### Mapping: current names → new names

| Current name                            | New name                                                    | Rationale                                                                                                                        |
| --------------------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `preparePKCEChallenge()`                | `randomPKCECodeVerifier()` + `calculatePKCECodeChallenge()` | Split into two composable primitives matching panva exactly. Verifier generation and challenge derivation are separate concerns. |
| `authorize()`                           | `buildAuthorizationUrl()`                                   | Describes what is returned (a URL), not what happens after (navigation). Matches panva's `buildAuthorizationUrl`.                |
| `siwe()`                                | `buildSiweAuthorizationUrl()`                               | Consistent with `buildAuthorizationUrl`. SIWE is a variant, not a different concept.                                             |
| `getAccess()` (auth code path)          | `authorizationCodeGrant()` / `exchangeAuthorizationCode()`  | Canonical: OAuth2 spec terminology matching panva. Friendly alias for product engineers less familiar with grant type names.     |
| `getAccess()` (refresh token path)      | `refreshTokenGrant()` / `refreshAccessToken()`              | Canonical: OAuth2 spec terminology. Friendly alias for readability.                                                              |
| `getAccess()` (client credentials path) | `clientCredentialsGrant()`                                  | OAuth2 spec terminology. Matches panva's `clientCredentialsGrant`.                                                               |
| `disconnect()`                          | _(removed)_                                                 | No replacement needed — caller manages their own state.                                                                          |
| `revokeAccess()`                        | _(removed)_                                                 | No replacement needed — caller manages their own storage.                                                                        |
| `subscribeOrderNotifications()`         | `createOrderSocket()`                                       | Describes what is returned. Consistent with the `create*` naming pattern.                                                        |
| `unsubscribeOrderNotifications()`       | `subscription.close()`                                      | Caller calls `.close()` on the returned `OrderSubscription` directly.                                                            |
| `new MoneriumClient()`                  | `createMoneriumClient()` / `new MoneriumClient()`           | Factory function is the primary API. Class constructor is exported as a compatibility alias. See API Client section.             |
| _(new)_                                 | `parseAuthorizationResponse()`                              | Optional pure helper. Parses a callback URL or query string into `{ code, state, error, errorDescription }`. No side effects.    |

### Mapping: current type names → new type names

| Current type                   | New type                           | Rationale                                                                                   |
| ------------------------------ | ---------------------------------- | ------------------------------------------------------------------------------------------- |
| `ClassOptions`                 | `MoneriumClientOptions`            | More descriptive; follows the pattern of naming option bags after the thing they configure. |
| `AuthFlowOptions`              | `BuildAuthorizationUrlOptions`     | Named after the function it configures.                                                     |
| `AuthFlowSIWEOptions`          | `BuildSiweAuthorizationUrlOptions` | Consistent with above.                                                                      |
| `AuthorizationCodeCredentials` | `AuthorizationCodeGrantOptions`    | OAuth2 spec terminology; named after the grant type.                                        |
| `ClientCredentials`            | `ClientCredentialsGrantOptions`    | Consistent with above.                                                                      |
| `PKCERequest`                  | _(internal)_                       | Was never meaningful as a public type.                                                      |
| `PKCESIWERequest`              | _(internal)_                       | Was never meaningful as a public type.                                                      |
| `PKCERequestShared`            | _(internal)_                       | Was never meaningful as a public type.                                                      |
| `PKCERequestArgs`              | _(internal)_                       | Was never meaningful as a public type.                                                      |
| `AuthArgs`                     | _(internal)_                       | Was never meaningful as a public type.                                                      |
| `BearerTokenCredentials`       | _(removed)_                        | Redundant union type that no longer maps to anything in the new design.                     |

---

## Architecture Overview

Everything is exported from a single entry point: `@monerium/sdk`. Sub-path imports are not required or encouraged. Internally, the source is split into focused modules so that bundlers can tree-shake unused code automatically.

```
@monerium/sdk  (single public entry point)
│
├── src/auth.ts           # Pure PKCE + OAuth2 helpers (no side effects, no storage)
│   ├── randomPKCECodeVerifier()
│   ├── calculatePKCECodeChallenge()
│   ├── buildAuthorizationUrl()
│   ├── buildSiweAuthorizationUrl()
│   ├── authorizationCodeGrant()    (alias: exchangeAuthorizationCode)
│   ├── refreshTokenGrant()         (alias: refreshAccessToken)
│   ├── clientCredentialsGrant()
│   └── parseAuthorizationResponse()
│
├── src/client.ts         # Stateless REST API client
│   ├── createMoneriumClient()      (primary API — factory function)
│   └── MoneriumClient              (class alias, identical options and behaviour)
│
├── src/socket.ts         # WebSocket subscription helpers
│   └── createOrderSocket()         (returns OrderSubscription)
│
├── src/utils.ts          # Pure utility functions (unchanged from today)
│   ├── placeOrderMessage()
│   ├── siweMessage()
│   ├── parseChain()
│   ├── getChain()
│   ├── rfc3339()
│   ├── shortenIban()
│   └── shortenAddress()
│
├── src/types.ts          # All TypeScript types and interfaces
└── src/index.ts          # Re-exports everything — the single public surface
```

### What is removed

- `preparePKCEChallenge()` — replaced by `randomPKCECodeVerifier()` + `calculatePKCECodeChallenge()`
- All `localStorage` access — removed entirely
- `window.location.assign()` calls — removed; URLs are returned instead
- `window.location.search` parsing — removed; caller passes `code` explicitly
- `window.history.replaceState()` calls (`cleanQueryString`) — removed
- `isServer` guards — removed; the SDK is environment-agnostic by design
- `isAuthorized` flag on the class — removed; presence of a valid token is the consumer's concern
- `bearerProfile` on the class — removed; tokens are returned from grant functions, not stored on the instance
- Internal socket `Map` — removed from the class; sockets are returned to the caller
- `disconnect()` — removed; no-op once the class holds no state
- `revokeAccess()` — removed; caller removes tokens from their own storage
- Sub-path exports as a _required_ API — `@monerium/sdk` remains the documented happy path. Optional stable subpath exports (`@monerium/sdk/auth`, `@monerium/sdk/client`, `@monerium/sdk/socket`) may be added alongside it for advanced consumers who want explicit scoping or cleaner bundle inspection; they are not banned, just not the primary documented entry point.

---

## New API Surface

All of the following are imported from `@monerium/sdk`.

### Auth helpers

```ts
// Generate a cryptographically random PKCE code verifier.
// Caller is responsible for storing this until the callback.
randomPKCECodeVerifier(): string

// Derive the S256 code challenge from a code verifier. Synchronous.
calculatePKCECodeChallenge(codeVerifier: string): string

// Build the authorization redirect URL. Returns a URL string — caller navigates.
buildAuthorizationUrl(options: BuildAuthorizationUrlOptions): string

// Build the SIWE authorization redirect URL. Returns a URL string — caller navigates.
buildSiweAuthorizationUrl(options: BuildSiweAuthorizationUrlOptions): string

// Exchange an authorization code for tokens. Caller stores the result.
// Canonical name (OAuth2 spec / panva). Friendly alias: exchangeAuthorizationCode()
authorizationCodeGrant(options: AuthorizationCodeGrantOptions): Promise<BearerProfile>
exchangeAuthorizationCode(options: AuthorizationCodeGrantOptions): Promise<BearerProfile>

// Get a new access token using a refresh token. Caller stores the result.
// Canonical name (OAuth2 spec). Friendly alias: refreshAccessToken()
refreshTokenGrant(options: RefreshTokenGrantOptions): Promise<BearerProfile>
refreshAccessToken(options: RefreshTokenGrantOptions): Promise<BearerProfile>

// Get an access token using client credentials. Server-side only.
clientCredentialsGrant(options: ClientCredentialsGrantOptions): Promise<BearerProfile>

// Optional pure helper — parse a callback URL or query string into structured fields.
// No side effects. No window access. Input/output only.
parseAuthorizationResponse(input: string | URL): ParsedAuthorizationResponse
```

### API client

```ts
// Stateless REST API client — factory function is the primary API
createMoneriumClient(options: MoneriumClientOptions): MoneriumClientInstance

// Class alias — identical options and behaviour; exported for compatibility
new MoneriumClient(options: MoneriumClientOptions)

// All existing resource methods remain, unchanged return types
client.getAuthContext(): Promise<AuthContext>
client.getProfile(id: string): Promise<Profile>
client.getProfiles(params?: ProfilesQueryParams): Promise<ProfilesResponse>
client.getAddress(address: string): Promise<Address>
client.getAddresses(params?: AddressesQueryParams): Promise<AddressesResponse>
client.getBalances(address, chain, currencies?): Promise<Balances>
client.getIban(iban: string): Promise<IBAN>
client.getIbans(params?: IbansQueryParams): Promise<IBANsResponse>
client.getOrders(filter?: OrderFilter): Promise<OrdersResponse>
client.getOrder(orderId: string): Promise<Order>
client.getTokens(): Promise<Token[]>
client.getSignatures(params?: SignaturesQueryParams): Promise<SignaturesResponse>
client.linkAddress(payload: LinkAddress): Promise<LinkedAddress>
client.placeOrder(order: NewOrder): Promise<Order | ResponseStatus>
client.moveIban(iban, payload): Promise<ResponseStatus>
client.requestIban(payload): Promise<ResponseStatus>
client.submitProfileDetails(profile, body): Promise<ResponseStatus>
client.uploadSupportingDocument(document: File): Promise<SupportingDoc>
```

### WebSocket

```ts
// Create and return an OrderSubscription — caller owns the lifecycle
createOrderSocket(options: CreateOrderSocketOptions): OrderSubscription
```

---

## Auth Flow Redesign

The entire OAuth2/PKCE flow becomes a series of explicit, pure function calls that the consumer orchestrates. The naming mirrors `openid-client` so that the pattern is recognisable to any developer familiar with standard OAuth2 libraries.

### Step 1 — Generate a code verifier (caller stores it)

```ts
import {
  randomPKCECodeVerifier,
  calculatePKCECodeChallenge,
} from '@monerium/sdk';

const codeVerifier = randomPKCECodeVerifier();
const codeChallenge = calculatePKCECodeChallenge(codeVerifier);

// Caller stores codeVerifier however they choose:
sessionStorage.setItem('pkce_verifier', codeVerifier);
// or: await AsyncStorage.setItem('pkce_verifier', codeVerifier);
// or: req.session.pkceVerifier = codeVerifier;
```

### Step 2 — Build the authorization URL (caller navigates)

```ts
import { buildAuthorizationUrl } from '@monerium/sdk';

const url = buildAuthorizationUrl({
  environment: 'sandbox',
  clientId: 'your-client-id',
  redirectUri: 'https://your-app.com/callback',
  codeChallenge,
  state: 'optional-state-value',
  // optional: prefill the login form
  email: 'user@example.com',
  // optional: skip steps in the auth flow
  skipCreateAccount: false,
  skipKyc: false,
  // optional: auto-link a wallet address
  address: '0x...',
  signature: '0x...',
  chain: 'ethereum',
});

// Caller decides how to navigate — the SDK does not redirect
window.location.assign(url);
// or: router.push(url);
// or: return redirect(url); // Next.js server action
```

### Step 3 — Exchange the code for tokens (caller stores the result)

```ts
import { authorizationCodeGrant } from '@monerium/sdk';

// Caller extracts the code — the SDK does not touch window.location
const code = new URLSearchParams(window.location.search).get('code');
const codeVerifier = sessionStorage.getItem('pkce_verifier');

const bearerProfile = await authorizationCodeGrant({
  environment: 'sandbox',
  clientId: 'your-client-id',
  redirectUri: 'https://your-app.com/callback',
  code,
  codeVerifier,
});

// Caller stores the tokens in whatever storage they choose
mySecureStore.set('access_token', bearerProfile.access_token);
mySecureStore.set('refresh_token', bearerProfile.refresh_token);
mySecureStore.set(
  'access_expiry',
  String(Date.now() + bearerProfile.expires_in * 1000)
);

// Caller cleans up PKCE state and URL if desired
sessionStorage.removeItem('pkce_verifier');
window.history.replaceState(null, '', window.location.pathname);
```

### Step 4 — Use the API client

```ts
import { createMoneriumClient, refreshTokenGrant } from '@monerium/sdk';

// ✅ Recommended for production — getAccessToken callback
// The client calls this before every request. The consumer controls
// expiry checking, refresh logic, and token rotation.
// createMoneriumClient() is the primary API; new MoneriumClient() is an alias.
const client = createMoneriumClient({
  environment: 'sandbox',
  getAccessToken: async () => {
    const token = mySecureStore.get('access_token');
    const expiry = Number(mySecureStore.get('access_expiry'));

    if (Date.now() > expiry) {
      const newProfile = await refreshTokenGrant({
        environment: 'sandbox',
        clientId: 'your-client-id',
        refreshToken: mySecureStore.get('refresh_token'),
      });
      mySecureStore.set('access_token', newProfile.access_token);
      mySecureStore.set(
        'access_expiry',
        String(Date.now() + newProfile.expires_in * 1000)
      );
      return newProfile.access_token;
    }

    return token;
  },
});

const profiles = await client.getProfiles();
```

### SIWE Flow

```ts
import {
  randomPKCECodeVerifier,
  calculatePKCECodeChallenge,
  buildSiweAuthorizationUrl,
  siweMessage,
} from '@monerium/sdk';

const codeVerifier = randomPKCECodeVerifier();
const codeChallenge = calculatePKCECodeChallenge(codeVerifier);
sessionStorage.setItem('pkce_verifier', codeVerifier);

const message = siweMessage({ domain, address, appName, redirectUri, chainId, ... });
// Caller signs the message with their wallet and gets `signature`

const url = buildSiweAuthorizationUrl({
  environment: 'sandbox',
  clientId: 'your-client-id',
  redirectUri: 'https://your-app.com/callback',
  codeChallenge,
  message,
  signature: '0x...',
  state: 'optional-state-value',
});

window.location.assign(url);
// Token exchange on the callback is identical to Step 3 above
```

### Client Credentials Flow (server-side)

```ts
import { clientCredentialsGrant, createMoneriumClient } from '@monerium/sdk';

const bearerProfile = await clientCredentialsGrant({
  environment: 'production',
  clientId: process.env.MONERIUM_CLIENT_ID,
  clientSecret: process.env.MONERIUM_CLIENT_SECRET,
});

// Server-side: tokens are short-lived and the process controls the lifecycle.
// A static accessToken is acceptable here since the server can re-run
// clientCredentialsGrant() on startup or when a 401 is received.
const client = createMoneriumClient({
  environment: 'production',
  accessToken: bearerProfile.access_token,
});
```

### Refresh Token Flow (standalone)

```ts
import { refreshTokenGrant } from '@monerium/sdk';

const bearerProfile = await refreshTokenGrant({
  environment: 'sandbox',
  clientId: 'your-client-id',
  refreshToken: mySecureStore.get('refresh_token'),
});

// Caller stores updated tokens
mySecureStore.set('access_token', bearerProfile.access_token);
mySecureStore.set(
  'access_expiry',
  String(Date.now() + bearerProfile.expires_in * 1000)
);
```

---

## API Client Redesign

### Constructor

`getAccessToken` and `accessToken` are mutually exclusive at the type level — TypeScript prevents passing both simultaneously. If neither is provided, the client works for unauthenticated endpoints (e.g. `getTokens()`); authenticated endpoints throw a `MoneriumError` with `code: 'authentication_required'`.

```ts
type MoneriumClientOptions =
  | {
      environment?: ENV;
      /**
       * Recommended for production browser usage and any long-lived client.
       *
       * Called by the client before every request. The consumer controls expiry
       * checking, refresh logic, and token rotation. This matches the pattern
       * used by Google Auth Library (refreshHandler), Azure Identity
       * (TokenCredential.getToken), and MSAL (acquireTokenSilent).
       *
       * Because the callback is invoked on every request, the consumer can:
       * - Check expiry and refresh transparently
       * - Rotate tokens on every call
       * - Fetch tokens from a secure backend (BFF pattern) without ever
       *   exposing the raw token in browser-accessible storage
       * - Deduplicate concurrent refresh requests internally
       */
      getAccessToken: () => string | Promise<string>;
      accessToken?: never;
      transport?: Transport;
    }
  | {
      environment?: ENV;
      /**
       * Convenience option for short-lived server-side usage and testing.
       *
       * A static token string. The client uses this as-is for the lifetime
       * of the instance. If the token expires, API calls will fail with 401
       * and the consumer must create a new instance or handle the error.
       *
       * Not recommended for production browser usage or long-lived clients.
       */
      accessToken: string;
      getAccessToken?: never;
      transport?: Transport;
    }
  | {
      environment?: ENV;
      accessToken?: never;
      getAccessToken?: never;
      transport?: Transport;
    };
```

The optional `transport` field replaces the internal `fetch` call. Pass a custom implementation to enable retries, request logging, observability, or test doubles without globally mocking `fetch`. Defaults to the platform's built-in `fetch`. See [Types & Exports](#types--exports) for the `Transport` type.

### Why `getAccessToken` is the security-preferred pattern

Every major auth SDK converges on a callback/credential pattern rather than a static token for exactly this reason:

| SDK                 | Pattern                                                                                                                                                    |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Google Auth Library | `refreshHandler: () => Promise<AccessTokenResponse>` — called before every request; falls back to stored `refresh_token`; deduplicates in-flight refreshes |
| Azure Identity      | `TokenCredential.getToken(scopes)` — callers never hold a raw token string; the credential decides whether to use cache or go to the network               |
| MSAL Browser        | `acquireTokenSilent(request)` — 3-tier waterfall: memory cache → refresh token → silent iframe; deduplicates by request thumbprint                         |

The callback pattern means:

1. The token is evaluated fresh before every request — no stale token risk
2. The consumer controls rotation — can implement any refresh strategy
3. Enables the BFF (Backend For Frontend) pattern — the callback can proxy token fetching through a secure backend, so raw tokens never touch browser-accessible storage
4. Handles concurrent request safety — the consumer's callback can deduplicate simultaneous refresh calls (e.g. with a shared `Promise`)

### No more `clientSecret` in the client constructor

`clientCredentialsGrant()` produces a `BearerProfile`. The caller extracts `access_token` and passes it to `MoneriumClient`. The secret never touches the client class. On the server, where tokens are typically short-lived and the process controls the full lifecycle, a static `accessToken` is acceptable.

### Error Handling

All HTTP errors are thrown as structured `MoneriumError` objects:

```ts
class MoneriumError extends Error {
  name: 'MoneriumError';
  status?: number; // absent for network-level errors with no HTTP response
  code?: string; // absent if the backend returned no structured error code
  body?: unknown; // raw backend response payload; untyped because error shapes vary
  cause?: unknown; // underlying error, if any (e.g. a fetch rejection)
  requestId?: string; // from X-Request-ID response header; invaluable for support
}
```

This replaces the current behaviour of throwing raw API response objects or untyped `Error` strings. `status` is optional because network failures (DNS errors, connection timeouts) produce no HTTP response. `body` is preferred over `details` to signal that this is the raw backend payload, not a processed structure.

### Chain Resolution

`mapChainIdToChain` and `parseChainBackwardsCompatible` are no longer applied silently inside every API method. The client accepts chains in any supported format (name string, chain ID number, Cosmos ID) and resolves them once in a dedicated internal layer. The environment context (`sandbox` / `production`) is set at construction time and applied consistently.

> **Note on implicit normalisation vs. the Explicit-Over-Implicit principle:** This is intentional, not a contradiction. The principle targets _side effects and lifecycle decisions_ (navigation, storage writes, auth state changes). Pure input-shaping — accepting `1` and deterministically resolving it to `"ethereum"` — is acceptable because it is stateless, reversible by inspection, and eliminates a class of "wrong chain ID" bugs with no surprises. The RFC draws the line at anything that mutates state or triggers IO behind the caller's back.

---

## WebSocket Redesign

The internal socket `Map` is removed. `createOrderSocket` is a standalone function that creates and returns an `OrderSubscription`. The caller owns the connection and calls `.close()` when done.

Returning a small `OrderSubscription` abstraction rather than a raw `WebSocket` decouples the public API from the browser `WebSocket` primitive. This means:

- The underlying transport can change (SSE, long-poll, etc.) without a breaking change
- `state` as a typed union (`'connecting' | 'open' | 'closed'`) is more useful than `WebSocket.readyState` (a raw number)
- The type is trivially mockable in tests — implement two properties, done
- Irrelevant `WebSocket` surface (`send`, `binaryType`, protocol fields) is not exposed to callers

```ts
import { createOrderSocket, OrderState } from '@monerium/sdk';

const subscription = createOrderSocket({
  environment: 'sandbox',
  accessToken: mySecureStore.get('access_token'),
  filter: {
    profile: 'profile-id',
    state: OrderState.pending,
  },
  onMessage: (order: Order) => {
    console.log('New order:', order);
  },
  onError: (err: Event) => {
    console.error('Socket error:', err);
  },
});

console.log(subscription.state); // 'connecting' | 'open' | 'closed'

// Caller closes the connection when done
subscription.close();
```

There is no `subscribeOrderNotifications` or `unsubscribeOrderNotifications` on the client class. The caller manages the `OrderSubscription` reference directly.

---

## Types & Exports

### What is added

```ts
export interface BuildAuthorizationUrlOptions {
  environment: ENV;
  clientId: string;
  redirectUri: string;
  codeChallenge: string;
  state?: string;
  email?: string;
  skipCreateAccount?: boolean;
  skipKyc?: boolean;
  address?: string;
  signature?: string;
  chain?: Chain | ChainId;
}

export interface BuildSiweAuthorizationUrlOptions {
  environment: ENV;
  clientId: string;
  redirectUri: string;
  codeChallenge: string;
  message: string;
  signature: string;
  state?: string;
}

export interface AuthorizationCodeGrantOptions {
  environment: ENV;
  clientId: string;
  redirectUri: string;
  code: string;
  codeVerifier: string;
}

export interface RefreshTokenGrantOptions {
  environment: ENV;
  clientId: string;
  refreshToken: string;
}

export interface ClientCredentialsGrantOptions {
  environment: ENV;
  clientId: string;
  clientSecret: string;
}

// Discriminated union — TypeScript prevents passing both getAccessToken and accessToken
export type MoneriumClientOptions =
  | {
      environment?: ENV;
      getAccessToken: () => string | Promise<string>;
      accessToken?: never;
      transport?: Transport;
    }
  | {
      environment?: ENV;
      accessToken: string;
      getAccessToken?: never;
      transport?: Transport;
    }
  | {
      environment?: ENV;
      accessToken?: never;
      getAccessToken?: never;
      transport?: Transport;
    };

export interface CreateOrderSocketOptions {
  environment: ENV;
  accessToken: string;
  filter?: OrderNotificationQueryParams;
  onMessage?: (order: Order) => void;
  onError?: (err: Event) => void;
}

// Returned by createOrderSocket — small abstraction over the raw WebSocket
export type OrderSubscription = {
  close(): void;
  readonly state: 'connecting' | 'open' | 'closed';
};

// Injectable transport — replaces the internal fetch call; defaults to platform fetch
export type Transport = <T>(req: {
  method: string;
  url: string;
  headers?: Record<string, string>;
  body?: BodyInit | string;
}) => Promise<T>;

// Pure helper — result of parseAuthorizationResponse()
export interface ParsedAuthorizationResponse {
  code?: string;
  state?: string;
  error?: string;
  errorDescription?: string;
}

export class MoneriumError extends Error {
  name: 'MoneriumError';
  status?: number; // absent for network-level errors
  code?: string; // absent if the backend returned no structured code
  body?: unknown; // raw backend response payload
  cause?: unknown; // underlying error (e.g. fetch rejection)
  requestId?: string; // from X-Request-ID header; useful for support
}
```

### What is removed from the public API

| Removed                        | Reason                                          |
| ------------------------------ | ----------------------------------------------- |
| `ClassOptions`                 | Replaced by `MoneriumClientOptions`             |
| `AuthorizationCodeCredentials` | Replaced by `AuthorizationCodeGrantOptions`     |
| `ClientCredentials`            | Replaced by `ClientCredentialsGrantOptions`     |
| `BearerTokenCredentials`       | No longer needed                                |
| `AuthFlowOptions`              | Replaced by `BuildAuthorizationUrlOptions`      |
| `AuthFlowSIWEOptions`          | Replaced by `BuildSiweAuthorizationUrlOptions`  |
| `PKCERequest`                  | Internal type, was never a useful public export |
| `PKCESIWERequest`              | Internal type, was never a useful public export |
| `PKCERequestShared`            | Internal type, was never a useful public export |
| `PKCERequestArgs`              | Internal type, was never a useful public export |
| `PKCERSIWERequestArgs`         | Internal type, was never a useful public export |
| `AuthArgs`                     | Internal type, was never a useful public export |
| `constants` (storage keys)     | Internal implementation detail                  |

### What is unchanged

All resource types (`Order`, `IBAN`, `Profile`, `Address`, `Token`, `BearerProfile`, `AuthContext`, `Balances`, `Counterpart`, `LinkAddress`, etc.) remain identical. The chain types (`Chain`, `ChainId`, `ProductionChain`, `SandboxChain`) remain identical. All enums (`Currency`, `OrderState`, `OrderKind`, `ProfileState`, etc.) remain identical. All utility functions (`placeOrderMessage`, `siweMessage`, `parseChain`, `getChain`, `rfc3339`, `shortenIban`, `shortenAddress`) remain identical.

---

## Deprecation Schedule

The migration is carried out in two phases to avoid forcing all consumers to upgrade at once.

### Phase 1 — `v2.x` (deprecation release, source-compatible)

The new exports are added alongside the old ones. Old names receive a `@deprecated` JSDoc tag with a message pointing to the replacement. No old names are removed. Consumers can migrate at their own pace.

> **On "source-compatible" vs "non-breaking":** Phase 1 is source-compatible for existing consumers — existing call sites compile and run unchanged. It is not guaranteed to be _fully_ runtime-equivalent in every edge case (timing differences, storage write order, auth callback edge cases). If you relied on exact internal behaviour, review the "What changes behaviour" section below.

The old names are re-exported as thin wrappers over the new implementations — not as independent code paths — so there is no risk of the two diverging.

```ts
/**
 * @deprecated Use `randomPKCECodeVerifier()` and `calculatePKCECodeChallenge()` instead.
 * Will be removed in v3.0.
 */
export const preparePKCEChallenge = () => { ... }

/**
 * @deprecated Use `buildAuthorizationUrl()` instead.
 * Will be removed in v3.0.
 */
authorize(params?: AuthFlowOptions): Promise<void> { ... }

/**
 * @deprecated Use `buildSiweAuthorizationUrl()` instead.
 * Will be removed in v3.0.
 */
siwe(params: AuthFlowSIWEOptions): Promise<void> { ... }

/**
 * @deprecated Use `authorizationCodeGrant()`, `refreshTokenGrant()`,
 * or `clientCredentialsGrant()` instead. Will be removed in v3.0.
 */
getAccess(refreshToken?: string): Promise<boolean> { ... }

/**
 * @deprecated No replacement. Caller manages their own auth state.
 * Will be removed in v3.0.
 */
disconnect(): Promise<void> { ... }

/**
 * @deprecated No replacement. Caller removes tokens from their own storage.
 * Will be removed in v3.0.
 */
revokeAccess(): Promise<void> { ... }

/**
 * @deprecated Use `createOrderSocket()` instead.
 * Will be removed in v3.0.
 */
subscribeOrderNotifications(...): WebSocket | undefined { ... }

/**
 * @deprecated Call `.close()` on the WebSocket returned by `createOrderSocket()`.
 * Will be removed in v3.0.
 */
unsubscribeOrderNotifications(...): void { ... }
```

#### What changes behaviour in Phase 1 (source-compatible, but notable)

- `authorize()` and `siwe()` will **no longer redirect** — they return the URL string. The wrapper calls `window.location.assign` on behalf of consumers who haven't migrated yet, preserving the old behaviour.
- `preparePKCEChallenge()` will **no longer write to `localStorage`** — it returns `{ codeVerifier, codeChallenge }`. The deprecated wrapper writes to `localStorage` internally as before, so old code continues to work.
- `getAccess()` will **no longer read from `localStorage`** or parse `window.location.search`. The deprecated wrapper continues to do this, preserving the old behaviour for unmigrated consumers.

### Phase 2 — `v3.0` (breaking, clean removal)

All deprecated names are removed. The class no longer accepts `clientSecret`. `localStorage`, `window.location`, and `isServer` guards are gone from the source. The `CHANGELOG.md` entry documents every removed name with a migration snippet.

### Deprecation timeline summary

| Name                              | Deprecated in | Removed in | Replacement                                                                     |
| --------------------------------- | ------------- | ---------- | ------------------------------------------------------------------------------- |
| `preparePKCEChallenge()`          | v2.x          | v3.0       | `randomPKCECodeVerifier()` + `calculatePKCECodeChallenge()`                     |
| `authorize()`                     | v2.x          | v3.0       | `buildAuthorizationUrl()`                                                       |
| `siwe()`                          | v2.x          | v3.0       | `buildSiweAuthorizationUrl()`                                                   |
| `getAccess()`                     | v2.x          | v3.0       | `authorizationCodeGrant()` / `refreshTokenGrant()` / `clientCredentialsGrant()` |
| `disconnect()`                    | v2.x          | v3.0       | _(none — caller manages state)_                                                 |
| `revokeAccess()`                  | v2.x          | v3.0       | _(none — caller manages storage)_                                               |
| `subscribeOrderNotifications()`   | v2.x          | v3.0       | `createOrderSocket()`                                                           |
| `unsubscribeOrderNotifications()` | v2.x          | v3.0       | `socket.close()`                                                                |
| `ClassOptions`                    | v2.x          | v3.0       | `MoneriumClientOptions`                                                         |
| `AuthFlowOptions`                 | v2.x          | v3.0       | `BuildAuthorizationUrlOptions`                                                  |
| `AuthFlowSIWEOptions`             | v2.x          | v3.0       | `BuildSiweAuthorizationUrlOptions`                                              |
| `AuthorizationCodeCredentials`    | v2.x          | v3.0       | `AuthorizationCodeGrantOptions`                                                 |
| `ClientCredentials`               | v2.x          | v3.0       | `ClientCredentialsGrantOptions`                                                 |
| `BearerTokenCredentials`          | v2.x          | v3.0       | _(removed — no replacement)_                                                    |
| `PKCERequest`                     | v2.x          | v3.0       | _(internal — no replacement)_                                                   |
| `PKCESIWERequest`                 | v2.x          | v3.0       | _(internal — no replacement)_                                                   |
| `PKCERequestShared`               | v2.x          | v3.0       | _(internal — no replacement)_                                                   |
| `PKCERequestArgs`                 | v2.x          | v3.0       | _(internal — no replacement)_                                                   |
| `PKCERSIWERequestArgs`            | v2.x          | v3.0       | _(internal — no replacement)_                                                   |
| `AuthArgs`                        | v2.x          | v3.0       | _(internal — no replacement)_                                                   |
| `constants` (storage keys)        | v2.x          | v3.0       | _(internal — no replacement)_                                                   |

---

## Migration Guide

### Before (current v2 API)

```ts
import { MoneriumClient } from '@monerium/sdk';

const monerium = new MoneriumClient({
  environment: 'sandbox',
  clientId: 'your-client-id',
  redirectUri: 'https://your-app.com/callback',
});

// Initiates redirect internally, writes code_verifier to localStorage
await monerium.authorize();

// On the callback page — reads window.location.search and localStorage internally
await monerium.getAccess();

// Subscribe to orders — stored in internal Map
monerium.subscribeOrderNotifications({
  onMessage: (order) => console.log(order),
});

// Disconnect — clears localStorage
await monerium.disconnect();
```

### After (v3 API with panva naming)

```ts
import {
  randomPKCECodeVerifier,
  calculatePKCECodeChallenge,
  buildAuthorizationUrl,
  authorizationCodeGrant,
  refreshTokenGrant,
  createMoneriumClient,
  createOrderSocket,
} from '@monerium/sdk';

// --- Initiate login ---
const codeVerifier = randomPKCECodeVerifier();
const codeChallenge = calculatePKCECodeChallenge(codeVerifier);

// Caller stores the verifier — no magic, no hidden writes
sessionStorage.setItem('pkce_verifier', codeVerifier);

const url = buildAuthorizationUrl({
  environment: 'sandbox',
  clientId: 'your-client-id',
  redirectUri: 'https://your-app.com/callback',
  codeChallenge,
});

// Caller decides how to navigate
window.location.assign(url);

// --- On the callback page ---
const code = new URLSearchParams(window.location.search).get('code');
const codeVerifier = sessionStorage.getItem('pkce_verifier');
sessionStorage.removeItem('pkce_verifier');

const bearerProfile = await authorizationCodeGrant({
  environment: 'sandbox',
  clientId: 'your-client-id',
  redirectUri: 'https://your-app.com/callback',
  code,
  codeVerifier,
});

// Caller stores tokens — no magic, no hidden writes
mySecureStore.set('access_token', bearerProfile.access_token);
mySecureStore.set('refresh_token', bearerProfile.refresh_token);
mySecureStore.set(
  'access_expiry',
  String(Date.now() + bearerProfile.expires_in * 1000)
);

// Caller cleans up the URL if desired
window.history.replaceState(null, '', window.location.pathname);

// --- Use the API (production pattern: getAccessToken callback) ---
// createMoneriumClient is the primary factory API; new MoneriumClient() is an alias
const client = createMoneriumClient({
  environment: 'sandbox',
  getAccessToken: async () => {
    const token = mySecureStore.get('access_token');
    const expiry = Number(mySecureStore.get('access_expiry'));

    if (Date.now() > expiry) {
      const newProfile = await refreshTokenGrant({
        environment: 'sandbox',
        clientId: 'your-client-id',
        refreshToken: mySecureStore.get('refresh_token'),
      });
      mySecureStore.set('access_token', newProfile.access_token);
      mySecureStore.set(
        'access_expiry',
        String(Date.now() + newProfile.expires_in * 1000)
      );
      return newProfile.access_token;
    }

    return token;
  },
});

const profiles = await client.getProfiles();

// --- Subscribe to orders — caller owns the subscription ---
const subscription = createOrderSocket({
  environment: 'sandbox',
  accessToken: mySecureStore.get('access_token'),
  onMessage: (order) => console.log(order),
});

// --- Disconnect — caller manages their own cleanup ---
subscription.close();
mySecureStore.remove('access_token');
mySecureStore.remove('refresh_token');
```

### During Phase 1 — using old names with deprecation warnings

Consumers who have not yet migrated will see deprecation warnings in their IDE (TypeScript hover / JSDoc) and in their bundler output, but their code will continue to work unchanged until v3.0.

```ts
// This still works in v2.x — but the IDE will show a deprecation warning
await monerium.authorize();
//             ^^^^^^^^^^ deprecated: use buildAuthorizationUrl() instead. Will be removed in v3.0.
```

---

## Prior Art

| SDK                                                                                | Key lessons applied here                                                                                                                                                                                                              |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`openid-client` (panva)](https://github.com/panva/openid-client)                  | Naming convention adopted directly. Fully stateless — `randomPKCECodeVerifier`, `calculatePKCECodeChallenge`, `buildAuthorizationUrl`, `authorizationCodeGrant` are all direct matches. No storage, no redirects. Single entry point. |
| [Google Auth Library](https://github.com/googleapis/google-auth-library-nodejs)    | `refreshHandler: () => Promise<AccessTokenResponse>` callback pattern; called before every request; eager expiry threshold; in-flight deduplication via `Map<refreshToken, Promise>`                                                  |
| [Azure Identity](https://github.com/Azure/azure-sdk-for-js)                        | `TokenCredential.getToken(scopes)` interface — callers never hold a raw token string; the credential decides whether to use cache or go to the network                                                                                |
| [MSAL Browser](https://github.com/AzureAD/microsoft-authentication-library-for-js) | `acquireTokenSilent()` — 3-tier fallback: memory cache → refresh token → silent iframe; deduplicates by request thumbprint                                                                                                            |
| [`auth0-spa-js`](https://github.com/auth0/auth0-spa-js)                            | `ICache` storage interface; in-memory fallback; clear separation between URL building and token exchange                                                                                                                              |
| [`@supabase/gotrue-js`](https://github.com/supabase/gotrue-js)                     | `SupportedStorage` type — accepts both sync and async implementations via `PromisifyMethods<Pick<Storage, 'getItem' \| 'setItem' \| 'removeItem'>>` — worth adopting in a future convenience wrapper                                  |

---

## Decisions Made

| Question                                    | Decision                                                                                                                                                                                                                                                                          |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sub-path exports vs single entry point      | **Single entry point as the documented happy path.** `@monerium/sdk` is primary. Optional stable subpath exports (`/auth`, `/client`, `/socket`) may be added for advanced users.                                                                                                 |
| Option A vs Option B for PKCE verifier      | **Option B** — `randomPKCECodeVerifier()` and `calculatePKCECodeChallenge()` return values; caller stores and passes back to `authorizationCodeGrant()`.                                                                                                                          |
| `calculatePKCECodeChallenge` sync vs async  | **Sync** — keeps `crypto-js` for Metamask Snap compatibility. Return type is `string`, not `Promise<string>`.                                                                                                                                                                     |
| `createLocalStorage()` helper               | **No** — the SDK must not encourage `localStorage`. Storage is always the consumer's responsibility.                                                                                                                                                                              |
| Keep storage key constants as public export | **No** — `STORAGE_CODE_VERIFIER`, `STORAGE_ACCESS_TOKEN`, `STORAGE_ACCESS_EXPIRY` removed from public API entirely.                                                                                                                                                               |
| `getAccessToken` vs static `accessToken`    | **Both supported, but mutually exclusive at the type level** (discriminated union). TypeScript prevents passing both. `getAccessToken` is recommended for production; `accessToken` is for server-side and testing.                                                               |
| Error class shape                           | **Single `MoneriumError`** with `status?: number`, `code?: string`, `body?: unknown`, `cause?: unknown`, `requestId?: string`. `status` is optional to handle network-level failures with no HTTP response.                                                                       |
| Chain resolution                            | **Silent inside the client.** Numeric `chainId` values (`1`, `137`) accepted anywhere a chain is expected, resolved to Monerium chain names internally. This is deterministic input-shaping, not a lifecycle side effect — see Chain Resolution section for the explicit framing. |
| Framework adapters                          | **Pure SDK only.** No first-party React or Next.js adapters. Can be addressed in a separate RFC.                                                                                                                                                                                  |
| Phase 1 deprecated wrapper isolation        | **Separate `src/compat.ts`.** All legacy `localStorage` and `window.location` code lives there exclusively — v3.0 cut is a single file deletion.                                                                                                                                  |
| Class vs factory function                   | **`createMoneriumClient()` is the primary API.** `MoneriumClient` class constructor is exported as a compatibility alias with identical behaviour. Both accept `MoneriumClientOptions`.                                                                                           |
| `createOrderSocket()` return type           | **`OrderSubscription`** — a `{ close(), state }` abstraction instead of a raw `WebSocket`. Decouples the public API from the browser primitive; trivially mockable in tests.                                                                                                      |
| Injectable transport                        | **Included in v3.0.** An optional `transport` field on `MoneriumClientOptions` replaces the internal `fetch` call. Defaults to platform `fetch`. Enables test doubles and retry wrappers without globally mocking `fetch`.                                                        |
| Auth function naming ergonomics             | **Canonical names are primary; friendly aliases are stable exports.** `authorizationCodeGrant` / `exchangeAuthorizationCode`, `refreshTokenGrant` / `refreshAccessToken`. Both are documented and supported.                                                                      |
| `parseAuthorizationResponse()` helper       | **Included.** Optional pure helper that parses a callback URL or query string into `{ code, state, error, errorDescription }`. No side effects, no window access, pure input/output.                                                                                              |

---

## Acceptance Criteria

### Auth Module

- [ ] `randomPKCECodeVerifier()` returns a `string` and writes nothing to any storage
- [ ] `calculatePKCECodeChallenge(codeVerifier)` returns a `string` (synchronous) and writes nothing to any storage
- [ ] `buildAuthorizationUrl()` returns a URL `string` and performs no navigation
- [ ] `buildSiweAuthorizationUrl()` returns a URL `string` and performs no navigation
- [ ] `authorizationCodeGrant()` returns a `BearerProfile` and writes nothing to any storage
- [ ] `exchangeAuthorizationCode()` is a stable re-export alias for `authorizationCodeGrant()`
- [ ] `refreshTokenGrant()` returns a `BearerProfile` and writes nothing to any storage
- [ ] `refreshAccessToken()` is a stable re-export alias for `refreshTokenGrant()`
- [ ] `clientCredentialsGrant()` returns a `BearerProfile` and writes nothing to any storage
- [ ] `parseAuthorizationResponse()` returns a `ParsedAuthorizationResponse` and accesses no globals
- [ ] All auth functions work in Node.js without any `window` polyfill
- [ ] All auth functions are named consistently with `openid-client` conventions

### API Client Module

- [ ] `createMoneriumClient()` is exported as the primary factory function
- [ ] `MoneriumClient` class is exported as a compatibility alias with identical behaviour
- [ ] Neither `createMoneriumClient` nor `MoneriumClient` accept `clientSecret`
- [ ] The client holds no internal token state after construction
- [ ] The client does not read or write `localStorage`, `sessionStorage`, or any other storage
- [ ] The client does not call `window.location.assign` or `window.history.replaceState`
- [ ] TypeScript prevents passing both `getAccessToken` and `accessToken` simultaneously (discriminated union enforced at the type level)
- [ ] `getAccessToken` (async callback, recommended) and `accessToken` (static string, convenience) are both supported
- [ ] When `getAccessToken` is provided, it is called before every authenticated request
- [ ] An optional `transport` function can be passed to replace the internal `fetch` call
- [ ] When no `transport` is provided, the platform's built-in `fetch` is used
- [ ] Numeric `chainId` values (e.g. `1`, `137`) are accepted and resolved to chain names silently inside the client
- [ ] All API resource methods return the same types as today
- [ ] API errors are thrown as `MoneriumError` instances with `status?`, `code?`, `body?`, and `requestId?`
- [ ] The client works in Node.js without any `window` polyfill

### WebSocket Module

- [ ] `createOrderSocket()` returns an `OrderSubscription` (not a raw `WebSocket`)
- [ ] `OrderSubscription.state` reflects the underlying connection state as `'connecting' | 'open' | 'closed'`
- [ ] The caller is responsible for calling `.close()` on the returned subscription
- [ ] No sockets are stored internally anywhere in the SDK

### Deprecation (Phase 1)

- [ ] All v2 method names (`authorize`, `siwe`, `getAccess`, `disconnect`, `revokeAccess`, `subscribeOrderNotifications`, `unsubscribeOrderNotifications`, `preparePKCEChallenge`) are re-exported with `@deprecated` JSDoc tags
- [ ] All deprecated v2 type names are re-exported with `@deprecated` JSDoc tags
- [ ] All legacy `localStorage` and `window.location` code lives exclusively in `src/compat.ts`
- [ ] Deprecated wrappers preserve existing runtime behaviour so unmigrated consumers are unaffected
- [ ] TypeScript consumers see deprecation strikethrough warnings in their IDE without any configuration

### General

- [ ] No direct references to `localStorage`, `sessionStorage`, or `window.location` exist outside `src/compat.ts`
- [ ] No `isServer` guards exist outside `src/compat.ts`
- [ ] `"sideEffects": false` is set in `package.json`
- [ ] Everything is importable from `@monerium/sdk` — sub-path imports are optional, not required
- [ ] Bundle size is reduced compared to the current version (verified in CI)
- [ ] All existing unit tests pass against the new API (updated for new signatures)
- [ ] New unit tests cover each auth function in a Node.js environment (no `window` global)
- [ ] `CHANGELOG.md` documents every breaking change with a before/after migration snippet
- [ ] `README.md` is rewritten with `getAccessToken` as the primary example

---

## Summary

> For team alignment. Full detail is in the sections above.

### The problem

The SDK currently owns too much. It reads and writes `localStorage`, parses the browser URL, and redirects the user — all invisibly. This makes it impossible to use in SSR, React Native, or any non-standard browser environment. It makes testing brittle and surprises developers who don't expect a library to silently mutate their storage and URL.

### What changes

The SDK becomes a set of pure functions and a stateless API client. **It stops making decisions on your behalf.**

| Concern         | Before                                          | After                                                |
| --------------- | ----------------------------------------------- | ---------------------------------------------------- |
| PKCE generation | `preparePKCEChallenge()` writes to localStorage | `randomPKCECodeVerifier()` returns a string          |
| Navigation      | `authorize()` calls `window.location.assign`    | `buildAuthorizationUrl()` returns a URL              |
| Token exchange  | `getAccess()` reads from the URL and storage    | `authorizationCodeGrant()` takes explicit arguments  |
| Token storage   | Written to localStorage automatically           | Returned to the caller — stored however they choose  |
| Token refresh   | Handled inside `getAccess()`                    | `getAccessToken` callback on the client              |
| Client creation | `new MoneriumClient()` (OOP-first)              | `createMoneriumClient()` (factory, primary API)      |
| WebSockets      | Stored in an internal Map on the class          | `createOrderSocket()` returns an `OrderSubscription` |
| Errors          | Raw JSON objects or plain Error strings         | `MoneriumError` with `status?`, `code?`, and `body?` |

### What stays the same

Every API method (`getProfiles`, `placeOrder`, `getIbans`, etc.) and every resource type (`Order`, `IBAN`, `Profile`, `Token`, etc.) is unchanged. Numeric `chainId` values are still accepted and resolved to Monerium chain names transparently inside the client.

### Naming

Function names follow [`openid-client`](https://github.com/panva/openid-client) conventions — the de facto standard OAuth2/PKCE library in the JS ecosystem. Any developer familiar with standard OAuth2 libraries will recognise `randomPKCECodeVerifier`, `calculatePKCECodeChallenge`, `buildAuthorizationUrl`, and `authorizationCodeGrant` immediately.

### How we get there

**Phase 1 — v2.x (no breaking changes).** New functions ship alongside the old ones. Old names are marked `@deprecated` in TypeScript so IDEs show a strikethrough. All legacy behaviour is isolated in `src/compat.ts`. Nothing breaks for existing consumers.

**Phase 2 — v3.0 (clean cut).** `src/compat.ts` is deleted. Old names are gone. The SDK has no `localStorage`, no `window.location`, no `isServer` guards anywhere in the codebase.

---

# Summary

> For team alignment. Full detail is in the sections above.

### The problem

The SDK currently owns too much. It reads and writes `localStorage`, parses the browser URL, and redirects the user — all invisibly. This makes it impossible to use in SSR, React Native, or any non-standard browser environment. It makes testing brittle and surprises developers who don't expect a library to silently mutate their storage and URL.

### What changes

The SDK becomes a set of pure functions and a stateless API client. **It stops making decisions on your behalf.**

| Concern         | Before                                          | After                                                |
| --------------- | ----------------------------------------------- | ---------------------------------------------------- |
| PKCE generation | `preparePKCEChallenge()` writes to localStorage | `randomPKCECodeVerifier()` returns a string          |
| Navigation      | `authorize()` calls `window.location.assign`    | `buildAuthorizationUrl()` returns a URL              |
| Token exchange  | `getAccess()` reads from the URL and storage    | `authorizationCodeGrant()` takes explicit arguments  |
| Token storage   | Written to localStorage automatically           | Returned to the caller — stored however they choose  |
| Token refresh   | Handled inside `getAccess()`                    | `getAccessToken` callback on the client              |
| Client creation | `new MoneriumClient()` (OOP-first)              | `createMoneriumClient()` (factory, primary API)      |
| WebSockets      | Stored in an internal Map on the class          | `createOrderSocket()` returns an `OrderSubscription` |
| Errors          | Raw JSON objects or plain Error strings         | `MoneriumError` with `status?`, `code?`, and `body?` |

### What stays the same

Every API method (`getProfiles`, `placeOrder`, `getIbans`, etc.) and every resource type (`Order`, `IBAN`, `Profile`, `Token`, etc.) is unchanged. Numeric `chainId` values are still accepted and resolved to Monerium chain names transparently inside the client.

### Naming

Function names follow [`openid-client`](https://github.com/panva/openid-client) conventions — the de facto standard OAuth2/PKCE library in the JS ecosystem. Any developer familiar with standard OAuth2 libraries will recognise `randomPKCECodeVerifier`, `calculatePKCECodeChallenge`, `buildAuthorizationUrl`, and `authorizationCodeGrant` immediately.

### How we get there

**Phase 1 — v2.x (no breaking changes).** New functions ship alongside the old ones. Old names are marked `@deprecated` in TypeScript so IDEs show a strikethrough. All legacy behaviour is isolated in `src/compat.ts`. Nothing breaks for existing consumers.

**Phase 2 — v3.0 (clean cut).** `src/compat.ts` is deleted. Old names are gone. The SDK has no `localStorage`, no `window.location`, no `isServer` guards anywhere in the codebase.
