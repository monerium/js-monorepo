---
name: monerium
description: 'Monerium onchain fiat API overview and integration router. Use when starting a Monerium integration or when deciding between OAuth, whitelabel, and private access.'
---

# Monerium integration router

Monerium provides onchain fiat (EURe) accounts with IBANs and blockchain addresses. Choose the access model first, then load the matching skill.

| Access model | Auth                      | Use when                                           | Skill                 |
| ------------ | ------------------------- | -------------------------------------------------- | --------------------- |
| OAuth        | Authorization Code + PKCE | Your app acts on behalf of existing Monerium users | `monerium-oauth`      |
| Whitelabel   | Client credentials        | You onboard customers under your own brand         | `monerium-whitelabel` |
| Private      | Client credentials        | Your app acts on your own Monerium account         | `monerium-private`    |

## Base URLs

- Production: `https://api.monerium.app`
- Sandbox: `https://api.monerium.dev`

## Rules for all integrations

- Send `Accept: application/vnd.monerium.api-v2+json` on every API request.
- Keep access tokens and client secrets server-side. Never expose them to the browser.
- Dates are RFC 3339, UTC. IDs are UUIDs. Amounts are strings.
- On `429`, read `Retry-After` and back off exponentially.
- Do not use the zero UUID (`00000000-0000-0000-0000-000000000000`); it is reserved.

## Next steps

Read the matching skill's `SKILL.md` and its `references/` file before writing code. For common questions, load `monerium-faq`. For sandbox testing, load `monerium-sandbox`. For a condensed rules checklist, load `monerium-api-rules`.
