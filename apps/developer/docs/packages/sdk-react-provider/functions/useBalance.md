# Function: useBalance()

> **useBalance**(`params`?: \{`address`: `string`;`chain`: `ChainId` \| `Chain`;`query`: [`QueryOptions`](/docs/packages/sdk-react-provider/type-aliases/QueryOptions.md)\<[`Balances`](/docs/packages/sdk-react-provider/interfaces/Balances.md)\>; \}): [`QueryResult`](/docs/packages/sdk-react-provider/type-aliases/QueryResult.md)\<`"balances"`, [`Balances`](/docs/packages/sdk-react-provider/interfaces/Balances.md)\>

# Get balance for a an address on a give chain

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params`? | `object` | No required parameters. |
| `params.address`? | `string` | The address to fetch the balance for. |
| `params.chain`? | `ChainId` \| `Chain` | The chain to fetch the balance for. |
| `params.query`? | [`QueryOptions`](/docs/packages/sdk-react-provider/type-aliases/QueryOptions.md)\<[`Balances`](/docs/packages/sdk-react-provider/interfaces/Balances.md)\> | See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) options. |

## Returns

[`QueryResult`](/docs/packages/sdk-react-provider/type-aliases/QueryResult.md)\<`"balances"`, [`Balances`](/docs/packages/sdk-react-provider/interfaces/Balances.md)\>

## Example

```ts
const {
   balance, // useQuery's `data` property
   isLoading,
   isError,
   error,
   refetch,
   ...moreUseQueryResults
} = useBalances();
```

## See

[API Documentation](https://monerium.dev/api-docs/v2#tag/addresses/operation/balances)

## Defined in

[sdk-react-provider/src/lib/hooks.tsx:413](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/hooks.tsx#L413)
