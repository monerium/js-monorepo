# Function: useAuthContext()

> **useAuthContext**(`params`?): [`QueryResult`](/docs/tools/SDK%20React%20Provider/type-aliases/QueryResult.md)\<`"authContext"`, `AuthContext`\>

# Get the authentication context.

## Parameters

• **params?** = `{}`

No required parameters.

• **params.query?**: [`QueryOptions`](/docs/tools/SDK%20React%20Provider/type-aliases/QueryOptions.md)\<`AuthContext`\>

See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) options.

## Returns

[`QueryResult`](/docs/tools/SDK%20React%20Provider/type-aliases/QueryResult.md)\<`"authContext"`, `AuthContext`\>

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

[AuthContext interface](/docs/tools/SDK/interfaces/AuthContext.md)

## Defined in

[hooks.tsx:125](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/hooks.tsx#L125)
