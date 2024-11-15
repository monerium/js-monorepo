# Function: useProfile()

> **useProfile**(`params`: \{`profile`: `string`;`query`: [`QueryOptions`](/docs/packages/sdk-react-provider/type-aliases/QueryOptions.md)\<[`Profile`](/docs/packages/sdk-react-provider/interfaces/Profile.md)\>; \}): `UseQueryResult`\<[`Profile`](/docs/packages/sdk-react-provider/interfaces/Profile.md), `Error`\>

If no `profile` id is provided, the default profile is used.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | `object` |  |
| `params.profile`? | `string` | The id of the profile |
| `params.query`? | [`QueryOptions`](/docs/packages/sdk-react-provider/type-aliases/QueryOptions.md)\<[`Profile`](/docs/packages/sdk-react-provider/interfaces/Profile.md)\> | See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) options. |

## Returns

`UseQueryResult`\<[`Profile`](/docs/packages/sdk-react-provider/interfaces/Profile.md), `Error`\>

## Example

```ts
const {
   data
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

[sdk-react-provider/src/lib/hooks.tsx:156](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/hooks.tsx#L156)
