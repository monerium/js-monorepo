# Monerium monorepo

### Install

Install PNPM: https://pnpm.io/installation

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
```

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

We use [release-please](https://github.com/googleapis/release-please), for automated releases. The configuration file is located at `release-please-config.json`, and the manifest file is at `.release-please-manifest.json`. In general, you don't need to manually update the manifest file because the release-please action automatically updates it.

If you need to adjust a package version, you can update the `release-please-config.json` file with `"release-as": "0.0.1"` for that package. Just remember to remove it after the release.

To trigger a release, you merge a PR into the main branch. The release process will create a new release branch and a PR. When you merge this PR into the main branch, a release will be created.

The pipeline will automatically publish the following packages if there are changes when a release is created:

- `@monerium/sdk` at 'packages/sdk'
- `@monerium/sdk-react-provider` at 'packages/sdk-react-provider'
- `@monerium/openapi` at 'packages/openapi'
- TBD: `@repo/ui` at 'packages/ui'

#### Useful links

[Release please - Github action](https://github.com/marketplace/actions/release-please-action)

[Release please - Config file options](https://github.com/googleapis/release-please/blob/main/docs/manifest-releaser.md#configfile)

# FAQ

## I merged a release PR, but it immediately opened a new PR for the same release.

Verify that the package version is not set to a specific version with `"release-as"` in the `release-please-config.json` file. If it is, remove it and merge the PR again.
