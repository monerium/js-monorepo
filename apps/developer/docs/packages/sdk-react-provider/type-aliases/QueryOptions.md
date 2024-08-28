# Type Alias: QueryOptions\<TData\>

> **QueryOptions**\<`TData`\>: `Omit`\<`UseQueryOptions`\<`TData`\>, `"queryKey"` \| `"queryFn"`\>

See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) options.

## Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `TData` | `unknown` | The data returned. |

## See

# [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery)

## Example

```ts
useQueryHook({
 query: {
   enabled: isReady,
   staleTime: 1000,
   placeHolderData: { foo: 'bar' },
 }
})
```
## Options
> `queryKey` and `queryFn` are used internally and therefore not included as an options.
```diff
query: {
   gcTime,
   enabled,
   networkMode,
   initialData,
   initialDataUpdatedAt,
   meta,
   notifyOnChangeProps,
   placeholderData,
   queryKeyHashFn,
   refetchInterval,
   refetchIntervalInBackground,
   refetchOnMount,
   refetchOnReconnect,
   refetchOnWindowFocus,
   retry,
   retryOnMount,
   retryDelay,
   select,
   staleTime,
   structuralSharing,
   throwOnError
}
 ```

## Defined in

[sdk-react-provider/src/lib/types.ts:83](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/types.ts#L83)
