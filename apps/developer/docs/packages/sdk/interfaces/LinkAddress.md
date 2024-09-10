# Interface: LinkAddress

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `address` | `string` | The public key of the blockchain account. | [types.ts:465](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L465) |
| `chain` | `number` \| [`Chain`](/docs/packages/sdk/type-aliases/Chain.md) | - | [types.ts:478](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L478) |
| `message` | `string` | Fixed message to be signed with the private key corresponding to the given address. `I hereby declare that I am the address owner.` | [types.ts:471](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L471) |
| `profile?` | `string` | Profile ID that owns the address. | [types.ts:463](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L463) |
| `signature` | `string` | The signature hash of signing the `message` with the private key associated with the given address. For signing on-chain with ERC1271 contracts, use `0x`, visit the documentation for further details. https://monerium.dev/api-docs-v2#tag/addresses/operation/link-address | [types.ts:477](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L477) |
