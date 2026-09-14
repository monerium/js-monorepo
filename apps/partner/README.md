# Monerium Partner Tool

Vite + React playground for testing the Monerium whitelabel SDK integration against Sandbox on Ethereum Sepolia. Wallet connection uses Reown AppKit with the Ethers adapter, supporting injected wallets and WalletConnect.

## Run locally

From the monorepo root:

```bash
pnpm install
pnpm --filter partner dev
```

Provide the whitelabel client credentials and Reown project ID in `.env`, then open [http://localhost:5173](http://localhost:5173). If `.env` is absent, both the Vite client and local proxy automatically use `.env.example`; shell environment variables take precedence.

The Node proxy uses the whitelabel client-credentials flow and keeps the client secret and access token server-side. This follows the whitelabel integration guidance: all Monerium API calls are made by the backend.
