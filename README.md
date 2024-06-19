# Turborepo starter

This is an official starter Turborepo.

## Using this example

Run the following command:

```sh
pnpm exec create-turbo@latest
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `customer`: a [Next.js](https://nextjs.org/) app, an open source Monerium client
- `@monerium/sdk`: an SDK for interacting with the Monerium API
- `@monerium/sdk-react-provider`: a React provider for the Monerium SDK
- `@repo/ui`: a sharable stub React component library
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/postcss-config`: `postcss` configurations
- `@repo/stylelint-config`: `stylelint` configurations
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

### Utilities

- [TurboRepo](https://turbo.build/repo) for monorepo management
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

### Build

To build all apps and packages, run the following command:

```
cd js-monorepo
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```
cd js-monorepo
pnpm dev
```

Note: use `pnpm dev --log-order stream` for a more traditional log output.

### Pipeline

We use [release-please](https://github.com/googleapis/release-please), for automated releases. The configuration file is located at `release-please-config.json`, and the manifest file is at `.release-please-manifest.json`. In general, you don't need to manually update the manifest file because the release-please action automatically updates it.

If you need to adjust a package version, you can update the `release-please-config.json` file with `"release-as": "0.0.1"` for that package. Just remember to remove it after the release.

To trigger a release, you merge a PR into the main branch. The release process will create a new release branch and a PR. When you merge this PR into the main branch, a release will be created.

The pipeline will automatically publish the following packages if there are changes when a release is created:

- `@monerium/sdk` at 'packages/sdk'
- `@monerium/sdk-react-provider` at 'packages/sdk-react-provider'
- TBD: `@repo/ui` at 'packages/ui'

#### Useful links

[Release please - Github action](https://github.com/marketplace/actions/release-please-action)
[Release please - Config file options](https://github.com/googleapis/release-please/blob/main/docs/manifest-releaser.md#configfile)

### Remote Caching

Turborepo can use a technique known as [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup), then enter the following commands:

```
cd my-turborepo
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
npx turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)
