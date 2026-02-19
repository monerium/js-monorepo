# @monerium/openapi

The OpenAPI specification for the [Monerium API](https://monerium.dev).

## Usage

The spec is published as part of this package and can be referenced locally in other packages in this monorepo.

```ts
import path from 'path';

// resolve the absolute path to the spec file
path.resolve(__dirname, '../../packages/openapi/openapi.yml')
```

## Development

### Prerequisites

Install dependencies from the monorepo root:

```sh
pnpm install
```

### Preview docs

Spin up a local [Redoc](https://redocly.com/redoc) preview of the spec:

```sh
pnpm dev
```

### Validate

Lint and validate the spec against OpenAPI 3.1 rules:

```sh
pnpm validate
```

### Build

Copy the spec to `dist/` so it can be consumed by other packages:

```sh
pnpm build
```

## Spec location

The source of truth lives at:

```
packages/openapi/src/openapi-v2.yml
```

All edits should be made there. The `dist/` directory is generated — do not edit it directly.
