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

> **authorize**(`params`?: [`AuthFlowOptions`](/docs/packages/sdk/interfaces/AuthFlowOptions.md)): `Promise`\<`void`\>

Construct the url to the authorization code flow and redirects,
Code Verifier needed for the code challenge is stored in local storage
For automatic wallet link, add the following properties: `address`, `signature` & `chain`

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params`? | [`AuthFlowOptions`](/docs/packages/sdk/interfaces/AuthFlowOptions.md) | the auth flow params |

#### Returns

`Promise`\<`void`\>

string

#### See

[API Documentation](https://monerium.dev/api-docs-v2#tag/auth/operation/auth)

#### Defined in

[client.ts:160](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L160)

***

### disconnect()

> **disconnect**(): `Promise`\<`void`\>

Cleanups the localstorage and websocket connections

#### Returns

`Promise`\<`void`\>

#### Defined in

[client.ts:704](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L704)

***

### getAccess()

> **getAccess**(`client`?: [`ClientCredentials`](/docs/packages/sdk/interfaces/ClientCredentials.md) \| [`AuthorizationCodeCredentials`](/docs/packages/sdk/interfaces/AuthorizationCodeCredentials.md)): `Promise`\<`boolean`\>

Will use the authorization code flow code to get access token

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

[client.ts:208](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L208)

***

### revokeAccess()

> **revokeAccess**(): `Promise`\<`void`\>

Revokes access

#### Returns

`Promise`\<`void`\>

#### Defined in

[client.ts:717](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L717)

***

### signUp()

> **signUp**(`payload`: [`SignUpPayload`](/docs/packages/sdk/interfaces/SignUpPayload.md)): `Promise`\<[`SignUpResponse`](/docs/packages/sdk/interfaces/SignUpResponse.md)\>

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `payload` | [`SignUpPayload`](/docs/packages/sdk/interfaces/SignUpPayload.md) |

#### Returns

`Promise`\<[`SignUpResponse`](/docs/packages/sdk/interfaces/SignUpResponse.md)\>

#### See

[API Documentation](https://monerium.dev/api-docs-v2#tag/auth/operation/auth-signup)

#### Defined in

[client.ts:499](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L499)

## Addresses

### getAddress()

> **getAddress**(`address`: `string`): `Promise`\<[`Address`](/docs/packages/sdk/interfaces/Address.md)\>

Get details for a single address by using the address public key after the address has been successfully linked to Monerium.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `address` | `string` | The public key of the blockchain account. |

#### Returns

`Promise`\<[`Address`](/docs/packages/sdk/interfaces/Address.md)\>

#### See

[API Documentation](https://monerium.dev/api-docs-v2#tag/addresses/operation/address)

#### Example

```ts
 monerium.getAddress('0x1234567890abcdef1234567890abcdef12345678')
```

#### Defined in

[client.ts:353](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L353)

***

### getAddresses()

> **getAddresses**(`params`?: [`AddressesQueryParams`](/docs/packages/sdk/interfaces/AddressesQueryParams.md)): `Promise`\<[`Addresses`](/docs/packages/sdk/interfaces/Addresses.md)\>

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params`? | [`AddressesQueryParams`](/docs/packages/sdk/interfaces/AddressesQueryParams.md) | No required parameters. |

#### Returns

`Promise`\<[`Addresses`](/docs/packages/sdk/interfaces/Addresses.md)\>

#### See

