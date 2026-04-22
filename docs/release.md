# Release & Publish Pipeline

## Overview

Releases are automated using [release-please](https://github.com/googleapis/release-please). Publishing to npm uses [OIDC Trusted Publisher](https://docs.npmjs.com/generating-provenance-statements) — no npm tokens are stored anywhere.

## How a release works

1. Merge a PR into `main`
2. release-please opens (or updates) a release PR with a version bump and changelog
3. Merge the release PR into `main`
4. release-please creates a GitHub release and tag
5. `ci.yml` detects the release and automatically publishes the affected package(s) to npm

## Packages that get published

| Package                        | Path                          |
| ------------------------------ | ----------------------------- |
| `@monerium/sdk`                | `packages/sdk`                |
| `@monerium/sdk-react-provider` | `packages/sdk-react-provider` |
| `@monerium/openapi`            | `packages/openapi`            |

## Manual publish

To publish without going through a full release cycle, trigger the **CI** workflow manually from GitHub Actions:

1. Go to **Actions → CI → Run workflow**
2. Select the package and whether to do a dry run
3. Click **Run workflow**

> Manual dispatch also goes through `ci.yml`, which ensures the OIDC Trusted Publisher claims match.

## OIDC Trusted Publisher

Publishing uses GitHub Actions OIDC — no npm automation token is needed or stored.

**How it works:**

- At publish time, npm exchanges a short-lived GitHub OIDC token for a granular npm access token
- The npm registry validates the token against the Trusted Publisher configuration for each package
- If the claims match, publishing proceeds without any stored credentials

**Configuration on npmjs.com** (Settings → Trusted Publishers for each package):

| Field             | Value            |
| ----------------- | ---------------- |
| Publisher         | GitHub Actions   |
| Organization      | `monerium`       |
| Repository        | `js-monorepo`    |
| Workflow filename | `ci.yml`         |
| Environment       | `npm-production` |

> The workflow filename must be `ci.yml` — not `publish.yml`. npm validates the `workflow_ref` claim in the OIDC token, which is always the _calling_ workflow. Since all publishes (both automatic and manual) are triggered from `ci.yml`, this must match.

## Workflow structure

```
ci.yml  (single entry point for all publishes)
│
├── on: push → release-please → build → publish-*  (automatic)
└── on: workflow_dispatch → publish-*               (manual)
         ↓
    publish.yml  (reusable workflow — handles build, test, and npm publish)
```

`publish.yml` is a reusable workflow only — it has no `workflow_dispatch` trigger and cannot be run directly.

## Introducing a breaking change

release-please bumps the major version automatically when it sees a commit with a breaking change footer or a `!` in the type.

**In your commit message, use either:**

```
feat!: remove deprecated authorize() method
```

or a footer:

```
feat: replace authorize() with buildAuthorizationUrl()

BREAKING CHANGE: authorize() has been removed. Use buildAuthorizationUrl() instead.
```

Both will cause release-please to bump the major version (e.g. `1.x.x` → `2.0.0`) and add a `### ⚠ BREAKING CHANGES` section to the changelog.

**Tips:**

- You can stack multiple commits before merging the release PR — release-please will accumulate all breaking changes into one release
- Add a `BREAKING CHANGE` footer with a clear description of what changed and how to migrate; this goes directly into the changelog
- If you want to ship breaking changes alongside regular features in the same release, just include both commit types in the same batch — release-please will always use the highest version bump required

## Adjusting a version manually

Add `"release-as": "1.2.3"` to the relevant package in `release-please-config.json`, merge, then **remove it** after the release PR is merged. Leaving it in will cause release-please to keep reopening the same release.

## Useful links

- [release-please GitHub Action](https://github.com/marketplace/actions/release-please-action)
- [release-please config options](https://github.com/googleapis/release-please/blob/main/docs/manifest-releaser.md#configfile)
- [npm Trusted Publishing docs](https://docs.npmjs.com/generating-provenance-statements)
- [npmjs.com — @monerium/sdk access settings](https://www.npmjs.com/package/@monerium/sdk/access)
