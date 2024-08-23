# Type Alias: MutationOptions\<TData, TError, TVariables\>

> **MutationOptions**\<`TData`, `TError`, `TVariables`\>: `Omit`\<`UseMutationOptions`\<`TData`, `TError`, `TVariables`\>, `"mutationKey"` \| `"mutationFn"`\>

See [Tanstack Query - useMutation](https://tanstack.com/query/latest/docs/framework/react/reference/useMutation) options.

## Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `TData` | `unknown` | The data returned. |
| `TError` | `unknown` | The error returned. |
| `TVariables` | `unknown` | The variables used in the mutation. |

## See

# [Tanstack Query - useMutation](https://tanstack.com/query/latest/docs/framework/react/reference/useMutation)

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
})

```
## Options
> `mutationKey` and `mutationFn` are used internally and therefore not included as an options.
```diff
mutation: {
   gcTime,
   meta,
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

## Defined in

[types.ts:173](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/types.ts#L173)
