# RFC 3: JavaScript SDK v4.0 — Redesign

- **Author:** @Einar
- **State:** Draft
- **Labels:** developers, monorepo, sdk
- **Created:** April 16th

---

## Introduction

The current Monerium SDK implementation relies heavily on `window.localStorage` for managing PKCE code verifiers (`STORAGE_CODE_VERIFIER`) and OAuth2 access tokens (`STORAGE_ACCESS_TOKEN`, `STORAGE_ACCESS_EXPIRY`).

We want to push our users to store this in their backend, but it also causes issues with server-side rendering, mobile/React Native, and Web Workers.

Because of breaking changes, there is an opportunity for a full redesign.

The redesign eliminates all hidden writes to `localStorage`, all internal navigation calls, and all implicit lifecycle management. In their place, functions return values, and the caller decides what to do with them.

The driving principle is simple: **the SDK stops making decisions on your behalf.**

All Monerium API endpoints are CORS-locked and cannot be called directly from a browser. The SDK is designed for Node.js and server-side runtimes. Browser-based direct API access is not supported.

---

## Problem Statement

The issue was raised by Blinx, we were pushing them to use a backend for the credentials when they reported back to us that the SDK has a built-in usage of `localStorage`, which can be a security risk as well.

The current `MoneriumClient` class conflates too many concerns. It manages the OAuth2/PKCE auth flow, persists tokens, parses the browser URL, redirects the user, calls the REST API, and holds WebSocket connections — all in a single object with implicit internal state.

| Problem                                                                                      | Impact                                                                         |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `localStorage` is used internally with no way to override it                                 | Breaks in SSR, React Native, and secure-storage environments                   |
| `window.location.assign()` is called inside `authorize()` and `siwe()`                       | The SDK hijacks navigation; impossible to intercept or test                    |
| `window.location.search` is parsed inside `getAccess()`                                      | Forces consumers to call `getAccess()` exactly on the callback page            |
| `window.history.replaceState()` is called after token exchange                               | Unexpected URL mutation that can conflict with routers (Next.js, React Router) |
| `preparePKCEChallenge()` silently writes `code_verifier` to `localStorage`                   | Hidden side effect; impossible to trace, test, or override                     |
| Token expiry is checked and managed inside `getAccess()`                                     | Auth state lifecycle is invisible to the consumer                              |
| `MoneriumClient` is stateful (holds `bearerProfile`, `isAuthorized`, sockets internally)     | Hard to use in React, server environments, or with state management libraries  |
| `isServer` guards are sprinkled throughout the client                                        | SSR support is bolted on, not designed in                                      |
| `clientSecret` is accepted in `MoneriumClient` — the same class used for browser OAuth flows | Leaks server-only credentials into browser bundles if misconfigured            |
| `getAccess()` has four different code paths controlled by implicit state                     | Unpredictable; difficult to reason about                                       |

**Who is affected:** Any consumer integrating the SDK outside a plain browser page. This includes Next.js and Remix applications (SSR), React Native applications, Cloudflare Worker backends, server-side automation using client credentials, and any application that wants to unit-test its auth flow without mocking browser globals.

---

## Proposed Solution

Replace the current stateful `MoneriumClient` with a set of explicit, focused functions and an auth-stateless API client.

The auth flow becomes an explicit sequence of function calls that the consumer orchestrates. Each function returns a value. The consumer stores it, navigates with it, or passes it to the next step. Nothing happens invisibly.

### Design principles

1. **No side effects by default.** Every function returns a value. Nothing is stored, redirected, or mutated unless the consumer explicitly calls a function that does so.
2. **You own your storage.** Tokens, verifiers, and expiry values are returned as plain objects. The consumer stores and retrieves them.
3. **You own your navigation.** The SDK produces URLs. The consumer navigates to them.
4. **Node.js and server runtimes first.** All Monerium API endpoints are CORS-locked. The SDK targets Node.js, Cloudflare Workers, and other server runtimes. No browser globals (`window`, `localStorage`, `document`) are used or required anywhere in the SDK.
5. **Explicit over implicit.** Auth state is not held inside the client. The consumer passes tokens in. The flow of data is visible and traceable.

### What changes

