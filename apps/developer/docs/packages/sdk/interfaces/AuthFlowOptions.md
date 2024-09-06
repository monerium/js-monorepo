# Interface: AuthFlowOptions

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `address?` | `string` | the address your customer should link in auth flow | [types.ts:547](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L547) |
| `chain?` | [`Chain`](/docs/packages/sdk/type-aliases/Chain.md) \| [`ChainId`](/docs/packages/sdk/type-aliases/ChainId.md) | the chain of the address | [types.ts:551](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L551) |
| `clientId?` | `string` | the auth flow client ID for your application | [types.ts:543](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L543) |
| `redirectUri?` | `string` | the redirect URI defined by your application | [types.ts:545](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L545) |
| `signature?` | `string` | the signature of the address | [types.ts:549](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L549) |
| `skipCreateAccount?` | `boolean` | skip account creation in auth flow | [types.ts:555](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L555) |
| `state?` | `string` | the state oauth parameter | [types.ts:553](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L553) |
