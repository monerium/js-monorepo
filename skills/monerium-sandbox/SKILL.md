---
name: monerium-sandbox
description: 'Set up and test a Monerium integration in the sandbox. Covers minting test EURe, test gas faucets, the onboarding checklist, source-of-funds testing, and funding whitelabel profiles. Use when testing Monerium end-to-end before go-live.'
---

# Monerium sandbox

Use the sandbox at [sandbox.monerium.dev](https://sandbox.monerium.dev) to test without real money or real blockchain transactions. The sandbox API is `https://api.monerium.dev`.

## Before writing code

Read `references/sandbox.md` in full. It contains the sandbox checklist, test EURe, faucets, source-of-funds testing, and whitelabel funding.

## Key rules

- Mint test EURe in the sandbox UI: **Receive** page (`/receive`) -> **Simulate bank transfer** -> add money. This triggers the same `order.created` and `order.updated` webhooks as a real incoming payment.
- Get test gas from the Sepolia, Chiado, and Amoy faucets listed in the reference.
- Run the full checklist: create an application, authenticate, set up webhooks, onboard a profile, trigger `profile.error`, test source of funds, link a wallet, get an IBAN, mint test EURe, get test gas, fund whitelabel profiles, and place a test order.
- To fund whitelabel profiles, mint EURe on your regular sandbox profile and transfer it on-chain to the wallets linked to your whitelabel profiles.

## Reference

- `references/sandbox.md` — full sandbox guide.
