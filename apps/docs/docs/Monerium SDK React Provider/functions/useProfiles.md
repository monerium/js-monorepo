[**Monerium SDK React Provider v0.2.0**](../Packages.md) • **Docs**

***

[Monerium Packages](../../Packages.md) / [Monerium SDK React Provider](../Monerium%20SDK%20React%20Provider.md) / useProfiles

# Function: useProfiles()

> **useProfiles**(`params`?): [`QueryResult`](../type-aliases/QueryResult.md)\<`"profiles"`, [`Profile`](../interfaces/Profile.md)[]\>

# Get profiles

## Parameters

• **params?** = `{}`

No required parameters.

• **params.query?**: [`QueryOptions`](../type-aliases/QueryOptions.md)\<[`Profile`](../interfaces/Profile.md)[]\>

See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) options.

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

[sdk-react-provider/src/lib/hooks.tsx:239](https://github.com/monerium/js-monorepo/blob/ffeefd2a9bccc0d18acecd9390a7bfced5720c17/packages/sdk-react-provider/src/lib/hooks.tsx#L239)
