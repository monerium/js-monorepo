# RFC: Splitting API Clients by Integration Pattern

## Context

Currently, the Monerium SDK exposes two primary client factories: `createMoneriumAuthClient` and `createMoneriumApiClient`. The `MoneriumApiClient` includes every available REST API endpoint (e.g., `createProfile`, `placeOrder`, `getBalances`).

However, Monerium supports three distinctly different integration patterns, each with its own authorization mechanism and restricted set of capabilities:

1. **OAuth** (`oauth.mdx`)
2. **Private** (`private.mdx`)
3. **Whitelabel** (`whitelabel.mdx`)

## The Problem

Exposing a monolithic `MoneriumApiClient` leads to a poor Developer Experience (DX) and potential runtime errors.

- An **OAuth** application authenticates via PKCE/Authorization Code but cannot access system-level endpoints. If an OAuth developer calls `client.createProfile()`, it will fail, despite TypeScript suggesting it is a valid method.
- A **Private** application authenticates via Client Credentials to manage its _own_ account. It does not onboard customers, so exposing profile creation/KYC methods is misleading.
- A **Whitelabel** application authenticates via Client Credentials to manage _external_ users, requiring full access to profile creation, KYC, and webhook provisioning, but does not need OAuth redirect URL builders.

## Proposed Architecture

We should replace (or deprecate) the generic `MoneriumApiClient` and `MoneriumAuthClient` with three focused, integration-specific clients.

By doing this, we leverage TypeScript to enforce the business logic and authorization scopes of each integration type at compile time.

### 1. OAuth Client (`createOAuthClient`)

Designed for consumer-facing dApps where users authorize the application via the Monerium portal.

**Auth Capabilities:**

- URL Builders (`buildAuthorizationUrl`, `buildSiweAuthorizationUrl`)
- Grants (`authorizationCodeGrant`, `refreshTokenGrant`)
- Callback parsing (`parseAuthorizationResponse`)
- _Excluded:_ `clientCredentialsGrant`

**API Capabilities:**

- Read operations (`getProfile`, `getBalances`, `getOrders`, `getIbans`, `getTokens`, `getSignatures`)
- User actions (`placeOrder`, `linkAddress`, `requestIban`, `moveIban`)
- _Excluded:_ `createProfile`, `shareProfileKYC`, `updateProfileDetails`, `updateProfileForm`, `updateProfileVerifications`

### 2. Private Client (`createPrivateClient`)

Designed for internal backends or scripts managing a single, pre-approved Monerium corporate/personal account.

**Auth Capabilities:**

- Grants (`clientCredentialsGrant`)
- _Excluded:_ OAuth URL builders, PKCE generation, Authorization Code grants.

**API Capabilities:**

- Account management (`getBalances`, `linkAddress`, `requestIban`, `moveIban`)
- Order execution (`placeOrder`, `getOrders`)
- _Excluded:_ Profile onboarding (`createProfile`, `shareProfileKYC`, etc.)

### 3. Whitelabel Client (`createWhitelabelClient`)

Designed for enterprise partners embedding Monerium accounts directly into their infrastructure.

**Auth Capabilities:**

- Grants (`clientCredentialsGrant`)
- _Excluded:_ OAuth URL builders, PKCE generation, Authorization Code grants.

**API Capabilities:**

- Full system-to-system profile management (`createProfile`, `shareProfileKYC`, `updateProfileDetails`, `updateProfileForm`, `updateProfileVerifications`)
- Full programmatic account management (`linkAddress`, `requestIban`, `moveIban`, `placeOrder`)
- Webhooks management (if/when added to SDK)

## Implementation Plan

1. **Retain Standalone Functions:**
   The standalone functions in `src/client.ts` (e.g., `export async function getProfile(...)`) and `src/auth.ts` will remain completely unchanged. They act as our modular, tree-shakable building blocks.

2. **Create New Factories:**
   Create three new factory functions mapping only the allowed standalone functions to the returned object:

   ```ts
   export function createOAuthClient(options: OAuthClientOptions): OAuthClient { ... }
   export function createPrivateClient(options: PrivateClientOptions): PrivateClient { ... }
   export function createWhitelabelClient(options: WhitelabelClientOptions): WhitelabelClient { ... }
   ```

3. **Refactor Options Types:**
   Currently `MoneriumApiClientOptions` uses discriminated unions to guess the auth type.
   - `OAuthClientOptions` will expect `getAccessToken` / `accessToken`.
   - `PrivateClientOptions` and `WhitelabelClientOptions` could optionally accept `clientId` and `clientSecret` to handle `client_credentials` rotation under the hood automatically.

4. **Deprecation Strategy:**
   Deprecate `createMoneriumApiClient` and `createMoneriumAuthClient` with a `@deprecated` JSDoc tag pointing developers to the new, specific factories. Remove them in the next major version.

## Benefits

- **Intellisense as Documentation:** Developers type `client.` and only see endpoints their specific API credentials are permitted to use.
- **Safer Types:** Prevents accidental usage of `clientCredentialsGrant` in browser environments (which would leak the secret) by keeping it out of the `OAuthClient`.
- **1:1 Mental Model:** The SDK directly mirrors the documentation structure on `docs.monerium.com`.

## Examples

### OAuth Example

In a generic Node.js backend, the OAuth client seamlessly integrates with a database (like SQLite) using the `getAccessToken` callback:

```ts
import { createOAuthClient } from '@monerium/sdk';
import db from './db'; // Example SQLite instance

// 1. OAuth Callback Route
app.get('/callback', async (req, res) => {
  const auth = createOAuthClient({ environment: 'sandbox' });

  // Exchange code
  const session = await auth.authorizationCodeGrant({
    clientId: '...',
    redirectUri: '...',
    code: req.query.code as string,
    codeVerifier: req.session.codeVerifier,
  });

  // Store token in SQLite
  await db.run('UPDATE users SET access_token = ? WHERE id = ?', [
    session.access_token,
    req.session.userId,
  ]);

  res.redirect('/dashboard');
});

// 2. API Route
app.get('/api/balances', async (req, res) => {
  // Initialize with a dynamic token getter (no stateful classes!)
  const api = createOAuthClient({
    environment: 'sandbox',
    getAccessToken: async () => {
      const row = await getAccessTokenFromDb(req.session.userId),
      ]);
      return row.access_token;
    },
  });

  // Call the API (Token is fetched dynamically on demand)
  const balances = await api.getBalances({
    address: '0x...',
    chain: 'ethereum',
  });
  // api.createProfile(...) // TS Error: Property 'createProfile' does not exist on OAuthClient

  res.json(balances);
});
```

### Private Example

```ts
import { createPrivateClient } from '@monerium/sdk';

// 1. Initialize for the backend (uses secret)
// The SDK could automatically manage the Client Credentials token lifecycle under the hood.
const private = createPrivateClient({
  environment: 'production',
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
});

// 2. Directly access API (no OAuth flows)
const orders = await private.getOrders();
const ibans = await private.getIbans();
```

### Whitelabel Example

```ts
import { createWhitelabelClient } from '@monerium/sdk';

const whitelabel = createWhitelabelClient({
  environment: 'sandbox',
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
});

// 1. Access system-to-system onboarding endpoints
const profile = await whitelabel.createProfile({
  kind: 'personal',
  // ...
});

await whitelabel.updateProfileDetails({
  profile: profile.id,
  personal: {
    /* ... */
  },
});
```
