# Class: MoneriumClient

## Constructors

### new MoneriumClient()

> **new MoneriumClient**(`envOrOptions`?): [`MoneriumClient`](/docs/packages/SDK/classes/MoneriumClient.md)

#### Parameters

• **envOrOptions?**: [`ENV`](/docs/packages/SDK/type-aliases/ENV.md) \| [`ClassOptions`](/docs/packages/SDK/type-aliases/ClassOptions.md)

#### Returns

[`MoneriumClient`](/docs/packages/SDK/classes/MoneriumClient.md)

#### Default Value

`sandbox`

#### Example

```ts
new MoneriumClient() // defaults to `sandbox`

new MoneriumClient('production')

new MoneriumClient({
 environment: 'sandbox',
 clientId: 'your-client-id',
 redirectUri: 'your-redirect-url'
})
```

#### Defined in

[client.ts:90](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L90)

## Properties

### bearerProfile?

> `optional` **bearerProfile**: [`BearerProfile`](/docs/packages/SDK/interfaces/BearerProfile.md)

The bearer profile will be available after authentication, it includes the `access_token` and `refresh_token`

#### Defined in

[client.ts:61](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L61)

***

### isAuthorized

> **isAuthorized**: `boolean` = `!!this.bearerProfile`

#### Defined in

[client.ts:69](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L69)

***

### state

> **state**: `undefined` \| `string`

The state parameter is used to maintain state between the request and the callback.

#### Defined in

[client.ts:75](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L75)

## Methods

### Auth

#### authorize()

> **authorize**(`client`?): `Promise`\<`void`\>

Construct the url to the authorization code flow and redirects,
Code Verifier needed for the code challenge is stored in local storage
For automatic wallet link, add the following properties: `address`, `signature` & `chain`

##### Parameters

• **client?**: [`AuthFlowOptions`](/docs/packages/SDK/interfaces/AuthFlowOptions.md)

##### Returns

`Promise`\<`void`\>

