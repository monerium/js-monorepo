[Monerium SDK React Provider](../README.md) / useProfiles

# Function: useProfiles()

> **useProfiles**(`params`?: \{`query`: [`QueryOptions`](../type-aliases/QueryOptions.md)\<[`Profile`](../interfaces/Profile.md)[]\>; \}): [`QueryResult`](../type-aliases/QueryResult.md)\<`"profiles"`, [`Profile`](../interfaces/Profile.md)[]\>

# Get profiles

## Parameters

| Parameter       | Type                                                                                         | Description                                                                                                         |
| --------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `params`?       | `object`                                                                                     | No required parameters.                                                                                             |
| `params.query`? | [`QueryOptions`](../type-aliases/QueryOptions.md)\<[`Profile`](../interfaces/Profile.md)[]\> | See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) options. |

## Returns

[`QueryResult`](../type-aliases/QueryResult.md)\<`"profiles"`, [`Profile`](../interfaces/Profile.md)[]\>

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

[Profile interface](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/docs/generated/interfaces/Profile.md)

## Defined in

[sdk-react-provider/src/lib/hooks.tsx:216](https://github.com/monerium/js-monorepo/blob/ae1055c12538e860127a655bc059162d414323b3/packages/sdk-react-provider/src/lib/hooks.tsx#L216)
