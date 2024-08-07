[**Monerium SDK React Provider v0.2.0**](../Packages.md) • **Docs**

***

[Monerium Packages](../../Packages.md) / [Monerium SDK React Provider](../Monerium%20SDK%20React%20Provider.md) / QueryResult

# Type Alias: QueryResult\<TVarName, TData\>

> **QueryResult**\<`TVarName`, `TData`\>: `Omit`\<`UseQueryResult`\<`TData`\>, `"data"`\> & `{ [P in TVarName]: UseQueryResult<TData>["data"] }`

See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) returns.

## Type Parameters

• **TVarName** *extends* `string`

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

[useAuthContext](../functions/useAuthContext.md)

[useBalances](../functions/useBalances.md)

[useOrders](../functions/useOrders.md)

[useProfile](../functions/useProfile.md)

[useTokens](../functions/useTokens.md)

## Defined in

[sdk-react-provider/src/lib/types.ts:149](https://github.com/monerium/js-monorepo/blob/ffeefd2a9bccc0d18acecd9390a7bfced5720c17/packages/sdk-react-provider/src/lib/types.ts#L149)
