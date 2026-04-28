| [Monerium.com](https://monerium.com/) | [Monerium.app](https://monerium.app/) | [Monerium Dev Docs](https://docs.monerium.com/) |
| ------------------------------------- | ------------------------------------- | ----------------------------------------------- |

# Monerium SDK Documentation

  <a href="https://docs.monerium.com">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/Developer_portal-2c6ca7"/>
      <img src="https://img.shields.io/badge/Developer_portal-2c6ca7" alt="Static Badge"/>
    </picture>
  </a>
  <a href="https://docs.monerium.com/api">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/API_documentation-2c6ca7"/>
      <img src="https://img.shields.io/badge/API_documentation-2c6ca7" alt="Static Badge"/>
    </picture>
  </a>
  <br/><br/>
    <a href="https://www.npmjs.com/package/@monerium/sdk">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/npm/v/%40monerium%2Fsdk?colorA=2c6ca7&colorB=21262d"/>
      <img src="https://img.shields.io/npm/v/%40monerium%2Fsdk?colorA=f6f8fa&colorB=f6f8fa" alt="Version"/>
    </picture>
  </a>
  <a href="https://github.com/monerium/js-monorepo/issues">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/github/issues/monerium/js-monorepo?colorA=2c6ca7&colorB=21262d"/>
      <img src="https://img.shields.io/github/issues/monerium/js-monorepo?colorA=2c6ca7&colorB=21262d" alt="Version"/>
    </picture>
  </a>

## Introduction

Monerium connects your web3 wallet to any euro bank account with your personal IBAN.
All incoming euro payments are automatically minted as EURe tokens to your wallet.
Sending EURe to traditional bank accounts is just as easy.
With a single signature from your wallet, your EURe is burned and sent as Euros to any bank account.

## Installation

```sh
pnpm add @monerium/sdk
```

## Usage Patterns

The Monerium SDK supports three primary integration patterns.

### 1. OAuth Integration (User-authorized)

_Best for apps where users authorize your application via the Monerium portal._

```ts
import {
  createMoneriumAuthClient,
  generatePKCE,
  parseAuthorizationResponse,
} from '@monerium/sdk';

const auth = createMoneriumAuthClient({ environment: 'sandbox' });

// --- 1. Initiate login (Server-side route) ---
const { codeVerifier, codeChallenge } = generatePKCE();
// Store the verifier in a secure, server-side session or cookie
session.set('pkce_verifier', codeVerifier);

const url = auth.buildAuthorizationUrl({
  clientId: 'your-client-id',
  redirectUri: 'https://your-app.com/callback',
  codeChallenge,
});
// Redirect user to the returned URL...

// --- 2. Handle callback (Server-side route) ---
const { code } = auth.parseAuthorizationResponse(req.url);
const storedVerifier = session.get('pkce_verifier');
session.delete('pkce_verifier');

const bearerProfile = await auth.authorizationCodeGrant({
  clientId: 'your-client-id',
  redirectUri: 'https://your-app.com/callback',
  code,
  codeVerifier: storedVerifier,
});
```

### 2. Whitelabel / Private Integration (System-to-System)

_Best for server-side apps that manage the full user lifecycle or interact with a single private account._

```ts
import { createMoneriumAuthClient } from '@monerium/sdk';

const auth = createMoneriumAuthClient({ environment: 'production' });

const bearerProfile = await auth.clientCredentialsGrant({
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
});
```

### 3. Custom Transport

_Inject custom logic (retries, logging, proxies) by replacing the default fetch implementation._

```ts
import { createMoneriumApiClient } from '@monerium/sdk';

const api = createMoneriumApiClient({
  environment: 'sandbox',
  accessToken: '...',
  transport: async ({ method, url, headers, body }) => {
    console.log(`Calling ${method} ${url}`);
    const res = await fetch(url, { method, headers, body });
    return { status: res.status, bodyText: await res.text() };
  },
});
```

### 4. Making API Calls

Once you have an access token, use the `MoneriumApiClient`.

```ts
import { createMoneriumApiClient } from '@monerium/sdk';

// RECOMMENDED: Automatic token management for server-side apps
const api = createMoneriumApiClient({
  environment: 'sandbox',
  getAccessToken: async () => {
    // Logic to retrieve token from DB/session.
    // If expired, use auth.refreshTokenGrant() before returning.
    return myTokenService.getValidToken();
  },
});

// Common Tasks
const profiles = await api.getProfiles();
const ibans = await api.getIbans();
```

---

## Core Tasks

#### Linking a Wallet

Linking requires a cryptographic proof of ownership: the customer signs a fixed message and your app submits the signature.

```ts
await api.linkAddress({
  address: '0x...',
  signature: '0x...', // Signature of "I hereby declare that I am the address owner."
  chain: 'polygon',
});
```

#### Placing a Redeem Order (Outgoing SEPA)

```ts
await api.placeOrder({
  amount: '100.00',
  currency: 'eur',
  address: '0x...', // User's linked wallet address
  counterpart: {
    identifier: { standard: 'iban', iban: 'EE...' },
    details: { firstName: 'Jane', lastName: 'Doe' },
  },
  message: '...', // Signed message
  signature: '0x...',
  chain: 'polygon',
});
```

## API Reference

[API Documentation](https://docs.monerium.com/api)

## Contributing

We are using PNPM as a package manager and [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) standard.

#### Build

```
pnpm build
```

#### Test

```
pnpm test
```

## Support

[Support](https://monerium.app/help) | [Github Issues](https://github.com/monerium/js-monorepo/issues)
