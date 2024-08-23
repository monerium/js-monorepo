# Function: useMoveIban()

> **useMoveIban**(`params`?: \{`mutation`: `{}`; \}): [`MutationResult`](/docs/packages/sdk-react-provider/type-aliases/MutationResult.md)\<`"moveIban"`, `ResponseStatus`, `Error`, `MoveIbanPayload` & \{`iban`: `string`; \}\>

# Move Iban
Move an existing IBAN to a specified address an chain.
All incoming EUR payments will automatically be routed to the address on that chain.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params`? | `object` | No required parameters. |
| `params.mutation`? | [`MutationOptions`](/docs/packages/sdk-react-provider/type-aliases/MutationOptions.md)\<`ResponseStatus`, `Error`, `MoveIbanPayload` & \{`iban`: `string`; \}\> | - |

## Returns

[`MutationResult`](/docs/packages/sdk-react-provider/type-aliases/MutationResult.md)\<`"moveIban"`, `ResponseStatus`, `Error`, `MoveIbanPayload` & \{`iban`: `string`; \}\>

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
