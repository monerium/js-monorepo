---
name: monerium-faq
description: 'Answer common Monerium integration questions. Covers EIP-1271 Safe IBANs, same-chain transfers, Sumsub reusable IDs, proof of address, risk form prefills, deposit and withdrawal limits, order idempotency and retries, rate limits, webhook IPs, and Polygon Amoy. Use for Monerium FAQ or edge cases.'
---

# Monerium FAQ

Read `references/faq.md` for the full Q&A. Quick answers:

## Accounts and IBANs

- **Safe / EIP-1271 IBAN:** Yes. An IBAN can be linked to an EIP-1271 smart contract wallet such as Safe. Both off-chain and on-chain flows are supported; prefer the off-chain flow because the signature is verified immediately and the address is linked in the response.
- **Same-chain gasless wallet-to-wallet transfer:** No. The wallet holding the EURe must send an on-chain transfer and pay gas.

## Onboarding and KYC

- **Sumsub reusable identity (ID) tokens:** No. Onboarding uses classic applicant tokens through KYC Sharing.
- **Proof of address:** Required for all applicants. It must show the customer's name and current address and be no older than six months from account creation. Non-document proof of address is not available.
- **Risk form prefills:** Only TIN and tax residence country are pre-filled by Monerium. The full required field set is in `PATCH /profiles/{profile}/form`. Importing a prefilled questionnaire is not supported.

## Orders and limits

- **Deposit and withdrawal limits:** Minimum is `0.01`. There are no per-customer limits.
- **`POST /orders` idempotency:** The signed order message is an idempotency key; posting the same signed message twice returns `400` for a duplicate order. You may also supply a client-generated UUID in the optional `id` field and retry the exact same request. There are currently no rate limits. Retry only on `5xx` with exponential backoff. Set the order timestamp a couple of minutes ahead to leave room for retries and latency.

## Sandbox and go-live

- **Webhook source IPs:** No fixed IPs. Verify each webhook using the `webhook-signature` header, which contains an HMAC-SHA256 signature over `webhook-id`, `webhook-timestamp`, and the raw request body.
- **Polygon Amoy:** Yes. Whitelabel IBANs are supported on Polygon Amoy in the sandbox environment.

## Reference

- `references/faq.md` — full Q&A with links to the docs.
- OpenAPI spec: `https://raw.githubusercontent.com/monerium/js-monorepo/main/packages/openapi/openapi.yml`
- Rendered API reference: `https://docs.monerium.com/api/`
