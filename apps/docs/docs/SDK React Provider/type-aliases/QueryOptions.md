# Type Alias: QueryOptions\<TData\>

> **QueryOptions**\<`TData`\>: `Omit`\<`UseQueryOptions`\<`TData`\>, `"queryKey"` \| `"queryFn"`\>

See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) options.

## Type Parameters

• **TData** = `unknown`

The data returned.

## See

# [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery)

## Options

> `queryKey` and `queryFn` are used internally and therefore not included in the options.
```diff
query: {
-  queryKey,
-  queryFn,
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

## Used By

[useAuthContext](/docs/SDK%20React%20Provider/functions/useAuthContext.md)

[useBalances](/docs/SDK%20React%20Provider/functions/useBalances.md)

[useOrders](/docs/SDK%20React%20Provider/functions/useOrders.md)

[useProfile](/docs/SDK%20React%20Provider/functions/useProfile.md)

[useTokens](/docs/SDK%20React%20Provider/functions/useTokens.md)

## Defined in

[types.ts:96](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/types.ts#L96)