string
[https://monerium.dev/api-docs#operation/auth](https://monerium.dev/api-docs#operation/auth)

##### Defined in

[client.ts:130](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L130)

***

#### disconnect()

> **disconnect**(): `Promise`\<`void`\>

Cleanups the socket and the subscriptions

##### Returns

`Promise`\<`void`\>

##### Defined in

[client.ts:525](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L525)

***

#### getAccess()

> **getAccess**(`client`?): `Promise`\<`boolean`\>

Will redirect to the authorization code flow and store the code verifier in the local storage

##### Parameters

• **client?**: [`ClientCredentials`](/docs/packages/SDK/interfaces/ClientCredentials.md) \| [`AuthorizationCodeCredentials`](/docs/packages/SDK/interfaces/AuthorizationCodeCredentials.md) \| [`DeprecatedAuthorizationCodeCredentials`](/docs/packages/SDK/interfaces/DeprecatedAuthorizationCodeCredentials.md)

the client credentials

##### Returns

`Promise`\<`boolean`\>

boolean to indicate if access has been granted

##### Example

```ts
import { MoneriumClient } from '@monerium/sdk';
 // Initialize the client with credentials
 const monerium = new MoneriumClient({
   environment: 'sandbox',
   clientId: 'your_client_credentials_uuid', // replace with your client ID
   clientSecret: 'your_client_secret', // replace with your client secret
 });

await monerium.getAccess();
```

##### Defined in

[client.ts:176](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L176)

***

#### getAuthContext()

> **getAuthContext**(): `Promise`\<[`AuthContext`](/docs/packages/SDK/interfaces/AuthContext.md)\>

[https://monerium.dev/api-docs#operation/auth-context](https://monerium.dev/api-docs#operation/auth-context)

##### Returns

`Promise`\<[`AuthContext`](/docs/packages/SDK/interfaces/AuthContext.md)\>

##### Defined in

[client.ts:298](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L298)

***

#### revokeAccess()

> **revokeAccess**(): `Promise`\<`void`\>

Revokes access

##### Returns

`Promise`\<`void`\>

##### Defined in

[client.ts:538](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L538)

### Accounts

#### getBalances()

> **getBalances**(`profileId`?): `Promise`\<[`Balances`](/docs/packages/SDK/interfaces/Balances.md)[]\>

[https://monerium.dev/api-docs#operation/profile-balances](https://monerium.dev/api-docs#operation/profile-balances)

##### Parameters

• **profileId?**: `string`

the id of the profile to fetch balances.

##### Returns

`Promise`\<[`Balances`](/docs/packages/SDK/interfaces/Balances.md)[]\>

##### Defined in

[client.ts:322](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L322)

***

#### linkAddress()

> **linkAddress**(`profileId`, `body`): `Promise`\<[`LinkedAddress`](/docs/packages/SDK/interfaces/LinkedAddress.md)\>

[https://monerium.dev/api-docs#operation/profile-addresses](https://monerium.dev/api-docs#operation/profile-addresses)

##### Parameters

• **profileId**: `string`

• **body**: [`LinkAddress`](/docs/packages/SDK/interfaces/LinkAddress.md)

##### Returns

`Promise`\<[`LinkedAddress`](/docs/packages/SDK/interfaces/LinkedAddress.md)\>

##### Defined in

[client.ts:361](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L361)

### Profiles

#### getProfile()

> **getProfile**(`profileId`): `Promise`\<[`Profile`](/docs/packages/SDK/interfaces/Profile.md)\>

[https://monerium.dev/api-docs#operation/profile](https://monerium.dev/api-docs#operation/profile)

##### Parameters

• **profileId**: `string`

the id of the profile to fetch.

##### Returns

`Promise`\<[`Profile`](/docs/packages/SDK/interfaces/Profile.md)\>

##### Defined in

[client.ts:307](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L307)

***

#### getProfiles()

> **getProfiles**(): `Promise`\<[`Profile`](/docs/packages/SDK/interfaces/Profile.md)[]\>

[https://monerium.dev/api-docs#operation/profiles](https://monerium.dev/api-docs#operation/profiles)

##### Returns

`Promise`\<[`Profile`](/docs/packages/SDK/interfaces/Profile.md)[]\>

##### Defined in

[client.ts:314](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L314)

### Orders

#### connectOrderSocket()

> **connectOrderSocket**(): `Promise`\<`void`\>

Connects to the order notifications socket

##### Returns

`Promise`\<`void`\>

##### Defined in

[client.ts:482](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L482)

***

#### getOrder()

> **getOrder**(`orderId`): `Promise`\<[`Order`](/docs/packages/SDK/interfaces/Order.md)\>

[https://monerium.dev/api-docs#operation/order](https://monerium.dev/api-docs#operation/order)

##### Parameters

• **orderId**: `string`

##### Returns

`Promise`\<[`Order`](/docs/packages/SDK/interfaces/Order.md)\>

##### Defined in

[client.ts:343](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L343)

***

#### getOrders()

> **getOrders**(`filter`?): `Promise`\<[`Order`](/docs/packages/SDK/interfaces/Order.md)[]\>

[https://monerium.dev/api-docs#operation/orders](https://monerium.dev/api-docs#operation/orders)

##### Parameters

• **filter?**: [`OrderFilter`](/docs/packages/SDK/interfaces/OrderFilter.md)

##### Returns

`Promise`\<[`Order`](/docs/packages/SDK/interfaces/Order.md)[]\>

##### Defined in

[client.ts:334](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L334)

***

#### placeOrder()

> **placeOrder**(`order`): `Promise`\<[`Order`](/docs/packages/SDK/interfaces/Order.md)\>

[https://monerium.dev/api-docs#operation/post-orders](https://monerium.dev/api-docs#operation/post-orders)

##### Parameters

• **order**: [`NewOrder`](/docs/packages/SDK/type-aliases/NewOrder.md)

##### Returns

`Promise`\<[`Order`](/docs/packages/SDK/interfaces/Order.md)\>

##### Defined in

[client.ts:376](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L376)

***

#### subscribeOrders()

> **subscribeOrders**(`event`, `handler`): `void`

Subscribe to MoneriumEvent to receive notifications using the Monerium API (WebSocket)
We are setting a subscription map because we need the user to have a token to start the WebSocket connection
[https://monerium.dev/api-docs#operation/profile-orders-notifications](https://monerium.dev/api-docs#operation/profile-orders-notifications)

##### Parameters

• **event**: [`OrderState`](/docs/packages/SDK/enumerations/OrderState.md)

The event to subscribe to

• **handler**: [`MoneriumEventListener`](/docs/packages/SDK/type-aliases/MoneriumEventListener.md)

The handler to be called when the event is triggered

##### Returns

`void`

##### Defined in

[client.ts:554](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L554)

***

#### subscribeToOrderNotifications()

> **subscribeToOrderNotifications**(): `WebSocket`

Subscribes to the order notifications socket

##### Returns

`WebSocket`

##### Defined in

[client.ts:493](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L493)

***

#### unsubscribeOrders()

> **unsubscribeOrders**(`event`): `void`

Unsubscribe from MoneriumEvent and close the socket if there are no more subscriptions

##### Parameters

• **event**: [`OrderState`](/docs/packages/SDK/enumerations/OrderState.md)

The event to unsubscribe from

##### Returns

`void`

##### Defined in

[client.ts:563](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L563)

***

#### uploadSupportingDocument()

> **uploadSupportingDocument**(`document`): `Promise`\<[`SupportingDoc`](/docs/packages/SDK/interfaces/SupportingDoc.md)\>

[https://monerium.dev/api-docs#operation/supporting-document](https://monerium.dev/api-docs#operation/supporting-document)

##### Parameters

• **document**: `File`

##### Returns

`Promise`\<[`SupportingDoc`](/docs/packages/SDK/interfaces/SupportingDoc.md)\>

##### Defined in

[client.ts:393](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L393)

### Tokens

#### getTokens()

> **getTokens**(): `Promise`\<[`Token`](/docs/packages/SDK/interfaces/Token.md)[]\>

[https://monerium.dev/api-docs#operation/tokens](https://monerium.dev/api-docs#operation/tokens)

##### Returns

`Promise`\<[`Token`](/docs/packages/SDK/interfaces/Token.md)[]\>

##### Defined in

[client.ts:351](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L351)
