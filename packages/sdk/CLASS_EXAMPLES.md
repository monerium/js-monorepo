# Monerium SDK Class Examples

This document demonstrates how to use the plan-specific client classes (`MoneriumPrivateClient`, `MoneriumWhitelabelClient`, and `MoneriumOAuthClient`) for the integration flows defined in the Monerium developer documentation.

---

## Private Plan

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

---

## Whitelabel Plan

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

---

## OAuth Plan

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

async function runOAuthAuthFlow() {
  const { codeChallenge, codeVerifier } = generatePKCE();
  // Store `codeVerifier` in the session/local storage for later...

  // 2. Authorize (Redirect user to Monerium)
  const authUrl = client.buildAuthorizationUrl({
    clientId: 'YOUR_CLIENT_ID',
    redirectUri: 'https://your-app.com/callback',
    codeChallenge: codeChallenge,
    state: 'random_state_string'
  });
  
  // -> window.location.assign(authUrl)

  // --- After the user redirects back to your app ---
  
  // 3. Parse Authorization Response
  const { code } = client.parseAuthorizationResponse(window.location.search);

  // 4. Exchange code for tokens
  const tokens = await client.authorizationCodeGrant({
    clientId: 'YOUR_CLIENT_ID',
    redirectUri: 'https://your-app.com/callback',
    code: code!,
    codeVerifier: 'STORED_CODE_VERIFIER'
  });

  // Save `tokens` to your database associated with the user
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