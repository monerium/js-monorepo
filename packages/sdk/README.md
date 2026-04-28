| [Monerium.com](https://monerium.com/) | [Monerium.app](https://monerium.app/) | [Monerium Dev Docs](https://docs.monerium.com/) |
| ------------------------------------- | ------------------------------------- | ----------------------------------------------- |

# Monerium SDK Documentation

  <a href="https://docs.monerium.com">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/Developer_portal-2c6ca7"></source>
      <img src="https://img.shields.io/badge/Developer_portal-2c6ca7" alt="Static Badge"></img>
    </picture>
  </a>
  <a href="https://docs.monerium.com/api">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/API_documentation-2c6ca7"></source>
      <img src="https://img.shields.io/badge/API_documentation-2c6ca7" alt="Static Badge"></img>
    </picture>
  </a>
  <br></br>
    <a href="https://www.npmjs.com/package/@monerium/sdk">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/npm/v/%40monerium%2Fsdk?colorA=2c6ca7&colorB=21262d"></source>
      <img src="https://img.shields.io/npm/v/%40monerium%2Fsdk?colorA=f6f8fa&colorB=f6f8fa" alt="Version"></img>
    </picture>
  </a>
  <a href="https://github.com/monerium/js-monorepo/issues">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/Issues-2c6ca7" alt="Issues"></img>
    </picture>
  </a>

## Introduction

Monerium connects your web3 wallet to any euro bank account with your personal IBAN.
All incoming euro payments are automatically minted as EURe tokens to your wallet.
Sending EURe to traditional bank accounts is just as easy.
With a single signature from your wallet, your EURe is burned and sent as Euros to any bank account.

## Documentation

- [SDK Reference](https://monerium.github.io/js-monorepo/)

## Installation

```sh
pnpm add @monerium/sdk
```

## Usage Patterns

The Monerium SDK supports three primary integration patterns:

### 1. OAuth Integration (User-authorized)
*Best for apps where users authorize your application via the Monerium portal.*

```ts
import { createMoneriumAuthClient, generatePKCE } from '@monerium/sdk';

const auth = createMoneriumAuthClient({ environment: 'sandbox' });

// Get tokens via Authorization Code + PKCE (Backend-only to avoid CORS)
const { codeVerifier, codeChallenge } = generatePKCE();
const url = auth.buildAuthorizationUrl({ 
  clientId: '...', 
  redirectUri: '...', 
  codeChallenge 
});

// ... after callback ...
const { code } = auth.parseAuthorizationResponse(req.url);
const tokens = await auth.authorizationCodeGrant({ 
  code, 
  codeVerifier, 
  clientId: '...', 
  redirectUri: '...' 
});
```

### 2. Whitelabel / Private Integration (System-to-System)
*Best for apps that manage the full user lifecycle or interact with a single private account.*

```ts
import { createMoneriumAuthClient } from '@monerium/sdk';

const auth = createMoneriumAuthClient({ environment: 'production' });

const tokens = await auth.clientCredentialsGrant({
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
});
```

### 3. Making API Calls
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
  }
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
  chain: 'polygon'
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
    details: { firstName: 'Jane', lastName: 'Doe' }
  },
  message: '...', // Signed message
  signature: '0x...',
  chain: 'polygon'
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

[Support](https://monerium.app/help) | [Telegram](https://t.me/+lGtM1gY9zWthNGE8) | [Github Issues](https://github.com/monerium/js-monorepo/issues)
