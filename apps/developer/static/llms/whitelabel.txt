# Monerium Whitelabel Integration

## Overview

Whitelabel lets a partner manage customer onboarding under their own brand. Each customer gets a dedicated IBAN and on-chain address. Users never interact with Monerium directly.

- Auth model: Client Credentials (server-to-server, no user redirect)
- You need `CLIENT_ID` and `CLIENT_SECRET` from the Monerium developer dashboard

## API Base URLs

- Production: `https://api.monerium.app`
- Sandbox: `https://api.monerium.dev`

## Conventions

- All IDs are UUIDs
- Dates: RFC 3339 (e.g. `2021-02-13T16:41:10.091Z`, UTC)
- Versioning: include `Accept: application/vnd.monerium.api-v2+json` on every request
- Rate limiting: `429` means slow down. Read the `Retry-After` header and apply exponential backoff.

## Authentication — Client Credentials

Exchange your credentials for tokens. Store tokens server-side only.

```
POST /auth/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&client_id=CLIENT_ID&client_secret=CLIENT_SECRET
```

Response:

```json
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

```js
const BASE_URL = "https://api.monerium.dev"; // swap for production

async function getTokens(clientId, clientSecret) {
  const res = await fetch(`${BASE_URL}/auth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/vnd.monerium.api-v2+json",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });
  if (!res.ok) throw new Error(`Auth failed: ${res.status} ${await res.text()}`);
  return res.json(); // { access_token, refresh_token, expires_in }
}

async function refreshTokens(refreshToken, clientId, clientSecret) {
  const res = await fetch(`${BASE_URL}/auth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/vnd.monerium.api-v2+json",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });
  if (!res.ok) throw new Error(`Refresh failed: ${res.status} ${await res.text()}`);
  return res.json();
}
```

Attach the token to every subsequent request:

```
Authorization: Bearer <access_token>
Accept: application/vnd.monerium.api-v2+json
```

---

## Webhooks

### Register a webhook

```
POST /webhooks
Content-Type: application/json

{
  "url": "https://yourserver.example/webhooks/monerium",
  "secret": "whsec_<base64-random>",
  "types": ["profile.updated", "iban.updated", "order.created", "order.updated"]
}
```

Generate the secret:

```js
const crypto = require("crypto");
const secret = "whsec_" + crypto.randomBytes(32).toString("base64");
```

Monerium immediately sends a `subscription.created` event to your URL. Respond with HTTP `200` to activate. Store the secret.

Available event types: `profile.updated`, `iban.updated`, `order.created`, `order.updated`

### Verify webhook signatures

Every webhook request includes:

- `webhook-id` — unique event ID (use for deduplication)
- `webhook-timestamp` — Unix timestamp string
- `webhook-signature` — one or more comma-separated `v1,<base64>` values

Signed string: `${webhook-id}.${webhook-timestamp}.${rawBody}`

Signature: HMAC-SHA256 of the signed string using your secret (strip `whsec_` prefix, base64-decode it), digest as base64.

Reject requests if the timestamp is more than 5 minutes old.

```js
const crypto = require("crypto");
const express = require("express");

const app = express();

// Must use raw body for signature verification
app.use("/webhooks/monerium", express.raw({ type: "application/json" }));

function verifyMoneriumWebhook(req, res, next) {
  const webhookId = req.headers["webhook-id"];
  const webhookTimestamp = req.headers["webhook-timestamp"];
  const webhookSignature = req.headers["webhook-signature"];
  const rawBody = req.body; // Buffer

  if (!webhookId || !webhookTimestamp || !webhookSignature) {
    return res.status(400).send("Missing webhook headers");
  }

  // Reject stale events (> 5 minutes)
  const timestampMs = Number(webhookTimestamp) * 1000;
  if (Math.abs(Date.now() - timestampMs) > 5 * 60 * 1000) {
    return res.status(400).send("Webhook timestamp too old");
  }

  const secret = process.env.MONERIUM_WEBHOOK_SECRET; // "whsec_..."
  const keyBytes = Buffer.from(secret.replace(/^whsec_/, ""), "base64");

  const signedString = `${webhookId}.${webhookTimestamp}.${rawBody.toString()}`;
  const expected =
    "v1," + crypto.createHmac("sha256", keyBytes).update(signedString).digest("base64");

  const signatures = webhookSignature.split(" ");
  const valid = signatures.some((sig) => sig === expected);

  if (!valid) {
    return res.status(401).send("Invalid signature");
  }

  req.moneriumEvent = JSON.parse(rawBody.toString());
  next();
}

app.post("/webhooks/monerium", verifyMoneriumWebhook, (req, res) => {
  const event = req.moneriumEvent;
  // Deduplicate using req.headers["webhook-id"]
  console.log("Received event:", event.type, event);
  res.sendStatus(200);
});
```

Retry policy: Monerium retries up to 10 times over 12 hours with exponential backoff. Always deduplicate by `webhook-id`.

---

## Onboard a Customer

### 1. Create a profile

```
POST /profiles
Content-Type: application/json

{ "kind": "personal" }
```

or

```json
{ "kind": "corporate" }
```

Response includes `id` (profile UUID). `kind` cannot be changed after creation.

### 2. Submit profile details

```
PATCH /profiles/{profileId}/details
Content-Type: application/json
```

Personal:

```json
{
  "personal": {
    "firstName": "Jane",
    "lastName": "Doe",
    "idDocument": {
      "kind": "passport",
      "number": "AB123456"
    },
    "address": "123 Main St",
    "postalCode": "10001",
    "city": "Berlin",
    "country": "DE",
    "countryState": "",
    "nationality": "DE",
    "birthday": "1990-06-15"
  }
}
```

Corporate:

```json
{
  "corporate": {
    "companyName": "Acme GmbH",
    "registrationNumber": "HRB 12345",
    "incorporationDate": "2015-03-01",
    "companyType": "gmbh",
    "registeredAddress": {
      "address": "Unter den Linden 1",
      "postalCode": "10117",
      "city": "Berlin",
      "country": "DE"
    }
  }
}
```

### 3. Submit the onboarding form

```
PATCH /profiles/{profileId}/form
Content-Type: application/json
```

Personal:

```json
{
  "personal": {
    "purposeOfAccount": "payments",
    "sourceOfFunds": "salary"
  }
}
```

Corporate:

```json
{
  "corporate": {
    "purposeOfAccount": "payments",
    "sourceOfFunds": "business_revenue"
  }
}
```

### 4a. Submit verifications (documents)

Upload a file first:

```
POST /files
Content-Type: multipart/form-data

file=<binary>
```

Response: `{ "fileId": "uuid" }`

Then attach it:

```
PATCH /profiles/{profileId}/verifications
Content-Type: application/json

{
  "personal": [
    { "kind": "sourceOfFunds", "fileId": "uuid" }
  ]
}
```

### 4b. KYC sharing via Sumsub (alternative to manual document upload)

If you already run a Sumsub KYC flow, share the applicant result directly. This populates details and verifications automatically. You still need to PATCH `/form`.

```
POST /profiles/{profileId}/share
Content-Type: application/json

{
  "provider": "sumsub",
  "externalId": "<sumsub-applicant-id>"
}
```

### Profile states

`created` -> `incomplete` -> `submitted` -> `approved` or `rejected`

Monitor via `profile.updated` webhook. The event payload includes the current `state`.

---

## Link a Wallet Address

```
POST /addresses
Content-Type: application/json

{
  "address": "0xYourEOAAddress",
  "chain": "ethereum",
  "message": "I hereby declare that I am the address owner.",
  "signature": "0x...",
  "profileId": "uuid"
}
```

Supported chains: `ethereum`, `gnosis`, `polygon`, `arbitrum`, `base`, `linea`, `scroll`

For Safe or other ERC-1271 smart contract wallets, include `safeAddress`.

Sign the fixed message with the wallet private key (EOA example using ethers.js):

```js
const { ethers } = require("ethers");

const MESSAGE = "I hereby declare that I am the address owner.";

async function linkAddress(accessToken, profileId, privateKey, chain) {
  const wallet = new ethers.Wallet(privateKey);
  const signature = await wallet.signMessage(MESSAGE);

  const res = await fetch(`${BASE_URL}/addresses`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "Accept": "application/vnd.monerium.api-v2+json",
    },
    body: JSON.stringify({
      address: wallet.address,
      chain,
      message: MESSAGE,
      signature,
      profileId,
    }),
  });

  if (!res.ok) throw new Error(`Link address failed: ${res.status} ${await res.text()}`);
  return res.json();
}
```

---

## EUR IBAN

### Request an IBAN

```
POST /ibans
Content-Type: application/json

