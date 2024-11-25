# Function: getChain()

> **getChain**(`chainId`: `number`): [`Chain`](/docs/packages/sdk/type-aliases/Chain.md)

This will resolve the chainId number to the corresponding chain name.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `chainId` | `number` | The chainId of the network |

## Returns

[`Chain`](/docs/packages/sdk/type-aliases/Chain.md)

chain name

## Example

```ts
getChain(1) // 'ethereum'
getChain(11155111) // 'ethereum'

getChain(100) // 'gnosis'
getChain(10200) // 'gnosis'

getChain(137) // 'polygon'
getChain(80002) // 'polygon'
```

## Defined in

[utils.ts:139](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/utils.ts#L139)
