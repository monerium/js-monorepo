# RFC: Full SDK Redesign — `@monerium/sdk`

- **Status:** Proposed
- **Author:** Monerium SDK Team
- **Replaces:** RFC-storage-adapter.md
- **Package:** `@monerium/sdk`

---

## Introduction

This RFC proposes a full redesign of `@monerium/sdk` from a stateful, side-effect-heavy class into a set of pure functions paired with a stateless API client. The redesign eliminates all hidden writes to `localStorage`, all internal navigation calls, and all implicit lifecycle management. In their place, functions return values and the caller decides what to do with them.

The driving principle is simple: **the SDK stops making decisions on your behalf.**

The migration is intentionally non-disruptive. A source-compatible Phase 1 release (v2.x) ships new exports alongside deprecated wrappers. A clean Phase 2 release (v3.0) removes all legacy code. Existing consumers are not broken until they choose to upgrade to v3.0.

---

## Problem Statement

The current `MoneriumClient` class conflates too many concerns. It manages the OAuth2/PKCE auth flow, persists tokens, parses the browser URL, redirects the user, calls the REST API, and holds WebSocket connections — all in a single object with implicit internal state.

This design made early integration fast, but it has created significant problems for any consumer running outside a standard browser page context.

| #   | Problem                                                                                      | Impact                                                                                                                                                                                                                        |
| --- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `localStorage` is used internally with no way to override it                                 | Breaks in SSR, React Native, and secure-storage environments                                                                                                                                                                  |
| 2   | `window.location.assign()` is called inside `authorize()` and `siwe()`                       | The SDK hijacks navigation; impossible to intercept or test                                                                                                                                                                   |
| 3   | `window.location.search` is parsed inside `getAccess()`                                      | Forces consumers to call `getAccess()` exactly on the callback page; no flexibility                                                                                                                                           |
| 4   | `window.history.replaceState()` is called after token exchange                               | Unexpected URL mutation that can conflict with routers (Next.js, React Router)                                                                                                                                                |
| 5   | `preparePKCEChallenge()` silently writes `code_verifier` to `localStorage`                   | Hidden side effect; impossible to trace, test, or override                                                                                                                                                                    |
| 6   | Token expiry is checked and managed inside `getAccess()`                                     | Auth state lifecycle is invisible to the consumer                                                                                                                                                                             |
| 7   | `MoneriumClient` is stateful (holds `bearerProfile`, `isAuthorized`, sockets internally)     | Hard to use in React, server environments, or with state management libraries                                                                                                                                                 |
| 8   | `isServer` guards are sprinkled throughout the client                                        | SSR support is bolted on, not designed in                                                                                                                                                                                     |
| 9   | WebSockets are stored in an internal `Map` inside the class instance                         | No way to manage lifecycle externally; memory leak risk                                                                                                                                                                       |
| 10  | `clientSecret` is accepted in `MoneriumClient` — the same class used for browser OAuth flows | Conflates public clients (OAuth/PKCE, browser-safe) with confidential clients (client credentials, server-only); a developer adding `clientSecret` to a browser integration silently bundles the secret into client-side code |
| 11  | `getAccess()` has four different code paths controlled by implicit state                     | Unpredictable; difficult to reason about                                                                                                                                                                                      |

**Who is affected:** Any consumer integrating the SDK outside a plain browser page. This includes Next.js and Remix applications (SSR), React Native applications, Cloudflare Worker backends, server-side automation using client credentials, and any application that wants to unit-test its auth flow without mocking browser globals.

---

## Proposed Solution

Replace the current stateful `MoneriumClient` with a set of pure functions and a stateless API client.

The auth flow becomes an explicit sequence of function calls that the consumer orchestrates. Each function returns a value. The consumer stores it, navigates with it, or passes it to the next step. Nothing happens invisibly.

### Design principles

