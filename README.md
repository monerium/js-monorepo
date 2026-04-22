# Monerium monorepo

### Install

Install PNPM: https://pnpm.io/installation, see which version in package.json.

PNPM is a fast, disk space efficient package manager that uses hard links and symlinks to save space. **It is also optimized for monorepos.**

```
pnpm install
```

### Develop

To develop apps and packages, run the following command:

```bash
pnpm dev
# or just developer portal
pnpm dev --filter=developer

# To install a dependency for a certain app/package
pnpm add wagmi --filter=@monerium/sdk
```

>

Note: use `pnpm dev --log-order stream` for a more traditional log output. Or set `"ui": "stream"` in the `turbo.json` file to make it the default.

- Developer portal: http://localhost:3333/
- OpenAPI standalone: http://localhost:8080/
- Demo app: http://localhost:5000

### Build

To build all apps and packages, run the following command:

```bash
pnpm build
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- [`customer`](apps/developer): a [Docusaurus](https://docusaurus.io/) developer portal, served on https://docs.monerium.com.
- [`@monerium/sdk`](packages/sdk): an SDK for interacting with the Monerium API
- [`@monerium/sdk-react-provider`](packages/sdk-react-provider): a React provider for the Monerium SDK
- [`@monerium/openapi`](packages/openapi): OpenAPI specification using Redocly.
- [`customer`](apps/customer): a [Next.js](https://nextjs.org/) app, an open source Monerium client demo
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/postcss-config`: `postcss` configurations
- `@repo/stylelint-config`: `stylelint` configurations
- `@repo/typescript-config`: `tsconfig.json`'s used throughout the monorepo
- `@repo/ui`: a sharable stub React component library - not used currently

### Migration Guide

> SDK 3.0.0 and React Provider 1.0.0
> [SDK Migration Guide](apps/developer/docs/MigrationGuide.md)

### Utilities

- [TurboRepo](https://turbo.build/repo) for monorepo management, [Turbo.md](docs/Turbo.md) for more details
- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [PostCSS](https://postcss.org/) for CSS processing
- [Stylelint](https://stylelint.io/) for CSS linting
- [Jest](https://jestjs.io/) for testing
- [Commitlint](https://commitlint.js.org/) for commit message linting
- [Husky](https://typicode.github.io/husky/) for Git hooks
- [Lint-Staged](https://github.com/lint-staged/lint-staged) for running linters on staged files
- [Release Please](https://github.com/googleapis/release-please) for automated releases

### Pipeline

Releases are automated with release-please and published to npm via OIDC Trusted Publisher — no tokens stored anywhere.

See **[docs/release.md](docs/release.md)** for the full details.

# FAQ

## I merged a release PR, but it immediately opened a new PR for the same release.

Verify that the package version is not set to a specific version with `"release-as"` in the `release-please-config.json` file. If it is, remove it and merge the PR again.
