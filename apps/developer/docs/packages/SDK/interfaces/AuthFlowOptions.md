# Interface: AuthFlowOptions

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `address?` | `string` | the address your customer should link in auth flow | [types.ts:533](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L533) |
| `chain?` | `number` \| [`Chain`](/docs/packages/sdk/type-aliases/Chain.md) | the chain of the address | [types.ts:537](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L537) |
| `clientId?` | `string` | the auth flow client ID for your application | [types.ts:529](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L529) |
| `redirectUri?` | `string` | the redirect URI defined by your application | [types.ts:531](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L531) |
| `signature?` | `string` | the signature of the address | [types.ts:535](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L535) |
| `skipCreateAccount?` | `boolean` | skip account creation in auth flow | [types.ts:541](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L541) |
| `state?` | `string` | the state oauth parameter | [types.ts:539](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L539) |