1. **No side effects by default.** Every function returns a value. Nothing is stored, redirected, or mutated unless the consumer explicitly calls a function that does so.
2. **You own your storage.** Tokens, verifiers, and expiry values are returned as plain objects. The consumer stores and retrieves them.
3. **You own your navigation.** The SDK produces URLs. The consumer navigates to them.
4. **Environment-compatible by design.** The SDK avoids runtime-specific globals in its core modules and is designed to remain compatible with standards-based runtimes (browser, Node.js, React Native, Web Workers, Cloudflare Workers). No absolute guarantees are made about exotic runtime edge cases involving `crypto`, WebSocket availability, or `fetch`/`FormData` behaviour.
5. **Explicit over implicit.** Auth state is not held inside the client. The consumer passes tokens in. The flow of data is visible and traceable.
6. **Tree-shakeable and composable.** Published as a single entry point (`@monerium/sdk`) backed by focused internal modules. Bundlers tree-shake unused code automatically via `"sideEffects": false`.

### What changes

| Concern            | Before                                                                                  | After                                                                                               |
| ------------------ | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| PKCE generation    | `preparePKCEChallenge()` writes to localStorage                                         | `randomPKCECodeVerifier()` returns a string                                                         |
| Navigation         | `authorize()` calls `window.location.assign`                                            | `buildAuthorizationUrl()` returns a URL                                                             |
| Token exchange     | `getAccess()` reads from the URL and storage                                            | `authorizationCodeGrant()` takes explicit arguments                                                 |
| Token storage      | Written to localStorage automatically                                                   | Returned to the caller — stored however they choose                                                 |
| Token refresh      | Handled inside `getAccess()`                                                            | `getAccessToken` callback on the client                                                             |
| Client creation    | `new MoneriumClient()` (OOP-first)                                                      | `createMoneriumClient()` (factory, primary API)                                                     |
| Server credentials | `clientSecret` accepted in `MoneriumClient` constructor                                 | Only accepted in `clientCredentialsGrant()`; never touches the browser client                       |
| URL cleanup        | `window.history.replaceState()` called internally                                       | Caller decides whether and when to clean the URL                                                    |
| HTTP transport     | Internal `fetch` calls; no way to intercept or replace                                  | Optional `transport` callback on the client replaces the internal fetch                             |
| Token options      | `accessToken` and `getAccessToken` could both be passed; precedence documented in prose | Mutually exclusive at the type level via discriminated union — TypeScript prevents misconfiguration |
| WebSockets         | Stored in an internal Map on the class                                                  | `createOrderSocket()` returns an `OrderSubscription`                                                |
| Errors             | Raw JSON objects or plain Error strings                                                 | `MoneriumError` with `status?`, `code?`, and `body?`                                                |

### What stays the same

Every API method (`getProfiles`, `placeOrder`, `getIbans`, etc.) and every resource type (`Order`, `IBAN`, `Profile`, `Token`, `BearerProfile`, etc.) is unchanged. All enums (`Currency`, `OrderState`, `OrderKind`, `ProfileState`) are unchanged. All utility functions (`placeOrderMessage`, `siweMessage`, `parseChain`, `getChain`, `rfc3339`, `shortenIban`, `shortenAddress`) are unchanged. Numeric `chainId` values are still accepted and resolved to Monerium chain names inside the client.

---

## Design Details

### Module structure

Everything is exported from a single entry point: `@monerium/sdk`. Optional stable subpath exports (`@monerium/sdk/auth`, `@monerium/sdk/client`, `@monerium/sdk/socket`) may be added for advanced consumers who want explicit scoping or cleaner bundle inspection, but they are not the primary documented path.

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
│
├── src/types.ts          # All TypeScript types and interfaces
└── src/index.ts          # Re-exports everything — the single public surface
```

### Auth flow

The complete PKCE authorization code flow as a sequence of explicit calls:

**Step 1 — Generate a code verifier (caller stores it)**

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

**Step 2 — Build the authorization URL (caller navigates)**

```ts
import { buildAuthorizationUrl } from '@monerium/sdk';