[API Documentation](https://monerium.dev/api-docs-v2#tag/addresses/operation/addresses)

#### Defined in

[client.ts:362](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L362)

***

### getBalances()

> **getBalances**(`profile`: `string`): `Promise`\<[`Balances`](/docs/packages/sdk/interfaces/Balances.md)[]\>

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `profile` | `string` | the id of the profile to fetch balances. |

#### Returns

`Promise`\<[`Balances`](/docs/packages/sdk/interfaces/Balances.md)[]\>

#### See

[API Documentation](https://monerium.dev/api-docs-v2#tag/addresses/operation/profile-balances)

#### Defined in

[client.ts:378](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L378)

***

### linkAddress()

> **linkAddress**(`payload`: [`LinkAddress`](/docs/packages/sdk/interfaces/LinkAddress.md)): `Promise`\<[`ResponseStatus`](/docs/packages/sdk/type-aliases/ResponseStatus.md)\>

Add a new address to the profile

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `payload` | [`LinkAddress`](/docs/packages/sdk/interfaces/LinkAddress.md) |

#### Returns

`Promise`\<[`ResponseStatus`](/docs/packages/sdk/type-aliases/ResponseStatus.md)\>

#### See

[API Documentation](https://monerium.dev/api-docs-v2#tag/addresses/operation/link-address)

#### Defined in

[client.ts:434](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L434)

## Profiles

### getProfile()

> **getProfile**(`profile`: `string`): `Promise`\<[`Profile`](/docs/packages/sdk/interfaces/Profile.md)\>

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `profile` | `string` | the id of the profile to fetch. |

#### Returns

`Promise`\<[`Profile`](/docs/packages/sdk/interfaces/Profile.md)\>

#### See

[API Documentation](https://monerium.dev/api-docs-v2#tag/profiles/operation/profile)

#### Defined in

[client.ts:329](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L329)

***

### getProfiles()

> **getProfiles**(`params`?: [`ProfilesQueryParams`](/docs/packages/sdk/interfaces/ProfilesQueryParams.md)): `Promise`\<[`ProfilesResponse`](/docs/packages/sdk/interfaces/ProfilesResponse.md)\>

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `params`? | [`ProfilesQueryParams`](/docs/packages/sdk/interfaces/ProfilesQueryParams.md) |

#### Returns

`Promise`\<[`ProfilesResponse`](/docs/packages/sdk/interfaces/ProfilesResponse.md)\>

#### See

[API Documentation](https://monerium.dev/api-docs-v2#tag/profiles/operation/profiles)

#### Defined in

[client.ts:336](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L336)

***

### submitProfileDetails()

> **submitProfileDetails**(`profile`: `string`, `body`: [`SubmitProfileDetailsPayload`](/docs/packages/sdk/type-aliases/SubmitProfileDetailsPayload.md)): `Promise`\<[`ResponseStatus`](/docs/packages/sdk/type-aliases/ResponseStatus.md)\>

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `profile` | `string` |
| `body` | [`SubmitProfileDetailsPayload`](/docs/packages/sdk/type-aliases/SubmitProfileDetailsPayload.md) |

#### Returns

`Promise`\<[`ResponseStatus`](/docs/packages/sdk/type-aliases/ResponseStatus.md)\>

#### See

[API Documentation](https://monerium.dev/api-docs-v2#tag/profiles/operation/profile-details)

#### Defined in

[client.ts:511](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L511)

## IBANs

### getIban()

> **getIban**(`iban`: `string`): `Promise`\<[`IBAN`](/docs/packages/sdk/interfaces/IBAN.md)\>

Fetch details about a single IBAN

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `iban` | `string` | the IBAN to fetch. |

#### Returns

`Promise`\<[`IBAN`](/docs/packages/sdk/interfaces/IBAN.md)\>

#### See

[API Documentation](https://monerium.dev/api-docs-v2#tag/ibans/operation/iban)

#### Defined in

[client.ts:389](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L389)

***

### getIbans()

> **getIbans**(`queryParameters`?: [`IbansQueryParams`](/docs/packages/sdk/interfaces/IbansQueryParams.md)): `Promise`\<[`IBANsResponse`](/docs/packages/sdk/interfaces/IBANsResponse.md)\>

Fetch all IBANs for the profile

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `queryParameters`? | [`IbansQueryParams`](/docs/packages/sdk/interfaces/IbansQueryParams.md) |

#### Returns

`Promise`\<[`IBANsResponse`](/docs/packages/sdk/interfaces/IBANsResponse.md)\>

#### See

[API Documentation](https://monerium.dev/api-docs-v2#tag/ibans/operation/ibans)

#### Defined in

[client.ts:397](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L397)

***

### moveIban()

> **moveIban**(`iban`: `string`, `payload`: [`MoveIbanPayload`](/docs/packages/sdk/interfaces/MoveIbanPayload.md)): `Promise`\<[`ResponseStatus`](/docs/packages/sdk/type-aliases/ResponseStatus.md)\>

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `iban` | `string` | the IBAN to move. |
| `payload` | [`MoveIbanPayload`](/docs/packages/sdk/interfaces/MoveIbanPayload.md) | the payload to move the IBAN. |

#### Returns

`Promise`\<[`ResponseStatus`](/docs/packages/sdk/type-aliases/ResponseStatus.md)\>

#### See

[API Documentation](https://monerium.dev/api-docs-v2#tag/ibans/operation/move-iban)

#### Defined in

[client.ts:467](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L467)

***

### requestIban()

> **requestIban**(`payload`: [`RequestIbanPayload`](/docs/packages/sdk/interfaces/RequestIbanPayload.md)): `Promise`\<[`ResponseStatus`](/docs/packages/sdk/type-aliases/ResponseStatus.md)\>

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `payload` | [`RequestIbanPayload`](/docs/packages/sdk/interfaces/RequestIbanPayload.md) |  |

#### Returns

`Promise`\<[`ResponseStatus`](/docs/packages/sdk/type-aliases/ResponseStatus.md)\>

#### See

[API Documentation](https://monerium.dev/api-docs-v2#tag/ibans/operation/request-iban)

#### Defined in

[client.ts:483](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L483)

## Orders

### connectOrderNotifications()

> **connectOrderNotifications**(`params`?: \{`filter`: [`OrderNotificationQueryParams`](/docs/packages/sdk/interfaces/OrderNotificationQueryParams.md);`onError`: (`err`: `Event`) => `void`;`onMessage`: (`data`: [`Order`](/docs/packages/sdk/interfaces/Order.md)) => `void`; \}): `undefined` \| `WebSocket`

Connects to the order notifications socket

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params`? | `object` |  |
| `params.filter`? | [`OrderNotificationQueryParams`](/docs/packages/sdk/interfaces/OrderNotificationQueryParams.md) | specify which type of orders to listen to |
| `params.onError`? | (`err`: `Event`) => `void` | - |
| `params.onMessage`? | (`data`: [`Order`](/docs/packages/sdk/interfaces/Order.md)) => `void` | - |

#### Returns

`undefined` \| `WebSocket`

#### See

[API Document - Websocket](https://monerium.dev/api-docs-v2#tag/orders/operation/orders-notifications)

#### Defined in

[client.ts:620](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L620)

***

### disconnectOrderNotifications()

> **disconnectOrderNotifications**(`params`?: [`OrderNotificationQueryParams`](/docs/packages/sdk/interfaces/OrderNotificationQueryParams.md)): `void`

Closes the order notifications sockets

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params`? | [`OrderNotificationQueryParams`](/docs/packages/sdk/interfaces/OrderNotificationQueryParams.md) | specify which socket to close or close all if not provided |

#### Returns

`void`

#### See

[API Document - Websocket](https://monerium.dev/api-docs-v2#tag/orders/operation/orders-notifications)

#### Defined in

[client.ts:678](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L678)

***

### getOrder()

> **getOrder**(`orderId`: `string`): `Promise`\<[`Order`](/docs/packages/sdk/interfaces/Order.md)\>

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `orderId` | `string` |

#### Returns

`Promise`\<[`Order`](/docs/packages/sdk/interfaces/Order.md)\>

#### See

[API Documentation](https://monerium.dev/api-docs-v2#tag/order)

#### Defined in

[client.ts:417](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L417)

***

### getOrders()

> **getOrders**(`filter`?: [`OrderFilter`](/docs/packages/sdk/interfaces/OrderFilter.md)): `Promise`\<[`Order`](/docs/packages/sdk/interfaces/Order.md)[]\>

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `filter`? | [`OrderFilter`](/docs/packages/sdk/interfaces/OrderFilter.md) |

#### Returns

`Promise`\<[`Order`](/docs/packages/sdk/interfaces/Order.md)[]\>

#### See

[API Documentation](https://monerium.dev/api-docs-v2#tag/orders)

#### Defined in

[client.ts:410](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L410)

***

### placeOrder()

> **placeOrder**(`order`: [`NewOrder`](/docs/packages/sdk/type-aliases/NewOrder.md)): `Promise`\<[`Order`](/docs/packages/sdk/interfaces/Order.md)\>

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `order` | [`NewOrder`](/docs/packages/sdk/type-aliases/NewOrder.md) |

#### Returns

`Promise`\<[`Order`](/docs/packages/sdk/interfaces/Order.md)\>

#### See

[API Documentation](https://monerium.dev/api-docs-v2#tag/orders/operation/post-orders)

#### Defined in

[client.ts:448](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L448)

***

### uploadSupportingDocument()

> **uploadSupportingDocument**(`document`: `File`): `Promise`\<[`SupportingDoc`](/docs/packages/sdk/interfaces/SupportingDoc.md)\>

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `document` | `File` |

#### Returns

`Promise`\<[`SupportingDoc`](/docs/packages/sdk/interfaces/SupportingDoc.md)\>

#### See

[API Documentation](https://monerium.dev/api-docs-v2#tag/orders/operation/supporting-document)

#### Defined in

[client.ts:526](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L526)

## Tokens

### getTokens()

> **getTokens**(): `Promise`\<[`Token`](/docs/packages/sdk/interfaces/Token.md)[]\>

#### Returns

`Promise`\<[`Token`](/docs/packages/sdk/interfaces/Token.md)[]\>

#### See

[API Documentation](https://monerium.dev/api-docs-v2#tag/tokens)

#### Defined in

[client.ts:425](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/client.ts#L425)
