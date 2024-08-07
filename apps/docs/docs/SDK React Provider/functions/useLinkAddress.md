# Function: useLinkAddress()

> **useLinkAddress**(`param`): [`MutationResult`](/docs/SDK%20React%20Provider/type-aliases/MutationResult.md)\<`"linkAddress"`, `LinkedAddress`, `Error`, `LinkAddress`\>

# Add address to profile.
When the address has been linked, the relevant profile query will be invalidated and re-fetched.

## Parameters

• **param**

• **param.mutation?**: [`MutationOptions`](/docs/SDK%20React%20Provider/type-aliases/MutationOptions.md)\<`LinkedAddress`, `Error`, `LinkAddress`\>

See [Tanstack Query - useMutation](https://tanstack.com/query/latest/docs/framework/react/reference/useMutation) options.

• **param.profileId**: `string`

Which profile to link the address.

## Returns

[`MutationResult`](/docs/SDK%20React%20Provider/type-aliases/MutationResult.md)\<`"linkAddress"`, `LinkedAddress`, `Error`, `LinkAddress`\>

## Example

```ts
const {
   linkAddress, // useMutation's `mutateAsync` property
   isPending,
   isError,
   error,
   status,
   ...moreUseMutationResults
} = useLinkAddress();
```

## See

[API Documentation](https://monerium.dev/api-docs#operation/profile-addresses)

[LinkAddress interface](/docs/SDK/interfaces/AuthContext.md)

## Defined in

[hooks.tsx:594](https://github.com/monerium/js-monorepo/blob/bdb556f177407a98459f8edb039e31cf37d07d7a/packages/sdk-react-provider/src/lib/hooks.tsx#L594)