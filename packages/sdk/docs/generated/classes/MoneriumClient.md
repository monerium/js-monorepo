[**Monerium SDK v2.12.1-beta0**](../README.md) • **Docs**

---

[Monerium SDK v2.12.1-beta0](../README.md) / MoneriumClient

# Class: MoneriumClient

## Constructors

### new MoneriumClient()

> **new MoneriumClient**(`envOrOptions`?): [`MoneriumClient`](MoneriumClient.md)

#### Parameters

• **envOrOptions?**: [`ENV`](../type-aliases/ENV.md) \| [`ClassOptions`](../type-aliases/ClassOptions.md)

#### Returns

[`MoneriumClient`](MoneriumClient.md)

#### Default Value

`sandbox`

#### Example

```ts
new MoneriumClient(); // defaults to `sandbox`

new MoneriumClient('production');

new MoneriumClient({
  environment: 'sandbox',
  clientId: 'your-client-id',
  redirectUrl: 'your-redirect-url',
});
```

#### Source

[client.ts:88](https://github.com/monerium/js-monorepo/blob/5652214d02f5add3c0253df8e24a10c8f67836ad/packages/sdk/src/client.ts#L88)

## Properties

### bearerProfile?

> `optional` **bearerProfile**: [`BearerProfile`](../interfaces/BearerProfile.md)

The bearer profile will be available after authentication, it includes the `access_token` and `refresh_token`

#### Source

[client.ts:59](https://github.com/monerium/js-monorepo/blob/5652214d02f5add3c0253df8e24a10c8f67836ad/packages/sdk/src/client.ts#L59)

---

### isAuthorized

> **isAuthorized**: `boolean` = `!!this.bearerProfile`

#### Source

[client.ts:67](https://github.com/monerium/js-monorepo/blob/5652214d02f5add3c0253df8e24a10c8f67836ad/packages/sdk/src/client.ts#L67)

---

### state

> **state**: `undefined` \| `string`

The state parameter is used to maintain state between the request and the callback.

#### Source

[client.ts:73](https://github.com/monerium/js-monorepo/blob/5652214d02f5add3c0253df8e24a10c8f67836ad/packages/sdk/src/client.ts#L73)

## Methods

### Auth

#### authorize()

> **authorize**(`client`?): `Promise`\<`void`\>

Construct the url to the authorization code flow,
Code Verifier needed for the code challenge is stored in local storage
For automatic wallet link, add the following properties: `address`, `signature` & `chainId`

##### Parameters

• **client?**: [`AuthFlowOptions`](../interfaces/AuthFlowOptions.md)

##### Returns

`Promise`\<`void`\>

string
[https://monerium.dev/api-docs#operation/auth](https://monerium.dev/api-docs#operation/auth)

##### Source

[client.ts:127](https://github.com/monerium/js-monorepo/blob/5652214d02f5add3c0253df8e24a10c8f67836ad/packages/sdk/src/client.ts#L127)

---

#### disconnect()

> **disconnect**(): `Promise`\<`void`\>

Cleanups the socket and the subscriptions

##### Returns

`Promise`\<`void`\>

##### Source

[client.ts:502](https://github.com/monerium/js-monorepo/blob/5652214d02f5add3c0253df8e24a10c8f67836ad/packages/sdk/src/client.ts#L502)

---

#### getAccess()

> **getAccess**(`client`?): `Promise`\<`boolean`\>

Get access to the API

##### Parameters

• **client?**: [`ClientCredentials`](../interfaces/ClientCredentials.md) \| [`AuthorizationCodeCredentials`](../interfaces/AuthorizationCodeCredentials.md)

the client credentials

##### Returns

`Promise`\<`boolean`\>

boolean to indicate if access has been granted

##### Source

[client.ts:161](https://github.com/monerium/js-monorepo/blob/5652214d02f5add3c0253df8e24a10c8f67836ad/packages/sdk/src/client.ts#L161)

---

#### getAuthContext()

> **getAuthContext**(): `Promise`\<[`AuthContext`](../interfaces/AuthContext.md)\>

[https://monerium.dev/api-docs#operation/auth-context](https://monerium.dev/api-docs#operation/auth-context)

##### Returns

`Promise`\<[`AuthContext`](../interfaces/AuthContext.md)\>

##### Source

[client.ts:274](https://github.com/monerium/js-monorepo/blob/5652214d02f5add3c0253df8e24a10c8f67836ad/packages/sdk/src/client.ts#L274)

---

#### revokeAccess()

> **revokeAccess**(): `Promise`\<`void`\>

Revokes access

##### Returns

`Promise`\<`void`\>

##### Source

[client.ts:515](https://github.com/monerium/js-monorepo/blob/5652214d02f5add3c0253df8e24a10c8f67836ad/packages/sdk/src/client.ts#L515)

### Accounts

#### getBalances()

> **getBalances**(`profileId`?): `Promise`\<[`Balances`](../interfaces/Balances.md)[]\>

[https://monerium.dev/api-docs#operation/profile-balances](https://monerium.dev/api-docs#operation/profile-balances)

##### Parameters

• **profileId?**: `string`

the id of the profile to fetch balances.

##### Returns

`Promise`\<[`Balances`](../interfaces/Balances.md)[]\>

##### Source

[client.ts:291](https://github.com/monerium/js-monorepo/blob/5652214d02f5add3c0253df8e24a10c8f67836ad/packages/sdk/src/client.ts#L291)

---

#### linkAddress()

> **linkAddress**(`profileId`, `body`): `Promise`\<`unknown`\>

[https://monerium.dev/api-docs#operation/profile-addresses](https://monerium.dev/api-docs#operation/profile-addresses)

##### Parameters

• **profileId**: `string`

• **body**: [`LinkAddress`](../interfaces/LinkAddress.md)

##### Returns

`Promise`\<`unknown`\>

##### Source

[client.ts:329](https://github.com/monerium/js-monorepo/blob/5652214d02f5add3c0253df8e24a10c8f67836ad/packages/sdk/src/client.ts#L329)

### Profiles

#### getProfile()

> **getProfile**(`profileId`): `Promise`\<[`Profile`](../interfaces/Profile.md)\>

[https://monerium.dev/api-docs#operation/profile](https://monerium.dev/api-docs#operation/profile)

##### Parameters

• **profileId**: `string`

the id of the profile to fetch.

##### Returns

`Promise`\<[`Profile`](../interfaces/Profile.md)\>

##### Source

[client.ts:283](https://github.com/monerium/js-monorepo/blob/5652214d02f5add3c0253df8e24a10c8f67836ad/packages/sdk/src/client.ts#L283)

### Orders

#### connectOrderSocket()

> **connectOrderSocket**(): `Promise`\<`void`\>

Connects to the order notifications socket

##### Returns

`Promise`\<`void`\>

##### Source

[client.ts:459](https://github.com/monerium/js-monorepo/blob/5652214d02f5add3c0253df8e24a10c8f67836ad/packages/sdk/src/client.ts#L459)

---

#### getOrder()

> **getOrder**(`orderId`): `Promise`\<[`Order`](../interfaces/Order.md)\>

[https://monerium.dev/api-docs#operation/order](https://monerium.dev/api-docs#operation/order)

##### Parameters

• **orderId**: `string`

##### Returns

`Promise`\<[`Order`](../interfaces/Order.md)\>

##### Source

[client.ts:311](https://github.com/monerium/js-monorepo/blob/5652214d02f5add3c0253df8e24a10c8f67836ad/packages/sdk/src/client.ts#L311)

---

#### getOrders()

> **getOrders**(`filter`?): `Promise`\<[`Order`](../interfaces/Order.md)[]\>

[https://monerium.dev/api-docs#operation/orders](https://monerium.dev/api-docs#operation/orders)

##### Parameters

• **filter?**: [`OrderFilter`](../interfaces/OrderFilter.md)

##### Returns

`Promise`\<[`Order`](../interfaces/Order.md)[]\>

##### Source

[client.ts:303](https://github.com/monerium/js-monorepo/blob/5652214d02f5add3c0253df8e24a10c8f67836ad/packages/sdk/src/client.ts#L303)

---

#### placeOrder()

> **placeOrder**(`order`, `profileId`?): `Promise`\<[`Order`](../interfaces/Order.md)\>

[https://monerium.dev/api-docs#operation/post-orders](https://monerium.dev/api-docs#operation/post-orders)

##### Parameters

• **order**: [`NewOrder`](../type-aliases/NewOrder.md)

• **profileId?**: `string`

##### Returns

`Promise`\<[`Order`](../interfaces/Order.md)\>

##### Source

[client.ts:344](https://github.com/monerium/js-monorepo/blob/5652214d02f5add3c0253df8e24a10c8f67836ad/packages/sdk/src/client.ts#L344)

---

#### subscribeOrders()

> **subscribeOrders**(`event`, `handler`): `void`

Subscribe to MoneriumEvent to receive notifications using the Monerium API (WebSocket)
We are setting a subscription map because we need the user to have a token to start the WebSocket connection
[https://monerium.dev/api-docs#operation/profile-orders-notifications](https://monerium.dev/api-docs#operation/profile-orders-notifications)

##### Parameters

• **event**: [`OrderState`](../enumerations/OrderState.md)

The event to subscribe to

• **handler**: [`MoneriumEventListener`](../type-aliases/MoneriumEventListener.md)

The handler to be called when the event is triggered

##### Returns

`void`

##### Source

[client.ts:531](https://github.com/monerium/js-monorepo/blob/5652214d02f5add3c0253df8e24a10c8f67836ad/packages/sdk/src/client.ts#L531)

---

#### subscribeToOrderNotifications()

> **subscribeToOrderNotifications**(): `WebSocket`

Subscribes to the order notifications socket

##### Returns

`WebSocket`

##### Source

[client.ts:470](https://github.com/monerium/js-monorepo/blob/5652214d02f5add3c0253df8e24a10c8f67836ad/packages/sdk/src/client.ts#L470)

---

#### unsubscribeOrders()

> **unsubscribeOrders**(`event`): `void`

Unsubscribe from MoneriumEvent and close the socket if there are no more subscriptions

##### Parameters

• **event**: [`OrderState`](../enumerations/OrderState.md)

The event to unsubscribe from

##### Returns

`void`

##### Source

[client.ts:540](https://github.com/monerium/js-monorepo/blob/5652214d02f5add3c0253df8e24a10c8f67836ad/packages/sdk/src/client.ts#L540)

---

#### uploadSupportingDocument()

> **uploadSupportingDocument**(`document`): `Promise`\<[`SupportingDoc`](../interfaces/SupportingDoc.md)\>

[https://monerium.dev/api-docs#operation/supporting-document](https://monerium.dev/api-docs#operation/supporting-document)

##### Parameters

• **document**: `File`

##### Returns

`Promise`\<[`SupportingDoc`](../interfaces/SupportingDoc.md)\>

##### Source

[client.ts:370](https://github.com/monerium/js-monorepo/blob/5652214d02f5add3c0253df8e24a10c8f67836ad/packages/sdk/src/client.ts#L370)

### Tokens

#### getTokens()

> **getTokens**(): `Promise`\<[`Token`](../interfaces/Token.md)[]\>

[https://monerium.dev/api-docs#operation/tokens](https://monerium.dev/api-docs#operation/tokens)

##### Returns

`Promise`\<[`Token`](../interfaces/Token.md)[]\>

##### Source

[client.ts:319](https://github.com/monerium/js-monorepo/blob/5652214d02f5add3c0253df8e24a10c8f67836ad/packages/sdk/src/client.ts#L319)
