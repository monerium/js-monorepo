[**Monerium SDK React Provider v0.2.0**](../Packages.md) • **Docs**

***

[Monerium Packages](../../Packages.md) / [Monerium SDK React Provider](../Monerium%20SDK%20React%20Provider.md) / useProfile

# Function: useProfile()

> **useProfile**(`params`): [`QueryResult`](../type-aliases/QueryResult.md)\<`"profile"`, [`Profile`](../interfaces/Profile.md)\>

# Get single profile
If no `profileId` is provided, the default profile is used.

## Parameters

• **params** = `{}`

• **params.profileId?**: `string`

The id of the profile.

• **params.query?**: [`QueryOptions`](../type-aliases/QueryOptions.md)\<[`Profile`](../interfaces/Profile.md)\>

See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) options.

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

[sdk-react-provider/src/lib/hooks.tsx:178](https://github.com/monerium/js-monorepo/blob/ffeefd2a9bccc0d18acecd9390a7bfced5720c17/packages/sdk-react-provider/src/lib/hooks.tsx#L178)
