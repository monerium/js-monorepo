# Function: useProfile()

> **useProfile**(`params`: \{`profile`: `string`;`query`: [`QueryOptions`](/docs/packages/sdk-react-provider/type-aliases/QueryOptions.md)\<`Profile`\>; \}): [`QueryResult`](/docs/packages/sdk-react-provider/type-aliases/QueryResult.md)\<`"profile"`, `Profile`\>

# Get single profile
If no `profileId` is provided, the default profile is used.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | `object` |  |
| `params.profile`? | `string` | The id of the profile. |
| `params.query`? | [`QueryOptions`](/docs/packages/sdk-react-provider/type-aliases/QueryOptions.md)\<`Profile`\> | See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) options. |

## Returns

[`QueryResult`](/docs/packages/sdk-react-provider/type-aliases/QueryResult.md)\<`"profile"`, `Profile`\>

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

[Profile interface](/docs/packages/sdk/interfaces/Profile.md)

## Defined in

[hooks.tsx:149](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/hooks.tsx#L149)