const url = buildAuthorizationUrl({
  environment: 'sandbox',
  clientId: 'your-client-id',
  redirectUri: 'https://your-app.com/callback',
  codeChallenge,
  state: 'optional-state-value',
  email: 'user@example.com', // optional: prefill
  address: '0x...', // optional: auto-link wallet
  signature: '0x...',
  chain: 'ethereum',
});

// Caller decides how to navigate — the SDK does not redirect
window.location.assign(url);
// or: router.push(url);
// or: return redirect(url); // Next.js server action
```

**Step 3 — Exchange the code for tokens (caller stores the result)**

```ts
import {
  authorizationCodeGrant,
  parseAuthorizationResponse,
} from '@monerium/sdk';

// Option A: manual extraction
const code = new URLSearchParams(window.location.search).get('code');

// Option B: use the optional pure helper (no globals, no side effects)
const { code, error, errorDescription } = parseAuthorizationResponse(
  window.location.href
);

const codeVerifier = sessionStorage.getItem('pkce_verifier');
sessionStorage.removeItem('pkce_verifier');

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
window.history.replaceState(null, '', window.location.pathname);
```

**Step 4 — Use the API client**

```ts
import { createMoneriumClient, refreshTokenGrant } from '@monerium/sdk';

// createMoneriumClient() is the primary API; new MoneriumClient() is a compatibility alias.
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

### Client Credentials flow (server-side)

```ts
import { clientCredentialsGrant, createMoneriumClient } from '@monerium/sdk';

const bearerProfile = await clientCredentialsGrant({
  environment: 'production',
  clientId: process.env.MONERIUM_CLIENT_ID,
  clientSecret: process.env.MONERIUM_CLIENT_SECRET,
});

// clientSecret never touches the client class.
// Static accessToken is acceptable server-side — the process controls the lifecycle.
const client = createMoneriumClient({
  environment: 'production',
  accessToken: bearerProfile.access_token,
});
```

### SIWE flow

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

const message = siweMessage({ domain, address, appName, redirectUri, chainId });
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

### WebSocket subscriptions

`createOrderSocket` returns an `OrderSubscription` — a small abstraction over the raw `WebSocket`. This decouples the public API from the browser primitive (the underlying transport can change without a breaking change), exposes `state` as a typed union rather than a raw number, and prevents callers from accessing irrelevant `WebSocket` surface (`send`, `binaryType`, etc.).

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

