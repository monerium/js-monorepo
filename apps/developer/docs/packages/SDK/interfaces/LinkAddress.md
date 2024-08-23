# Interface: LinkAddress

## Properties

### address

> **address**: `string`

The public key of the blockchain account.

#### Defined in

[types.ts:467](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L467)

***

### chain

> **chain**: `number` \| [`Chain`](/docs/packages/SDK/type-aliases/Chain.md)

#### Defined in

[types.ts:480](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L480)

***

### message

> **message**: `string`

Fixed message to be signed with the private key corresponding to the given address.

`I hereby declare that I am the address owner.`

#### Defined in

[types.ts:473](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L473)

***

### profile?

> `optional` **profile**: `string`

Profile ID that owns the address.

#### Defined in

[types.ts:465](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L465)

***

### signature

> **signature**: `string`

The signature hash of signing the `message` with the private key associated with the given address.
For signing on-chain with ERC1271 contracts, use `0x`, visit the documentation for further details.
https://monerium.dev/api-docs-v2#tag/addresses/operation/link-address

#### Defined in

[types.ts:479](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L479)
