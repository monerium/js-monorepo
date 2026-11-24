---
name: monerium-oauth
description: 'Build a Monerium OAuth integration. Covers Authorization Code + PKCE, Sign-In with Ethereum (SIWE), wallet linking (EOA and EIP-1271), IBANs, redeem orders, and order monitoring. Use when your app acts on behalf of an existing Monerium user.'
---

# Monerium OAuth integration

Use this skill when a third-party app needs to act on behalf of an existing Monerium user. The user grants permission; your backend exchanges the authorization code and makes API calls.

## Before writing code

Read `references/oauth.md` in full. It contains the PKCE flow, SIWE, wallet linking, IBAN lookup, order placement, and order monitoring with code examples.

## Key rules

- Auth: Authorization Code + PKCE. No client secret. The backend exchanges the code; the token endpoint has no CORS.
- Base URLs: production `https://api.monerium.app`, sandbox `https://api.monerium.dev`.
- Send `Accept: application/vnd.monerium.api-v2+json` on all requests.
- Keep tokens server-side. Never expose them to the browser.
- For real-time order updates, listen to on-chain Transfer events; do not poll.
- Cross-chain orders use `counterpart.identifier.standard = "chain"`.
- On `429`, read `Retry-After` and back off exponentially.

## Reference

- `references/oauth.md` — full integration guide.
