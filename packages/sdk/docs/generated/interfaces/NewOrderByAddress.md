[**Monerium SDK v2.12.1**](../README.md) • **Docs**

---

[Monerium SDK v2.12.1](../README.md) / NewOrderByAddress

# Interface: NewOrderByAddress

## Extends

- [`NewOrderCommon`](NewOrderCommon.md)

## Properties

### address

> **address**: `string`

#### Source

[types.ts:405](https://github.com/monerium/js-monorepo/blob/95da1ee68c22ee2a6c87ac928b307c8f3825242a/packages/sdk/src/types.ts#L405)

---

### amount

> **amount**: `string`

#### Inherited from

[`NewOrderCommon`](NewOrderCommon.md).[`amount`](NewOrderCommon.md#amount)

#### Source

[types.ts:396](https://github.com/monerium/js-monorepo/blob/95da1ee68c22ee2a6c87ac928b307c8f3825242a/packages/sdk/src/types.ts#L396)

---

### ~~chain?~~

> `optional` **chain**: [`Chain`](../type-aliases/Chain.md)

#### Deprecated

- Use 'chainId'

#### Source

[types.ts:407](https://github.com/monerium/js-monorepo/blob/95da1ee68c22ee2a6c87ac928b307c8f3825242a/packages/sdk/src/types.ts#L407)

---

### chainId

> **chainId**: `number`

#### Source

[types.ts:410](https://github.com/monerium/js-monorepo/blob/95da1ee68c22ee2a6c87ac928b307c8f3825242a/packages/sdk/src/types.ts#L410)

---

### counterpart

> **counterpart**: [`Counterpart`](Counterpart.md)

#### Inherited from

[`NewOrderCommon`](NewOrderCommon.md).[`counterpart`](NewOrderCommon.md#counterpart)

#### Source

[types.ts:399](https://github.com/monerium/js-monorepo/blob/95da1ee68c22ee2a6c87ac928b307c8f3825242a/packages/sdk/src/types.ts#L399)

---

### currency?

> `optional` **currency**: [`Currency`](../enumerations/Currency.md)

#### Inherited from

[`NewOrderCommon`](NewOrderCommon.md).[`currency`](NewOrderCommon.md#currency)

#### Source

[types.ts:398](https://github.com/monerium/js-monorepo/blob/95da1ee68c22ee2a6c87ac928b307c8f3825242a/packages/sdk/src/types.ts#L398)

---

### memo?

> `optional` **memo**: `string`

#### Inherited from

[`NewOrderCommon`](NewOrderCommon.md).[`memo`](NewOrderCommon.md#memo)

#### Source

[types.ts:401](https://github.com/monerium/js-monorepo/blob/95da1ee68c22ee2a6c87ac928b307c8f3825242a/packages/sdk/src/types.ts#L401)

---

### message

> **message**: `string`

#### Inherited from

[`NewOrderCommon`](NewOrderCommon.md).[`message`](NewOrderCommon.md#message)

#### Source

[types.ts:400](https://github.com/monerium/js-monorepo/blob/95da1ee68c22ee2a6c87ac928b307c8f3825242a/packages/sdk/src/types.ts#L400)

---

### ~~network?~~

> `optional` **network**: `"sepolia"` \| `"chiado"` \| `"amoy"` \| `"mainnet"`

#### Deprecated

- Use 'chainId'

#### Source

[types.ts:409](https://github.com/monerium/js-monorepo/blob/95da1ee68c22ee2a6c87ac928b307c8f3825242a/packages/sdk/src/types.ts#L409)

---

### signature

> **signature**: `string`

#### Inherited from

[`NewOrderCommon`](NewOrderCommon.md).[`signature`](NewOrderCommon.md#signature)

#### Source

[types.ts:397](https://github.com/monerium/js-monorepo/blob/95da1ee68c22ee2a6c87ac928b307c8f3825242a/packages/sdk/src/types.ts#L397)

---

### supportingDocumentId?

> `optional` **supportingDocumentId**: `string`

#### Inherited from

[`NewOrderCommon`](NewOrderCommon.md).[`supportingDocumentId`](NewOrderCommon.md#supportingdocumentid)

#### Source

[types.ts:402](https://github.com/monerium/js-monorepo/blob/95da1ee68c22ee2a6c87ac928b307c8f3825242a/packages/sdk/src/types.ts#L402)
