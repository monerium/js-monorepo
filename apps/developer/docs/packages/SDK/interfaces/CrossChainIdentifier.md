# Interface: CrossChainIdentifier

## Extends

- [`Identifier`](/docs/packages/SDK/interfaces/Identifier.md)

## Properties

### address

> **address**: `string`

The receivers address

#### Defined in

[types.ts:333](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L333)

***

### bic?

> `optional` **bic**: `string`

#### Inherited from

[`Identifier`](/docs/packages/SDK/interfaces/Identifier.md).[`bic`](/docs/packages/SDK/interfaces/Identifier.md#bic)

#### Defined in

[types.ts:192](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L192)

***

### chain

> **chain**: `number` \| [`Chain`](/docs/packages/SDK/type-aliases/Chain.md)

The receivers network

#### Defined in

[types.ts:335](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L335)

***

### standard

> **standard**: [`chain`](/docs/packages/SDK/enumerations/PaymentStandard.md#chain)

#### Overrides

[`Identifier`](/docs/packages/SDK/interfaces/Identifier.md).[`standard`](/docs/packages/SDK/interfaces/Identifier.md#standard)

#### Defined in

[types.ts:331](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L331)
