# Function: useProfile()

> **useProfile**(`params`): [`QueryResult`](/docs/SDK%20React%20Provider/type-aliases/QueryResult.md)\<`"profile"`, `Profile`\>

# Get single profile
If no `profileId` is provided, the default profile is used.

## Parameters

• **params** = `{}`

• **params.profileId?**: `string`

The id of the profile.

• **params.query?**: [`QueryOptions`](/docs/SDK%20React%20Provider/type-aliases/QueryOptions.md)\<`Profile`\>

See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) options.

## Returns

[`QueryResult`](/docs/SDK%20React%20Provider/type-aliases/QueryResult.md)\<`"profile"`, `Profile`\>

## Example

```ts
const {
   profile, // useQuery's `data` property
   isLoading,
   isError,
   error,
   refetch,
   ...moreUseQueryResults
} = useProfile();
```

## See

[API Documentation](https://monerium.dev/api-docs#operation/profile)

[Profile interface](/docs/SDK/interfaces/Profile.md)

## Defined in

[hooks.tsx:178](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/hooks.tsx#L178)
