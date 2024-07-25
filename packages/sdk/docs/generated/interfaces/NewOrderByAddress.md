[**Monerium SDK**](../README.md) • **Docs**

---

[Monerium SDK](../README.md) / NewOrderByAddress

# Interface: NewOrderByAddress

## Extends

- [`NewOrderCommon`](NewOrderCommon.md)

## Properties

### address

> **address**: `string`

#### Defined in

[types.ts:405](https://github.com/monerium/js-monorepo/blob/daf0515eb0b1bfcdd9bd49ef605447668fdb0f6a/packages/sdk/src/types.ts#L405)

---

### amount

> **amount**: `string`

#### Inherited from

[`NewOrderCommon`](NewOrderCommon.md).[`amount`](NewOrderCommon.md#amount)

#### Defined in

[types.ts:396](https://github.com/monerium/js-monorepo/blob/daf0515eb0b1bfcdd9bd49ef605447668fdb0f6a/packages/sdk/src/types.ts#L396)

---

### ~~chain?~~

> `optional` **chain**: [`Chain`](../type-aliases/Chain.md)

#### Deprecated

- Use 'chainId'

#### Defined in

[types.ts:407](https://github.com/monerium/js-monorepo/blob/daf0515eb0b1bfcdd9bd49ef605447668fdb0f6a/packages/sdk/src/types.ts#L407)

---

### chainId

> **chainId**: `number`

#### Defined in

[types.ts:410](https://github.com/monerium/js-monorepo/blob/daf0515eb0b1bfcdd9bd49ef605447668fdb0f6a/packages/sdk/src/types.ts#L410)

---

### counterpart

> **counterpart**: [`Counterpart`](Counterpart.md)

#### Inherited from

[`NewOrderCommon`](NewOrderCommon.md).[`counterpart`](NewOrderCommon.md#counterpart)

#### Defined in

[types.ts:399](https://github.com/monerium/js-monorepo/blob/daf0515eb0b1bfcdd9bd49ef605447668fdb0f6a/packages/sdk/src/types.ts#L399)

---

### currency?

> `optional` **currency**: [`Currency`](../enumerations/Currency.md)

#### Inherited from

[`NewOrderCommon`](NewOrderCommon.md).[`currency`](NewOrderCommon.md#currency)

#### Defined in

[types.ts:398](https://github.com/monerium/js-monorepo/blob/daf0515eb0b1bfcdd9bd49ef605447668fdb0f6a/packages/sdk/src/types.ts#L398)

---

### memo?

> `optional` **memo**: `string`

#### Inherited from

[`NewOrderCommon`](NewOrderCommon.md).[`memo`](NewOrderCommon.md#memo)

#### Defined in

[types.ts:401](https://github.com/monerium/js-monorepo/blob/daf0515eb0b1bfcdd9bd49ef605447668fdb0f6a/packages/sdk/src/types.ts#L401)

---

### message

> **message**: `string`

#### Inherited from

[`NewOrderCommon`](NewOrderCommon.md).[`message`](NewOrderCommon.md#message)

#### Defined in

[types.ts:400](https://github.com/monerium/js-monorepo/blob/daf0515eb0b1bfcdd9bd49ef605447668fdb0f6a/packages/sdk/src/types.ts#L400)

---

### ~~network?~~

> `optional` **network**: `"sepolia"` \| `"chiado"` \| `"amoy"` \| `"mainnet"`

#### Deprecated

- Use 'chainId'

#### Defined in

[types.ts:409](https://github.com/monerium/js-monorepo/blob/daf0515eb0b1bfcdd9bd49ef605447668fdb0f6a/packages/sdk/src/types.ts#L409)

---

### signature

> **signature**: `string`

#### Inherited from

[`NewOrderCommon`](NewOrderCommon.md).[`signature`](NewOrderCommon.md#signature)

#### Defined in

[types.ts:397](https://github.com/monerium/js-monorepo/blob/daf0515eb0b1bfcdd9bd49ef605447668fdb0f6a/packages/sdk/src/types.ts#L397)

---

### supportingDocumentId?

> `optional` **supportingDocumentId**: `string`

#### Inherited from

[`NewOrderCommon`](NewOrderCommon.md).[`supportingDocumentId`](NewOrderCommon.md#supportingdocumentid)

#### Defined in

[types.ts:402](https://github.com/monerium/js-monorepo/blob/daf0515eb0b1bfcdd9bd49ef605447668fdb0f6a/packages/sdk/src/types.ts#L402)
