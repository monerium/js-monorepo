# Function: parseChain()

> **parseChain**(`chain`: [`Chain`](/docs/packages/sdk/type-aliases/Chain.md) \| [`ChainId`](/docs/packages/sdk/type-aliases/ChainId.md)): [`Chain`](/docs/packages/sdk/type-aliases/Chain.md)

This will resolve the chainId number to the corresponding chain name.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `chain` | [`Chain`](/docs/packages/sdk/type-aliases/Chain.md) \| [`ChainId`](/docs/packages/sdk/type-aliases/ChainId.md) | The chainId of the network |

## Returns

[`Chain`](/docs/packages/sdk/type-aliases/Chain.md)

chain name, 'ethereum', 'polygon', 'gnosis', etc.

## Defined in

[utils.ts:48](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/utils.ts#L48)