| Concern          | Before                                                         | After                                                                   |
| ---------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------- |
| PKCE generation  | `preparePKCEChallenge()` writes to localStorage                | `randomPKCECodeVerifier()` returns a string                             |
| Navigation       | `authorize()` calls `window.location.assign`                   | `buildAuthorizationUrl()` returns a URL                                 |
| URL manipulation | `window.history.replaceState()` called internally              | Caller decides whether and when to clean the URL                        |
| Token exchange   | `getAccess()` reads from the URL and storage                   | `authorizationCodeGrant()` takes explicit arguments                     |
| Token storage    | Written to localStorage automatically                          | Returned to the caller — stored however they choose                     |
| Token refresh    | Handled inside `getAccess()`                                   | `getAccessToken` callback on the client                                 |
| Client creation  | `new MoneriumClient()` (OOP-first)                             | `createMoneriumClient()` (factory, primary API)                         |
| HTTP transport   | Internal `fetch` calls; no way to intercept or replace         | Optional `transport` callback on the client replaces the internal fetch |
| WebSockets       | `subscribeOrderNotifications()` stored internally on the class | Removed in v4 — use webhooks instead                                    |
| Errors           | Raw JSON objects or plain Error strings                        | Typed Errors                                                            |

---

## Design Details

### Module structure

Everything is exported from a single entry point: `@monerium/sdk`. Optional stable subpath exports (`@monerium/sdk/auth`, `@monerium/sdk/client`) may be added for advanced consumers who want explicit scoping or cleaner bundle inspection, but they are not the primary documented path.

```
@monerium/sdk  (single public entry point)
│
├── src/auth.ts           # Auth helpers — no hidden side effects, no storage writes
│   ├── randomPKCECodeVerifier()
│   ├── calculatePKCECodeChallenge()
│   ├── buildAuthorizationUrl()
│   ├── buildSiweAuthorizationUrl()
│   ├── authorizationCodeGrant()    (alias: exchangeAuthorizationCode)
│   ├── refreshTokenGrant()         (alias: refreshAccessToken)
│   ├── clientCredentialsGrant()
│   └── parseAuthorizationResponse()
│
├── src/client.ts         # Auth-stateless REST API client
│   ├── createMoneriumClient()      (primary API — factory function)
│   └── MoneriumClient              (deprecated in v3.x, removed in v4.0 — use createMoneriumClient())
│
├── src/utils.ts          # Pure utility functions (unchanged from today)
│
├── src/types.ts          # All TypeScript types and interfaces
└── src/index.ts          # Re-exports everything — the single public surface
```

### The API client

`createMoneriumClient()` is the documented API. `MoneriumClient` exists in v3.x for source compatibility only — it is deprecated from day one, carries a `@deprecated` JSDoc tag, and is removed in v4.0. It is not the preferred style. The client holds no bearer profile, no refresh token, and no socket registry.

The client accepts one of two token supply strategies, which are mutually exclusive at the type level (TypeScript prevents passing both):

**`getAccessToken` — recommended for browser and long-lived clients**

A callback invoked before every authenticated request. The consumer controls expiry checking, refresh logic, and token rotation. Because it runs on every request, it can transparently refresh expired tokens, rotate tokens, or proxy token fetching through a secure backend (BFF pattern) so raw tokens never reach browser-accessible storage.
If `getAccessToken` throws or returns a rejected promise, the error propagates as-is to the caller of the API method — it is not wrapped or retried by the client.

If multiple API calls fire simultaneously and the token is expired, each will invoke `getAccessToken` concurrently.
The SDK does not deduplicate these calls — if this matters for your use case (e.g. a rotating refresh token that is invalidated on first use),
implement deduplication inside the callback using a shared promise:

```ts
let refreshPromise: Promise<string> | null = null;

getAccessToken: async () => {
  if (Date.now() < Number(myStore.get('access_expiry'))) {
    return myStore.get('access_token');
  }
  if (!refreshPromise) {
    refreshPromise = refreshTokenGrant({ ... })
      .then(p => {
        myStore.set('access_token', p.access_token);
        myStore.set('access_expiry', String(Date.now() + p.expires_in * 1000));
        return p.access_token;
      })
      .finally(() => { refreshPromise = null; });
  }
  return refreshPromise;
}
```

This pattern is the standard across major auth SDKs:

| SDK                 | Equivalent pattern                                                                 |
| ------------------- | ---------------------------------------------------------------------------------- |
| Google Auth Library | `refreshHandler: () => Promise<AccessTokenResponse>` — called before every request |
| Azure Identity      | `TokenCredential.getToken(scopes)` — callers never hold a raw token string         |
| MSAL Browser        | `acquireTokenSilent(request)` — gets a fresh token automatically in the background |

