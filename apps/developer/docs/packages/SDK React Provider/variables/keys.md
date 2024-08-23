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

[hooks.tsx:29](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/hooks.tsx#L29)