// Caller closes the connection when done — no SDK method required
subscription.close();
```

### Key type signatures

**Client options — discriminated union (TypeScript prevents passing both token fields)**

```ts
type MoneriumClientOptions =
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
```

**Injectable transport (replaces internal fetch; defaults to platform fetch)**

```ts
type Transport = <T>(req: {
  method: string;
  url: string;
  headers?: Record<string, string>;
  body?: BodyInit | string;
}) => Promise<T>;
```

**OrderSubscription**

```ts
type OrderSubscription = {
  close(): void;
  readonly state: 'connecting' | 'open' | 'closed';
};
```

**Structured error**

```ts
class MoneriumError extends Error {
  name: 'MoneriumError';
  status?: number; // absent for network-level errors with no HTTP response
  code?: string; // absent if the backend returned no structured error code
  body?: unknown; // raw backend response payload
  cause?: unknown; // underlying error (e.g. a fetch rejection)
  requestId?: string; // from X-Request-ID response header; useful for support
}
```

**parseAuthorizationResponse — optional pure helper**

```ts
parseAuthorizationResponse(input: string | URL): {
  code?: string;
  state?: string;
  error?: string;
  errorDescription?: string;
}
```

### Naming convention

Function names follow the conventions established by [`openid-client`](https://github.com/panva/openid-client) — the de facto standard OAuth2/PKCE library in the JavaScript ecosystem. Where the spec-faithful name is unfamiliar to product engineers, a friendly alias is exported alongside it as a stable, documented export.

| Current name                            | New canonical name(s)                                       |
| --------------------------------------- | ----------------------------------------------------------- |
| `preparePKCEChallenge()`                | `randomPKCECodeVerifier()` + `calculatePKCECodeChallenge()` |
| `authorize()`                           | `buildAuthorizationUrl()`                                   |
| `siwe()`                                | `buildSiweAuthorizationUrl()`                               |
| `getAccess()` (auth code path)          | `authorizationCodeGrant()` / `exchangeAuthorizationCode()`  |
| `getAccess()` (refresh token path)      | `refreshTokenGrant()` / `refreshAccessToken()`              |
| `getAccess()` (client credentials path) | `clientCredentialsGrant()`                                  |
| `subscribeOrderNotifications()`         | `createOrderSocket()`                                       |
| `unsubscribeOrderNotifications()`       | `subscription.close()`                                      |
| `new MoneriumClient()`                  | `createMoneriumClient()` / `new MoneriumClient()` (alias)   |
| _(new)_                                 | `parseAuthorizationResponse()`                              |

### What is removed from the public API

| Removed                                                                                                      | Reason                                           |
| ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------ |
| `ClassOptions`                                                                                               | Replaced by `MoneriumClientOptions`              |
| `AuthorizationCodeCredentials`                                                                               | Replaced by `AuthorizationCodeGrantOptions`      |
| `ClientCredentials`                                                                                          | Replaced by `ClientCredentialsGrantOptions`      |
| `BearerTokenCredentials`                                                                                     | No longer needed                                 |
| `AuthFlowOptions`                                                                                            | Replaced by `BuildAuthorizationUrlOptions`       |
| `AuthFlowSIWEOptions`                                                                                        | Replaced by `BuildSiweAuthorizationUrlOptions`   |
| `PKCERequest`, `PKCESIWERequest`, `PKCERequestShared`, `PKCERequestArgs`, `PKCERSIWERequestArgs`, `AuthArgs` | Internal types; were never useful public exports |
| `constants` (storage keys)                                                                                   | Related to `localStorage`                        |

### Why `getAccessToken` is the preferred pattern

Every major auth SDK converges on a callback/credential pattern rather than a static token:

| SDK                 | Pattern                                                                              |
| ------------------- | ------------------------------------------------------------------------------------ |
| Google Auth Library | `refreshHandler: () => Promise<AccessTokenResponse>` — called before every request   |
| Azure Identity      | `TokenCredential.getToken(scopes)` — callers never hold a raw token string           |
| MSAL Browser        | `acquireTokenSilent(request)` — 3-tier waterfall; deduplicates by request thumbprint |

The callback pattern means the token is evaluated fresh before every request, the consumer controls rotation, and the BFF (Backend For Frontend) pattern is trivially supported — the callback can proxy token fetching through a secure backend so raw tokens never reach browser-accessible storage.

### Chain resolution

Numeric `chainId` values (`1`, `137`, etc.) are accepted anywhere a chain is expected and resolved deterministically to Monerium chain names inside the client. This is intentional input-shaping, not a contradiction of the Explicit-Over-Implicit principle. The principle targets side effects and lifecycle decisions (navigation, storage writes, auth state). Pure, stateless input normalisation — accepting `1` and resolving it to `"ethereum"` — eliminates a class of silent bugs with no hidden IO.

---

## Alternatives Considered

### Keep the class as-is and add a storage adapter

An earlier RFC (RFC-storage-adapter.md) explored adding a `StorageAdapter` interface to `MoneriumClient` so consumers could swap out `localStorage`. This was rejected because it addressed only one of thirteen pain points. The navigation hijacking, implicit auth state, and WebSocket lifecycle problems remained. A storage adapter is a patch; this RFC is a redesign.

### Keep `new MoneriumClient()` as the only constructor API

Keeping the class as the sole entry point is valid — the class holds no meaningful state in the new design, so the distinction between class and factory is mostly philosophical. However, `createMoneriumClient()` is more honest about what is happening (you get a plain object of methods back, not a class instance with OOP semantics), aligns better with the functional character of the rest of the API, and is easier to mock in tests. `MoneriumClient` is retained as a compatibility alias so existing code continues to work without changes.

### Return a raw `WebSocket` from `createOrderSocket()`

The first draft of this RFC returned a raw `WebSocket`. The problems with this are: it leaks a browser global into the public API contract, exposes irrelevant surface (`send`, `binaryType`, protocol fields), makes `readyState` a raw number rather than a typed union, and makes mocking in tests unnecessarily verbose. The `OrderSubscription` abstraction is two properties (`close()` and `state`) and trivially implementable as a test double.

### Keep `getAccessToken`/`accessToken` mutually exclusive by precedence rule

The original draft documented that `getAccessToken` takes precedence if both are provided. This was replaced with a TypeScript discriminated union because precedence rules are runtime mercy for misconfiguration. The type system should prevent the ambiguity from being expressed at all. The discriminated union achieves this at zero runtime cost.

### Injectable transport as an optional future addition

The first draft listed transport injection as an "open for discussion" item. It has been moved into the initial v3.0 design because this is the kind of seam that is easy to add early and mildly painful to retrofit later. Most consumers will never use it. Those who do — teams writing unit tests, teams on Cloudflare Workers with custom fetch wrappers, teams adding structured request logging — will find it essential. The cost of including it is one optional field on the options object.

### Auth function naming: spec-faithful only vs. friendly aliases

The first draft used only the OAuth2 spec-faithful names (`authorizationCodeGrant`, `refreshTokenGrant`). These are immediately recognisable to developers familiar with `openid-client` or the OAuth2 spec, but can feel unfamiliar to product engineers integrating payment flows. Rather than choose one audience, both are supported: the canonical names are primary and the friendly aliases (`exchangeAuthorizationCode`, `refreshAccessToken`) are stable, documented re-exports pointing at the same implementation. There is no divergence risk and no maintenance cost beyond the export line.

### Single entry point vs. subpath exports

The earlier draft stated that subpath exports (`@monerium/sdk/auth`, `@monerium/sdk/client`, `@monerium/sdk/socket`) were "not needed". This was softened: `@monerium/sdk` remains the documented happy path and the only path shown in examples, but subpath exports are not banned. Advanced consumers who want explicit scoping, cleaner bundle analysis, or leaner imports in large monorepos can use them without the SDK actively working against them.

### `parseAuthorizationResponse()` as a core function vs. leaving it out entirely

The first draft removed all URL parsing from the SDK. A pure helper that accepts a URL string and returns `{ code, state, error, errorDescription }` was added back because it has no side effects, touches no globals, and solves a real ergonomics problem without reintroducing any of the old magic. It is opt-in — callers who prefer to extract the code themselves are unaffected. The alternative (leaving it out entirely) would have every consumer writing the same four lines of `URLSearchParams` parsing.

---

## Trade-offs and Risks

### The caller must manage more state explicitly

The primary trade-off is deliberate: the SDK no longer manages PKCE state, token storage, URL parsing, or navigation. Consumers who previously called `authorize()` and `getAccess()` and had it "just work" now need to wire up a few more explicit steps. This is the point. The SDK cannot make those decisions correctly for all environments, so it returns the primitives and lets the caller decide.

The Migration Guide provides a complete before/after example. The Phase 1 deprecated wrappers preserve the old one-call behaviour for consumers who are not yet ready to migrate.

### Phase 1 is source-compatible, not fully runtime-equivalent

Phase 1 deprecated wrappers are thin layers over the new implementation — they are not independent code paths. This means they will exhibit slightly different timing characteristics and internal sequencing compared to the original implementation. Code that relied on exact internal behaviour (specific write order to `localStorage`, specific timing of `window.history.replaceState`, etc.) may observe differences. The wrappers are intended to cover all documented usage patterns, not all possible internal observations.

### `OrderSubscription` is not a `WebSocket`

Consumers who used the raw `WebSocket` returned by the old `subscribeOrderNotifications()` to attach their own `onopen`, `onclose`, or `readyState` checks will need to use the `state` property and `close()` method on `OrderSubscription` instead. This is a deliberate restriction, not an oversight. The `OrderSubscription` type is designed so the underlying transport can change without a public API break.

### `MoneriumError.status` is now optional

In the old design, status was always a number. It is now `status?: number` because network-level failures (DNS errors, connection timeouts) produce no HTTP response and therefore no status code. Code that checks `error.status === 401` must now guard for `undefined`. This is more correct; the old typing was a lie.

### Bundle size

Removing `localStorage`, `window.location`, and internal socket management will reduce the bundle. The injectable `transport` type and `OrderSubscription` abstraction add negligible bytes. The overall direction is smaller, but exact size savings depend on tree-shaking efficiency and bundler configuration. Bundle size is verified in CI as an acceptance criterion.

---

## Rollout and Migration

### Phase 1 — v2.x (source-compatible deprecation release)

All new exports are added alongside the old ones. Old names receive `@deprecated` JSDoc tags so TypeScript consumers see IDE strikethrough warnings without any configuration. No old names are removed. All legacy `localStorage` and `window.location` code is isolated in `src/compat.ts`. Consumers can migrate at their own pace.

**What the deprecated wrappers do differently from the originals:**

- `authorize()` and `siwe()` no longer redirect — the wrapper calls `window.location.assign` to preserve old behaviour
- `preparePKCEChallenge()` no longer writes to `localStorage` — the wrapper writes it internally as before
- `getAccess()` no longer reads from `localStorage` or parses `window.location.search` — the wrapper continues to do this

**Deprecation timeline**

| Name                              | Deprecated in | Removed in | Replacement                                                                     |
| --------------------------------- | ------------- | ---------- | ------------------------------------------------------------------------------- |
| `preparePKCEChallenge()`          | v2.x          | v3.0       | `randomPKCECodeVerifier()` + `calculatePKCECodeChallenge()`                     |
| `authorize()`                     | v2.x          | v3.0       | `buildAuthorizationUrl()`                                                       |
| `siwe()`                          | v2.x          | v3.0       | `buildSiweAuthorizationUrl()`                                                   |
| `getAccess()`                     | v2.x          | v3.0       | `authorizationCodeGrant()` / `refreshTokenGrant()` / `clientCredentialsGrant()` |
| `disconnect()`                    | v2.x          | v3.0       | _(none — caller manages state)_                                                 |
| `revokeAccess()`                  | v2.x          | v3.0       | _(none — caller manages storage)_                                               |
| `subscribeOrderNotifications()`   | v2.x          | v3.0       | `createOrderSocket()`                                                           |
| `unsubscribeOrderNotifications()` | v2.x          | v3.0       | `subscription.close()`                                                          |
| `ClassOptions`                    | v2.x          | v3.0       | `MoneriumClientOptions`                                                         |
| `AuthFlowOptions`                 | v2.x          | v3.0       | `BuildAuthorizationUrlOptions`                                                  |
| `AuthFlowSIWEOptions`             | v2.x          | v3.0       | `BuildSiweAuthorizationUrlOptions`                                              |
| `AuthorizationCodeCredentials`    | v2.x          | v3.0       | `AuthorizationCodeGrantOptions`                                                 |
| `ClientCredentials`               | v2.x          | v3.0       | `ClientCredentialsGrantOptions`                                                 |

### Phase 2 — v3.0 (breaking, clean removal)

`src/compat.ts` is deleted. All deprecated names are removed. `CHANGELOG.md` documents every removed name with a before/after migration snippet. `README.md` is rewritten with `createMoneriumClient` and `getAccessToken` as the primary examples.

### Before/after migration snapshot

**Before (current v2 API)**

```ts
import { MoneriumClient } from '@monerium/sdk';

