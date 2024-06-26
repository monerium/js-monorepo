[**Monerium SDK v2.13.0**](../README.md) • **Docs**

---

[Monerium SDK v2.13.0](../README.md) / PKCERequest

# Type alias: PKCERequest

> **PKCERequest**: `object`

## Type declaration

### address?

> `optional` **address**: `string`

the address of the wallet to automatically link

### ~~chain?~~

> `optional` **chain**: [`Chain`](Chain.md)

#### Deprecated

- Use chainId

### chainId?

> `optional` **chainId**: [`ChainId`](ChainId.md)

The network of the wallet to automatically link

### client_id

> **client_id**: `string`

the authentication flow client id of the application

### code_challenge

> **code_challenge**: `string`

the code challenge automatically generated by the SDK

### code_challenge_method

> **code_challenge_method**: `"S256"`

the code challenge method for the authentication flow , handled by the SDK

### ~~network?~~

> `optional` **network**: [`Network`](Network.md)

#### Deprecated

- Use chainId

### redirect_uri

> **redirect_uri**: `string`

the redirect uri of the application

### response_type

> **response_type**: `"code"`

the response type of the authentication flow, handled by the SDK

### scope?

> `optional` **scope**: `string`

the scope of the application

### signature?

> `optional` **signature**: `string`

the signature of the wallet to automatically link

### state?

> `optional` **state**: `string`

the state of the application

## Source

[types.ts:145](https://github.com/monerium/js-monorepo/blob/4397cd6d6b171e9f3bbb7c9a2278e6782b814c1a/packages/sdk/src/types.ts#L145)
