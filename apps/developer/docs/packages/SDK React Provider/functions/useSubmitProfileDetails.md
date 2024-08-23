# Function: useSubmitProfileDetails()

> **useSubmitProfileDetails**(`param`): [`MutationResult`](/docs/packages/SDK%20React%20Provider/type-aliases/MutationResult.md)\<`"submitProfileDetails"`, `ResponseStatus`, `Error`, `SubmitProfileDetailsPayload`\>

# Submit profile details.
Submit the required compliance information to onboard the customer.

Note that you won't be able to change the profile "kind" from personal to corporate or vice versa once the profile has been approved.

## Parameters

• **param**

• **param.mutation?**: [`MutationOptions`](/docs/packages/SDK%20React%20Provider/type-aliases/MutationOptions.md)\<`ResponseStatus`, `Error`, `SubmitProfileDetailsPayload`\> = `{}`

See [Tanstack Query - useMutation](https://tanstack.com/query/latest/docs/framework/react/reference/useMutation) options.

• **param.profile**: `string`

The id of the profile to submit to.

## Returns

[`MutationResult`](/docs/packages/SDK%20React%20Provider/type-aliases/MutationResult.md)\<`"submitProfileDetails"`, `ResponseStatus`, `Error`, `SubmitProfileDetailsPayload`\>

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

[API Documentation](https://monerium.dev/api-docs-v2#tag/profiles/operation/profile-details)

[SubmitProfileDetailsPayload type](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/docs/generated/type-aliases/SubmitProfileDetailsPayload.md)

## Defined in

[hooks.tsx:719](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/hooks.tsx#L719)
