[Monerium SDK React Provider](../README.md) / QueryResult

# Type Alias: QueryResult\<TVarName, TData\>

> **QueryResult**\<`TVarName`, `TData`\>: `Omit`\<`UseQueryResult`\<`TData`\>, `"data"`\> & `{ [P in TVarName]: UseQueryResult<TData>["data"] }`

See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) returns.

## Type Parameters

| Type Parameter                | Default type | Description                                     |
| ----------------------------- | ------------ | ----------------------------------------------- |
| `TVarName` _extends_ `string` | -            | The name of the variable that returns the data. |
| `TData`                       | `unknown`    | The data returned.                              |

## See

# [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery)

## Example

> `data` is renamed according to the `TVarName` and therefore not included in the result.

```diff
{
-   data,
   dataUpdatedAt,
   error,
   errorUpdatedAt,
   failureCount,
   failureReason,
   fetchStatus,
   isError,
   isFetched,
   isFetchedAfterMount,
   isFetching,
   isInitialLoading,
   isLoading,
   isLoadingError,
   isPaused,
   isPending,
   isPlaceholderData,
   isRefetchError,
   isRefetching,
   isStale,
   isSuccess,
   refetch,
   status,
}
```

## Used By

[useAuthContext](../functions/useAuthContext.md)

[useBalances](../functions/useBalances.md)

[useOrders](../functions/useOrders.md)

[useProfile](../functions/useProfile.md)

[useTokens](../functions/useTokens.md)

## Defined in

[sdk-react-provider/src/lib/types.ts:149](https://github.com/monerium/js-monorepo/blob/ae1055c12538e860127a655bc059162d414323b3/packages/sdk-react-provider/src/lib/types.ts#L149)
