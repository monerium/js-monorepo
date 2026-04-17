# Monerium OAuth Integration

## Overview

OAuth is how third-party applications act on behalf of existing Monerium users. The user grants your app permission to read their data and place orders under their account.

API base URLs:
- Production: `https://api.monerium.app`
- Sandbox: `https://api.monerium.dev`

Flow architecture:
- Frontend initiates the OAuth redirect
- Backend exchanges the authorization code for tokens (no CORS on token endpoint)
- Backend makes all subsequent API calls using the access token

Auth method: Authorization Code + PKCE (Proof Key for Code Exchange). No client secret is needed for OAuth apps.

## Conventions

- All IDs are UUIDs (e.g. `a08bfa22-e6d6-11ed-891c-2ea11c960b3f`)
- Dates: RFC 3339, UTC (e.g. `2021-02-13T16:41:10.091Z`)
- Versioning: include `Accept: application/vnd.monerium.api-v2+json` on all API requests
- Rate limiting: HTTP 429 means slow down. Read the `Retry-After` header value (seconds) and apply exponential backoff before retrying.
- All monetary amounts are strings (e.g. `"100.50"`)
- Currencies are lowercase ISO codes: `eur`, `gbp`, `usd`, `isk`
- Chain names: `ethereum`, `gnosis`, `polygon`, `arbitrum`, `base`, `linea`, `scroll`, `noble`

## Authentication — Authorization Code + PKCE

### Step 1: Generate PKCE values

Generate a `code_verifier` (random 64 bytes, base64url-encoded) and derive a `code_challenge` (SHA-256 of verifier, base64url-encoded, no padding).

```js
const crypto = require("crypto");

function base64url(buffer) {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function generatePKCE() {
  const verifier = base64url(crypto.randomBytes(64));
  const challenge = base64url(crypto.createHash("sha256").update(verifier).digest());
  return { verifier, challenge };
}

const { verifier, challenge } = generatePKCE();
// Store verifier server-side (session, DB, etc.) keyed to the state value
```

### Step 2: Redirect to /auth

Build the authorization URL and redirect the user's browser to it.

```js
const BASE_URL = "https://api.monerium.dev";
const CLIENT_ID = "your-client-id";
const REDIRECT_URI = "https://yourapp.com/callback";

function buildAuthURL(challenge, state) {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    code_challenge: challenge,
    code_challenge_method: "S256",
    state: state,
  });
  return `${BASE_URL}/auth?${params.toString()}`;
}

// Generate a random state value for CSRF protection
const state = base64url(crypto.randomBytes(16));
const authURL = buildAuthURL(challenge, state);

// Store state in session, then:
// res.redirect(authURL);
```

The Monerium authorization server redirects the user through its own login/onboarding UI. On completion it redirects back to your `redirect_uri` with:
- Success: `https://yourapp.com/callback?code=AUTHORIZATION_CODE&state=STATE`
- Error: `https://yourapp.com/callback?error=access_denied&error_description=...`

### Step 3: Handle the callback

Receive the `code` and `state` query parameters. Verify `state` matches what you stored.

```js
function handleCallback(query, session) {
  if (query.error) {
    throw new Error(`OAuth error: ${query.error} — ${query.error_description}`);
  }
  if (query.state !== session.oauthState) {
    throw new Error("State mismatch — possible CSRF attack");
  }
  return query.code;
}
```

### Step 4: Exchange code for tokens

POST to `/auth/token` from your backend. This must be server-side — the endpoint does not support CORS.