const monerium = new MoneriumClient({
  environment: 'sandbox',
  clientId: 'your-client-id',
  redirectUri: 'https://your-app.com/callback',
});

await monerium.authorize(); // redirects internally, writes to localStorage
await monerium.getAccess(); // reads window.location.search and localStorage
monerium.subscribeOrderNotifications({
  onMessage: (order) => console.log(order),
});
await monerium.disconnect(); // clears localStorage
```

**After (v3 API)**

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
sessionStorage.setItem('pkce_verifier', codeVerifier);

const url = buildAuthorizationUrl({
  environment: 'sandbox',
  clientId: 'your-client-id',
  redirectUri: 'https://your-app.com/callback',
  codeChallenge,
});
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

mySecureStore.set('access_token', bearerProfile.access_token);
mySecureStore.set('refresh_token', bearerProfile.refresh_token);
mySecureStore.set(
  'access_expiry',
  String(Date.now() + bearerProfile.expires_in * 1000)
);
window.history.replaceState(null, '', window.location.pathname);

// --- Use the API ---
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

// --- Subscribe to orders ---
const subscription = createOrderSocket({
  environment: 'sandbox',
  accessToken: mySecureStore.get('access_token'),
  onMessage: (order) => console.log(order),
});

// --- Clean up ---
subscription.close();
mySecureStore.remove('access_token');
mySecureStore.remove('refresh_token');
```

