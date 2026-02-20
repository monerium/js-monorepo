# @monerium/openapi

The OpenAPI specification for the [Monerium API](https://monerium.dev).

## Usage

The spec is published as part of this package and can be referenced locally in other packages in this monorepo.

```ts
require.resolve('@monerium/openapi')
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
## Spec location

The source of truth lives at:

```
packages/openapi/openapi.yml
```
