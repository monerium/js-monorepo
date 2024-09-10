# Function: useProfile()

> **useProfile**(`params`: \{`profile`: `string`;`query`: [`QueryOptions`](/docs/packages/sdk-react-provider/type-aliases/QueryOptions.md)\<[`Profile`](/docs/packages/sdk-react-provider/interfaces/Profile.md)\>; \}): [`QueryResult`](/docs/packages/sdk-react-provider/type-aliases/QueryResult.md)\<`"profile"`, [`Profile`](/docs/packages/sdk-react-provider/interfaces/Profile.md)\>

If no `profile` id is provided, the default profile is used.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | `object` |  |
| `params.profile`? | `string` | The id of the profile |
| `params.query`? | [`QueryOptions`](/docs/packages/sdk-react-provider/type-aliases/QueryOptions.md)\<[`Profile`](/docs/packages/sdk-react-provider/interfaces/Profile.md)\> | See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) options. |

## Returns

[`QueryResult`](/docs/packages/sdk-react-provider/type-aliases/QueryResult.md)\<`"profile"`, [`Profile`](/docs/packages/sdk-react-provider/interfaces/Profile.md)\>

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

## Defined in

[sdk-react-provider/src/lib/hooks.tsx:144](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/hooks.tsx#L144)
