<<<<<<< HEAD:apps/docs/docs/SDK React Provider/type-aliases/QueryOptions.md
=======
[**Monerium SDK React Provider v0.2.0**](../Packages.md) • **Docs**

---

[Monerium Packages](../../Packages.md) / [Monerium SDK React Provider](../Monerium%20SDK%20React%20Provider.md) / QueryOptions

>>>>>>> 48f86c7 (feat: setup docasaurus):apps/docs/docs/Monerium SDK React Provider/type-aliases/QueryOptions.md
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
  },
});
```

## Used By

[useAuthContext](/docs/SDK%20React%20Provider/functions/useAuthContext.md)

[useBalances](/docs/SDK%20React%20Provider/functions/useBalances.md)

[useOrders](/docs/SDK%20React%20Provider/functions/useOrders.md)

[useProfile](/docs/SDK%20React%20Provider/functions/useProfile.md)

[useTokens](/docs/SDK%20React%20Provider/functions/useTokens.md)

## Defined in

[sdk-react-provider/src/lib/types.ts:96](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/types.ts#L96)
