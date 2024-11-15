# Interface: CrossChainIdentifier

## Extends

- [`Identifier`](/docs/packages/sdk/interfaces/Identifier.md)

## Properties

| Property | Type | Description | Overrides | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ | ------ |
| `address` | `string` | The receivers address | - | - | [types.ts:344](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L344) |
| `bic?` | `string` | - | - | [`Identifier`](/docs/packages/sdk/interfaces/Identifier.md).`bic` | [types.ts:204](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L204) |
| `chain` | [`Chain`](/docs/packages/sdk/type-aliases/Chain.md) \| [`ChainId`](/docs/packages/sdk/type-aliases/ChainId.md) | The receivers network | - | - | [types.ts:346](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L346) |
| `standard` | `chain` | - | [`Identifier`](/docs/packages/sdk/interfaces/Identifier.md).`standard` | - | [types.ts:342](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L342) |
