# Function: useProfiles()

> **useProfiles**(`params`?: \{`query`: [`QueryOptions`](/docs/packages/sdk-react-provider/type-aliases/QueryOptions.md)\<[`ProfilePermissions`](/docs/packages/sdk-react-provider/interfaces/ProfilePermissions.md)[]\>; \}): [`QueryResult`](/docs/packages/sdk-react-provider/type-aliases/QueryResult.md)\<`"profiles"`, [`ProfilePermissions`](/docs/packages/sdk-react-provider/interfaces/ProfilePermissions.md)[]\>

# Get profiles

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params`? | `object` | No required parameters. |
| `params.query`? | [`QueryOptions`](/docs/packages/sdk-react-provider/type-aliases/QueryOptions.md)\<[`ProfilePermissions`](/docs/packages/sdk-react-provider/interfaces/ProfilePermissions.md)[]\> | See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) options. |

## Returns

[`QueryResult`](/docs/packages/sdk-react-provider/type-aliases/QueryResult.md)\<`"profiles"`, [`ProfilePermissions`](/docs/packages/sdk-react-provider/interfaces/ProfilePermissions.md)[]\>

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

## Defined in

[sdk-react-provider/src/lib/hooks.tsx:204](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/hooks.tsx#L204)
