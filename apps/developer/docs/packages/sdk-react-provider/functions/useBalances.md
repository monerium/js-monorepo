# Function: useBalances()

> **useBalances**(`params`: \{`address`: `string`;`chain`: `ChainId` \| `Chain`;`currencies`: `Currency` \| `Currency`[];`query`: [`QueryOptions`](/docs/packages/sdk-react-provider/type-aliases/QueryOptions.md)\<[`Balances`](/docs/packages/sdk-react-provider/interfaces/Balances.md)\>; \}): `UseQueryResult`\<[`Balances`](/docs/packages/sdk-react-provider/interfaces/Balances.md), `Error`\>

# Get balance for a an address on a give chain

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | `object` |  |
| `params.address` | `string` | The address to fetch the balance for. |
| `params.chain` | `ChainId` \| `Chain` | The chain to fetch the balance for. |
| `params.currencies`? | `Currency` \| `Currency`[] | One or many: `eur`, `usd`, `gbp`, `isk` |
| `params.query`? | [`QueryOptions`](/docs/packages/sdk-react-provider/type-aliases/QueryOptions.md)\<[`Balances`](/docs/packages/sdk-react-provider/interfaces/Balances.md)\> | See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) options. |

## Returns

`UseQueryResult`\<[`Balances`](/docs/packages/sdk-react-provider/interfaces/Balances.md), `Error`\>

## Example

```ts
const {
   data,
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

[sdk-react-provider/src/lib/hooks.tsx:403](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/hooks.tsx#L403)
