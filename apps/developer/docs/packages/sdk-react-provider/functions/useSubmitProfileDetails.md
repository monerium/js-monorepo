# Function: useSubmitProfileDetails()

> **useSubmitProfileDetails**(`param`: \{`mutation`: `{}`;`profile`: `string`; \}): [`MutationResult`](/docs/packages/sdk-react-provider/type-aliases/MutationResult.md)\<`"submitProfileDetails"`, [`ResponseStatus`](/docs/packages/sdk-react-provider/type-aliases/ResponseStatus.md), `Error`, [`SubmitProfileDetailsPayload`](/docs/packages/sdk-react-provider/type-aliases/SubmitProfileDetailsPayload.md)\>

Submit the required compliance information to onboard the customer.

Note that you won't be able to change the profile "kind" from personal to corporate or vice versa once the profile has been approved.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `param` | `object` |  |
| `param.mutation`? | [`MutationOptions`](/docs/packages/sdk-react-provider/type-aliases/MutationOptions.md)\<[`ResponseStatus`](/docs/packages/sdk-react-provider/type-aliases/ResponseStatus.md), `Error`, [`SubmitProfileDetailsPayload`](/docs/packages/sdk-react-provider/type-aliases/SubmitProfileDetailsPayload.md)\> | See [Tanstack Query - useMutation](https://tanstack.com/query/latest/docs/framework/react/reference/useMutation) options. |
| `param.profile` | `string` | The id of the profile to submit to. |

## Returns

[`MutationResult`](/docs/packages/sdk-react-provider/type-aliases/MutationResult.md)\<`"submitProfileDetails"`, [`ResponseStatus`](/docs/packages/sdk-react-provider/type-aliases/ResponseStatus.md), `Error`, [`SubmitProfileDetailsPayload`](/docs/packages/sdk-react-provider/type-aliases/SubmitProfileDetailsPayload.md)\>

## Example

```ts
const {
   submitProfileDetails, // useMutation's `mutateAsync` property
   isPending,
   isError,
   error,
   status,
   ...moreUseMutationResults
} = useSubmitProfileDetails();
```

## See

[API Documentation](https://monerium.dev/api-docs-v2#tag/profiles/operation/profile-details)}

## Defined in

[sdk-react-provider/src/lib/hooks.tsx:679](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/hooks.tsx#L679)
