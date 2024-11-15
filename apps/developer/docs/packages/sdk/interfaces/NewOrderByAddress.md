# Interface: NewOrderByAddress

## Extends

- [`NewOrderCommon`](/docs/packages/sdk/interfaces/NewOrderCommon.md)

## Properties

| Property | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| `address` | `string` | - | - | [types.ts:442](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L442) |
| `amount` | `string` | - | [`NewOrderCommon`](/docs/packages/sdk/interfaces/NewOrderCommon.md).`amount` | [types.ts:433](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L433) |
| `chain` | [`Chain`](/docs/packages/sdk/type-aliases/Chain.md) \| [`ChainId`](/docs/packages/sdk/type-aliases/ChainId.md) | The senders network | - | [types.ts:444](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L444) |
| `counterpart` | [`Counterpart`](/docs/packages/sdk/interfaces/Counterpart.md) | - | [`NewOrderCommon`](/docs/packages/sdk/interfaces/NewOrderCommon.md).`counterpart` | [types.ts:436](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L436) |
| `currency` | [`Currency`](/docs/packages/sdk/enumerations/Currency.md) | - | [`NewOrderCommon`](/docs/packages/sdk/interfaces/NewOrderCommon.md).`currency` | [types.ts:435](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L435) |
| `memo?` | `string` | - | [`NewOrderCommon`](/docs/packages/sdk/interfaces/NewOrderCommon.md).`memo` | [types.ts:438](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L438) |
| `message` | `string` | - | [`NewOrderCommon`](/docs/packages/sdk/interfaces/NewOrderCommon.md).`message` | [types.ts:437](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L437) |
| `signature` | `string` | - | [`NewOrderCommon`](/docs/packages/sdk/interfaces/NewOrderCommon.md).`signature` | [types.ts:434](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L434) |
| `supportingDocumentId?` | `string` | - | [`NewOrderCommon`](/docs/packages/sdk/interfaces/NewOrderCommon.md).`supportingDocumentId` | [types.ts:439](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L439) |
