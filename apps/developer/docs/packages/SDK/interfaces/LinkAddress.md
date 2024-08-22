# Interface: LinkAddress

## Properties

### address

> **address**: `string`

<<<<<<< HEAD:apps/developer/docs/packages/SDK/interfaces/LinkAddress.md
> **accounts**: [`CurrencyAccounts`](/docs/packages/SDK/interfaces/CurrencyAccounts.md)[]
=======
The public key of the blockchain account.
>>>>>>> 3a1f3b9 (docs: update generated docs):packages/sdk/docs/generated/interfaces/LinkAddress.md

#### Defined in

[types.ts:465](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L465)

***

### chain

> **chain**: `number` \| [`Chain`](../type-aliases/Chain.md)

#### Defined in

[types.ts:478](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L478)

***

### message

<<<<<<< HEAD:apps/developer/docs/packages/SDK/interfaces/LinkAddress.md
> `optional` **chain**: `number` \| [`Chain`](/docs/packages/SDK/type-aliases/Chain.md)
=======
> **message**: `string`

Fixed message to be signed with the private key corresponding to the given address.

`I hereby declare that I am the address owner.`
>>>>>>> 3a1f3b9 (docs: update generated docs):packages/sdk/docs/generated/interfaces/LinkAddress.md

#### Defined in

[types.ts:471](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L471)

***

### profile?

> `optional` **profile**: `string`

Profile ID that owns the address.

#### Defined in

[types.ts:463](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L463)

***

### signature

> **signature**: `string`

The signature hash of signing the `message` with the private key associated with the given address.
For signing on-chain with ERC1271 contracts, use `0x`, visit the documentation for further details.
https://monerium.dev/api-docs-v2#tag/addresses/operation/link-address

#### Defined in

[types.ts:477](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L477)