**`accessToken` — for server-side and testing only**

A static token string used as-is for the lifetime of the client instance. Suitable for server processes where the lifecycle is controlled and the token is short-lived. Not recommended for browser clients — if the token expires, API calls fail with 401.

**`transport` — optional, for advanced use**

Replaces the internal `fetch` call. The SDK pre-populates all headers (`Authorization`, `Content-Type`, `Accept`) and owns JSON parsing and error normalization — the transport only handles networking. Return the raw response `status` and `bodyText`; throw on network-level failures. This keeps `MoneriumApiError` and `MoneriumSdkError` behaviour consistent regardless of which transport is used. Supports `AbortSignal` for request cancellation.

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

type TransportRequest = {
  method: string;
  url: string;
  headers: Record<string, string>; // always pre-populated by the SDK
  body?: BodyInit | string;
  signal?: AbortSignal; // for request cancellation
};

type TransportResponse = {
  status: number;
  headers?: Record<string, string>;
  bodyText: string; // raw response body — SDK handles JSON parsing
};

type Transport = (request: TransportRequest) => Promise<TransportResponse>;
```

If neither token option is provided, the client works for unauthenticated endpoints (e.g. `getTokens()`); authenticated endpoints throw a `MoneriumSdkError` with `type: 'authentication_required'`.

### PKCE auth flow

The complete authorization code flow for a Node.js backend. All tokens are stored server-side — they never touch the browser.

**Step 1 — Initiate login (server route)**

```ts
import {
  randomPKCECodeVerifier,
  calculatePKCECodeChallenge,
  buildAuthorizationUrl,
} from '@monerium/sdk';

// Express route: GET /login
app.get('/login', (req, res) => {
  const codeVerifier = randomPKCECodeVerifier();
  const codeChallenge = calculatePKCECodeChallenge(codeVerifier);

  // Store verifier server-side until the callback
  req.session.pkceVerifier = codeVerifier;

  const url = buildAuthorizationUrl({
    environment: 'sandbox',
    clientId: process.env.MONERIUM_CLIENT_ID,
    redirectUri: 'https://your-app.com/callback',
    codeChallenge,
  });

  res.redirect(url);
});
```

**Step 2 — Handle the callback (server route)**

```ts
import {
  authorizationCodeGrant,
  parseAuthorizationResponse,
  MoneriumApiError,
} from '@monerium/sdk';

// Express route: GET /callback
app.get('/callback', async (req, res) => {
  // TODO: not sure we need parseAuthorizationReponse anymore.
  const { code, error, errorDescription } = parseAuthorizationResponse(
    new URL(req.url, 'https://your-app.com')
  );

  if (error) {
    return res.status(400).json({ error, errorDescription });
  }

  const codeVerifier = req.session.pkceVerifier;
  delete req.session.pkceVerifier;

  try {
    const bearerProfile = await authorizationCodeGrant({
      environment: 'sandbox',
      clientId: process.env.MONERIUM_CLIENT_ID,
      redirectUri: 'https://your-app.com/callback',
      code,
      codeVerifier,
    });

    // Store tokens server-side — never sent to the browser
    req.session.accessToken = bearerProfile.access_token;
    req.session.refreshToken = bearerProfile.refresh_token;
    req.session.accessExpiry = Date.now() + bearerProfile.expires_in * 1000;

    res.redirect('/dashboard');
  } catch (err) {
    if (err instanceof MoneriumApiError) {
      res.status(err.code).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Authentication failed' });
    }
  }
});
```

**Step 3 — Create the API client per request**

```ts
import { createMoneriumClient, refreshTokenGrant } from '@monerium/sdk';

function buildClient(session: typeof req.session) {
  return createMoneriumClient({
    environment: 'sandbox',
    getAccessToken: async () => {
      if (Date.now() > session.accessExpiry) {
        const refreshed = await refreshTokenGrant({
          environment: 'sandbox',
          clientId: process.env.MONERIUM_CLIENT_ID,
          refreshToken: session.refreshToken,
        });
        session.accessToken = refreshed.access_token;
        session.accessExpiry = Date.now() + refreshed.expires_in * 1000;
        return refreshed.access_token;
      }
      return session.accessToken;
    },
  });
}

