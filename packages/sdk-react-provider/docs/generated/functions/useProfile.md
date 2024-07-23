[Monerium SDK React Provider](../README.md) / useProfile

# Function: useProfile()

> **useProfile**(`params`: \{`profileId`: `string`;`query`: [`QueryOptions`](../type-aliases/QueryOptions.md)\<[`Profile`](../interfaces/Profile.md)\>; \}): [`QueryResult`](../type-aliases/QueryResult.md)\<`"profile"`, [`Profile`](../interfaces/Profile.md)\>

# Get single profile

If no `profileId` is provided, the default profile is used.

## Parameters

| Parameter           | Type                                                                                       | Description                                                                                                         |
| ------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| `params`            | `object`                                                                                   |                                                                                                                     |
| `params.profileId`? | `string`                                                                                   | The id of the profile.                                                                                              |
| `params.query`?     | [`QueryOptions`](../type-aliases/QueryOptions.md)\<[`Profile`](../interfaces/Profile.md)\> | See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) options. |

## Returns

[`QueryResult`](../type-aliases/QueryResult.md)\<`"profile"`, [`Profile`](../interfaces/Profile.md)\>

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

[Profile interface](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/docs/generated/interfaces/Profile.md)

## Defined in

[sdk-react-provider/src/lib/hooks.tsx:149](https://github.com/monerium/js-monorepo/blob/ae1055c12538e860127a655bc059162d414323b3/packages/sdk-react-provider/src/lib/hooks.tsx#L149)
