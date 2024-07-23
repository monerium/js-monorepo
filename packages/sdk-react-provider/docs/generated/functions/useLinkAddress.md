[Monerium SDK React Provider](../README.md) / useLinkAddress

# Function: useLinkAddress()

> **useLinkAddress**(`param`: \{`mutation`: [`MutationOptions`](../type-aliases/MutationOptions.md)\<`LinkedAddress`, `Error`, [`LinkAddress`](../interfaces/LinkAddress.md)\>;`profileId`: `string`; \}): [`MutationResult`](../type-aliases/MutationResult.md)\<`"linkAddress"`, `LinkedAddress`, `Error`, [`LinkAddress`](../interfaces/LinkAddress.md)\>

# Add address to profile.

When the address has been linked, the relevant profile query will be invalidated and re-fetched.

## Parameters

| Parameter         | Type                                                                                                                               | Description                                                                                                               |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `param`           | `object`                                                                                                                           |                                                                                                                           |
| `param.mutation`? | [`MutationOptions`](../type-aliases/MutationOptions.md)\<`LinkedAddress`, `Error`, [`LinkAddress`](../interfaces/LinkAddress.md)\> | See [Tanstack Query - useMutation](https://tanstack.com/query/latest/docs/framework/react/reference/useMutation) options. |
| `param.profileId` | `string`                                                                                                                           | Which profile to link the address.                                                                                        |

## Returns

[`MutationResult`](../type-aliases/MutationResult.md)\<`"linkAddress"`, `LinkedAddress`, `Error`, [`LinkAddress`](../interfaces/LinkAddress.md)\>

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

[LinkAddress interface](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/docs/generated/interfaces/LinkAddress.md)

## Defined in

[sdk-react-provider/src/lib/hooks.tsx:568](https://github.com/monerium/js-monorepo/blob/ae1055c12538e860127a655bc059162d414323b3/packages/sdk-react-provider/src/lib/hooks.tsx#L568)
