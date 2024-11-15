# Interface: AuthFlowOptions

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `address?` | `string` | the address your customer should link in auth flow | [types.ts:558](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L558) |
| `chain?` | [`Chain`](/docs/packages/sdk/type-aliases/Chain.md) \| [`ChainId`](/docs/packages/sdk/type-aliases/ChainId.md) | the chain of the address | [types.ts:562](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L562) |
| `clientId?` | `string` | the auth flow client ID for your application | [types.ts:554](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L554) |
| `redirectUri?` | `string` | the redirect URI defined by your application | [types.ts:556](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L556) |
| `signature?` | `string` | the signature of the address | [types.ts:560](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L560) |
| `skipCreateAccount?` | `boolean` | skip account creation in auth flow | [types.ts:566](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L566) |
| `state?` | `string` | the state oauth parameter | [types.ts:564](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L564) |
