# Monerium Private Integration

A Monerium Private integration gives direct API access to your own Monerium account. The application acts on your own wallet, IBAN, and orders. No external customers, no partner review required.

- Auth: Client Credentials (server-to-server)
- You need `CLIENT_ID` and `CLIENT_SECRET` from the Monerium developer dashboard

## API Base URLs

- Production: `https://api.monerium.app`
- Sandbox: `https://api.monerium.dev`

## Conventions

- All IDs are UUIDs
- Dates: RFC 3339, UTC (e.g. `2021-02-13T16:41:10.091Z`)
- Include `Accept: application/vnd.monerium.api-v2+json` on every request
- Rate limiting: `429` means slow down. Read the `Retry-After` header and use exponential backoff.

---

## Authentication — Client Credentials

Exchange your client credentials for tokens.

**Request**

```
POST /auth/token
Content-Type: application/x-www-form-urlencoded
```

Body fields:

| Field           | Value                    |
|----------------|--------------------------|
| `grant_type`   | `client_credentials`     |
| `client_id`    | your client ID           |
| `client_secret`| your client secret       |

**Response**

```json
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

**JavaScript example**

```js
async function getTokens({ baseUrl, clientId, clientSecret }) {
  const res = await fetch(`${baseUrl}/auth/token`, {
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

  if (!res.ok) throw new Error(`Auth failed: ${res.status}`);
  return res.json(); // { access_token, refresh_token, ... }
}
```

Use the `access_token` as a Bearer token on all subsequent requests:

```
Authorization: Bearer <access_token>
```

---

## Webhooks

Register a webhook to receive `order.created` and `order.updated` events. Profile approval is notified by email, not by webhook.

### Register a webhook

```
POST /webhooks
Authorization: Bearer <access_token>
Accept: application/vnd.monerium.api-v2+json
Content-Type: application/json
```

Body:

```json
{
  "url": "https://your-server.example.com/webhooks/monerium",
  "secret": "whsec_<base64-random>",
  "types": ["order.created", "order.updated"]
}
```

The `secret` must be prefixed with `whsec_` followed by a base64-encoded random string. Generate one like this:

```js
import { randomBytes } from "node:crypto";

const secret = "whsec_" + randomBytes(32).toString("base64");
```

Monerium immediately sends a `subscription.created` event to your URL. Your endpoint must respond with HTTP `200` to activate the webhook.

### Verify webhook signatures

Every webhook request includes three headers:

| Header                | Description                        |
|----------------------|------------------------------------|
| `webhook-id`         | Unique event ID (use for dedup)    |
| `webhook-timestamp`  | Unix timestamp (seconds)           |
| `webhook-signature`  | Signature(s), comma-separated      |

**Signed string format:**

```
{webhook-id}.{webhook-timestamp}.{rawBody}
```

**Expected signature:**

1. Strip the `whsec_` prefix from your secret
2. Base64-decode it to get the raw key
3. Compute HMAC-SHA256 over the signed string using the raw key
4. Base64-encode the digest
5. Compare against `v1,{digest}`

**Full Node.js/Express verification example**

```js
import express from "express";
import { createHmac, timingSafeEqual } from "node:crypto";

const app = express();

// Use raw body for signature verification
app.post(
  "/webhooks/monerium",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const id = req.headers["webhook-id"];
    const timestamp = req.headers["webhook-timestamp"];
    const signature = req.headers["webhook-signature"];

    if (!id || !timestamp || !signature) {
      return res.status(400).send("Missing webhook headers");
    }

    // Reject stale events (optional, recommended: 5 minute tolerance)
    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - Number(timestamp)) > 300) {
      return res.status(400).send("Timestamp out of tolerance");
    }

    const rawBody = req.body; // Buffer
    const signedString = `${id}.${timestamp}.${rawBody}`;

    // Decode secret: strip whsec_ prefix, base64 decode
    const secret = process.env.MONERIUM_WEBHOOK_SECRET; // e.g. "whsec_abc123..."
    const keyBytes = Buffer.from(secret.replace(/^whsec_/, ""), "base64");

    const expected =
      "v1," +
      createHmac("sha256", keyBytes)
        .update(signedString)
        .digest("base64");

    // Constant-time comparison against all provided signatures
    const signatures = signature.split(" ");
    const valid = signatures.some((sig) => {
      try {
        return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
      } catch {
        return false;
      }
    });

    if (!valid) {
      return res.status(401).send("Invalid signature");
    }

    // Deduplicate by webhook-id (store in DB/cache)
    // if (alreadyProcessed(id)) return res.status(200).send("Duplicate");

    const event = JSON.parse(rawBody.toString());
    console.log("Received event:", event.type, event);

    res.status(200).send("OK");
  }
);
```

Monerium retries failed deliveries up to 10 times over 12 hours. Always deduplicate by `webhook-id`.

---

## Link a Wallet

Associate a blockchain address with your Monerium profile before placing orders or requesting IBANs.

```
POST /addresses
Authorization: Bearer <access_token>
Accept: application/vnd.monerium.api-v2+json
Content-Type: application/json
```

Body:

```json
{
  "address": "0xYourAddress",
  "chain": "ethereum",
  "message": "I hereby declare that I am the address owner.",
  "signature": "0x..."
}
```

Supported chains: `ethereum`, `gnosis`, `polygon`, `arbitrum`, `base`, `linea`, `scroll`

The message must be signed by the private key of the EOA address.

**JavaScript example using ethers.js**

```js
import { Wallet } from "ethers";