```js
async function exchangeCode(code, verifier) {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: CLIENT_ID,
    code: code,
    code_verifier: verifier,
    redirect_uri: REDIRECT_URI,
  });

  const response = await fetch(`${BASE_URL}/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(`Token exchange failed: ${err.message}`);
  }

  return response.json();
  // Returns: { access_token, refresh_token, token_type: "Bearer", expires_in: 3600 }
}
```

Token response shape:

```json
{
  "access_token": "EoWmpc2uSZar6h2bKgh",
  "refresh_token": "cowYzCowQxGPUl4p15iwKA",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

Use `access_token` as a `Bearer` token in subsequent requests. Store `refresh_token` securely.

### Step 5: Refresh the access token

When the access token expires, use the refresh token to obtain a new one without user interaction.

```js
async function refreshAccessToken(refreshToken) {
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: CLIENT_ID,
    refresh_token: refreshToken,
  });

  const response = await fetch(`${BASE_URL}/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(`Token refresh failed: ${err.message}`);
  }

  return response.json();
  // Returns the same shape as the initial token response
}
```

### Making authenticated requests

All API calls use the access token as a Bearer token.

```js
async function moneriumRequest(path, accessToken, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.monerium.api-v2+json",
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (response.status === 401) {
    throw new Error("Unauthorized — refresh or re-authorize");
  }
  if (response.status === 429) {
    const retryAfter = response.headers.get("Retry-After") || "5";
    throw new Error(`Rate limited — retry after ${retryAfter}s`);
  }
  if (!response.ok) {
    const err = await response.json();
    throw new Error(`API error ${response.status}: ${err.message}`);
  }

  return response.json();
}
```

## Authentication — Sign-In with Ethereum (SIWE)

For users who already have a Monerium account with a linked wallet, you can authenticate them silently using an EIP-4361 (SIWE) message signed by their wallet. This skips the redirect flow entirely.

Requirements:
- The wallet address must already be linked to a Monerium account
- `expiration_time` is required in the SIWE message
- `resources` must include `https://monerium.com/siwe` plus your app's privacy policy and terms of service URLs
- `nonce` must be unique per request (use a random value)

SIWE message format (EIP-4361):

```
example.com wants you to sign in with your Ethereum account:
0xf9ca5763A2d7a908d9a565567C80C069eCDd1B52

Allow AppName to access my data on Monerium

URI: https://example.com/callback
Version: 1
Chain ID: 1
Nonce: 8YOaY6qkvyf7F5lx
Issued At: 2024-08-24T14:23:00Z
Expiration Time: 2024-08-24T15:23:00Z
Resources:
- https://monerium.com/siwe
- https://example.com/privacy-policy
- https://example.com/terms-of-service
```

POST to `/auth` with the SIWE parameters plus PKCE. The response is a redirect (302) to your `redirect_uri` containing an authorization code, just like the standard flow. Exchange the code with `/auth/token` as normal.

