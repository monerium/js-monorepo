[**Monerium SDK**](../README.md) • **Docs**

***

[Monerium SDK](../README.md) / CrossChain

# Interface: CrossChain

## Extends

- [`Identifier`](Identifier.md)

## Properties

### address

> **address**: `string`

#### Defined in

[types.ts:307](https://github.com/monerium/js-monorepo/blob/f9c4f6d23632080dc2f66fc1ef03cdb9951e75af/packages/sdk/src/types.ts#L307)

***

### bic?

> `optional` **bic**: `string`

#### Inherited from

[`Identifier`](Identifier.md).[`bic`](Identifier.md#bic)

#### Defined in

[types.ts:241](https://github.com/monerium/js-monorepo/blob/f9c4f6d23632080dc2f66fc1ef03cdb9951e75af/packages/sdk/src/types.ts#L241)

***

### chain?

> `optional` **chain**: [`Chain`](../type-aliases/Chain.md)

#### Defined in

[types.ts:309](https://github.com/monerium/js-monorepo/blob/f9c4f6d23632080dc2f66fc1ef03cdb9951e75af/packages/sdk/src/types.ts#L309)

***

### chainId?

> `optional` **chainId**: `number`

#### Defined in

[types.ts:308](https://github.com/monerium/js-monorepo/blob/f9c4f6d23632080dc2f66fc1ef03cdb9951e75af/packages/sdk/src/types.ts#L308)

***

### ~~network?~~

> `optional` **network**: `"sepolia"` \| `"chiado"` \| `"amoy"` \| `"mainnet"`

#### Deprecated

- Use 'chainId' or 'chain'

#### Defined in

[types.ts:311](https://github.com/monerium/js-monorepo/blob/f9c4f6d23632080dc2f66fc1ef03cdb9951e75af/packages/sdk/src/types.ts#L311)

***

### standard

> **standard**: [`chain`](../enumerations/PaymentStandard.md#chain)

#### Overrides

[`Identifier`](Identifier.md).[`standard`](Identifier.md#standard)

#### Defined in

[types.ts:306](https://github.com/monerium/js-monorepo/blob/f9c4f6d23632080dc2f66fc1ef03cdb9951e75af/packages/sdk/src/types.ts#L306)
