# Function: useLinkAddress()

> **useLinkAddress**(`param`: \{`mutation`: [`MutationOptions`](/docs/packages/sdk-react-provider/type-aliases/MutationOptions.md)\<\{`status`: `number`;`statusText`: `string`; \}, `Error`, [`LinkAddress`](/docs/packages/sdk-react-provider/interfaces/LinkAddress.md)\>;`profileId`: `string`; \}): [`MutationResult`](/docs/packages/sdk-react-provider/type-aliases/MutationResult.md)\<`"linkAddress"`, \{`status`: `number`;`statusText`: `string`; \}, `Error`, [`LinkAddress`](/docs/packages/sdk-react-provider/interfaces/LinkAddress.md)\>

# Add address to profile.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `param` | `object` |  |
| `param.mutation`? | [`MutationOptions`](/docs/packages/sdk-react-provider/type-aliases/MutationOptions.md)\<\{`status`: `number`;`statusText`: `string`; \}, `Error`, [`LinkAddress`](/docs/packages/sdk-react-provider/interfaces/LinkAddress.md)\> | See [Tanstack Query - useMutation](https://tanstack.com/query/latest/docs/framework/react/reference/useMutation) options. |
| `param.profileId` | `string` | Which profile to link the address. |

## Returns

[`MutationResult`](/docs/packages/sdk-react-provider/type-aliases/MutationResult.md)\<`"linkAddress"`, \{`status`: `number`;`statusText`: `string`; \}, `Error`, [`LinkAddress`](/docs/packages/sdk-react-provider/interfaces/LinkAddress.md)\>

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

## Defined in

[sdk-react-provider/src/lib/hooks.tsx:979](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/hooks.tsx#L979)