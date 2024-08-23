# Interface: NewOrderByAddress

## Extends

- [`NewOrderCommon`](/docs/packages/sdk/interfaces/NewOrderCommon.md)

## Properties

| Property | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| `address` | `string` | - | - | [types.ts:426](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L426) |
| `amount` | `string` | - | [`NewOrderCommon`](/docs/packages/sdk/interfaces/NewOrderCommon.md).`amount` | [types.ts:417](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L417) |
| `chain` | `number` \| [`Chain`](/docs/packages/sdk/type-aliases/Chain.md) | The senders network | - | [types.ts:428](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L428) |
| `counterpart` | [`Counterpart`](/docs/packages/sdk/interfaces/Counterpart.md) | - | [`NewOrderCommon`](/docs/packages/sdk/interfaces/NewOrderCommon.md).`counterpart` | [types.ts:420](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L420) |
| `currency` | [`Currency`](/docs/packages/sdk/enumerations/Currency.md) | - | [`NewOrderCommon`](/docs/packages/sdk/interfaces/NewOrderCommon.md).`currency` | [types.ts:419](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L419) |
| `memo?` | `string` | - | [`NewOrderCommon`](/docs/packages/sdk/interfaces/NewOrderCommon.md).`memo` | [types.ts:422](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L422) |
| `message` | `string` | - | [`NewOrderCommon`](/docs/packages/sdk/interfaces/NewOrderCommon.md).`message` | [types.ts:421](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L421) |
| `signature` | `string` | - | [`NewOrderCommon`](/docs/packages/sdk/interfaces/NewOrderCommon.md).`signature` | [types.ts:418](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L418) |
| `supportingDocumentId?` | `string` | - | [`NewOrderCommon`](/docs/packages/sdk/interfaces/NewOrderCommon.md).`supportingDocumentId` | [types.ts:423](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L423) |