// Use in any route
app.get('/ibans', async (req, res) => {
  const client = buildClient(req.session);
  const ibans = await client.getIbans();
  res.json(ibans);
});
```

### Client credentials flow (server-side)

```ts
import { clientCredentialsGrant, createMoneriumClient } from '@monerium/sdk';

const { access_token, expires_in } = await clientCredentialsGrant({
  environment: 'production',
  clientId: process.env.MONERIUM_CLIENT_ID,
  clientSecret: process.env.MONERIUM_CLIENT_SECRET,
});

// clientSecret never touches the client — only the resulting token does
const client = createMoneriumClient({
  environment: 'production',
  accessToken: access_token,
});
```

### SIWE flow

SIWE is a variant of Step 1. The authorization URL is built with `buildSiweAuthorizationUrl`, passing a signed EIP-4361 message. Token exchange on the callback is identical to Step 2.

```ts
import { buildSiweAuthorizationUrl, siweMessage } from '@monerium/sdk';

// Express route: POST /login/siwe
app.post('/login/siwe', async (req, res) => {
  const { address, signature, chainId } = req.body;

  const codeVerifier = randomPKCECodeVerifier();
  const codeChallenge = calculatePKCECodeChallenge(codeVerifier);
  req.session.pkceVerifier = codeVerifier;

  const message = siweMessage({
    domain: 'your-app.com',
    address,
    uri: 'https://your-app.com',
    chainId,
  });

  const url = buildSiweAuthorizationUrl({
    environment: 'sandbox',
    clientId: process.env.MONERIUM_CLIENT_ID,
    redirectUri: 'https://your-app.com/callback',
    codeChallenge,
    message,
    signature,
  });

  res.redirect(url);
  // Token exchange on /callback is identical to Step 2
});
```

### Optional helpers

```ts
// parseAuthorizationResponse — optional pure helper
// Parses a callback URL or query string. No globals. No side effects. Never throws.
// Returns an empty object if none of the expected parameters are present.
// Check for the presence of `code` or `error` to determine if the URL is an OAuth2 callback.
parseAuthorizationResponse(input: string | URL): {
  code?: string;
  state?: string;
  error?: string;
  errorDescription?: string;
}
```

### Error handling

The SDK throws two distinct error types.

`MoneriumApiError` is thrown when the Monerium API returns a non-2xx response. The fields map directly to the API response body — nothing is translated or normalised.

`MoneriumSdkError` is thrown for failures that originate inside the SDK with no HTTP response involved.

```ts
// Thrown when the Monerium API returns a non-2xx response
class MoneriumApiError extends Error {
  code: number; // e.g. 400, 401
  status: string; // e.g. "Bad Request", "Unauthorized"
  // message — set to the API's message field
  errors?: Record<string, string>; // field-level validation errors
  details?: unknown;
}

// Thrown for SDK-level failures — no HTTP response involved
type MoneriumSdkErrorType =
  | 'network_error' // fetch failed (DNS, timeout, connection refused)
  | 'authentication_required' // authenticated endpoint called with no token
  | 'invalid_configuration'; // bad options passed to createMoneriumClient