---

## Security Considerations

### `clientSecret` is removed from the client constructor

OAuth2 defines two distinct client types that must never be mixed:

| Client type             | Used for                                             | Credentials                                                        |
| ----------------------- | ---------------------------------------------------- | ------------------------------------------------------------------ |
| **Public client**       | Browser apps, mobile apps using OAuth/PKCE           | `clientId` + `redirectUri` — no secret; PKCE provides the security |
| **Confidential client** | Server-to-server automation using client credentials | `clientId` + `clientSecret` — secret must never leave the server   |

Both flows use `clientId`, but only the confidential flow uses `clientSecret`. The old `MoneriumClient` accepted `clientSecret` in the same constructor used for browser OAuth flows. This made it easy to accidentally configure a browser client with a `clientSecret` and have it silently included in a client-side JavaScript bundle.

In the new design, `clientSecret` only ever appears in `clientCredentialsGrant({ clientId, clientSecret })` — a standalone function whose name and placement make the server-only intent explicit. `createMoneriumClient()` never accepts `clientSecret`; it only accepts an access token (via `accessToken` or `getAccessToken`). The boundary between the two client types is now enforced at the API surface, not just in documentation.

### `getAccessToken` enables the BFF pattern

Because the client calls `getAccessToken` before every request, the callback can proxy token fetching through a secure backend endpoint (Backend For Frontend pattern). Raw tokens never need to reach browser-accessible storage. This is not enforced by the SDK — it is an architecture the SDK now makes possible, whereas the old design made it impossible.

