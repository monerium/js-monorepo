# Interface: NewOrderByAddress

## Extends

- [`NewOrderCommon`](/docs/packages/sdk/interfaces/NewOrderCommon.md)

## Properties

| Property | Type | Description | Inherited from | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| `address` | `string` | - | - | [types.ts:424](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L424) |
| `amount` | `string` | - | [`NewOrderCommon`](/docs/packages/sdk/interfaces/NewOrderCommon.md).`amount` | [types.ts:415](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L415) |
| `chain` | `number` \| [`Chain`](/docs/packages/sdk/type-aliases/Chain.md) | The senders network | - | [types.ts:426](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L426) |
| `counterpart` | [`Counterpart`](/docs/packages/sdk/interfaces/Counterpart.md) | - | [`NewOrderCommon`](/docs/packages/sdk/interfaces/NewOrderCommon.md).`counterpart` | [types.ts:418](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L418) |
| `currency` | [`Currency`](/docs/packages/sdk/enumerations/Currency.md) | - | [`NewOrderCommon`](/docs/packages/sdk/interfaces/NewOrderCommon.md).`currency` | [types.ts:417](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L417) |
| `memo?` | `string` | - | [`NewOrderCommon`](/docs/packages/sdk/interfaces/NewOrderCommon.md).`memo` | [types.ts:420](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L420) |
| `message` | `string` | - | [`NewOrderCommon`](/docs/packages/sdk/interfaces/NewOrderCommon.md).`message` | [types.ts:419](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L419) |
| `signature` | `string` | - | [`NewOrderCommon`](/docs/packages/sdk/interfaces/NewOrderCommon.md).`signature` | [types.ts:416](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L416) |
| `supportingDocumentId?` | `string` | - | [`NewOrderCommon`](/docs/packages/sdk/interfaces/NewOrderCommon.md).`supportingDocumentId` | [types.ts:421](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L421) |
