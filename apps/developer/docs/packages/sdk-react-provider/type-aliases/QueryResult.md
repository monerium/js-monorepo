# Type Alias: QueryResult\<TVarName, TData\>

> **QueryResult**\<`TVarName`, `TData`\>: `Omit`\<`UseQueryResult`\<`TData`\>, `"data"`\> & `{ [P in TVarName]: UseQueryResult<TData>["data"] }`

See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) returns.

## Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `TVarName` *extends* `string` | - | The name of the variable that returns the data. |
| `TData` | `unknown` | The data returned. |

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

## Defined in

[sdk-react-provider/src/lib/types.ts:126](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/types.ts#L126)
