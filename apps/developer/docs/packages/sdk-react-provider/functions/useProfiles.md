# Function: useProfiles()

> **useProfiles**(`params`?: \{`query`: [`QueryOptions`](/docs/packages/sdk-react-provider/type-aliases/QueryOptions.md)\<`ProfilePermissions`[]\>; \}): [`QueryResult`](/docs/packages/sdk-react-provider/type-aliases/QueryResult.md)\<`"profiles"`, `ProfilePermissions`[]\>

# Get profiles

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params`? | `object` | No required parameters. |
| `params.query`? | [`QueryOptions`](/docs/packages/sdk-react-provider/type-aliases/QueryOptions.md)\<`ProfilePermissions`[]\> | See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) options. |

## Returns

[`QueryResult`](/docs/packages/sdk-react-provider/type-aliases/QueryResult.md)\<`"profiles"`, `ProfilePermissions`[]\>

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

[Profile interface](/docs/packages/sdk/interfaces/Profile.md)

## Defined in

[hooks.tsx:211](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/hooks.tsx#L211)
