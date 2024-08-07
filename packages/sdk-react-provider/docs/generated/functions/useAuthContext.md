[Monerium SDK React Provider](../README.md) / useAuthContext

# Function: useAuthContext()

> **useAuthContext**(`params`?: \{`query`: [`QueryOptions`](../type-aliases/QueryOptions.md)\<[`AuthContext`](../interfaces/AuthContext.md)\>; \}): [`QueryResult`](../type-aliases/QueryResult.md)\<`"authContext"`, [`AuthContext`](../interfaces/AuthContext.md)\>

# Get the authentication context.

## Parameters

| Parameter       | Type                                                                                               | Description                                                                                                         |
| --------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `params`?       | `object`                                                                                           | No required parameters.                                                                                             |
| `params.query`? | [`QueryOptions`](../type-aliases/QueryOptions.md)\<[`AuthContext`](../interfaces/AuthContext.md)\> | See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) options. |

## Returns

[`QueryResult`](../type-aliases/QueryResult.md)\<`"authContext"`, [`AuthContext`](../interfaces/AuthContext.md)\>

## Example

```ts
const {
  authContext, // useQuery's `data` property
  isLoading,
  isError,
  error,
  refetch,
  ...moreUseQueryResults
} = useAuthContext();
```

## See

[API Documentation](https://monerium.dev/api-docs#operation/auth-context)

[AuthContext interface](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/docs/generated/interfaces/AuthContext.md)

## Defined in

[sdk-react-provider/src/lib/hooks.tsx:125](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/hooks.tsx#L125)
