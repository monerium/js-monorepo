[**Monerium SDK React Provider v0.2.0**](../Packages.md) • **Docs**

***

[Monerium Packages](../../Packages.md) / [Monerium SDK React Provider](../Monerium%20SDK%20React%20Provider.md) / UseAuthReturn

# Type Alias: UseAuthReturn

> **UseAuthReturn**: `object`

## Type declaration

### authorize()

> **authorize**: (`params`?) => `Promise`\<`void`\>

Constructs the url and redirects to the Monerium auth flow.

#### Parameters

• **params?**: [`AuthorizeParams`](AuthorizeParams.md)

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

[sdk-react-provider/src/lib/types.ts:21](https://github.com/monerium/js-monorepo/blob/ffeefd2a9bccc0d18acecd9390a7bfced5720c17/packages/sdk-react-provider/src/lib/types.ts#L21)
