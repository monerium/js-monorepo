[**Monerium SDK v2.13.0**](../README.md) • **Docs**

---

[Monerium SDK v2.13.0](../README.md) / CrossChain

# Interface: CrossChain

## Extends

- [`Identifier`](Identifier.md)

## Properties

### address

> **address**: `string`

#### Source

[types.ts:308](https://github.com/monerium/js-monorepo/blob/4397cd6d6b171e9f3bbb7c9a2278e6782b814c1a/packages/sdk/src/types.ts#L308)

---

### bic?

> `optional` **bic**: `string`

#### Inherited from

[`Identifier`](Identifier.md).[`bic`](Identifier.md#bic)

#### Source

[types.ts:242](https://github.com/monerium/js-monorepo/blob/4397cd6d6b171e9f3bbb7c9a2278e6782b814c1a/packages/sdk/src/types.ts#L242)

---

### ~~chain?~~

> `optional` **chain**: [`Chain`](../type-aliases/Chain.md)

#### Deprecated

- Use chainId

#### Source

[types.ts:311](https://github.com/monerium/js-monorepo/blob/4397cd6d6b171e9f3bbb7c9a2278e6782b814c1a/packages/sdk/src/types.ts#L311)

---

### chainId

> **chainId**: `number`

#### Source

[types.ts:309](https://github.com/monerium/js-monorepo/blob/4397cd6d6b171e9f3bbb7c9a2278e6782b814c1a/packages/sdk/src/types.ts#L309)

---

### ~~network?~~

> `optional` **network**: `"sepolia"` \| `"chiado"` \| `"amoy"` \| `"mainnet"`

#### Deprecated

- Use chainId

#### Source

[types.ts:313](https://github.com/monerium/js-monorepo/blob/4397cd6d6b171e9f3bbb7c9a2278e6782b814c1a/packages/sdk/src/types.ts#L313)

---

### standard

> **standard**: [`chain`](../enumerations/PaymentStandard.md#chain)

#### Overrides

[`Identifier`](Identifier.md).[`standard`](Identifier.md#standard)

#### Source

[types.ts:307](https://github.com/monerium/js-monorepo/blob/4397cd6d6b171e9f3bbb7c9a2278e6782b814c1a/packages/sdk/src/types.ts#L307)
