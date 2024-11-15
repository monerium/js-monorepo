# Function: useLinkAddress()

> **useLinkAddress**(`params`?: \{`mutation`: [`MutationOptions`](/docs/packages/sdk-react-provider/type-aliases/MutationOptions.md)\<`LinkedAddress`, `Error`, [`LinkAddress`](/docs/packages/sdk-react-provider/interfaces/LinkAddress.md)\>; \}): [`MutationResult`](/docs/packages/sdk-react-provider/type-aliases/MutationResult.md)\<`"linkAddress"`, `LinkedAddress`, `Error`, [`LinkAddress`](/docs/packages/sdk-react-provider/interfaces/LinkAddress.md)\>

# Add address to profile.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params`? | `object` | No required parameters. |
| `params.mutation`? | [`MutationOptions`](/docs/packages/sdk-react-provider/type-aliases/MutationOptions.md)\<`LinkedAddress`, `Error`, [`LinkAddress`](/docs/packages/sdk-react-provider/interfaces/LinkAddress.md)\> | See [Tanstack Query - useMutation](https://tanstack.com/query/latest/docs/framework/react/reference/useMutation) options. |

## Returns

[`MutationResult`](/docs/packages/sdk-react-provider/type-aliases/MutationResult.md)\<`"linkAddress"`, `LinkedAddress`, `Error`, [`LinkAddress`](/docs/packages/sdk-react-provider/interfaces/LinkAddress.md)\>

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

[sdk-react-provider/src/lib/hooks.tsx:964](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/hooks.tsx#L964)
