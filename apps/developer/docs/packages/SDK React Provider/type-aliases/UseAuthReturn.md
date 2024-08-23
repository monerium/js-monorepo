# Type Alias: UseAuthReturn

> **UseAuthReturn**: `object`

## Type declaration

### authorize()

> **authorize**: (`params`?) => `Promise`\<`void`\>

Constructs the url and redirects to the Monerium auth flow.

#### Parameters

• **params?**: [`AuthorizeParams`](/docs/packages/SDK%20React%20Provider/type-aliases/AuthorizeParams.md)

#### Returns

`Promise`\<`void`\>

### disconnect()

> **disconnect**: () => `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

### error

> **error**: `unknown`

### isAuthorized

> **isAuthorized**: `boolean`

Indicates whether the SDK is authorized.

### isLoading

> **isLoading**: `boolean`

Indicates whether the SDK authorization is loading.

### revokeAccess()

> **revokeAccess**: () => `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

## Defined in

[types.ts:21](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/types.ts#L21)
