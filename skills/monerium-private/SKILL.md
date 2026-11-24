---
name: monerium-private
description: 'Build a Monerium private integration for your own account. Covers client credentials, webhooks, wallet linking, IBAN request, and redeem orders. Use when the app acts on your own Monerium account with no external customers.'
---

# Monerium private integration

Use this skill when your app acts on your own Monerium account: your wallet, your IBAN, and your orders. There are no external customers and no partner review.

## Before writing code

Read `references/private.md` in full. It contains client credentials, webhooks, wallet linking, IBAN requests, and order placement with code examples.

## Key rules

- Auth: Client Credentials. Exchange `CLIENT_ID` and `CLIENT_SECRET` at `POST /auth/token` with `grant_type=client_credentials`.
- Base URLs: production `https://api.monerium.app`, sandbox `https://api.monerium.dev`.
- Send `Accept: application/vnd.monerium.api-v2+json` on all requests.
- Keep access tokens and client secrets server-side. Never expose them to the browser.
- Verify every webhook with HMAC-SHA256 over `${webhook-id}.${webhook-timestamp}.${rawBody}` using the `whsec_` secret. Respond `200` quickly and process asynchronously. Deduplicate by `webhook-id`.
- Do not poll for state changes; use webhooks.
- `kind=redeem` is an outgoing SEPA payment. `kind=issue` is an incoming payment and is handled automatically.
- Cross-chain orders use `counterpart.identifier.standard = "chain"`.

## Reference

- `references/private.md` — full integration guide.
- OpenAPI spec: `https://raw.githubusercontent.com/monerium/js-monorepo/main/packages/openapi/openapi.yml`
- Rendered API reference: `https://docs.monerium.com/api`
