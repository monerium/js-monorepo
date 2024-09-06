# Function: useBalances()

> **useBalances**(`params`: \{`query`: [`QueryOptions`](/docs/packages/sdk-react-provider/type-aliases/QueryOptions.md)\<[`Balances`](/docs/packages/sdk-react-provider/interfaces/Balances.md)[]\>; \}): [`QueryResult`](/docs/packages/sdk-react-provider/type-aliases/QueryResult.md)\<`"balances"`, [`Balances`](/docs/packages/sdk-react-provider/interfaces/Balances.md)[]\>

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | `object` |  |
| `params.query`? | [`QueryOptions`](/docs/packages/sdk-react-provider/type-aliases/QueryOptions.md)\<[`Balances`](/docs/packages/sdk-react-provider/interfaces/Balances.md)[]\> | See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) options. |

## Returns

[`QueryResult`](/docs/packages/sdk-react-provider/type-aliases/QueryResult.md)\<`"balances"`, [`Balances`](/docs/packages/sdk-react-provider/interfaces/Balances.md)[]\>

## Example

```ts
const {
   balances, // useQuery's `data` property
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

[sdk-react-provider/src/lib/hooks.tsx:462](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/hooks.tsx#L462)
