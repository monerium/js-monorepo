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

[client.ts:98](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L98)

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

[https://monerium.dev/api-docs-v2#tag/addresses/operation/address](https://monerium.dev/api-docs-v2#tag/addresses/operation/address)

##### Parameters

• **address**: `string`

The public key of the blockchain account.

##### Returns

`Promise`\<[`Address`](/docs/packages/SDK/interfaces/Address.md)\>

##### Defined in

[client.ts:319](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L319)

***

#### getAddresses()

> **getAddresses**(`__namedParameters`): `Promise`\<[`Addresses`](/docs/packages/SDK/interfaces/Addresses.md)\>

[https://monerium.dev/api-docs-v2#tag/addresses/operation/addresses](https://monerium.dev/api-docs-v2#tag/addresses/operation/addresses)

##### Parameters

• **\_\_namedParameters**: [`AddressesQueryParams`](/docs/packages/SDK/interfaces/AddressesQueryParams.md) = `{}`

##### Returns

`Promise`\<[`Addresses`](/docs/packages/SDK/interfaces/Addresses.md)\>

##### Defined in

[client.ts:329](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L329)

***

#### getBalances()

> **getBalances**(`profile`): `Promise`\<[`Balances`](/docs/packages/SDK/interfaces/Balances.md)[]\>

[https://monerium.dev/api-docs-v2#tag/addresses/operation/profile-balances](https://monerium.dev/api-docs-v2#tag/addresses/operation/profile-balances)

##### Parameters

• **profile**: `string`

##### Returns

`Promise`\<[`Balances`](/docs/packages/SDK/interfaces/Balances.md)[]\>

##### Defined in

[client.ts:345](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L345)

***

#### linkAddress()

> **linkAddress**(`body`): `Promise`\<[`ResponseStatus`](/docs/packages/SDK/type-aliases/ResponseStatus.md)\>

[https://monerium.dev/api-docs-v2#tag/addresses/operation/link-address](https://monerium.dev/api-docs-v2#tag/addresses/operation/link-address)

##### Parameters

• **body**: [`LinkAddress`](/docs/packages/SDK/interfaces/LinkAddress.md)

##### Returns

`Promise`\<[`ResponseStatus`](/docs/packages/SDK/type-aliases/ResponseStatus.md)\>

##### Defined in

[client.ts:398](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L398)

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
[https://monerium.dev/api-docs-v2#tag/auth/operation/auth](https://monerium.dev/api-docs-v2#tag/auth/operation/auth)

##### Defined in

[client.ts:141](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L141)

***

#### disconnect()

> **disconnect**(): `Promise`\<`void`\>

Cleanups the socket and the subscriptions

##### Returns

`Promise`\<`void`\>

##### Defined in

[client.ts:655](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L655)

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

[client.ts:183](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L183)

***

#### revokeAccess()

> **revokeAccess**(): `Promise`\<`void`\>

Revokes access

##### Returns

`Promise`\<`void`\>

##### Defined in

[client.ts:667](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L667)

***

#### signUp()

> **signUp**(`body`): `Promise`\<[`SignUpResponse`](/docs/packages/SDK/interfaces/SignUpResponse.md)\>

[https://monerium.dev/api-docs-v2#tag/auth/operation/auth-signup](https://monerium.dev/api-docs-v2#tag/auth/operation/auth-signup)

##### Parameters

• **body**: [`SignUpPayload`](/docs/packages/SDK/interfaces/SignUpPayload.md)

##### Returns

`Promise`\<[`SignUpResponse`](/docs/packages/SDK/interfaces/SignUpResponse.md)\>

##### Defined in

[client.ts:454](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L454)

### IBANs

#### getIban()

> **getIban**(`iban`): `Promise`\<[`IBAN`](/docs/packages/SDK/interfaces/IBAN.md)\>

"https://monerium.dev/api-docs-v2#tag/ibans/operation/iban"

##### Parameters

• **iban**: `string`

##### Returns

`Promise`\<[`IBAN`](/docs/packages/SDK/interfaces/IBAN.md)\>

##### Defined in

[client.ts:353](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L353)

***

#### getIbans()

> **getIbans**(`queryParameters`?): `Promise`\<[`IBANsResponse`](/docs/packages/SDK/interfaces/IBANsResponse.md)\>

"https://monerium.dev/api-docs-v2#tag/ibans/operation/ibans"

##### Parameters

• **queryParameters?**: [`IbansQueryParams`](/docs/packages/SDK/interfaces/IbansQueryParams.md)

##### Returns

`Promise`\<[`IBANsResponse`](/docs/packages/SDK/interfaces/IBANsResponse.md)\>

##### Defined in

[client.ts:360](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L360)

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

[client.ts:424](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L424)

***

#### requestIban()

> **requestIban**(`__namedParameters`): `Promise`\<[`ResponseStatus`](/docs/packages/SDK/type-aliases/ResponseStatus.md)\>

[https://monerium.dev/api-docs-v2#tag/ibans/operation/request-iban](https://monerium.dev/api-docs-v2#tag/ibans/operation/request-iban)

##### Parameters

• **\_\_namedParameters**: [`RequestIbanPayload`](/docs/packages/SDK/interfaces/RequestIbanPayload.md)

##### Returns

`Promise`\<[`ResponseStatus`](/docs/packages/SDK/type-aliases/ResponseStatus.md)\>

##### Defined in

[client.ts:438](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L438)

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

[client.ts:575](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L575)

***

#### disconnectOrderNotifications()

> **disconnectOrderNotifications**(`queryParameters`?): `void`

Closes the order notifications sockets

##### Parameters

• **queryParameters?**: [`OrderNotificationQueryParams`](/docs/packages/SDK/interfaces/OrderNotificationQueryParams.md)

##### Returns

`void`

##### Defined in

[client.ts:630](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L630)

### Profiles

#### getProfile()

> **getProfile**(`profile`): `Promise`\<[`Profile`](/docs/packages/SDK/interfaces/Profile.md)\>

[https://monerium.dev/api-docs-v2#tag/profiles/operation/profile](https://monerium.dev/api-docs-v2#tag/profiles/operation/profile)

##### Parameters

• **profile**: `string`

the id of the profile to fetch.

##### Returns

`Promise`\<[`Profile`](/docs/packages/SDK/interfaces/Profile.md)\>

##### Defined in

[client.ts:304](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L304)

***

#### getProfiles()

> **getProfiles**(`params`?): `Promise`\<[`ProfilesResponse`](/docs/packages/SDK/interfaces/ProfilesResponse.md)\>

[https://monerium.dev/api-docs-v2#tag/profiles/operation/profiles](https://monerium.dev/api-docs-v2#tag/profiles/operation/profiles)

##### Parameters

• **params?**: [`ProfilesQueryParams`](/docs/packages/SDK/interfaces/ProfilesQueryParams.md)

##### Returns

`Promise`\<[`ProfilesResponse`](/docs/packages/SDK/interfaces/ProfilesResponse.md)\>

##### Defined in

[client.ts:311](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L311)

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

[client.ts:466](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L466)

### Orders

#### getOrder()

> **getOrder**(`orderId`): `Promise`\<[`Order`](/docs/packages/SDK/interfaces/Order.md)\>

[https://monerium.dev/api-docs-v2#tag/order](https://monerium.dev/api-docs-v2#tag/order)

##### Parameters

• **orderId**: `string`

##### Returns

`Promise`\<[`Order`](/docs/packages/SDK/interfaces/Order.md)\>

##### Defined in

[client.ts:380](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L380)

***

#### getOrders()

> **getOrders**(`filter`?): `Promise`\<[`Order`](/docs/packages/SDK/interfaces/Order.md)[]\>

[https://monerium.dev/api-docs-v2#tag/orders](https://monerium.dev/api-docs-v2#tag/orders)

##### Parameters

• **filter?**: [`OrderFilter`](/docs/packages/SDK/interfaces/OrderFilter.md)

##### Returns

`Promise`\<[`Order`](/docs/packages/SDK/interfaces/Order.md)[]\>

##### Defined in

[client.ts:373](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L373)

***

#### placeOrder()

> **placeOrder**(`order`): `Promise`\<[`Order`](/docs/packages/SDK/interfaces/Order.md)\>

[https://monerium.dev/api-docs-v2#tag/orders/operation/post-orders](https://monerium.dev/api-docs-v2#tag/orders/operation/post-orders)

##### Parameters

• **order**: [`NewOrder`](/docs/packages/SDK/type-aliases/NewOrder.md)

##### Returns

`Promise`\<[`Order`](/docs/packages/SDK/interfaces/Order.md)\>

##### Defined in

[client.ts:407](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L407)

***

#### uploadSupportingDocument()

> **uploadSupportingDocument**(`document`): `Promise`\<[`SupportingDoc`](/docs/packages/SDK/interfaces/SupportingDoc.md)\>

[https://monerium.dev/api-docs-v2#tag/orders/operation/supporting-document](https://monerium.dev/api-docs-v2#tag/orders/operation/supporting-document)

##### Parameters

• **document**: `File`

##### Returns

`Promise`\<[`SupportingDoc`](/docs/packages/SDK/interfaces/SupportingDoc.md)\>

##### Defined in

[client.ts:481](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L481)

### Tokens

#### getTokens()

> **getTokens**(): `Promise`\<[`Token`](/docs/packages/SDK/interfaces/Token.md)[]\>

[https://monerium.dev/api-docs-v2#tag/tokens](https://monerium.dev/api-docs-v2#tag/tokens)

##### Returns

`Promise`\<[`Token`](/docs/packages/SDK/interfaces/Token.md)[]\>

##### Defined in

[client.ts:388](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L388)
