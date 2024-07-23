[**Monerium SDK**](../README.md) • **Docs**

---

[Monerium SDK](../README.md) / CrossChain

# Interface: CrossChain

## Extends

- [`Identifier`](Identifier.md)

## Properties

### address

> **address**: `string`

#### Defined in

[types.ts:308](https://github.com/monerium/js-monorepo/blob/6fd0ad80ad4e8d991580cbeedf4372ce7e758e51/packages/sdk/src/types.ts#L308)

---

### bic?

> `optional` **bic**: `string`

#### Inherited from

[`Identifier`](Identifier.md).[`bic`](Identifier.md#bic)

#### Defined in

[types.ts:242](https://github.com/monerium/js-monorepo/blob/6fd0ad80ad4e8d991580cbeedf4372ce7e758e51/packages/sdk/src/types.ts#L242)

---

### ~~chain?~~

> `optional` **chain**: [`Chain`](../type-aliases/Chain.md)

#### Deprecated

- Use chainId

#### Defined in

[types.ts:311](https://github.com/monerium/js-monorepo/blob/6fd0ad80ad4e8d991580cbeedf4372ce7e758e51/packages/sdk/src/types.ts#L311)

---

### chainId

> **chainId**: `number`

#### Defined in

[types.ts:309](https://github.com/monerium/js-monorepo/blob/6fd0ad80ad4e8d991580cbeedf4372ce7e758e51/packages/sdk/src/types.ts#L309)

---

### ~~network?~~

> `optional` **network**: `"sepolia"` \| `"chiado"` \| `"amoy"` \| `"mainnet"`

#### Deprecated

- Use chainId

#### Defined in

[types.ts:313](https://github.com/monerium/js-monorepo/blob/6fd0ad80ad4e8d991580cbeedf4372ce7e758e51/packages/sdk/src/types.ts#L313)

---

### standard

> **standard**: [`chain`](../enumerations/PaymentStandard.md#chain)

#### Overrides

[`Identifier`](Identifier.md).[`standard`](Identifier.md#standard)

#### Defined in

[types.ts:307](https://github.com/monerium/js-monorepo/blob/6fd0ad80ad4e8d991580cbeedf4372ce7e758e51/packages/sdk/src/types.ts#L307)