```js
async function siweAuth(message, signature, challenge, state) {
  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    code_challenge: challenge,
    code_challenge_method: "S256",
    authentication_method: "siwe",
    message: message,
    signature: signature,
    state: state,
  });

  // This will redirect (302) to redirect_uri?code=...&state=...
  // In a backend context, follow the redirect or parse the Location header
  const response = await fetch(`${BASE_URL}/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    redirect: "manual",
    body: body.toString(),
  });

  // Location header contains: redirect_uri?code=AUTH_CODE&state=STATE
  const location = response.headers.get("Location");
  const url = new URL(location);
  return url.searchParams.get("code");
}
```

## Link a Wallet

Before a user's address can receive EURe or place orders, it must be linked to their Monerium profile.

Endpoint: `POST /addresses`

Required body fields:
- `address` — the wallet address (0x...)
- `chain` — one of: `ethereum`, `gnosis`, `polygon`, `arbitrum`, `base`, `linea`, `scroll`, `noble`
- `message` — must be exactly: `"I hereby declare that I am the address owner."`
- `signature` — EOA signature of the message using the private key for `address`

Optional:
- `profile` — profile UUID; defaults to the authenticated user's profile

### EOA (standard wallet) linking

```js
// Using ethers.js v6 style signing — adapt to your wallet library
async function linkAddress(accessToken, address, chain, signFn) {
  const message = "I hereby declare that I am the address owner.";

  // signFn is a function that takes a message string and returns a 0x-prefixed signature
  // e.g. with ethers: await signer.signMessage(message)
  const signature = await signFn(message);

  return moneriumRequest("/addresses", accessToken, {
    method: "POST",
    body: JSON.stringify({ address, chain, message, signature }),
  });
}
```

Sign the message as a personal_sign (EIP-191 prefixed) message. The signature must be a 65-byte (130 hex chars) value prefixed with `0x`.

### Safe / smart contract wallet (ERC-1271)

For multisig or smart contract wallets:

- **Onchain**: set `signature` to `"0x"`. Monerium will poll the contract for ERC-1271 confirmation for up to 5 days. Returns HTTP 202 Accepted.
- **Offchain**: collect all owner signatures off-chain and submit the aggregated Safe signature. Verified via ERC-1271.

```js
// Onchain Safe linking — signature is "0x", Monerium verifies on-chain
async function linkSafeAddressOnchain(accessToken, safeAddress, chain) {
  const message = "I hereby declare that I am the address owner.";
  return moneriumRequest("/addresses", accessToken, {
    method: "POST",
    body: JSON.stringify({
      address: safeAddress,
      chain,
      message,
      signature: "0x",
    }),
  });
  // Returns 202 — Monerium will verify asynchronously
}
```

Response:
- `201 Created` — address linked successfully
- `202 Accepted` — onchain verification pending (Safe wallets)

## Get IBANs

Each linked address can be assigned an IBAN. Incoming SEPA payments to the IBAN are automatically minted as EURe to the linked address. Outgoing payments burn EURe from the address.

### List all IBANs for the authenticated user

```js
async function getIBANs(accessToken) {
  return moneriumRequest("/ibans", accessToken);
}
```

Response shape:

```json
{
  "ibans": [
    {
      "iban": "EE127310138155512606682602",
      "name": "Jane Doe",
      "bic": "EAPFESM2XXX",
      "profile": "4f079ef8-6d26-11eb-9bc8-acde48001122",
      "address": "0x59cFC408d310697f9D3598e1BE75B0157a072407",
      "chain": "gnosis"
    }
  ]
}
```

### Get a single IBAN

```js
async function getIBAN(accessToken, iban) {
  return moneriumRequest(`/ibans/${iban}`, accessToken);
}
```

Do not poll IBANs repeatedly. Fetch once per user action or on an explicit trigger (e.g. page load or user request). IBAN assignment can take a few seconds after address linking — if the IBAN list is empty immediately after linking, wait briefly and retry once.

Filter by chain: `GET /ibans?chain=gnosis`

## Place Orders (Redeem — outgoing SEPA payment)

A redeem order burns EURe from the user's linked address and sends a SEPA payment to the specified bank account.

Endpoint: `POST /orders`

The wallet owner must sign the order message to authorize it. The message format is:

```
Send <CURRENCY_UPPERCASE> <AMOUNT> to <IBAN> at <RFC3339_TIMESTAMP>
```

Timestamp must be within 5 minutes of the current time or in the future. Accurate to the minute (seconds are zero).

Example message: `Send EUR 100 to EE127310138155512606682602 at 2024-07-12T12:02:00Z`

You may also use the shortened IBAN format (first 4 + `...` + last 4 chars):
`Send EUR 100 to EE12...2602 at 2024-07-12T12:02:00Z`

```js
async function placeRedeemOrder(accessToken, params) {
  // params: { address, chain, amount, currency, iban, firstName, lastName, country, signFn }
  const { address, chain, amount, currency, iban, firstName, lastName, country, signFn } = params;

  // Build the message the wallet owner must sign
  const timestamp = new Date().toISOString().replace(/:\d{2}\.\d{3}Z$/, ":00Z");
  const message = `Send ${currency.toUpperCase()} ${amount} to ${iban} at ${timestamp}`;

  // signFn signs the message with the wallet private key
  const signature = await signFn(message);

  const body = {
    address,
    chain,
    currency,
    kind: "redeem",
    amount,
    counterpart: {
      identifier: {
        standard: "iban",
        iban,
      },
      details: {
        firstName,
        lastName,
        country, // ISO 3166-1 alpha-2, e.g. "DE"
      },
    },
    message,
    signature,
  };

  return moneriumRequest("/orders", accessToken, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
```

### Cross-chain transfer

To send EURe to another address on a different chain, use `counterpart.identifier.standard = "chain"`.

Message format: `Send <CURRENCY_UPPERCASE> <AMOUNT> to <ADDRESS> on <CHAIN> at <TIMESTAMP>`

```js
const message = `Send EUR 50 to 0x4B4c34f35b0Bb9Af56418FAdD4677ce45ADF7760 on gnosis at 2024-07-12T12:02:00Z`;

const body = {
  address: "0x59cFC408d310697f9D3598e1BE75B0157a072407",
  chain: "ethereum",
  currency: "eur",
  kind: "redeem",
  amount: "50",
  counterpart: {
    identifier: {
      standard: "chain",
      address: "0x4B4c34f35b0Bb9Af56418FAdD4677ce45ADF7760",
      chain: "gnosis",
    },
    details: {},
  },
  message,
  signature: await signFn(message),
};
```

Order response shape:

```json
{
  "id": "8c0fd7b1-01da-11ed-89c1-52c47a86c354",
  "kind": "redeem",
  "profile": "312c5cc4-4b06-11ed-a6cf-bac9bf26c37c",
  "address": "0x798728D5410aB4FB49d2C277A49baC5048aB43ca",
  "chain": "ethereum",
  "currency": "eur",
  "amount": "100",
  "counterpart": {
    "identifier": { "standard": "iban", "iban": "EE127310138155512606682602" },
    "details": { "firstName": "Satoshi", "lastName": "Nakamoto", "country": "FR" }
  },
  "memo": "Powered by Monerium",
  "state": "placed",
  "meta": {
    "placedAt": "2024-07-12T12:02:49.000Z",
    "txHashes": ["0x692ff12125b71c167b3ea90bddb3b28edd60941851cb0cdd852cc3b6d79311cd"]
  }
}
```

Order states: `placed` → `pending` → `processed` | `rejected`

`meta.txHashes` contains the on-chain transaction hash(es) once the burn/mint has been executed.

Note: orders with amount >= €15,000 require a supporting document (`supportingDocumentId`). Upload via `POST /files` (multipart/form-data, max 5MB, PDF or JPEG) to obtain a file ID.

## Monitor Orders

### On-chain event listening (recommended for real-time)

Listen for ERC-20 Transfer events on the EURe token contract:

- Incoming (mint): `from` address is `address(0)` (`0x0000000000000000000000000000000000000000`), `to` is the user's address
- Outgoing (burn): `to` address is `address(0)`, `from` is the user's address

Get current token contract addresses from `GET /tokens`:

```js
async function getTokenContracts(accessToken) {
  return moneriumRequest("/tokens", accessToken);
}

// Example response item:
// { currency: "eur", ticker: "EUR", symbol: "EURe", chain: "ethereum",
//   address: "0x3231cb76718cdef2155fc47b5286d82e6eda273f", decimals: 18 }
```

ERC-20 Transfer event topic: `0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef`

After detecting an on-chain Transfer event, fetch the corresponding Monerium order once using the transaction hash:

```js
async function getOrderByTxHash(accessToken, txHash) {
  return moneriumRequest(`/orders?txHash=${txHash}`, accessToken);
}
// Returns: { orders: [ <Order> ] }
```

Do not poll this endpoint in a loop. Call it once after detecting the on-chain event. The `txHash` filter is available on `GET /orders`.

### Fetch a specific order by ID

```js
async function getOrder(accessToken, orderId) {
  return moneriumRequest(`/orders/${orderId}`, accessToken);
}
```

### List all orders

```js
async function getOrders(accessToken, filters = {}) {
  const params = new URLSearchParams(filters);
  const query = params.toString() ? `?${params.toString()}` : "";
  return moneriumRequest(`/orders${query}`, accessToken);
}

// Available filters: address, txHash, profile, memo, state (pending|processed|rejected)
```

## Get Auth Context

Retrieve details about the currently authenticated user, including their profiles.

```js
async function getAuthContext(accessToken) {
  return moneriumRequest("/auth/context", accessToken);
}
```

## Create an Application

1. Go to [sandbox.monerium.dev](https://sandbox.monerium.dev) and sign in
2. Navigate to Developers → Create application → select OAuth
3. Set your redirect URI(s)
4. Copy the `CLIENT_ID`
5. For production: repeat at [monerium.app](https://monerium.app)

Sandbox is for testing with fake money. Production is for real money. Application settings (client IDs, redirect URIs) are separate between environments.

## Error Handling Reference

| Status | Meaning |
|--------|---------|
| 400 | Bad request — check required fields and formats |
| 401 | Unauthorized — access token missing, expired, or invalid |
| 403 | Forbidden — token valid but lacks permission for this resource |
| 404 | Resource not found |
| 429 | Rate limited — read `Retry-After` header, back off |
| 500 | Server error — retry with backoff |

Error response shape:

```json
{
  "code": 400,
  "status": "Bad Request",
  "message": "Validation errors",
  "errors": {
    "address": "Address missing"
  }
}
```
