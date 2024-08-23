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
const monerium = new MoneriumClient() // defaults to `sandbox`
// or
new MoneriumClient('production')

new MoneriumClient({
 environment: 'sandbox',
 clientId: 'your-client-id',
 redirectUri: 'your-redirect-url'
})

// Server side only
new MoneriumClient({
 environment: 'sandbox',
 clientId: 'your-client-id',
 clientSecret: 'your-secret'
})
```

#### Defined in

[client.ts:105](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L105)

## Properties

### bearerProfile?

> `optional` **bearerProfile**: [`BearerProfile`](/docs/packages/SDK/interfaces/BearerProfile.md)

The bearer profile will be available after authentication, it includes the `access_token` and `refresh_token`

#### Defined in

[client.ts:71](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L71)

***

### isAuthorized

> **isAuthorized**: `boolean` = `!!this.bearerProfile`

#### Defined in

[client.ts:77](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L77)

***

### state

> **state**: `undefined` \| `string`

The state parameter is used to maintain state between the request and the callback.

#### Defined in

[client.ts:83](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L83)

## Methods

### Addresses

#### getAddress()

> **getAddress**(`address`): `Promise`\<[`Address`](/docs/packages/SDK/interfaces/Address.md)\>

# Get a single address
Get details for a single address by using the address public key after the address has been successfully linked to Monerium.

##### Parameters

• **address**: `string`

The public key of the blockchain account.
[API Documentation](https://monerium.dev/api-docs-v2#tag/addresses/operation/address)

##### Returns

`Promise`\<[`Address`](/docs/packages/SDK/interfaces/Address.md)\>

##### Example

```
monerium.getAddress('0x1234567890abcdef1234567890abcdef12345678')
```

##### Defined in

[client.ts:333](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L333)

***

#### getAddresses()

> **getAddresses**(`__namedParameters`): `Promise`\<[`Addresses`](/docs/packages/SDK/interfaces/Addresses.md)\>

[https://monerium.dev/api-docs-v2#tag/addresses/operation/addresses](https://monerium.dev/api-docs-v2#tag/addresses/operation/addresses)

##### Parameters

• **\_\_namedParameters**: [`AddressesQueryParams`](/docs/packages/SDK/interfaces/AddressesQueryParams.md) = `{}`

##### Returns

`Promise`\<[`Addresses`](/docs/packages/SDK/interfaces/Addresses.md)\>

##### Defined in

[client.ts:343](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L343)

***

#### getBalances()

> **getBalances**(`profile`): `Promise`\<[`Balances`](/docs/packages/SDK/interfaces/Balances.md)[]\>

[https://monerium.dev/api-docs-v2#tag/addresses/operation/profile-balances](https://monerium.dev/api-docs-v2#tag/addresses/operation/profile-balances)

##### Parameters

• **profile**: `string`

##### Returns

`Promise`\<[`Balances`](/docs/packages/SDK/interfaces/Balances.md)[]\>

##### Defined in

[client.ts:359](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L359)

***

#### linkAddress()

> **linkAddress**(`body`): `Promise`\<[`ResponseStatus`](/docs/packages/SDK/type-aliases/ResponseStatus.md)\>

[https://monerium.dev/api-docs-v2#tag/addresses/operation/link-address](https://monerium.dev/api-docs-v2#tag/addresses/operation/link-address)

##### Parameters

• **body**: [`LinkAddress`](/docs/packages/SDK/interfaces/LinkAddress.md)

##### Returns

`Promise`\<[`ResponseStatus`](/docs/packages/SDK/type-aliases/ResponseStatus.md)\>

##### Defined in

[client.ts:412](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L412)

### Authentication

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

##### Link

[API Documentation](https://monerium.dev/api-docs-v2#tag/auth/operation/auth)

##### Defined in

[client.ts:148](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L148)

***

#### disconnect()

> **disconnect**(): `Promise`\<`void`\>

Cleanups the socket and the subscriptions

##### Returns

`Promise`\<`void`\>

##### Defined in

[client.ts:669](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L669)

***

#### getAccess()

> **getAccess**(`client`?): `Promise`\<`boolean`\>

Will redirect to the authorization code flow and store the code verifier in the local storage

##### Parameters

• **client?**: [`ClientCredentials`](/docs/packages/SDK/interfaces/ClientCredentials.md) \| [`AuthorizationCodeCredentials`](/docs/packages/SDK/interfaces/AuthorizationCodeCredentials.md)

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

[client.ts:190](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L190)

***

#### revokeAccess()

> **revokeAccess**(): `Promise`\<`void`\>

Revokes access

##### Returns

`Promise`\<`void`\>

##### Defined in

[client.ts:681](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L681)

***

#### signUp()

> **signUp**(`body`): `Promise`\<[`SignUpResponse`](/docs/packages/SDK/interfaces/SignUpResponse.md)\>

[https://monerium.dev/api-docs-v2#tag/auth/operation/auth-signup](https://monerium.dev/api-docs-v2#tag/auth/operation/auth-signup)

##### Parameters

• **body**: [`SignUpPayload`](/docs/packages/SDK/interfaces/SignUpPayload.md)

##### Returns

`Promise`\<[`SignUpResponse`](/docs/packages/SDK/interfaces/SignUpResponse.md)\>

##### Defined in

[client.ts:468](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L468)

### IBANs

#### getIban()

> **getIban**(`iban`): `Promise`\<[`IBAN`](/docs/packages/SDK/interfaces/IBAN.md)\>

"https://monerium.dev/api-docs-v2#tag/ibans/operation/iban"

##### Parameters

• **iban**: `string`

##### Returns

`Promise`\<[`IBAN`](/docs/packages/SDK/interfaces/IBAN.md)\>

##### Defined in

[client.ts:367](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L367)

***

#### getIbans()

> **getIbans**(`queryParameters`?): `Promise`\<[`IBANsResponse`](/docs/packages/SDK/interfaces/IBANsResponse.md)\>

"https://monerium.dev/api-docs-v2#tag/ibans/operation/ibans"

##### Parameters

• **queryParameters?**: [`IbansQueryParams`](/docs/packages/SDK/interfaces/IbansQueryParams.md)

##### Returns

`Promise`\<[`IBANsResponse`](/docs/packages/SDK/interfaces/IBANsResponse.md)\>

##### Defined in

[client.ts:374](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L374)

***

#### moveIban()

> **moveIban**(`iban`, `__namedParameters`): `Promise`\<[`ResponseStatus`](/docs/packages/SDK/type-aliases/ResponseStatus.md)\>

[https://monerium.dev/api-docs-v2#tag/ibans/operation/move-iban](https://monerium.dev/api-docs-v2#tag/ibans/operation/move-iban)

##### Parameters

• **iban**: `string`

• **\_\_namedParameters**: [`MoveIbanPayload`](/docs/packages/SDK/interfaces/MoveIbanPayload.md)

##### Returns

`Promise`\<[`ResponseStatus`](/docs/packages/SDK/type-aliases/ResponseStatus.md)\>

##### Defined in

[client.ts:438](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L438)

***

#### requestIban()

> **requestIban**(`__namedParameters`): `Promise`\<[`ResponseStatus`](/docs/packages/SDK/type-aliases/ResponseStatus.md)\>

[https://monerium.dev/api-docs-v2#tag/ibans/operation/request-iban](https://monerium.dev/api-docs-v2#tag/ibans/operation/request-iban)

##### Parameters

• **\_\_namedParameters**: [`RequestIbanPayload`](/docs/packages/SDK/interfaces/RequestIbanPayload.md)

##### Returns

`Promise`\<[`ResponseStatus`](/docs/packages/SDK/type-aliases/ResponseStatus.md)\>

##### Defined in

[client.ts:452](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L452)

### Orders
[Websocket](https://monerium.dev/api-docs-v2#tag/orders/operation/orders-notifications)

#### connectOrderNotifications()

> **connectOrderNotifications**(`__namedParameters`): `undefined` \| `WebSocket`

Connects to the order notifications socket

##### Parameters

• **\_\_namedParameters** = `{}`

• **\_\_namedParameters.filter?**: [`OrderNotificationQueryParams`](/docs/packages/SDK/interfaces/OrderNotificationQueryParams.md)

• **\_\_namedParameters.onError?**

• **\_\_namedParameters.onMessage?**

##### Returns

`undefined` \| `WebSocket`

##### Defined in

[client.ts:589](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L589)

***

#### disconnectOrderNotifications()

> **disconnectOrderNotifications**(`queryParameters`?): `void`

Closes the order notifications sockets

##### Parameters

• **queryParameters?**: [`OrderNotificationQueryParams`](/docs/packages/SDK/interfaces/OrderNotificationQueryParams.md)

##### Returns

`void`

##### Defined in

[client.ts:644](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L644)

### Profiles

#### getProfile()

> **getProfile**(`profile`): `Promise`\<[`Profile`](/docs/packages/SDK/interfaces/Profile.md)\>

# TELL

##### Parameters

• **profile**: `string`

the id of the profile to fetch.

##### Returns

`Promise`\<[`Profile`](/docs/packages/SDK/interfaces/Profile.md)\>

##### Link

[API Documentation](https://monerium.dev/api-docs-v2#tag/profiles/operation/profile)

##### Defined in

[client.ts:312](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L312)

***

#### getProfiles()

> **getProfiles**(`params`?): `Promise`\<[`ProfilesResponse`](/docs/packages/SDK/interfaces/ProfilesResponse.md)\>

[https://monerium.dev/api-docs-v2#tag/profiles/operation/profiles](https://monerium.dev/api-docs-v2#tag/profiles/operation/profiles)

##### Parameters

• **params?**: [`ProfilesQueryParams`](/docs/packages/SDK/interfaces/ProfilesQueryParams.md)

##### Returns

`Promise`\<[`ProfilesResponse`](/docs/packages/SDK/interfaces/ProfilesResponse.md)\>

##### Defined in

[client.ts:319](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L319)

***

#### submitProfileDetails()

> **submitProfileDetails**(`profile`, `body`): `Promise`\<[`ResponseStatus`](/docs/packages/SDK/type-aliases/ResponseStatus.md)\>

[https://monerium.dev/api-docs-v2#tag/profiles/operation/profile-details](https://monerium.dev/api-docs-v2#tag/profiles/operation/profile-details)

##### Parameters

• **profile**: `string`

• **body**: [`SubmitProfileDetailsPayload`](/docs/packages/SDK/type-aliases/SubmitProfileDetailsPayload.md)

##### Returns

`Promise`\<[`ResponseStatus`](/docs/packages/SDK/type-aliases/ResponseStatus.md)\>

##### Defined in

[client.ts:480](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L480)

### Orders

#### getOrder()

> **getOrder**(`orderId`): `Promise`\<[`Order`](/docs/packages/SDK/interfaces/Order.md)\>

[https://monerium.dev/api-docs-v2#tag/order](https://monerium.dev/api-docs-v2#tag/order)

##### Parameters

• **orderId**: `string`

##### Returns

`Promise`\<[`Order`](/docs/packages/SDK/interfaces/Order.md)\>

##### Defined in

[client.ts:394](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L394)

***

#### getOrders()

> **getOrders**(`filter`?): `Promise`\<[`Order`](/docs/packages/SDK/interfaces/Order.md)[]\>

[https://monerium.dev/api-docs-v2#tag/orders](https://monerium.dev/api-docs-v2#tag/orders)

##### Parameters

• **filter?**: [`OrderFilter`](/docs/packages/SDK/interfaces/OrderFilter.md)

##### Returns

`Promise`\<[`Order`](/docs/packages/SDK/interfaces/Order.md)[]\>

##### Defined in

[client.ts:387](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L387)

***

#### placeOrder()

> **placeOrder**(`order`): `Promise`\<[`Order`](/docs/packages/SDK/interfaces/Order.md)\>

[https://monerium.dev/api-docs-v2#tag/orders/operation/post-orders](https://monerium.dev/api-docs-v2#tag/orders/operation/post-orders)

##### Parameters

• **order**: [`NewOrder`](/docs/packages/SDK/type-aliases/NewOrder.md)

##### Returns

`Promise`\<[`Order`](/docs/packages/SDK/interfaces/Order.md)\>

##### Defined in

[client.ts:421](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L421)

***

#### uploadSupportingDocument()

> **uploadSupportingDocument**(`document`): `Promise`\<[`SupportingDoc`](/docs/packages/SDK/interfaces/SupportingDoc.md)\>

[https://monerium.dev/api-docs-v2#tag/orders/operation/supporting-document](https://monerium.dev/api-docs-v2#tag/orders/operation/supporting-document)

##### Parameters

• **document**: `File`

##### Returns

`Promise`\<[`SupportingDoc`](/docs/packages/SDK/interfaces/SupportingDoc.md)\>

##### Defined in

[client.ts:495](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L495)

### Tokens

#### getTokens()

> **getTokens**(): `Promise`\<[`Token`](/docs/packages/SDK/interfaces/Token.md)[]\>

[https://monerium.dev/api-docs-v2#tag/tokens](https://monerium.dev/api-docs-v2#tag/tokens)

##### Returns

`Promise`\<[`Token`](/docs/packages/SDK/interfaces/Token.md)[]\>

##### Defined in

[client.ts:402](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L402)
