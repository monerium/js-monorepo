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

This section demonstrates how to use the plan-specific client classes (`MoneriumPrivateClient`, `MoneriumWhitelabelClient`, and `MoneriumOAuthClient`) for the integration flows.

### 1. Private Plan

[Read the Private Integration Guide](https://docs.monerium.com/private)

The Private plan gives you direct API access to your own Monerium account. 
You use `MoneriumPrivateClient` for Server-to-Server communication.

Instead of manually passing static access tokens, the recommended approach is to provide a `getAccessToken` callback. This allows the client to dynamically retrieve, cache, and refresh tokens seamlessly across all requests using a single global client instance.

```typescript
import { MoneriumPrivateClient, Currency } from '@monerium/sdk';

// 1. Initialize the client ONCE globally
const client: MoneriumPrivateClient = new MoneriumPrivateClient({
  environment: 'sandbox',
  getAccessToken: async () => {
    // a. Check in-memory cache
    let token = memoryCache.get('monerium_token');
    
    // b. Fallback to Database
    if (!token) {
      token = await db.getToken();
      if (token) memoryCache.set('monerium_token', token);
    }

    // c. If token is missing or expired, fetch a new one
    if (!token || isExpired(token)) {
      // clientCredentialsGrant does not require authentication
      const auth = await client.clientCredentialsGrant('YOUR_CLIENT_ID', 'YOUR_CLIENT_SECRET');
      token = auth.access_token;
      
      memoryCache.set('monerium_token', token);
      await db.saveToken(token);
    }
    
    return token;
  }
});

// 2. Set up Webhooks (One-off initialization)
async function setupWebhooks() {
  const { subscriptions } = await client.getSubscriptions();
  const webhookUrl = 'https://your-app.com/webhooks/monerium';
  
  if (!subscriptions.some(sub => sub.url === webhookUrl)) {
    await client.createSubscription({
      url: webhookUrl,
      secret: 'whsec_YOUR_BASE64_ENCODED_SECRET',
      types: ['order.created', 'order.updated']
    });
  }
}

async function runPrivateFlow() {
  // 3. Link a Wallet
  const { addresses } = await client.getAddresses();
  if (!addresses.some(a => a.address === '0xYourAddress...')) {
    await client.linkAddress({
      address: '0xYourAddress...',
      message: 'I hereby declare that I am the address owner.',
      signature: '0xYourSignature...',
      chain: 'ethereum'
    });
  }

  // 4. Send payments (Place an Order)
  // Check if profile and IBAN are approved before placing an order
  const profiles = await client.getProfiles();
  const defaultProfile = profiles.profiles[0];
  const { ibans } = await client.getIbans();
  const activeIban = ibans.find(i => i.state === 'approved');
  
  if (defaultProfile?.state === 'approved' && activeIban) {
    await client.placeOrder({
      address: '0xYourAddress...',
      chain: 'ethereum',
      amount: '100.00',
      signature: '0xYourSignature...',
      currency: Currency.eur,
      counterpart: {
        identifier: {
          standard: 'iban',
          iban: 'YOUR_IBAN',
          bic: 'YOUR_BIC'
        },
        details: {
          firstName: 'John',
          lastName: 'Doe',
          country: 'IS'
        }
      },
      message: 'Payment for services'
    });
  }
}

// 5. Handle Webhooks (e.g., in your Express route)
async function handleMoneriumWebhook(event: any) {
  // Automatically provision IBAN when the profile is approved
  if (event.type === 'profile.updated' && event.meta?.state === 'approved') {
    const { ibans } = await client.getIbans();

    if (ibans.length > 0) {
      if (!ibans.some(i => i.address === '0xYourAddress...' && i.chain === 'ethereum')) {
        await client.moveIban({
          iban: ibans[0].iban,
          address: '0xYourAddress...',
          chain: 'ethereum'
        });
      }
    } else {
      await client.requestIban({
        address: '0xYourAddress...',
        chain: 'ethereum'
      });
    }
  }

  if (event.type === 'order.updated') {
    console.log('Order status changed:', event.meta?.state);
  }
}
```

### 2. Whitelabel Plan

[Read the Whitelabel Integration Guide](https://docs.monerium.com/whitelabel)

Embed regulated euro accounts and SEPA payments in your product under your own brand. 
You use `MoneriumWhitelabelClient` to manage profiles on behalf of your customers.

Similar to the Private plan, use the `getAccessToken` pattern for efficient, secure server-to-server authentication.

```typescript
import { MoneriumWhitelabelClient } from '@monerium/sdk';

// 1. Initialize the client ONCE globally
const client: MoneriumWhitelabelClient = new MoneriumWhitelabelClient({
  environment: 'sandbox',
  getAccessToken: async () => {
    let token = memoryCache.get('monerium_token');
    
    if (!token) {
      token = await db.getToken();
      if (token) memoryCache.set('monerium_token', token);
    }

    if (!token || isExpired(token)) {
      const auth = await client.clientCredentialsGrant('YOUR_CLIENT_ID', 'YOUR_CLIENT_SECRET');
      token = auth.access_token;
      
      memoryCache.set('monerium_token', token);
      await db.saveToken(token);
    }
    
    return token;
  }
});

// 2. Set up Webhooks (One-off initialization, listen for profile approvals)
async function setupWebhooks() {
  const { subscriptions } = await client.getSubscriptions();
  const webhookUrl = 'https://your-app.com/webhooks/monerium';
  
  if (!subscriptions.some(sub => sub.url === webhookUrl)) {
    await client.createSubscription({
      url: webhookUrl,
      secret: 'whsec_YOUR_BASE64_ENCODED_SECRET',
      types: ['profile.updated', 'iban.updated', 'order.created', 'order.updated']
    });
  }
}

async function runWhitelabelFlow() {
  // 3. Onboard the customer (Create a Profile)
  const profile = await client.createProfile({
    kind: 'personal'
  });

  // 4. Submit identity data (e.g., via Sumsub integration)
  // await client.shareProfileKYC({ ... });

  // 5. Link a Wallet
  const { addresses } = await client.getAddresses({ profile: profile.id });
  if (!addresses.some(a => a.address === '0xCustomerAddress...')) {
    await client.linkAddress({
      profile: profile.id,
      address: '0xCustomerAddress...',
      message: 'I hereby declare that I am the address owner.',
      signature: '0xCustomerSignature...',
      chain: 'polygon'
    });
  }

  // 6. Send/Receive Payments
  // Check if profile and IBAN are approved before interacting
  const currentProfile = await client.getProfile(profile.id);
  const { ibans } = await client.getIbans({ profile: profile.id });
  const activeIban = ibans.find(i => i.state === 'approved');

  if (currentProfile.state === 'approved' && activeIban) {
    // Monerium handles incoming SEPA payments automatically once the IBAN is active.
    // You can also place outgoing orders here using client.placeOrder()
  }
}

// 7. Handle Webhooks (e.g., in your Express route)
async function handleMoneriumWebhook(event: any) {
  // Automatically provision IBAN when the profile is approved
  if (event.type === 'profile.updated' && event.meta?.state === 'approved') {
    const profileId = event.meta?.profile;
    const { ibans } = await client.getIbans({ profile: profileId });

    if (ibans.length > 0) {
      if (!ibans.some(i => i.address === '0xCustomerAddress...' && i.chain === 'polygon')) {
        await client.moveIban({
          iban: ibans[0].iban,
          address: '0xCustomerAddress...',
          chain: 'polygon'
        });
      }
    } else {
      await client.requestIban({
        address: '0xCustomerAddress...',
        chain: 'polygon'
      });
    }
  }

  if (event.type === 'iban.updated') {
    console.log('IBAN state changed for profile:', event.meta?.profile);
  }
}
```

### 3. OAuth Plan

[Read the OAuth Integration Guide](https://docs.monerium.com/oauth)

The OAuth flow lets users authorize your application to access their Monerium account. 
You use `MoneriumOAuthClient` as it is safe for both browser and server environments (it does not contain `clientCredentialsGrant`).

When managing multiple users, you can also use `getAccessToken` to fetch the specific user's token from your database and refresh it automatically via `refreshTokenGrant` if it expires.

```typescript
import { MoneriumOAuthClient, generatePKCE } from '@monerium/sdk';

// 1. Initialize the client (Browser or Server)
const client: MoneriumOAuthClient = new MoneriumOAuthClient({
  environment: 'sandbox',
  getAccessToken: async () => {
    // Fetch the authenticated user's access token from your database/session
    let { accessToken, refreshToken, expiresAt } = await db.getUserTokens(userId);

    // If expired, refresh it automatically using the OAuth client
    if (Date.now() >= expiresAt) {
      const auth = await client.refreshTokenGrant({
        clientId: 'YOUR_CLIENT_ID',
        refreshToken: refreshToken
      });

      accessToken = auth.access_token;
      await db.saveUserTokens(userId, auth);
    }

    return accessToken;
  }
});

// --- Server or Client: Initiate login ---
async function initiateAuth() {
  const { codeChallenge, codeVerifier } = generatePKCE();
  // Store `codeVerifier` in a secure, server-side session or cookie
  // session.set('pkce_verifier', codeVerifier);

  const authUrl = client.buildAuthorizationUrl({
    clientId: 'YOUR_CLIENT_ID',
    redirectUri: 'https://your-app.com/callback',
    codeChallenge: codeChallenge,
    state: 'random_state_string'
  });
  
  // Redirect user to the returned URL...
  // (e.g., `window.location.assign(authUrl)` on the client, or `redirect(authUrl)` on the server)
}

// --- Server: Handle Callback ---
// Exchanging the code requires a secure backend endpoint
async function handleAuthCallback(requestUrl: string) {
  // 1. Parse Authorization Response
  const { code } = client.parseAuthorizationResponse(requestUrl);

  // 2. Retrieve the stored verifier
  // const storedVerifier = session.get('pkce_verifier');

  // 3. Exchange code for tokens
  const tokens = await client.authorizationCodeGrant({
    clientId: 'YOUR_CLIENT_ID',
    redirectUri: 'https://your-app.com/callback',
    code: code!,
    codeVerifier: 'STORED_CODE_VERIFIER'
  });

  // 4. Save `tokens` to your database associated with the user
  await db.saveUserTokens(userId, tokens);
}

async function runOAuthUserFlow() {
  // 5. Link a Wallet
  const { addresses } = await client.getAddresses();
  if (!addresses.some(a => a.address === '0xUserAddress...')) {
    await client.linkAddress({
      address: '0xUserAddress...',
      message: 'I hereby declare that I am the address owner.',
      signature: '0xUserSignature...',
      chain: 'arbitrum'
    });
  }

  // 6. Check if Profile & IBAN are approved
  const profiles = await client.getProfiles();
  const defaultProfile = profiles.profiles[0];
  const { ibans } = await client.getIbans();
  const activeIban = ibans.find(i => i.state === 'approved');
  
  if (defaultProfile?.state === 'approved' && activeIban) {
    // 7. Get user's balances
    const balances = await client.getBalances({
      address: '0xUserAddress...',
      chain: 'arbitrum'
    });
    
    console.log(balances);

    // You can also place orders here safely!
  } else if (defaultProfile?.state === 'approved' && !activeIban) {
    // Automatically issue/move the IBAN if the profile is approved but the IBAN is not ready
    if (ibans.length > 0) {
      if (!ibans.some(i => i.address === '0xUserAddress...' && i.chain === 'arbitrum')) {
        await client.moveIban({
          iban: ibans[0].iban,
          address: '0xUserAddress...',
          chain: 'arbitrum'
        });
      }
    } else {
      await client.requestIban({
        address: '0xUserAddress...',
        chain: 'arbitrum'
      });
    }
  }
}
```

### 4. Custom Transport

_Inject custom logic (retries, logging, proxies) by replacing the default fetch implementation._

```ts
import { MoneriumOAuthClient } from '@monerium/sdk';

const api = new MoneriumOAuthClient({
  environment: 'sandbox',
  getAccessToken: async () => '...',
  transport: async ({ method, url, headers, body }) => {
    console.log(`Calling ${method} ${url}`);
    const res = await fetch(url, { method, headers, body });
    return { status: res.status, bodyText: await res.text() };
  },
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
