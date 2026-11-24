---
name: monerium-api-rules
description: 'Condensed Monerium API rules for AI coding assistants. Covers base URLs, auth models, webhook verification, order kinds, and common mistakes. Use as a quick checklist when writing Monerium integration code.'
---

# Monerium API rules

## Base URLs

- Sandbox: `https://api.monerium.dev`
- Production: `https://api.monerium.app`

## Always

- Include `Accept: application/vnd.monerium.api-v2+json` on all requests.
- Keep bearer tokens server-side only. Never expose them to the browser or client.
- Handle `429` responses with exponential backoff using the `Retry-After` header.
- Use RFC 3339 for all date fields, UTC (for example `2021-02-13T16:41:10.091Z`).
- All resource IDs are UUIDs.

## Authentication

- OAuth apps: Authorization Code + PKCE. The backend exchanges the code, stores tokens, and makes all API calls.
- Whitelabel and Private apps: Client Credentials (`POST /auth/token`, `grant_type=client_credentials`).
- Never implement browser-based OAuth. The Monerium API does not support CORS for authenticated requests.

## Webhooks (whitelabel and private only)

- Verify every webhook using HMAC-SHA256: sign `${webhook-id}.${webhook-timestamp}.${rawBody}` with the `whsec_` secret.
- Always respond `200` quickly and process asynchronously.
- Deduplicate events by `webhook-id`.

## Orders

- `kind=redeem`: outgoing SEPA payment (burns EURe, sends EUR via SEPA).
- `kind=issue`: incoming SEPA payment (mints EURe). Handled automatically; no API call needed.
- For cross-chain transfers: `counterpart.identifier.standard = "chain"`.

## Common mistakes to avoid

- Do not poll for state changes. Use webhooks (whitelabel/private) or on-chain events (OAuth).
- Do not expose access tokens to the frontend.
- Do not use the zero UUID (`00000000-0000-0000-0000-000000000000`); it is reserved for the Monerium system.

## Reference

- OpenAPI spec: `https://raw.githubusercontent.com/monerium/js-monorepo/main/packages/openapi/openapi.yml`
- Rendered API reference: `https://docs.monerium.com/api`
