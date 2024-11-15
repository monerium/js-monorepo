# Interface: LinkAddress

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `address` | `string` | The public key of the blockchain account. | sdk/dist/index.d.ts:388 |
| `chain` | `ChainId` \| `Chain` | - | sdk/dist/index.d.ts:401 |
| `message?` | `string` | Fixed message to be signed with the private key corresponding to the given address. `I hereby declare that I am the address owner.` | sdk/dist/index.d.ts:394 |
| `profile?` | `string` | Profile ID that owns the address. | sdk/dist/index.d.ts:386 |
| `signature` | `string` | The signature hash of signing the `message` with the private key associated with the given address. For signing on-chain with ERC1271 contracts, use `0x`, visit the documentation for further details. https://monerium.dev/api-docs-v2#tag/addresses/operation/link-address | sdk/dist/index.d.ts:400 |
