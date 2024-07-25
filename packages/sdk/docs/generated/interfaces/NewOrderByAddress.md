[**Monerium SDK**](../README.md) • **Docs**

***

[Monerium SDK](../README.md) / NewOrderByAddress

# Interface: NewOrderByAddress

## Extends

- [`NewOrderCommon`](NewOrderCommon.md)

## Properties

### address

> **address**: `string`

#### Defined in

[types.ts:403](https://github.com/monerium/js-monorepo/blob/f9c4f6d23632080dc2f66fc1ef03cdb9951e75af/packages/sdk/src/types.ts#L403)

***

### amount

> **amount**: `string`

#### Inherited from

[`NewOrderCommon`](NewOrderCommon.md).[`amount`](NewOrderCommon.md#amount)

#### Defined in

[types.ts:394](https://github.com/monerium/js-monorepo/blob/f9c4f6d23632080dc2f66fc1ef03cdb9951e75af/packages/sdk/src/types.ts#L394)

***

### chain?

> `optional` **chain**: [`Chain`](../type-aliases/Chain.md)

#### Defined in

[types.ts:404](https://github.com/monerium/js-monorepo/blob/f9c4f6d23632080dc2f66fc1ef03cdb9951e75af/packages/sdk/src/types.ts#L404)

***

### chainId?

> `optional` **chainId**: `number`

#### Defined in

[types.ts:407](https://github.com/monerium/js-monorepo/blob/f9c4f6d23632080dc2f66fc1ef03cdb9951e75af/packages/sdk/src/types.ts#L407)

***

### counterpart

> **counterpart**: [`Counterpart`](Counterpart.md)

#### Inherited from

[`NewOrderCommon`](NewOrderCommon.md).[`counterpart`](NewOrderCommon.md#counterpart)

#### Defined in

[types.ts:397](https://github.com/monerium/js-monorepo/blob/f9c4f6d23632080dc2f66fc1ef03cdb9951e75af/packages/sdk/src/types.ts#L397)

***

### currency

> **currency**: [`Currency`](../enumerations/Currency.md)

#### Inherited from

[`NewOrderCommon`](NewOrderCommon.md).[`currency`](NewOrderCommon.md#currency)

#### Defined in

[types.ts:396](https://github.com/monerium/js-monorepo/blob/f9c4f6d23632080dc2f66fc1ef03cdb9951e75af/packages/sdk/src/types.ts#L396)

***

### memo?

> `optional` **memo**: `string`

#### Inherited from

[`NewOrderCommon`](NewOrderCommon.md).[`memo`](NewOrderCommon.md#memo)

#### Defined in

[types.ts:399](https://github.com/monerium/js-monorepo/blob/f9c4f6d23632080dc2f66fc1ef03cdb9951e75af/packages/sdk/src/types.ts#L399)

***

### message

> **message**: `string`

#### Inherited from

[`NewOrderCommon`](NewOrderCommon.md).[`message`](NewOrderCommon.md#message)

#### Defined in

[types.ts:398](https://github.com/monerium/js-monorepo/blob/f9c4f6d23632080dc2f66fc1ef03cdb9951e75af/packages/sdk/src/types.ts#L398)

***

### ~~network?~~

> `optional` **network**: `"sepolia"` \| `"chiado"` \| `"amoy"` \| `"mainnet"`

#### Deprecated

- Use 'chainId' or 'chain'

#### Defined in

[types.ts:406](https://github.com/monerium/js-monorepo/blob/f9c4f6d23632080dc2f66fc1ef03cdb9951e75af/packages/sdk/src/types.ts#L406)

***

### signature

> **signature**: `string`

#### Inherited from

[`NewOrderCommon`](NewOrderCommon.md).[`signature`](NewOrderCommon.md#signature)

#### Defined in

[types.ts:395](https://github.com/monerium/js-monorepo/blob/f9c4f6d23632080dc2f66fc1ef03cdb9951e75af/packages/sdk/src/types.ts#L395)

***

### supportingDocumentId?

> `optional` **supportingDocumentId**: `string`

#### Inherited from

[`NewOrderCommon`](NewOrderCommon.md).[`supportingDocumentId`](NewOrderCommon.md#supportingdocumentid)

#### Defined in

[types.ts:400](https://github.com/monerium/js-monorepo/blob/f9c4f6d23632080dc2f66fc1ef03cdb9951e75af/packages/sdk/src/types.ts#L400)
