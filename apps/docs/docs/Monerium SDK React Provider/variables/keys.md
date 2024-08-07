[**Monerium SDK React Provider v0.2.0**](../Packages.md) • **Docs**

***

[Monerium Packages](../../Packages.md) / [Monerium SDK React Provider](../Monerium%20SDK%20React%20Provider.md) / keys

# Variable: keys

> `const` **keys**: `object`

**`Internal`**

Query keys

## Type declaration

### getAll

> **getAll**: `string`[]

### getAuthContext

> **getAuthContext**: `string`[]

### getBalances()

> **getBalances**: (`profileId`?) => `string`[]

#### Parameters

• **profileId?**: `string`

#### Returns

`string`[]

### getOrder()

> **getOrder**: (`orderId`) => `string`[]

#### Parameters

• **orderId**: `string`

#### Returns

`string`[]

### getOrders()

> **getOrders**: (`filter`?) => `object`[]

#### Parameters

• **filter?**: `unknown`

#### Returns

`object`[]

### getProfile()

> **getProfile**: (`profileId`) => `string`[]

#### Parameters

• **profileId**: `string`

#### Returns

`string`[]

### getProfiles

> **getProfiles**: `string`[]

### getTokens

> **getTokens**: `string`[]

### linkAddress

> **linkAddress**: `string`[]

### placeOrder

> **placeOrder**: `string`[]

## Defined in

[sdk-react-provider/src/lib/hooks.tsx:29](https://github.com/monerium/js-monorepo/blob/ffeefd2a9bccc0d18acecd9390a7bfced5720c17/packages/sdk-react-provider/src/lib/hooks.tsx#L29)
