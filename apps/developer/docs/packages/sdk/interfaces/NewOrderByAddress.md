# Interface: NewOrderByAddress

## Extends

- [`NewOrderCommon`](/docs/packages/sdk/interfaces/NewOrderCommon.md)

## Properties

| Property | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| `address` | `string` | - | - | [types.ts:438](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L438) |
| `amount` | `string` | - | [`NewOrderCommon`](/docs/packages/sdk/interfaces/NewOrderCommon.md).`amount` | [types.ts:429](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L429) |
| `chain` | [`Chain`](/docs/packages/sdk/type-aliases/Chain.md) \| [`ChainId`](/docs/packages/sdk/type-aliases/ChainId.md) | The senders network | - | [types.ts:440](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L440) |
| `counterpart` | [`Counterpart`](/docs/packages/sdk/interfaces/Counterpart.md) | - | [`NewOrderCommon`](/docs/packages/sdk/interfaces/NewOrderCommon.md).`counterpart` | [types.ts:432](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L432) |
| `currency` | [`Currency`](/docs/packages/sdk/enumerations/Currency.md) | - | [`NewOrderCommon`](/docs/packages/sdk/interfaces/NewOrderCommon.md).`currency` | [types.ts:431](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L431) |
| `memo?` | `string` | - | [`NewOrderCommon`](/docs/packages/sdk/interfaces/NewOrderCommon.md).`memo` | [types.ts:434](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L434) |
| `message` | `string` | - | [`NewOrderCommon`](/docs/packages/sdk/interfaces/NewOrderCommon.md).`message` | [types.ts:433](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L433) |
| `signature` | `string` | - | [`NewOrderCommon`](/docs/packages/sdk/interfaces/NewOrderCommon.md).`signature` | [types.ts:430](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L430) |
| `supportingDocumentId?` | `string` | - | [`NewOrderCommon`](/docs/packages/sdk/interfaces/NewOrderCommon.md).`supportingDocumentId` | [types.ts:435](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L435) |
