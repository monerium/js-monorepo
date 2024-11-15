# Interface: LinkAddress

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `address` | `string` | The public key of the blockchain account. | [types.ts:481](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L481) |
| `chain` | [`Chain`](/docs/packages/sdk/type-aliases/Chain.md) \| [`ChainId`](/docs/packages/sdk/type-aliases/ChainId.md) | - | [types.ts:494](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L494) |
| `message?` | `string` | Fixed message to be signed with the private key corresponding to the given address. `I hereby declare that I am the address owner.` | [types.ts:487](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L487) |
| `profile?` | `string` | Profile ID that owns the address. | [types.ts:479](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L479) |
| `signature` | `string` | The signature hash of signing the `message` with the private key associated with the given address. For signing on-chain with ERC1271 contracts, use `0x`, visit the documentation for further details. https://monerium.dev/api-docs-v2#tag/addresses/operation/link-address | [types.ts:493](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L493) |