async function linkAddress({ baseUrl, accessToken, privateKey, chain }) {
  const wallet = new Wallet(privateKey);
  const message = "I hereby declare that I am the address owner.";
  const signature = await wallet.signMessage(message);

  const res = await fetch(`${baseUrl}/addresses`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Accept": "application/vnd.monerium.api-v2+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      address: wallet.address,
      chain,
      message,
      signature,
    }),
  });

  if (!res.ok) throw new Error(`Link address failed: ${res.status}`);
  return res.json();
}
```

---

## EUR IBAN

### Request an IBAN

Request an IBAN to be assigned to a specific address and chain. No `profileId` is needed — the request uses your own profile automatically.

```
POST /ibans
Authorization: Bearer <access_token>
Accept: application/vnd.monerium.api-v2+json
Content-Type: application/json
```

Body:

```json
{
  "address": "0xYourAddress",
  "chain": "ethereum"
}
```

Returns `202 Accepted`. The IBAN will be assigned asynchronously. The easiest alternative is to set this up directly in the Monerium app dashboard.

### Move an IBAN to a different address or chain

Re-routes incoming SEPA payments to a different address or chain.

```
PATCH /ibans/{iban}
Authorization: Bearer <access_token>
Accept: application/vnd.monerium.api-v2+json
Content-Type: application/json
```

**JavaScript example**

```js
async function moveIban({ baseUrl, accessToken, iban, address, chain }) {
  const res = await fetch(`${baseUrl}/ibans/${iban}`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Accept": "application/vnd.monerium.api-v2+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ address, chain }),
  });

  if (!res.ok) throw new Error(`Move IBAN failed: ${res.status}`);
  return res.json();
}
```

---

## Orders

### Place an order (redeem — outgoing SEPA payment)

Send EURe from your address to a bank account via SEPA. No `profileId` is needed.

```
POST /orders
Authorization: Bearer <access_token>
Accept: application/vnd.monerium.api-v2+json
Content-Type: application/json
```

Body:

```json
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
      "name": "Jane Doe",
      "country": "DE"
    }
  },
  "message": "Invoice 123",
  "chain": "ethereum"
}
```

For a cross-chain transfer instead of a SEPA payment, set `counterpart.identifier.standard` to `"chain"`, set `address` to the destination address, and `chain` to the destination chain.

**JavaScript example**

```js
async function placeOrder({ baseUrl, accessToken, order }) {
  const res = await fetch(`${baseUrl}/orders`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Accept": "application/vnd.monerium.api-v2+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  });

  if (!res.ok) throw new Error(`Place order failed: ${res.status}`);
  return res.json(); // { id, state, ... }
}
```

### Monitor orders

Listen to `order.created` and `order.updated` webhook events (see Webhooks section above).

Order state progression:

```
pending -> processed
pending -> rejected
```

The `meta` field on an order includes `txHashes` once the on-chain transaction is confirmed.

---

## Going Live

1. Complete KYC (individual) or KYB (business) at `monerium.app/profiles`
2. Create a production application at `monerium.app`
3. No partner review needed — credentials activate once your profile is approved

---

## Create an Application

**Sandbox**

1. Go to `sandbox.monerium.dev`
2. Navigate to Developers -> Create application -> Private
3. Copy your `CLIENT_ID` and `CLIENT_SECRET`

**Production**

1. Go to `monerium.app`
2. Navigate to Developers -> Create application -> Private
3. Copy your `CLIENT_ID` and `CLIENT_SECRET`
