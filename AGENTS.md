# Agent Context for JS Monorepo

## Project Overview
This is a monorepo for Monerium, managed using `pnpm` and `turbo`. It contains Next.js applications, a Docusaurus documentation site, and various SDK, React Provider, and UI packages.

## Directory Structure
- `apps/customer/`: A Next.js application using `wagmi` and `viem` for Web3 integrations.
- `apps/developer/`: A Docusaurus-based developer documentation site.
- `packages/sdk/`: The core Monerium SDK.
- `packages/sdk-react-provider/`: React context and hooks wrapper for the SDK.
- `packages/openapi/`: OpenAPI specifications and schema generation.
- `packages/ui/`: Shared UI components for apps.
- Shared configurations: `eslint-config`, `postcss-config`, `stylelint-config`, `typescript-config`.

## Essential Commands (Run from root)
- `pnpm install` - Install dependencies across the workspace.
- `pnpm build` - Build all packages and apps via Turborepo.
- `pnpm dev` - Start development servers (`next dev`, Docusaurus, etc.).
- `pnpm test` - Run tests (Jest).
- `pnpm lint` - Run ESLint across the codebase.
- `pnpm lint:style` - Run Stylelint for CSS/SCSS files.
- `pnpm format` - Run Prettier to format `.ts`, `.tsx`, and `.md` files.
- `pnpm clean` - Remove node_modules, locks, and `.turbo` caches.

## Code Conventions & Architecture
- **Workspace Tools:** Uses `pnpm` workspaces (`pnpm-workspace.yaml`) and Turborepo (`turbo.json`) to manage task dependencies (e.g., `developer#build` depends on SDK, React Provider, and OpenAPI builds).
- **SDK Compatibility (`packages/sdk`):**
  - Code in `packages/sdk/src/client.ts` is the v4 implementation, while `compat.ts` handles v3 backward compatibility.
  - **Runtime Agnostic:** All code in `packages/sdk/src/` **must be runtime-agnostic**. It is designed for Node.js, Cloudflare Workers, MetaMask Snaps, and React Native without polyfills.
  - **Forbidden Globals:** Do not use `window`, `document`, `localStorage`, `sessionStorage`, `URL`, `URLSearchParams`, `TextEncoder`, or `TextDecoder`.
  - **Allowed Alternatives:** Use `urlEncoded()` from `src/utils.ts` instead of `URLSearchParams`. Use standard `encodeURIComponent`/`decodeURIComponent`.
  - **Exception:** `uploadSupportingDocument` in `src/client.ts` requires `Blob` and `FormData` (this is documented and acceptable as file uploads are not used in environments like MetaMask Snaps).
- **Customer App (`apps/customer`):** Written in React/Next.js using standard Next.js app router patterns (if applicable) or pages, integrated tightly with `viem`/`wagmi` for blockchain wallet interactions.

## CI & Release Pipeline
- **Continuous Integration:** `.github/workflows/ci.yml` uses Turborepo to cache tasks and run tests, linting, and builds for PRs.
- **Publishing:** Uses `release-please` for automated versioning and CHANGELOG generation.
- NPM packages are published using an **OIDC Trusted Publisher** configuration. Manual OIDC configuration should be strictly observed.
