[Monerium SDK React Provider](../README.md) / MutationResult

# Type Alias: MutationResult\<TFuncName, TData, TError, TVariables, TContext\>

> **MutationResult**\<`TFuncName`, `TData`, `TError`, `TVariables`, `TContext`\>: `Omit`\<`UseMutationResult`\<`TData`, `TError`, `TVariables`, `TContext`\>, `"mutateAsync"`\> & `{ [P in TFuncName]: UseMutationResult<TData, TError, TVariables, TContext>["mutateAsync"] }`

See [Tanstack Query - useMutation](https://tanstack.com/query/latest/docs/framework/react/reference/useMutation) returns.

## Type Parameters

| Type Parameter                 | Default type | Description                            |
| ------------------------------ | ------------ | -------------------------------------- |
| `TFuncName` _extends_ `string` | -            | The name of the function that mutates. |
| `TData`                        | -            | The data returned.                     |
| `TError`                       | -            | The error returned.                    |
| `TVariables`                   | -            | The variables used in the mutation.    |
| `TContext`                     | `unknown`    | The context used in the mutation.      |

## See

# [Tanstack Query - useMutation](https://tanstack.com/query/latest/docs/framework/react/reference/useMutation)

## Example

> `mutateAsync` is renamed according to the `TFuncName` and therefore not included in the result.

```diff
const {
   data,
   error,
   isError,
   isIdle,
   isPending,
   isPaused,
   isSuccess,
   failureCount,
   failureReason,
   mutate,
-  mutateAsync,
   reset,
   status,
   submittedAt,
   variables,
} = useMutationHook();
```

## Used By

[useLinkAddress](../functions/useLinkAddress.md)

[usePlaceOrder](../functions/usePlaceOrder.md)

## Defined in

[sdk-react-provider/src/lib/types.ts:247](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/types.ts#L247)