class MoneriumSdkError extends Error {
  type: MoneriumSdkErrorType;
  cause?: unknown;
}
```

```ts
try {
  await client.getProfiles();
} catch (err) {
  if (err instanceof MoneriumApiError) {
    console.log(err.code); // 401
    console.log(err.status); // "Unauthorized"
    console.log(err.message); // "Not authenticated"
    console.log(err.errors); // field errors if present
  } else if (err instanceof MoneriumSdkError) {
    console.log(err.type); // 'network_error' | 'authentication_required' | ...
    console.log(err.cause); // underlying fetch error, if network_error
  }
}
```

### Naming convention

Function names follow [`openid-client`](https://github.com/panva/openid-client) conventions. Where the spec-faithful name is unfamiliar, a friendly alias is exported alongside it.

| Current name                            | New name(s)                                                 |
| --------------------------------------- | ----------------------------------------------------------- |
| `preparePKCEChallenge()`                | `randomPKCECodeVerifier()` + `calculatePKCECodeChallenge()` |
| `authorize()`                           | `buildAuthorizationUrl()`                                   |
| `siwe()`                                | `buildSiweAuthorizationUrl()`                               |
| `getAccess()` (auth code path)          | `authorizationCodeGrant()` / `exchangeAuthorizationCode()`  |
| `getAccess()` (refresh token path)      | `refreshTokenGrant()` / `refreshAccessToken()`              |
| `getAccess()` (client credentials path) | `clientCredentialsGrant()`                                  |
| `new MoneriumClient()`                  | `createMoneriumClient()`                                    |
| _(new)_                                 | `parseAuthorizationResponse()`                              |

### Removed from the public API

| Removed                                                                                                      | Reason                                           |
| ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------ |
| `ClassOptions`                                                                                               | Replaced by `MoneriumClientOptions`              |
| `AuthorizationCodeCredentials`                                                                               | Replaced by `AuthorizationCodeGrantOptions`      |
| `ClientCredentials`                                                                                          | Replaced by `ClientCredentialsGrantOptions`      |
| `BearerTokenCredentials`                                                                                     | No longer needed                                 |
| `AuthFlowOptions`                                                                                            | Replaced by `BuildAuthorizationUrlOptions`       |
| `AuthFlowSIWEOptions`                                                                                        | Replaced by `BuildSiweAuthorizationUrlOptions`   |
| `PKCERequest`, `PKCESIWERequest`, `PKCERequestShared`, `PKCERequestArgs`, `PKCERSIWERequestArgs`, `AuthArgs` | Internal types; were never useful public exports |
| `constants` (storage keys)                                                                                   | Removed alongside `localStorage` support         |

---

## Integration Examples

Three complete Node.js integration patterns covering the main use cases.

### OAuth — Authorization Code + PKCE (Node.js backend)

For apps where an end user authorises access to their Monerium account.

```ts
import express from 'express';
import {
  randomPKCECodeVerifier,
  calculatePKCECodeChallenge,
  buildAuthorizationUrl,
  authorizationCodeGrant,
  refreshTokenGrant,
  parseAuthorizationResponse,
  createMoneriumClient,
  MoneriumApiError,
} from '@monerium/sdk';
import { ethers } from 'ethers';

const app = express();

// 1. Initiate login
app.get('/login', (req, res) => {
  const codeVerifier = randomPKCECodeVerifier();
  req.session.pkceVerifier = codeVerifier;

  const url = buildAuthorizationUrl({
    environment: 'sandbox',
    clientId: process.env.MONERIUM_CLIENT_ID,
    redirectUri: 'https://your-app.com/callback',
    codeChallenge: calculatePKCECodeChallenge(codeVerifier),
  });

  res.redirect(url);
});

// 2. Handle callback and exchange code for tokens
app.get('/callback', async (req, res) => {
  const { code, error } = parseAuthorizationResponse(
    new URL(req.url, 'https://your-app.com')
  );

  if (error || !code) return res.status(400).json({ error });

  try {
    const profile = await authorizationCodeGrant({
      environment: 'sandbox',
      clientId: process.env.MONERIUM_CLIENT_ID,
      redirectUri: 'https://your-app.com/callback',
      code,
      codeVerifier: req.session.pkceVerifier,
    });

    delete req.session.pkceVerifier;
    req.session.accessToken = profile.access_token;
    req.session.refreshToken = profile.refresh_token;
    req.session.accessExpiry = Date.now() + profile.expires_in * 1000;

    res.redirect('/dashboard');
  } catch (err) {
    if (err instanceof MoneriumApiError) {
      res.status(err.code).json({ error: err.message });
    } else {
      throw err;
    }
  }
});

// 3. Build a per-request client with automatic token refresh
function buildClient(session) {
  return createMoneriumClient({
    environment: 'sandbox',
    getAccessToken: async () => {
      if (Date.now() > session.accessExpiry) {
        const refreshed = await refreshTokenGrant({
          environment: 'sandbox',
          clientId: process.env.MONERIUM_CLIENT_ID,
          refreshToken: session.refreshToken,
        });
        session.accessToken = refreshed.access_token;
        session.accessExpiry = Date.now() + refreshed.expires_in * 1000;
        return refreshed.access_token;
      }
      return session.accessToken;
    },
  });
}

