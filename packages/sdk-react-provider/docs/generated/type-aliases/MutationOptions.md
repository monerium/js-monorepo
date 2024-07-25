[Monerium SDK React Provider](../README.md) / MutationOptions

# Type Alias: MutationOptions\<TData, TError, TVariables\>

> **MutationOptions**\<`TData`, `TError`, `TVariables`\>: `Omit`\<`UseMutationOptions`\<`TData`, `TError`, `TVariables`\>, `"mutationKey"` \| `"mutationFn"`\>

See [Tanstack Query - useMutation](https://tanstack.com/query/latest/docs/framework/react/reference/useMutation) options.

## Type Parameters

| Type Parameter | Default type | Description                         |
| -------------- | ------------ | ----------------------------------- |
| `TData`        | `unknown`    | The data returned.                  |
| `TError`       | `unknown`    | The error returned.                 |
| `TVariables`   | `unknown`    | The variables used in the mutation. |

## See

# [Tanstack Query - useMutation](https://tanstack.com/query/latest/docs/framework/react/reference/useMutation)

## Options

> `mutationKey` and `mutationFn` are used internally and therefore not included in the options.

```diff
mutation: {
   gcTime,
   meta,
-  mutationFn,
-  mutationKey,
   networkMode,
   onError,
   onMutate,
   onSettled,
   onSuccess,
   retry,
   retryDelay,
   scope,
   throwOnError,
}
```

## Example

```ts
useMutationHook({
  mutation: {
    onSuccess: (data, variables) => {
      console.log('onSuccess callback', data, variables);
    },
    onError: (error) => {
      console.log('onError callback', error);
    },
  },
});
```

## Used By

[useLinkAddress](../functions/useLinkAddress.md)

[usePlaceOrder](../functions/usePlaceOrder.md)

## Defined in

[sdk-react-provider/src/lib/types.ts:202](https://github.com/monerium/js-monorepo/blob/ae1055c12538e860127a655bc059162d414323b3/packages/sdk-react-provider/src/lib/types.ts#L202)
