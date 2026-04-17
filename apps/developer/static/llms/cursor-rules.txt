---
description: Monerium API integration rules
globs: ["**/*.ts", "**/*.js", "**/*.py", "**/*.go"]
alwaysApply: false
---

# Monerium API

## Base URLs
- Sandbox: https://api.monerium.dev
- Production: https://api.monerium.app

## Always
- Include `Accept: application/vnd.monerium.api-v2+json` on all requests
- Keep bearer tokens server-side only — never expose to browser/client
- Handle 429 responses with exponential backoff using the Retry-After header
- Use RFC 3339 for all date fields (e.g. 2021-02-13T16:41:10.091Z, UTC)
- All resource IDs are UUIDs

## Authentication
- OAuth apps: Authorization Code + PKCE. Backend exchanges code, stores tokens, makes all API calls
- Whitelabel/Private apps: Client Credentials (POST /auth/token, grant_type=client_credentials)
- Never implement browser-based OAuth — Monerium API does not support CORS for authenticated requests

## Webhooks (Whitelabel and Private only)
- Verify every webhook using HMAC-SHA256: sign `${webhook-id}.${webhook-timestamp}.${rawBody}` with the whsec_ secret
- Always respond 200 quickly, process asynchronously
- Deduplicate events by webhook-id

## Orders
- kind=redeem: outgoing SEPA payment (burns EURe, sends EUR via SEPA)
- kind=issue: incoming SEPA payment (mints EURe) — handled automatically, no API call needed
- For cross-chain transfers: counterpart.identifier.standard = "chain"

## Common mistakes to avoid
- Do not poll for state changes — use webhooks (Whitelabel/Private) or on-chain events (OAuth)
- Do not expose access tokens to the frontend
- Do not use the zero UUID (00000000-0000-0000-0000-000000000000) — reserved for Monerium system