// 4. Link an EOA wallet address
app.post('/link-wallet', async (req, res) => {
  const client = buildClient(req.session);
  const { address, privateKey } = req.body; // privateKey from your secure storage

  const wallet = new ethers.Wallet(privateKey);
  const message = `Link ${address} to Monerium`;
  const signature = await wallet.signMessage(message);

  await client.linkAddress({
    address,
    message,
    signature,
    chain: 'ethereum',
    accounts: [{ address, chain: 'ethereum', currency: 'EUR' }],
  });

  res.json({ linked: true });
});

// 5. Fetch IBANs
app.get('/ibans', async (req, res) => {
  const client = buildClient(req.session);
  const ibans = await client.getIbans();
  res.json(ibans);
});

// 6. Place a redeem order (outgoing SEPA payment)
app.post('/redeem', async (req, res) => {
  const client = buildClient(req.session);
  const { amount, iban, firstName, lastName } = req.body;

  const order = await client.placeOrder({
    kind: 'redeem',
    amount,
    currency: 'EUR',
    counterpart: {
      identifier: { standard: 'iban', iban },
      details: { firstName, lastName },
    },
    memo: 'SEPA payment',
  });

  res.json(order);
});
```

---

### Whitelabel — Customer Onboarding (Node.js, Client Credentials)

For platforms managing customer accounts on behalf of end users.

```ts
import {
  clientCredentialsGrant,
  createMoneriumClient,
  MoneriumApiError,
} from '@monerium/sdk';

// 1. Authenticate with client credentials
const { access_token } = await clientCredentialsGrant({
  environment: 'production',
  clientId: process.env.MONERIUM_CLIENT_ID,
  clientSecret: process.env.MONERIUM_CLIENT_SECRET,
});

const client = createMoneriumClient({
  environment: 'production',
  accessToken: access_token,
});

// 2. Customer onboarding: submit profile details
const context = await client.getAuthContext();
const profileId = context.profiles[0].id;

await client.submitProfileDetails(profileId, {
  personal: {
    firstName: 'Jane',
    lastName: 'Doe',
    birthday: '1990-01-01',
    nationality: 'IS',
    address: 'Borgartún 1',
    city: 'Reykjavík',
    postalCode: '105',
    country: 'IS',
    idDocument: { kind: 'passport', number: 'A1234567' },
  },
});

// 3. Link a wallet address
await client.linkAddress({
  address,
  message: 'I hereby declare that I am the address owner.',
  signature,
  chain: 'ethereum',
  accounts: [{ address, chain: 'ethereum', currency: 'EUR' }],
});

// 4. Request an IBAN
await client.requestIban({
  address: wallet.address,
  chain: 'ethereum',
  currency: 'EUR',
});

// 5. Place a redeem order
const order = await client.placeOrder({
  kind: 'redeem',
  amount: '100',
  currency: 'EUR',
  address,
  chain: 'ethereum',
  counterpart: {
    identifier: { standard: 'iban', iban: 'GB29NWBK60161331926819' },
    details: { firstName: 'John', lastName: 'Smith' },
  },
  memo: 'Invoice #1234',
});

console.log('Order placed:', order.id, order.state);
```

---

### Private — Direct Integration (Node.js, Client Credentials)

For direct server-to-server integrations with full control over accounts.

```ts
import {
  clientCredentialsGrant,
  createMoneriumClient,
  MoneriumApiError,
  MoneriumSdkError,
} from '@monerium/sdk';

// 1. Authenticate
const { access_token } = await clientCredentialsGrant({
  environment: 'production',
  clientId: process.env.MONERIUM_CLIENT_ID,
  clientSecret: process.env.MONERIUM_CLIENT_SECRET,
});

const client = createMoneriumClient({
  environment: 'production',
  accessToken: access_token,
});

// 2. Link a wallet address

await client.linkAddress({
  address,
  message: 'I hereby declare that I am the address owner.',
  signature,
  chain: 'polygon',
  accounts: [{ address, chain: 'ethereum', currency: 'EUR' }],
});

// 3. Request an IBAN
await client.requestIban({
  address,
  chain: 'ethereum',
  currency: 'EUR',
});