### Static `accessToken` is appropriate only for server-side use

The `accessToken` option is documented as suitable for short-lived server-side usage and testing only. It is not recommended for browser clients because there is no mechanism for automatic rotation. If the token expires, API calls fail with 401 and the consumer must construct a new client. This is acceptable on a server where the process controls the full lifecycle; it is not acceptable in a long-lived browser session.

### Token material is never logged or persisted by the SDK

No token, verifier, or credential touches any storage, logger, or network call inside the SDK itself. Everything is passed through function parameters and return values. The consumer's observable behaviour is the complete story.

---

## References

- [`openid-client` (panva)](https://github.com/panva/openid-client) — Naming conventions adopted directly; fully stateless OAuth2/PKCE reference implementation
- [Google Auth Library](https://github.com/googleapis/google-auth-library-nodejs) — `refreshHandler` callback pattern
- [Azure Identity SDK](https://github.com/Azure/azure-sdk-for-js) — `TokenCredential.getToken(scopes)` interface
- [MSAL Browser](https://github.com/AzureAD/microsoft-authentication-library-for-js) — `acquireTokenSilent()` and request deduplication
- [`auth0-spa-js`](https://github.com/auth0/auth0-spa-js) — `ICache` storage interface; separation of URL building and token exchange
- [`@supabase/gotrue-js`](https://github.com/supabase/gotrue-js) — `SupportedStorage` type for sync/async storage adapters
- RFC-storage-adapter.md — Prior Monerium RFC; superseded by this document
- RFC-sdk-redesign.md — Extended working document with full API surface, type definitions, deprecation timeline, acceptance criteria, and decisions log
