# Function: useProfiles()

> **useProfiles**(`params`?: \{`query`: [`QueryOptions`](/docs/packages/sdk-react-provider/type-aliases/QueryOptions.md)\<`ProfilesResponse`\>; \}): `UseQueryResult`\<`ProfilesResponse`, `Error`\>

# Get profiles

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params`? | `object` | No required parameters. |
| `params.query`? | [`QueryOptions`](/docs/packages/sdk-react-provider/type-aliases/QueryOptions.md)\<`ProfilesResponse`\> | See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) options. |

## Returns

`UseQueryResult`\<`ProfilesResponse`, `Error`\>

## Example

```ts
const {
   data,
   isLoading,
   isError,
   error,
   refetch,
   ...moreUseQueryResults
} = useProfiles();
```

## See

[API Documentation](https://monerium.dev/api-docs#operation/profiles)

## Defined in

[sdk-react-provider/src/lib/hooks.tsx:212](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/hooks.tsx#L212)
