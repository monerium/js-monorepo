# Function: useMoveIban()

> **useMoveIban**(`params`?): [`MutationResult`](/docs/packages/SDK%20React%20Provider/type-aliases/MutationResult.md)\<`"moveIban"`, `ResponseStatus`, `Error`, `MoveIbanPayload` & `object`\>

# Move Iban
Move an existing IBAN to a specified address an chain.
All incoming EUR payments will automatically be routed to the address on that chain.

## Parameters

• **params?** = `{}`

No required parameters.

• **params.mutation?**: [`MutationOptions`](/docs/packages/SDK%20React%20Provider/type-aliases/MutationOptions.md)\<`ResponseStatus`, `Error`, `MoveIbanPayload` & `object`\> = `{}`

## Returns

[`MutationResult`](/docs/packages/SDK%20React%20Provider/type-aliases/MutationResult.md)\<`"moveIban"`, `ResponseStatus`, `Error`, `MoveIbanPayload` & `object`\>

## Example

```ts
const {
   moveIban, // useMutation's `mutateAsync` property
   isPending,
   isError,
   error,
   status,
   ...moreUseMutationResults
} = useMoveIban();
```

## See

[API Documentation](https://monerium.dev/api-docs-v2#tag/ibans/operation/move-iban)

[NewOrder type](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/docs/generated/interfaces/MoveIbanPayload.md)

## Defined in

[hooks.tsx:869](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/hooks.tsx#L869)