// 4. Place a redeem order with error handling
try {
  const order = await client.placeOrder({
    kind: 'redeem',
    amount: '250',
    currency: 'EUR',
    address,
    chain: 'ethereum',
    counterpart: {
      identifier: { standard: 'iban', iban: 'DE89370400440532013000' },
      details: { firstName: 'Max', lastName: 'Mustermann' },
    },
    memo: 'Settlement',
  });

  console.log('Order placed:', order.id);
} catch (err) {
  if (err instanceof MoneriumApiError) {
    console.error(`API error ${err.code}: ${err.message}`, err.errors);
  } else if (err instanceof MoneriumSdkError) {
    console.error(`SDK error (${err.type}):`, err.cause ?? err.message);
  } else {
    throw err;
  }
}
```

---

## Alternatives Considered

### Storage adapter pattern (rejected)

A StorageAdapter option in createMoneriumClient to handle token persistence automatically while still allowing custom backends (React Native AsyncStorage, Cloudflare KV, etc.). This was rejected because:

It reintroduces hidden side effects (the SDK writing to storage)

Adapters would need to handle sync/async variants, increasing API surface

The getAccessToken callback already provides a clean inversion of control and is strictly more powerful and explicit.

---

## Trade-offs and Risks

The primary trade-off is deliberate: the SDK no longer manages PKCE state, token storage, URL parsing, or navigation. Consumers who previously called `authorize()` and `getAccess()` and had it "just work" now need to wire up a few more explicit steps. This is the point. The SDK cannot make those decisions correctly for all environments, so it returns the primitives and lets the caller decide.

---

## Rollout and Migration

### Phase 1 — v3.x (source-compatible deprecation release)

All new exports are added alongside the old ones. Old names receive `@deprecated` JSDoc tags so TypeScript consumers see IDE strikethrough warnings without any configuration. No old names are removed. All legacy `localStorage` and `window.location` code is isolated in `src/compat.ts`. Consumers can migrate at their own pace.

Deprecated wrappers preserve existing v3 behaviour while delegating internally to the new primitives where possible. From the caller's perspective nothing changes:

- `authorize()` and `siwe()` still redirect — the wrapper calls `window.location.assign` internally
- `preparePKCEChallenge()` still writes to `localStorage` — the wrapper handles this internally as before
- `getAccess()` still reads from `localStorage` and parses `window.location.search` — the wrapper continues to do this

**Deprecation timeline**

| Name                                 | Deprecated in | Removed in | Replacement                                                                     |
| ------------------------------------ | ------------- | ---------- | ------------------------------------------------------------------------------- |
| `preparePKCEChallenge()`             | v3.x          | v4.0       | `randomPKCECodeVerifier()` + `calculatePKCECodeChallenge()`                     |
| `authorize()`                        | v3.x          | v4.0       | `buildAuthorizationUrl()`                                                       |
| `siwe()`                             | v3.x          | v4.0       | `buildSiweAuthorizationUrl()`                                                   |
| `getAccess()`                        | v3.x          | v4.0       | `authorizationCodeGrant()` / `refreshTokenGrant()` / `clientCredentialsGrant()` |
| `disconnect()`                       | v3.x          | v4.0       | _(none — caller manages state)_                                                 |
| `revokeAccess()`                     | v3.x          | v4.0       | _(none — caller manages storage)_                                               |
| `subscribeOrderNotifications()`      | v3.x          | v4.0       | _(none — use webhooks instead - not in scope)_                                  |
| `unsubscribeOrderNotifications()`    | v3.x          | v4.0       | _(none — use webhooks instead - not in scope)_                                  |
| `ClassOptions`                       | v3.x          | v4.0       | `MoneriumClientOptions`                                                         |
| `AuthFlowOptions`                    | v3.x          | v4.0       | `BuildAuthorizationUrlOptions`                                                  |
| `AuthFlowSIWEOptions`                | v3.x          | v4.0       | `BuildSiweAuthorizationUrlOptions`                                              |
| `AuthorizationCodeCredentials`       | v3.x          | v4.0       | `AuthorizationCodeGrantOptions`                                                 |
| `ClientCredentials`                  | v3.x          | v4.0       | `ClientCredentialsGrantOptions`                                                 |
| `MoneriumClient` (class constructor) | v3.x          | v4.0       | `createMoneriumClient()`                                                        |

### Phase 2 — v4.0 (breaking, clean removal)

`src/compat.ts` is deleted. All deprecated names are removed. `CHANGELOG.md` documents every removed name with a before/after migration snippet. `README.md` is rewritten with `createMoneriumClient` and `getAccessToken` as the primary examples.

### Before/after migration snapshot

**Before (current v3 API)**

```ts
import { MoneriumClient } from '@monerium/sdk';

const monerium = new MoneriumClient({
  environment: 'sandbox',
  clientId: 'your-client-id',
  redirectUri: 'https://your-app.com/callback',
});

