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

> **getAddress**(`address`): `Promise`\<[`Address`](../interfaces/Address.md)\>

[https://monerium.dev/api-docs-v2#tag/addresses/operation/address](https://monerium.dev/api-docs-v2#tag/addresses/operation/address)

##### Parameters

• **address**: `string`

The public key of the blockchain account.

##### Returns

`Promise`\<[`Address`](../interfaces/Address.md)\>

##### Defined in

[client.ts:309](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L309)

***

#### getAddresses()

> **getAddresses**(`__namedParameters`): `Promise`\<[`Addresses`](../interfaces/Addresses.md)\>

[https://monerium.dev/api-docs-v2#tag/addresses/operation/addresses](https://monerium.dev/api-docs-v2#tag/addresses/operation/addresses)

##### Parameters

• **\_\_namedParameters**: [`AddressesQueryParams`](../interfaces/AddressesQueryParams.md) = `{}`

##### Returns

`Promise`\<[`Addresses`](../interfaces/Addresses.md)\>

##### Defined in

[client.ts:319](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L319)

***

#### getBalances()

> **getBalances**(`profile`): `Promise`\<[`Balances`](../interfaces/Balances.md)[]\>

[https://monerium.dev/api-docs-v2#tag/addresses/operation/profile-balances](https://monerium.dev/api-docs-v2#tag/addresses/operation/profile-balances)

##### Parameters

• **profile**: `string`

##### Returns

`Promise`\<[`Balances`](../interfaces/Balances.md)[]\>

##### Defined in

[client.ts:335](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L335)

***

#### linkAddress()

> **linkAddress**(`body`): `Promise`\<[`ResponseStatus`](../type-aliases/ResponseStatus.md)\>

[https://monerium.dev/api-docs-v2#tag/addresses/operation/link-address](https://monerium.dev/api-docs-v2#tag/addresses/operation/link-address)

##### Parameters

• **body**: [`LinkAddress`](../interfaces/LinkAddress.md)

##### Returns

`Promise`\<[`ResponseStatus`](../type-aliases/ResponseStatus.md)\>

##### Defined in

[client.ts:389](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L389)

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

<<<<<<< HEAD:apps/developer/docs/packages/SDK/classes/MoneriumClient.md
[client.ts:525](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L525)
=======
[client.ts:644](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L644)
>>>>>>> 3a1f3b9 (docs: update generated docs):packages/sdk/docs/generated/classes/MoneriumClient.md

***

#### getAccess()

> **getAccess**(`client`?): `Promise`\<`boolean`\>

Will redirect to the authorization code flow and store the code verifier in the local storage

##### Parameters

<<<<<<< HEAD:apps/developer/docs/packages/SDK/classes/MoneriumClient.md
• **client?**: [`ClientCredentials`](/docs/packages/SDK/interfaces/ClientCredentials.md) \| [`AuthorizationCodeCredentials`](/docs/packages/SDK/interfaces/AuthorizationCodeCredentials.md) \| [`DeprecatedAuthorizationCodeCredentials`](/docs/packages/SDK/interfaces/DeprecatedAuthorizationCodeCredentials.md)
=======
• **client?**: [`ClientCredentials`](../interfaces/ClientCredentials.md) \| [`AuthorizationCodeCredentials`](../interfaces/AuthorizationCodeCredentials.md)
>>>>>>> 3a1f3b9 (docs: update generated docs):packages/sdk/docs/generated/classes/MoneriumClient.md

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

<<<<<<< HEAD:apps/developer/docs/packages/SDK/classes/MoneriumClient.md
[client.ts:176](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L176)
=======
[client.ts:173](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L173)
>>>>>>> 3a1f3b9 (docs: update generated docs):packages/sdk/docs/generated/classes/MoneriumClient.md

***

#### revokeAccess()

<<<<<<< HEAD:apps/developer/docs/packages/SDK/classes/MoneriumClient.md
> **getAuthContext**(): `Promise`\<[`AuthContext`](/docs/packages/SDK/interfaces/AuthContext.md)\>
=======
> **revokeAccess**(): `Promise`\<`void`\>
>>>>>>> 3a1f3b9 (docs: update generated docs):packages/sdk/docs/generated/classes/MoneriumClient.md

Revokes access

##### Returns

<<<<<<< HEAD:apps/developer/docs/packages/SDK/classes/MoneriumClient.md
`Promise`\<[`AuthContext`](/docs/packages/SDK/interfaces/AuthContext.md)\>

##### Defined in

[client.ts:298](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L298)
=======
`Promise`\<`void`\>

##### Defined in

[client.ts:656](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L656)
>>>>>>> 3a1f3b9 (docs: update generated docs):packages/sdk/docs/generated/classes/MoneriumClient.md

***

#### signUp()

> **signUp**(`body`): `Promise`\<[`SignUpResponse`](../interfaces/SignUpResponse.md)\>

[https://monerium.dev/api-docs-v2#tag/auth/operation/auth-signup](https://monerium.dev/api-docs-v2#tag/auth/operation/auth-signup)

##### Parameters

• **body**: [`SignUpPayload`](../interfaces/SignUpPayload.md)

##### Returns

`Promise`\<[`SignUpResponse`](../interfaces/SignUpResponse.md)\>

##### Defined in

<<<<<<< HEAD:apps/developer/docs/packages/SDK/classes/MoneriumClient.md
[client.ts:538](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L538)
=======
[client.ts:445](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L445)
>>>>>>> 3a1f3b9 (docs: update generated docs):packages/sdk/docs/generated/classes/MoneriumClient.md

### IBANs

#### getIban()

<<<<<<< HEAD:apps/developer/docs/packages/SDK/classes/MoneriumClient.md
> **getBalances**(`profileId`?): `Promise`\<[`Balances`](/docs/packages/SDK/interfaces/Balances.md)[]\>
=======
> **getIban**(`iban`): `Promise`\<[`IBAN`](../interfaces/IBAN.md)\>
>>>>>>> 3a1f3b9 (docs: update generated docs):packages/sdk/docs/generated/classes/MoneriumClient.md

[https://monerium.dev/api-docs-v2#tag/ibans/operation/iban](https://monerium.dev/api-docs-v2#tag/ibans/operation/iban)

##### Parameters

• **iban**: `string`

##### Returns

<<<<<<< HEAD:apps/developer/docs/packages/SDK/classes/MoneriumClient.md
`Promise`\<[`Balances`](/docs/packages/SDK/interfaces/Balances.md)[]\>

##### Defined in

[client.ts:322](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L322)
=======
`Promise`\<[`IBAN`](../interfaces/IBAN.md)\>

##### Defined in

[client.ts:344](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L344)
>>>>>>> 3a1f3b9 (docs: update generated docs):packages/sdk/docs/generated/classes/MoneriumClient.md

***

#### getIbans()

<<<<<<< HEAD:apps/developer/docs/packages/SDK/classes/MoneriumClient.md
> **linkAddress**(`profileId`, `body`): `Promise`\<[`LinkedAddress`](/docs/packages/SDK/interfaces/LinkedAddress.md)\>
=======
> **getIbans**(`queryParameters`?): `Promise`\<[`IBANsResponse`](../interfaces/IBANsResponse.md)\>
>>>>>>> 3a1f3b9 (docs: update generated docs):packages/sdk/docs/generated/classes/MoneriumClient.md

[https://monerium.dev/api-docs-v2#tag/ibans/operation/ibans](https://monerium.dev/api-docs-v2#tag/ibans/operation/ibans)

##### Parameters

<<<<<<< HEAD:apps/developer/docs/packages/SDK/classes/MoneriumClient.md
• **profileId**: `string`

• **body**: [`LinkAddress`](/docs/packages/SDK/interfaces/LinkAddress.md)

##### Returns

`Promise`\<[`LinkedAddress`](/docs/packages/SDK/interfaces/LinkedAddress.md)\>
=======
• **queryParameters?**: [`IbansQueryParams`](../interfaces/IbansQueryParams.md)

##### Returns

`Promise`\<[`IBANsResponse`](../interfaces/IBANsResponse.md)\>
>>>>>>> 3a1f3b9 (docs: update generated docs):packages/sdk/docs/generated/classes/MoneriumClient.md

##### Defined in

[client.ts:361](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L361)

***

#### moveIban()

<<<<<<< HEAD:apps/developer/docs/packages/SDK/classes/MoneriumClient.md
> **getProfile**(`profileId`): `Promise`\<[`Profile`](/docs/packages/SDK/interfaces/Profile.md)\>
=======
> **moveIban**(`iban`, `__namedParameters`): `Promise`\<[`ResponseStatus`](../type-aliases/ResponseStatus.md)\>
>>>>>>> 3a1f3b9 (docs: update generated docs):packages/sdk/docs/generated/classes/MoneriumClient.md

[https://monerium.dev/api-docs-v2#tag/ibans/operation/move-iban](https://monerium.dev/api-docs-v2#tag/ibans/operation/move-iban)

##### Parameters

• **iban**: `string`

• **\_\_namedParameters**: [`MoveIbanPayload`](../interfaces/MoveIbanPayload.md)

##### Returns

<<<<<<< HEAD:apps/developer/docs/packages/SDK/classes/MoneriumClient.md
`Promise`\<[`Profile`](/docs/packages/SDK/interfaces/Profile.md)\>

##### Defined in

[client.ts:307](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L307)
=======
`Promise`\<[`ResponseStatus`](../type-aliases/ResponseStatus.md)\>

##### Defined in

[client.ts:415](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L415)
>>>>>>> 3a1f3b9 (docs: update generated docs):packages/sdk/docs/generated/classes/MoneriumClient.md

***

#### requestIban()

> **requestIban**(`__namedParameters`): `Promise`\<[`ResponseStatus`](../type-aliases/ResponseStatus.md)\>

<<<<<<< HEAD:apps/developer/docs/packages/SDK/classes/MoneriumClient.md
> **getProfiles**(): `Promise`\<[`Profile`](/docs/packages/SDK/interfaces/Profile.md)[]\>
=======
[https://monerium.dev/api-docs-v2#tag/ibans/operation/request-iban](https://monerium.dev/api-docs-v2#tag/ibans/operation/request-iban)
>>>>>>> 3a1f3b9 (docs: update generated docs):packages/sdk/docs/generated/classes/MoneriumClient.md

##### Parameters

• **\_\_namedParameters**: [`RequestIbanPayload`](../interfaces/RequestIbanPayload.md)

##### Returns

<<<<<<< HEAD:apps/developer/docs/packages/SDK/classes/MoneriumClient.md
`Promise`\<[`Profile`](/docs/packages/SDK/interfaces/Profile.md)[]\>

##### Defined in

[client.ts:314](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L314)
=======
`Promise`\<[`ResponseStatus`](../type-aliases/ResponseStatus.md)\>

##### Defined in

[client.ts:429](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L429)
>>>>>>> 3a1f3b9 (docs: update generated docs):packages/sdk/docs/generated/classes/MoneriumClient.md

### Orders
{@link https://monerium.dev/api-docs-v2#tag/orders/operation/orders-notifications}

#### connectOrderNotifications()

> **connectOrderNotifications**(`__namedParameters`): `undefined` \| `WebSocket`

Connects to the order notifications socket

##### Parameters

• **\_\_namedParameters** = `{}`

• **\_\_namedParameters.filter?**: [`OrderNotificationQueryParams`](../interfaces/OrderNotificationQueryParams.md)

• **\_\_namedParameters.onError?**

• **\_\_namedParameters.onMessage?**

##### Returns

`undefined` \| `WebSocket`

##### Defined in

<<<<<<< HEAD:apps/developer/docs/packages/SDK/classes/MoneriumClient.md
[client.ts:482](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L482)
=======
[client.ts:565](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L565)
>>>>>>> 3a1f3b9 (docs: update generated docs):packages/sdk/docs/generated/classes/MoneriumClient.md

***

#### disconnectOrderNotifications()

<<<<<<< HEAD:apps/developer/docs/packages/SDK/classes/MoneriumClient.md
> **getOrder**(`orderId`): `Promise`\<[`Order`](/docs/packages/SDK/interfaces/Order.md)\>
=======
> **disconnectOrderNotifications**(`queryParameters`?): `void`
>>>>>>> 3a1f3b9 (docs: update generated docs):packages/sdk/docs/generated/classes/MoneriumClient.md

Closes the order notifications sockets

##### Parameters

• **queryParameters?**: [`OrderNotificationQueryParams`](../interfaces/OrderNotificationQueryParams.md)

##### Returns

<<<<<<< HEAD:apps/developer/docs/packages/SDK/classes/MoneriumClient.md
`Promise`\<[`Order`](/docs/packages/SDK/interfaces/Order.md)\>

##### Defined in

[client.ts:343](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L343)
=======
`void`

##### Defined in

[client.ts:620](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L620)
>>>>>>> 3a1f3b9 (docs: update generated docs):packages/sdk/docs/generated/classes/MoneriumClient.md

### Profiles

#### getProfile()

<<<<<<< HEAD:apps/developer/docs/packages/SDK/classes/MoneriumClient.md
> **getOrders**(`filter`?): `Promise`\<[`Order`](/docs/packages/SDK/interfaces/Order.md)[]\>
=======
> **getProfile**(`profile`): `Promise`\<[`Profile`](../interfaces/Profile.md)\>
>>>>>>> 3a1f3b9 (docs: update generated docs):packages/sdk/docs/generated/classes/MoneriumClient.md

[https://monerium.dev/api-docs-v2#tag/profiles/operation/profile](https://monerium.dev/api-docs-v2#tag/profiles/operation/profile)

##### Parameters

<<<<<<< HEAD:apps/developer/docs/packages/SDK/classes/MoneriumClient.md
• **filter?**: [`OrderFilter`](/docs/packages/SDK/interfaces/OrderFilter.md)

##### Returns

`Promise`\<[`Order`](/docs/packages/SDK/interfaces/Order.md)[]\>

##### Defined in

[client.ts:334](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L334)
=======
• **profile**: `string`

the id of the profile to fetch.

##### Returns

`Promise`\<[`Profile`](../interfaces/Profile.md)\>

##### Defined in

[client.ts:294](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L294)
>>>>>>> 3a1f3b9 (docs: update generated docs):packages/sdk/docs/generated/classes/MoneriumClient.md

***

#### getProfiles()

<<<<<<< HEAD:apps/developer/docs/packages/SDK/classes/MoneriumClient.md
> **placeOrder**(`order`): `Promise`\<[`Order`](/docs/packages/SDK/interfaces/Order.md)\>
=======
> **getProfiles**(`params`?): `Promise`\<[`ProfilesResponse`](../interfaces/ProfilesResponse.md)\>
>>>>>>> 3a1f3b9 (docs: update generated docs):packages/sdk/docs/generated/classes/MoneriumClient.md

[https://monerium.dev/api-docs-v2#tag/profiles/operation/profiles](https://monerium.dev/api-docs-v2#tag/profiles/operation/profiles)

##### Parameters

<<<<<<< HEAD:apps/developer/docs/packages/SDK/classes/MoneriumClient.md
• **order**: [`NewOrder`](/docs/packages/SDK/type-aliases/NewOrder.md)

##### Returns

`Promise`\<[`Order`](/docs/packages/SDK/interfaces/Order.md)\>

##### Defined in

[client.ts:376](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L376)
=======
• **params?**: [`ProfilesQueryParams`](../interfaces/ProfilesQueryParams.md)

##### Returns

`Promise`\<[`ProfilesResponse`](../interfaces/ProfilesResponse.md)\>

##### Defined in

[client.ts:301](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L301)
>>>>>>> 3a1f3b9 (docs: update generated docs):packages/sdk/docs/generated/classes/MoneriumClient.md

***

#### submitProfileDetails()

> **submitProfileDetails**(`profile`, `body`): `Promise`\<[`ResponseStatus`](../type-aliases/ResponseStatus.md)\>

[https://monerium.dev/api-docs-v2#tag/profiles/operation/profile-details](https://monerium.dev/api-docs-v2#tag/profiles/operation/profile-details)

##### Parameters

<<<<<<< HEAD:apps/developer/docs/packages/SDK/classes/MoneriumClient.md
• **event**: [`OrderState`](/docs/packages/SDK/enumerations/OrderState.md)
=======
• **profile**: `string`

• **body**: [`SubmitProfileDetailsPayload`](../type-aliases/SubmitProfileDetailsPayload.md)

##### Returns

`Promise`\<[`ResponseStatus`](../type-aliases/ResponseStatus.md)\>

##### Defined in

[client.ts:457](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L457)

### Orders

#### getOrder()

> **getOrder**(`orderId`): `Promise`\<[`Order`](../interfaces/Order.md)\>
>>>>>>> 3a1f3b9 (docs: update generated docs):packages/sdk/docs/generated/classes/MoneriumClient.md

[https://monerium.dev/api-docs-v2#tag/order](https://monerium.dev/api-docs-v2#tag/order)

<<<<<<< HEAD:apps/developer/docs/packages/SDK/classes/MoneriumClient.md
• **handler**: [`MoneriumEventListener`](/docs/packages/SDK/type-aliases/MoneriumEventListener.md)
=======
##### Parameters
>>>>>>> 3a1f3b9 (docs: update generated docs):packages/sdk/docs/generated/classes/MoneriumClient.md

• **orderId**: `string`

##### Returns

`Promise`\<[`Order`](../interfaces/Order.md)\>

##### Defined in

<<<<<<< HEAD:apps/developer/docs/packages/SDK/classes/MoneriumClient.md
[client.ts:554](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L554)
=======
[client.ts:371](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L371)
>>>>>>> 3a1f3b9 (docs: update generated docs):packages/sdk/docs/generated/classes/MoneriumClient.md

***

#### getOrders()

> **getOrders**(`filter`?): `Promise`\<[`Order`](../interfaces/Order.md)[]\>

[https://monerium.dev/api-docs-v2#tag/orders](https://monerium.dev/api-docs-v2#tag/orders)

##### Parameters

• **filter?**: [`OrderFilter`](../interfaces/OrderFilter.md)

##### Returns

`Promise`\<[`Order`](../interfaces/Order.md)[]\>

##### Defined in

<<<<<<< HEAD:apps/developer/docs/packages/SDK/classes/MoneriumClient.md
[client.ts:493](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L493)
=======
[client.ts:364](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L364)
>>>>>>> 3a1f3b9 (docs: update generated docs):packages/sdk/docs/generated/classes/MoneriumClient.md

***

#### placeOrder()

> **placeOrder**(`order`): `Promise`\<[`Order`](../interfaces/Order.md)\>

[https://monerium.dev/api-docs-v2#tag/orders/operation/post-orders](https://monerium.dev/api-docs-v2#tag/orders/operation/post-orders)

##### Parameters

<<<<<<< HEAD:apps/developer/docs/packages/SDK/classes/MoneriumClient.md
• **event**: [`OrderState`](/docs/packages/SDK/enumerations/OrderState.md)

The event to unsubscribe from
=======
• **order**: [`NewOrder`](../type-aliases/NewOrder.md)
>>>>>>> 3a1f3b9 (docs: update generated docs):packages/sdk/docs/generated/classes/MoneriumClient.md

##### Returns

`Promise`\<[`Order`](../interfaces/Order.md)\>

##### Defined in

<<<<<<< HEAD:apps/developer/docs/packages/SDK/classes/MoneriumClient.md
[client.ts:563](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L563)
=======
[client.ts:398](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L398)
>>>>>>> 3a1f3b9 (docs: update generated docs):packages/sdk/docs/generated/classes/MoneriumClient.md

***

#### uploadSupportingDocument()

> **uploadSupportingDocument**(`document`): `Promise`\<[`SupportingDoc`](/docs/packages/SDK/interfaces/SupportingDoc.md)\>

[https://monerium.dev/api-docs-v2#tag/orders/operation/supporting-document](https://monerium.dev/api-docs-v2#tag/orders/operation/supporting-document)

##### Parameters

• **document**: `File`

##### Returns

`Promise`\<[`SupportingDoc`](/docs/packages/SDK/interfaces/SupportingDoc.md)\>

##### Defined in

<<<<<<< HEAD:apps/developer/docs/packages/SDK/classes/MoneriumClient.md
[client.ts:393](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L393)
=======
[client.ts:472](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L472)
>>>>>>> 3a1f3b9 (docs: update generated docs):packages/sdk/docs/generated/classes/MoneriumClient.md

### Tokens

#### getTokens()

> **getTokens**(): `Promise`\<[`Token`](/docs/packages/SDK/interfaces/Token.md)[]\>

[https://monerium.dev/api-docs-v2#tag/tokens](https://monerium.dev/api-docs-v2#tag/tokens)

##### Returns

`Promise`\<[`Token`](/docs/packages/SDK/interfaces/Token.md)[]\>

##### Defined in

<<<<<<< HEAD:apps/developer/docs/packages/SDK/classes/MoneriumClient.md
[client.ts:351](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L351)
=======
[client.ts:379](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L379)
>>>>>>> 3a1f3b9 (docs: update generated docs):packages/sdk/docs/generated/classes/MoneriumClient.md
