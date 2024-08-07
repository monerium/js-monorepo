# Type Alias: QueryResult\<TVarName, TData\>

> **QueryResult**\<`TVarName`, `TData`\>: `Omit`\<`UseQueryResult`\<`TData`\>, `"data"`\> & `{ [P in TVarName]: UseQueryResult<TData>["data"] }`

See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) returns.

## Type Parameters

• **TVarName** _extends_ `string`

The name of the variable that returns the data.

• **TData** = `unknown`

The data returned.

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

[useAuthContext](/docs/SDK%20React%20Provider/functions/useAuthContext.md)

[useBalances](/docs/SDK%20React%20Provider/functions/useBalances.md)

[useOrders](/docs/SDK%20React%20Provider/functions/useOrders.md)

[useProfile](/docs/SDK%20React%20Provider/functions/useProfile.md)

[useTokens](/docs/SDK%20React%20Provider/functions/useTokens.md)

## Defined in

[sdk-react-provider/src/lib/types.ts:149](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/types.ts#L149)
