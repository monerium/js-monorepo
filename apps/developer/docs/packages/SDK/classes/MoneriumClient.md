# Class: MoneriumClient

In the [Monerium UI](https://monerium.app/), create an application to get the `clientId` and register your `redirectUri`.
```ts
import { MoneriumClient } from '@monerium/sdk';

const monerium = new MoneriumClient() // defaults to `sandbox`

// or
new MoneriumClient('production')

// or
new MoneriumClient({
 environment: 'sandbox',
 clientId: 'your-client-id',
 redirectUri: 'http://your-redirect-url.com/monerium'
});

// or - server only
new MoneriumClient({
 environment: 'sandbox',
 clientId: 'your-client-id',
 clientSecret: 'your-client-secret'
})
```

## Constructors

### new MoneriumClient()

> **new MoneriumClient**(`envOrOptions`?: [`ENV`](/docs/packages/sdk/type-aliases/ENV.md) \| [`ClassOptions`](/docs/packages/sdk/type-aliases/ClassOptions.md)): [`MoneriumClient`](/docs/packages/sdk/classes/MoneriumClient.md)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `envOrOptions`? | [`ENV`](/docs/packages/sdk/type-aliases/ENV.md) \| [`ClassOptions`](/docs/packages/sdk/type-aliases/ClassOptions.md) |

#### Returns

[`MoneriumClient`](/docs/packages/sdk/classes/MoneriumClient.md)

#### Default Value

`sandbox`

#### Defined in

[client.ts:115](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L115)

## Properties

| Property | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| `bearerProfile?` | [`BearerProfile`](/docs/packages/sdk/interfaces/BearerProfile.md) | `undefined` | The bearer profile will be available after authentication, it includes the `access_token` and `refresh_token` | [client.ts:96](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L96) |
| `isAuthorized` | `boolean` | `!!this.bearerProfile` | The client is authorized if the bearer profile is available | [client.ts:104](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L104) |
| `state` | `undefined` \| `string` | `undefined` | The state parameter is used to maintain state between the request and the callback. | [client.ts:110](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L110) |

## Authentication

### authorize()

> **authorize**(`client`?: [`AuthFlowOptions`](/docs/packages/sdk/interfaces/AuthFlowOptions.md)): `Promise`\<`void`\>

[API Documentation](https://monerium.dev/api-docs-v2#tag/auth/operation/auth)

Construct the url to the authorization code flow and redirects,
Code Verifier needed for the code challenge is stored in local storage
For automatic wallet link, add the following properties: `address`, `signature` & `chain`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `client`? | [`AuthFlowOptions`](/docs/packages/sdk/interfaces/AuthFlowOptions.md) |

#### Returns

`Promise`\<`void`\>

string

#### Defined in

[client.ts:161](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L161)

***

### disconnect()

> **disconnect**(): `Promise`\<`void`\>

Cleanups the socket and the subscriptions

#### Returns

`Promise`\<`void`\>

#### Defined in

[client.ts:723](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L723)

***

### getAccess()

> **getAccess**(`client`?: [`ClientCredentials`](/docs/packages/sdk/interfaces/ClientCredentials.md) \| [`AuthorizationCodeCredentials`](/docs/packages/sdk/interfaces/AuthorizationCodeCredentials.md)): `Promise`\<`boolean`\>

Will redirect to the authorization code flow and store the code verifier in the local storage

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `client`? | [`ClientCredentials`](/docs/packages/sdk/interfaces/ClientCredentials.md) \| [`AuthorizationCodeCredentials`](/docs/packages/sdk/interfaces/AuthorizationCodeCredentials.md) | the client credentials |

#### Returns

`Promise`\<`boolean`\>

boolean to indicate if access has been granted

#### Example

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

#### Defined in

[client.ts:210](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L210)

***

### revokeAccess()

> **revokeAccess**(): `Promise`\<`void`\>

Revokes access

#### Returns

`Promise`\<`void`\>

#### Defined in

[client.ts:736](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L736)

***

### signUp()

> **signUp**(`body`: [`SignUpPayload`](/docs/packages/sdk/interfaces/SignUpPayload.md)): `Promise`\<[`SignUpResponse`](/docs/packages/sdk/interfaces/SignUpResponse.md)\>

[API Documentation](https://monerium.dev/api-docs-v2#tag/auth/operation/auth-signup)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `body` | [`SignUpPayload`](/docs/packages/sdk/interfaces/SignUpPayload.md) |

#### Returns

`Promise`\<[`SignUpResponse`](/docs/packages/sdk/interfaces/SignUpResponse.md)\>

#### Defined in

[client.ts:520](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L520)

## Addresses

### getAddress()

> **getAddress**(`address`: `string`): `Promise`\<[`Address`](/docs/packages/sdk/interfaces/Address.md)\>

Get details for a single address by using the address public key after the address has been successfully linked to Monerium.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `address` | `string` | The public key of the blockchain account. [API Documentation](https://monerium.dev/api-docs-v2#tag/addresses/operation/address) |

#### Returns

`Promise`\<[`Address`](/docs/packages/sdk/interfaces/Address.md)\>

#### Example

```ts
 monerium.getAddress('0x1234567890abcdef1234567890abcdef12345678')
```

#### Defined in

[client.ts:357](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L357)

***

### getAddresses()

> **getAddresses**(`params`: [`AddressesQueryParams`](/docs/packages/sdk/interfaces/AddressesQueryParams.md)): `Promise`\<[`Addresses`](/docs/packages/sdk/interfaces/Addresses.md)\>

[API Documentation](https://monerium.dev/api-docs-v2#tag/addresses/operation/addresses)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | [`AddressesQueryParams`](/docs/packages/sdk/interfaces/AddressesQueryParams.md) | No required parameters. |

#### Returns

`Promise`\<[`Addresses`](/docs/packages/sdk/interfaces/Addresses.md)\>

#### Defined in

[client.ts:370](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L370)

***

### getBalances()

> **getBalances**(`profile`: `string`): `Promise`\<[`Balances`](/docs/packages/sdk/interfaces/Balances.md)[]\>

[API Documentation](https://monerium.dev/api-docs-v2#tag/addresses/operation/profile-balances)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `profile` | `string` | the id of the profile to fetch balances. |

#### Returns

`Promise`\<[`Balances`](/docs/packages/sdk/interfaces/Balances.md)[]\>

#### Defined in

[client.ts:389](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L389)

***

### linkAddress()

> **linkAddress**(`body`: [`LinkAddress`](/docs/packages/sdk/interfaces/LinkAddress.md)): `Promise`\<[`ResponseStatus`](/docs/packages/sdk/type-aliases/ResponseStatus.md)\>

Add a new address to the profile
[API Documentation](https://monerium.dev/api-docs-v2#tag/addresses/operation/link-address)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `body` | [`LinkAddress`](/docs/packages/sdk/interfaces/LinkAddress.md) |

#### Returns

`Promise`\<[`ResponseStatus`](/docs/packages/sdk/type-aliases/ResponseStatus.md)\>

#### Defined in

[client.ts:455](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L455)

## Profiles

### getProfile()

> **getProfile**(`profile`: `string`): `Promise`\<[`Profile`](/docs/packages/sdk/interfaces/Profile.md)\>

[API Documentation](https://monerium.dev/api-docs-v2#tag/profiles/operation/profile)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `profile` | `string` | the id of the profile to fetch. |

#### Returns

`Promise`\<[`Profile`](/docs/packages/sdk/interfaces/Profile.md)\>

#### Defined in

[client.ts:332](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L332)

***

### getProfiles()

> **getProfiles**(`params`?: [`ProfilesQueryParams`](/docs/packages/sdk/interfaces/ProfilesQueryParams.md)): `Promise`\<[`ProfilesResponse`](/docs/packages/sdk/interfaces/ProfilesResponse.md)\>

[API Documentation](https://monerium.dev/api-docs-v2#tag/profiles/operation/profiles)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `params`? | [`ProfilesQueryParams`](/docs/packages/sdk/interfaces/ProfilesQueryParams.md) |

#### Returns

`Promise`\<[`ProfilesResponse`](/docs/packages/sdk/interfaces/ProfilesResponse.md)\>

#### Defined in

[client.ts:340](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L340)

***

### submitProfileDetails()

> **submitProfileDetails**(`profile`: `string`, `body`: [`SubmitProfileDetailsPayload`](/docs/packages/sdk/type-aliases/SubmitProfileDetailsPayload.md)): `Promise`\<[`ResponseStatus`](/docs/packages/sdk/type-aliases/ResponseStatus.md)\>

[API Documentation](https://monerium.dev/api-docs-v2#tag/profiles/operation/profile-details)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `profile` | `string` |
| `body` | [`SubmitProfileDetailsPayload`](/docs/packages/sdk/type-aliases/SubmitProfileDetailsPayload.md) |

#### Returns

`Promise`\<[`ResponseStatus`](/docs/packages/sdk/type-aliases/ResponseStatus.md)\>

#### Defined in

[client.ts:533](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L533)

## IBANs

### getIban()

> **getIban**(`iban`: `string`): `Promise`\<[`IBAN`](/docs/packages/sdk/interfaces/IBAN.md)\>

Fetch details about a single IBAN

[API Documentation](https://monerium.dev/api-docs-v2#tag/ibans/operation/iban)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `iban` | `string` | the IBAN to fetch. |

#### Returns

`Promise`\<[`IBAN`](/docs/packages/sdk/interfaces/IBAN.md)\>

#### Defined in

[client.ts:403](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L403)

***

### getIbans()

> **getIbans**(`queryParameters`?: [`IbansQueryParams`](/docs/packages/sdk/interfaces/IbansQueryParams.md)): `Promise`\<[`IBANsResponse`](/docs/packages/sdk/interfaces/IBANsResponse.md)\>

Fetch all IBANs for the profile
[API Documentation](https://monerium.dev/api-docs-v2#tag/ibans/operation/ibans)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `queryParameters`? | [`IbansQueryParams`](/docs/packages/sdk/interfaces/IbansQueryParams.md) |

#### Returns

`Promise`\<[`IBANsResponse`](/docs/packages/sdk/interfaces/IBANsResponse.md)\>

#### Defined in

[client.ts:413](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L413)

***

### moveIban()

> **moveIban**(`iban`: `string`, `payload`: [`MoveIbanPayload`](/docs/packages/sdk/interfaces/MoveIbanPayload.md)): `Promise`\<[`ResponseStatus`](/docs/packages/sdk/type-aliases/ResponseStatus.md)\>

[API Documentation](https://monerium.dev/api-docs-v2#tag/ibans/operation/move-iban)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `iban` | `string` | the IBAN to move. |
| `payload` | [`MoveIbanPayload`](/docs/packages/sdk/interfaces/MoveIbanPayload.md) | the payload to move the IBAN. |

#### Returns

`Promise`\<[`ResponseStatus`](/docs/packages/sdk/type-aliases/ResponseStatus.md)\>

#### Defined in

[client.ts:485](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L485)

***

### requestIban()

> **requestIban**(`payload`: [`RequestIbanPayload`](/docs/packages/sdk/interfaces/RequestIbanPayload.md)): `Promise`\<[`ResponseStatus`](/docs/packages/sdk/type-aliases/ResponseStatus.md)\>

[API Documentation](https://monerium.dev/api-docs-v2#tag/ibans/operation/request-iban)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `payload` | [`RequestIbanPayload`](/docs/packages/sdk/interfaces/RequestIbanPayload.md) | the payload to request an IBAN. |

#### Returns

`Promise`\<[`ResponseStatus`](/docs/packages/sdk/type-aliases/ResponseStatus.md)\>

#### Defined in

[client.ts:503](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L503)

## Orders

### connectOrderNotifications()

> **connectOrderNotifications**(`__namedParameters`: \{`filter`: [`OrderNotificationQueryParams`](/docs/packages/sdk/interfaces/OrderNotificationQueryParams.md);`onError`: (`err`: `Event`) => `void`;`onMessage`: (`data`: [`Order`](/docs/packages/sdk/interfaces/Order.md)) => `void`; \}): `undefined` \| `WebSocket`

Connects to the order notifications socket
[Websocket](https://monerium.dev/api-docs-v2#tag/orders/operation/orders-notifications)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `__namedParameters` | `object` |
| `__namedParameters.filter`? | [`OrderNotificationQueryParams`](/docs/packages/sdk/interfaces/OrderNotificationQueryParams.md) |
| `__namedParameters.onError`? | (`err`: `Event`) => `void` |
| `__namedParameters.onMessage`? | (`data`: [`Order`](/docs/packages/sdk/interfaces/Order.md)) => `void` |

#### Returns

`undefined` \| `WebSocket`

#### Defined in

[client.ts:641](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L641)

***

### disconnectOrderNotifications()

> **disconnectOrderNotifications**(`queryParameters`?: [`OrderNotificationQueryParams`](/docs/packages/sdk/interfaces/OrderNotificationQueryParams.md)): `void`

Closes the order notifications sockets
[Websocket](https://monerium.dev/api-docs-v2#tag/orders/operation/orders-notifications)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `queryParameters`? | [`OrderNotificationQueryParams`](/docs/packages/sdk/interfaces/OrderNotificationQueryParams.md) |

#### Returns

`void`

#### Defined in

[client.ts:697](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L697)

***

### getOrder()

> **getOrder**(`orderId`: `string`): `Promise`\<[`Order`](/docs/packages/sdk/interfaces/Order.md)\>

[API Documentation](https://monerium.dev/api-docs-v2#tag/order)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `orderId` | `string` |

#### Returns

`Promise`\<[`Order`](/docs/packages/sdk/interfaces/Order.md)\>

#### Defined in

[client.ts:435](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L435)

***

### getOrders()

> **getOrders**(`filter`?: [`OrderFilter`](/docs/packages/sdk/interfaces/OrderFilter.md)): `Promise`\<[`Order`](/docs/packages/sdk/interfaces/Order.md)[]\>

[API Documentation](https://monerium.dev/api-docs-v2#tag/orders)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `filter`? | [`OrderFilter`](/docs/packages/sdk/interfaces/OrderFilter.md) |

#### Returns

`Promise`\<[`Order`](/docs/packages/sdk/interfaces/Order.md)[]\>

#### Defined in

[client.ts:427](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L427)

***

### placeOrder()

> **placeOrder**(`order`: [`NewOrder`](/docs/packages/sdk/type-aliases/NewOrder.md)): `Promise`\<[`Order`](/docs/packages/sdk/interfaces/Order.md)\>

[API Documentation](https://monerium.dev/api-docs-v2#tag/orders/operation/post-orders)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `order` | [`NewOrder`](/docs/packages/sdk/type-aliases/NewOrder.md) |

#### Returns

`Promise`\<[`Order`](/docs/packages/sdk/interfaces/Order.md)\>

#### Defined in

[client.ts:465](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L465)

***

### uploadSupportingDocument()

> **uploadSupportingDocument**(`document`: `File`): `Promise`\<[`SupportingDoc`](/docs/packages/sdk/interfaces/SupportingDoc.md)\>

[API Documentation](https://monerium.dev/api-docs-v2#tag/orders/operation/supporting-document)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `document` | `File` |

#### Returns

`Promise`\<[`SupportingDoc`](/docs/packages/sdk/interfaces/SupportingDoc.md)\>

#### Defined in

[client.ts:549](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L549)

## Tokens

### getTokens()

> **getTokens**(): `Promise`\<[`Token`](/docs/packages/sdk/interfaces/Token.md)[]\>

[API Documentation](https://monerium.dev/api-docs-v2#tag/tokens)

#### Returns

`Promise`\<[`Token`](/docs/packages/sdk/interfaces/Token.md)[]\>

#### Defined in

[client.ts:444](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L444)