await monerium.authorize(); // redirects internally, writes to localStorage
await monerium.getAccess(); // reads window.location.search and localStorage

await monerium.disconnect(); // clears localStorage
```

**After (v4 API)**

```ts
import {
  randomPKCECodeVerifier,
  calculatePKCECodeChallenge,
  buildAuthorizationUrl,
  authorizationCodeGrant,
  refreshTokenGrant,
  createMoneriumClient,
} from '@monerium/sdk';

// --- Initiate login ---
const codeVerifier = randomPKCECodeVerifier();
const codeChallenge = calculatePKCECodeChallenge(codeVerifier);
session.set('pkce_verifier', codeVerifier); // server-side session

const url = buildAuthorizationUrl({
  environment: 'sandbox',
  clientId: 'your-client-id',
  redirectUri: 'https://your-app.com/callback',
  codeChallenge,
});
res.redirect(url);

// --- On the callback page ---
const { code } = parseAuthorizationResponse(
  new URL(req.url, 'https://your-app.com')
);
const codeVerifier = session.get('pkce_verifier');
session.delete('pkce_verifier');

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

// --- Use the API ---
const client = createMoneriumClient({
  environment: 'sandbox',
  getAccessToken: async () => {
    if (Date.now() > session.accessExpiry) {
      const newProfile = await refreshTokenGrant({
        environment: 'sandbox',
        clientId: 'your-client-id',
        refreshToken: session.refreshToken,
      });
      session.accessToken = newProfile.access_token;
      session.accessExpiry = Date.now() + newProfile.expires_in * 1000;
      return newProfile.access_token;
    }
    return session.accessToken;
  },
});

const profiles = await client.getProfiles();
```

---

## Security Considerations

### `clientSecret` is removed from the client constructor

OAuth2 defines two distinct client types that must never be mixed:

- **Public client:** `clientId` + `redirectUri`
- **Confidential client:** `clientId` + `clientSecret`

Both flows use `clientId`, but only the confidential flow uses `clientSecret`. The old `MoneriumClient` accepted `clientSecret` in the same constructor used for browser OAuth flows. This made it easy to accidentally configure a browser client with a `clientSecret` and have it silently included in a client-side JavaScript bundle.

In the new design, `clientSecret` only ever appears in `clientCredentialsGrant({ clientId, clientSecret })` — a standalone function whose name and placement make the server-only intent explicit. `createMoneriumClient()` never accepts `clientSecret`; it only accepts an access token (via `accessToken` or `getAccessToken`). The boundary between the two client types is now enforced at the API surface, not just in documentation.

### `getAccessToken` enables the Backend For Frontend pattern

Because the client calls `getAccessToken` before every request, the callback can proxy token fetching through a secure backend endpoint.
The SDK will no longer force raw tokens to reach browser-accessible storage.

### Token material is never logged or persisted by the SDK

No token, verifier, or credential touches any storage, logger, or network call inside the SDK itself. Everything is passed through function parameters and return values.

---

## Open Questions

_None at this time._

---

## References

- [`openid-client` (panva)](https://github.com/panva/openid-client) — Naming conventions adopted directly; fully stateless OAuth2/PKCE reference implementation
- [Google Auth Library](https://github.com/googleapis/google-auth-library-nodejs) — `refreshHandler` callback pattern
- [Azure Identity SDK](https://github.com/Azure/azure-sdk-for-js) — `TokenCredential.getToken(scopes)` interface
- [MSAL Browser](https://github.com/AzureAD/microsoft-authentication-library-for-js) — `acquireTokenSilent()` and request deduplication
- [`auth0-spa-js`](https://github.com/auth0/auth0-spa-js) — `ICache` storage interface; separation of URL building and token exchange
- [`@supabase/gotrue-js`](https://github.com/supabase/gotrue-js) — `SupportedStorage` type for sync/async storage adapters
- [Stripe API Errors](https://docs.stripe.com/api/errors) — reference for error object design; informed the two-class `MoneriumApiError` / `MoneriumSdkError` approach
- RFC-storage-adapter.md — Prior Monerium RFC; superseded by this document
- RFC-sdk-redesign.md — Extended working document with full API surface, type definitions, deprecation timeline, acceptance criteria, and decisions log

---

## Decision / Outcome

_To be filled after review._
