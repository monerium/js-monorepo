[**Monerium SDK**](../README.md) • **Docs**

---

[Monerium SDK](../README.md) / MoneriumClient

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

#### Defined in

[client.ts:89](https://github.com/monerium/js-monorepo/blob/daf0515eb0b1bfcdd9bd49ef605447668fdb0f6a/packages/sdk/src/client.ts#L89)

## Properties

### bearerProfile?

> `optional` **bearerProfile**: [`BearerProfile`](../interfaces/BearerProfile.md)

The bearer profile will be available after authentication, it includes the `access_token` and `refresh_token`

#### Defined in

[client.ts:60](https://github.com/monerium/js-monorepo/blob/daf0515eb0b1bfcdd9bd49ef605447668fdb0f6a/packages/sdk/src/client.ts#L60)

---

### isAuthorized

> **isAuthorized**: `boolean` = `!!this.bearerProfile`

#### Defined in

[client.ts:68](https://github.com/monerium/js-monorepo/blob/daf0515eb0b1bfcdd9bd49ef605447668fdb0f6a/packages/sdk/src/client.ts#L68)

---

### state

> **state**: `undefined` \| `string`

The state parameter is used to maintain state between the request and the callback.

#### Defined in

[client.ts:74](https://github.com/monerium/js-monorepo/blob/daf0515eb0b1bfcdd9bd49ef605447668fdb0f6a/packages/sdk/src/client.ts#L74)

## Methods

### Auth

#### authorize()

> **authorize**(`client`?): `Promise`\<`void`\>

Construct the url to the authorization code flow and redirects,
Code Verifier needed for the code challenge is stored in local storage
For automatic wallet link, add the following properties: `address`, `signature` & `chainId`

##### Parameters

• **client?**: [`AuthFlowOptions`](../interfaces/AuthFlowOptions.md)

##### Returns

`Promise`\<`void`\>

string
[https://monerium.dev/api-docs#operation/auth](https://monerium.dev/api-docs#operation/auth)

##### Defined in

[client.ts:128](https://github.com/monerium/js-monorepo/blob/daf0515eb0b1bfcdd9bd49ef605447668fdb0f6a/packages/sdk/src/client.ts#L128)

---

#### disconnect()

> **disconnect**(): `Promise`\<`void`\>

Cleanups the socket and the subscriptions

##### Returns

`Promise`\<`void`\>

##### Defined in

[client.ts:503](https://github.com/monerium/js-monorepo/blob/daf0515eb0b1bfcdd9bd49ef605447668fdb0f6a/packages/sdk/src/client.ts#L503)

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

##### Defined in

[client.ts:163](https://github.com/monerium/js-monorepo/blob/daf0515eb0b1bfcdd9bd49ef605447668fdb0f6a/packages/sdk/src/client.ts#L163)

---

#### getAuthContext()

> **getAuthContext**(): `Promise`\<[`AuthContext`](../interfaces/AuthContext.md)\>

[https://monerium.dev/api-docs#operation/auth-context](https://monerium.dev/api-docs#operation/auth-context)

##### Returns

`Promise`\<[`AuthContext`](../interfaces/AuthContext.md)\>

##### Defined in

[client.ts:276](https://github.com/monerium/js-monorepo/blob/daf0515eb0b1bfcdd9bd49ef605447668fdb0f6a/packages/sdk/src/client.ts#L276)

---

#### revokeAccess()

> **revokeAccess**(): `Promise`\<`void`\>

Revokes access

##### Returns

`Promise`\<`void`\>

##### Defined in

[client.ts:516](https://github.com/monerium/js-monorepo/blob/daf0515eb0b1bfcdd9bd49ef605447668fdb0f6a/packages/sdk/src/client.ts#L516)

### Accounts

#### getBalances()

> **getBalances**(`profileId`?): `Promise`\<[`Balances`](../interfaces/Balances.md)[]\>

[https://monerium.dev/api-docs#operation/profile-balances](https://monerium.dev/api-docs#operation/profile-balances)

##### Parameters

• **profileId?**: `string`

the id of the profile to fetch balances.

##### Returns

`Promise`\<[`Balances`](../interfaces/Balances.md)[]\>

##### Defined in

[client.ts:300](https://github.com/monerium/js-monorepo/blob/daf0515eb0b1bfcdd9bd49ef605447668fdb0f6a/packages/sdk/src/client.ts#L300)

---

#### linkAddress()

> **linkAddress**(`profileId`, `body`): `Promise`\<[`LinkedAddress`](../interfaces/LinkedAddress.md)\>

[https://monerium.dev/api-docs#operation/profile-addresses](https://monerium.dev/api-docs#operation/profile-addresses)

##### Parameters

• **profileId**: `string`

• **body**: [`LinkAddress`](../interfaces/LinkAddress.md)

##### Returns

`Promise`\<[`LinkedAddress`](../interfaces/LinkedAddress.md)\>

##### Defined in

[client.ts:339](https://github.com/monerium/js-monorepo/blob/daf0515eb0b1bfcdd9bd49ef605447668fdb0f6a/packages/sdk/src/client.ts#L339)

### Profiles

#### getProfile()

> **getProfile**(`profileId`): `Promise`\<[`Profile`](../interfaces/Profile.md)\>

[https://monerium.dev/api-docs#operation/profile](https://monerium.dev/api-docs#operation/profile)

##### Parameters

• **profileId**: `string`

the id of the profile to fetch.

##### Returns

`Promise`\<[`Profile`](../interfaces/Profile.md)\>

##### Defined in

[client.ts:285](https://github.com/monerium/js-monorepo/blob/daf0515eb0b1bfcdd9bd49ef605447668fdb0f6a/packages/sdk/src/client.ts#L285)

---

#### getProfiles()

> **getProfiles**(): `Promise`\<[`Profile`](../interfaces/Profile.md)[]\>

[https://monerium.dev/api-docs#operation/profiles](https://monerium.dev/api-docs#operation/profiles)

##### Returns

`Promise`\<[`Profile`](../interfaces/Profile.md)[]\>

##### Defined in

[client.ts:292](https://github.com/monerium/js-monorepo/blob/daf0515eb0b1bfcdd9bd49ef605447668fdb0f6a/packages/sdk/src/client.ts#L292)

### Orders

#### connectOrderSocket()

> **connectOrderSocket**(): `Promise`\<`void`\>

Connects to the order notifications socket

##### Returns

`Promise`\<`void`\>

##### Defined in

[client.ts:460](https://github.com/monerium/js-monorepo/blob/daf0515eb0b1bfcdd9bd49ef605447668fdb0f6a/packages/sdk/src/client.ts#L460)

---

#### getOrder()

> **getOrder**(`orderId`): `Promise`\<[`Order`](../interfaces/Order.md)\>

[https://monerium.dev/api-docs#operation/order](https://monerium.dev/api-docs#operation/order)

##### Parameters

• **orderId**: `string`

##### Returns

`Promise`\<[`Order`](../interfaces/Order.md)\>

##### Defined in

[client.ts:321](https://github.com/monerium/js-monorepo/blob/daf0515eb0b1bfcdd9bd49ef605447668fdb0f6a/packages/sdk/src/client.ts#L321)

---

#### getOrders()

> **getOrders**(`filter`?): `Promise`\<[`Order`](../interfaces/Order.md)[]\>

[https://monerium.dev/api-docs#operation/orders](https://monerium.dev/api-docs#operation/orders)

##### Parameters

• **filter?**: [`OrderFilter`](../interfaces/OrderFilter.md)

##### Returns

`Promise`\<[`Order`](../interfaces/Order.md)[]\>

##### Defined in

[client.ts:312](https://github.com/monerium/js-monorepo/blob/daf0515eb0b1bfcdd9bd49ef605447668fdb0f6a/packages/sdk/src/client.ts#L312)

---

#### placeOrder()

> **placeOrder**(`order`): `Promise`\<[`Order`](../interfaces/Order.md)\>

[https://monerium.dev/api-docs#operation/post-orders](https://monerium.dev/api-docs#operation/post-orders)

##### Parameters

• **order**: [`NewOrder`](../type-aliases/NewOrder.md)

##### Returns

`Promise`\<[`Order`](../interfaces/Order.md)\>

##### Defined in

[client.ts:354](https://github.com/monerium/js-monorepo/blob/daf0515eb0b1bfcdd9bd49ef605447668fdb0f6a/packages/sdk/src/client.ts#L354)

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

##### Defined in

[client.ts:532](https://github.com/monerium/js-monorepo/blob/daf0515eb0b1bfcdd9bd49ef605447668fdb0f6a/packages/sdk/src/client.ts#L532)

---

#### subscribeToOrderNotifications()

> **subscribeToOrderNotifications**(): `WebSocket`

Subscribes to the order notifications socket

##### Returns

`WebSocket`

##### Defined in

[client.ts:471](https://github.com/monerium/js-monorepo/blob/daf0515eb0b1bfcdd9bd49ef605447668fdb0f6a/packages/sdk/src/client.ts#L471)

---

#### unsubscribeOrders()

> **unsubscribeOrders**(`event`): `void`

Unsubscribe from MoneriumEvent and close the socket if there are no more subscriptions

##### Parameters

• **event**: [`OrderState`](../enumerations/OrderState.md)

The event to unsubscribe from

##### Returns

`void`

##### Defined in

[client.ts:541](https://github.com/monerium/js-monorepo/blob/daf0515eb0b1bfcdd9bd49ef605447668fdb0f6a/packages/sdk/src/client.ts#L541)

---

#### uploadSupportingDocument()

> **uploadSupportingDocument**(`document`): `Promise`\<[`SupportingDoc`](../interfaces/SupportingDoc.md)\>

[https://monerium.dev/api-docs#operation/supporting-document](https://monerium.dev/api-docs#operation/supporting-document)

##### Parameters

• **document**: `File`

##### Returns

`Promise`\<[`SupportingDoc`](../interfaces/SupportingDoc.md)\>

##### Defined in

[client.ts:371](https://github.com/monerium/js-monorepo/blob/daf0515eb0b1bfcdd9bd49ef605447668fdb0f6a/packages/sdk/src/client.ts#L371)

### Tokens

#### getTokens()

> **getTokens**(): `Promise`\<[`Token`](../interfaces/Token.md)[]\>

[https://monerium.dev/api-docs#operation/tokens](https://monerium.dev/api-docs#operation/tokens)

##### Returns

`Promise`\<[`Token`](../interfaces/Token.md)[]\>

##### Defined in

[client.ts:329](https://github.com/monerium/js-monorepo/blob/daf0515eb0b1bfcdd9bd49ef605447668fdb0f6a/packages/sdk/src/client.ts#L329)
