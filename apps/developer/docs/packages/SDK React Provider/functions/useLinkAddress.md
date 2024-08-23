# Function: useLinkAddress()

> **useLinkAddress**(`param`): [`MutationResult`](/docs/packages/SDK%20React%20Provider/type-aliases/MutationResult.md)\<`"linkAddress"`, `object`, `Error`, `LinkAddress`\>

# Add address to profile.
When the address has been linked, the relevant profile query will be invalidated and re-fetched.

## Parameters

• **param**

• **param.mutation?**: [`MutationOptions`](/docs/packages/SDK%20React%20Provider/type-aliases/MutationOptions.md)\<`object`, `Error`, `LinkAddress`\>

See [Tanstack Query - useMutation](https://tanstack.com/query/latest/docs/framework/react/reference/useMutation) options.

• **param.profileId**: `string`

Which profile to link the address.

## Returns

[`MutationResult`](/docs/packages/SDK%20React%20Provider/type-aliases/MutationResult.md)\<`"linkAddress"`, `object`, `Error`, `LinkAddress`\>

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

[LinkAddress interface](/docs/packages/SDK/interfaces/LinkAddress.md)

## Defined in

[hooks.tsx:1040](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/hooks.tsx#L1040)