{
  "address": "0xYourEOAAddress",
  "chain": "ethereum",
  "profileId": "uuid"
}
```

Returns `202 Accepted`. Monitor via `iban.updated` webhook.

IBAN states: `pending` -> `active`

### Move an IBAN to a different address

Re-routes all future incoming payments to a new on-chain address. Existing IBAN number stays the same.

```
PATCH /ibans/{iban}
Content-Type: application/json

{
  "address": "0xNewAddress",
  "chain": "ethereum"
}
```

---

## Orders

### Place a redeem order (outgoing SEPA payment)

A `redeem` sends EURe from an on-chain address to a bank account via SEPA.

```
POST /orders
Content-Type: application/json

{
  "kind": "redeem",
  "amount": "100",
  "currency": "eur",
  "address": "0xYourAddress",
  "counterpart": {
    "identifier": {
      "standard": "iban",
      "iban": "DE89370400440532013000"
    },
    "details": {
      "name": "John Doe",
      "country": "DE"
    }
  },
  "message": "Invoice 123",
  "chain": "ethereum",
  "profileId": "uuid"
}
```

### Cross-chain order

For on-chain-to-on-chain transfers, set `counterpart.identifier.standard` to `"chain"` and provide the destination address and chain.

```json
{
  "kind": "redeem",
  "amount": "50",
  "currency": "eur",
  "address": "0xSourceAddress",
  "counterpart": {
    "identifier": {
      "standard": "chain",
      "address": "0xDestinationAddress",
      "chain": "polygon"
    },
    "details": {
      "name": "Recipient Name",
      "country": "DE"
    }
  },
  "chain": "ethereum",
  "profileId": "uuid"
}
```

### Monitor orders

Listen to `order.created` and `order.updated` webhook events.

Order states: `pending` -> `processed` or `rejected`

---

## Going Live

1. Get partner approval from the Monerium team
2. Create a production application at `monerium.app`
3. Use `CLIENT_ID` and `CLIENT_SECRET` from the production application
4. Customers complete KYC/KYB via your onboarding flow using the production API

### Create an application (sandbox)

1. Go to `sandbox.monerium.dev` -> Developers -> Create application -> Whitelabel
2. Copy `CLIENT_ID` and `CLIENT_SECRET`

For production, repeat at `monerium.app` after partner approval.
