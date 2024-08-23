# Function: useProfiles()

> **useProfiles**(`params`?): [`QueryResult`](/docs/packages/SDK%20React%20Provider/type-aliases/QueryResult.md)\<`"profiles"`, `Profile`[]\>

# Get profiles

## Parameters

• **params?** = `{}`

No required parameters.

• **params.query?**: [`QueryOptions`](/docs/packages/SDK%20React%20Provider/type-aliases/QueryOptions.md)\<`Profile`[]\>

See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) options.

## Returns

[`QueryResult`](/docs/packages/SDK%20React%20Provider/type-aliases/QueryResult.md)\<`"profiles"`, `Profile`[]\>

## Example

```ts
const {
   profiles, // useQuery's `data` property
   isLoading,
   isError,
   error,
   refetch,
   ...moreUseQueryResults
} = useProfiles();
```

## See

[API Documentation](https://monerium.dev/api-docs#operation/profiles)

[Profile interface](/docs/packages/SDK/interfaces/Profile.md)

## Defined in

[hooks.tsx:239](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/hooks.tsx#L239)
