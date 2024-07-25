[Monerium SDK React Provider](../README.md) / QueryOptions

# Type Alias: QueryOptions\<TData\>

> **QueryOptions**\<`TData`\>: `Omit`\<`UseQueryOptions`\<`TData`\>, `"queryKey"` \| `"queryFn"`\>

See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) options.

## Type Parameters

| Type Parameter | Default type | Description        |
| -------------- | ------------ | ------------------ |
| `TData`        | `unknown`    | The data returned. |

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
  },
});
```

## Used By

[useAuthContext](../functions/useAuthContext.md)

[useBalances](../functions/useBalances.md)

[useOrders](../functions/useOrders.md)

[useProfile](../functions/useProfile.md)

[useTokens](../functions/useTokens.md)

## Defined in

[sdk-react-provider/src/lib/types.ts:96](https://github.com/monerium/js-monorepo/blob/ae1055c12538e860127a655bc059162d414323b3/packages/sdk-react-provider/src/lib/types.ts#L96)
