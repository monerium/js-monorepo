# Function: useMoveIban()

> **useMoveIban**(`params`?: \{`mutation`: `{}`; \}): [`MutationResult`](/docs/packages/sdk-react-provider/type-aliases/MutationResult.md)\<`"moveIban"`, [`ResponseStatus`](/docs/packages/sdk-react-provider/type-aliases/ResponseStatus.md), `Error`, [`MoveIbanPayload`](/docs/packages/sdk-react-provider/interfaces/MoveIbanPayload.md) & \{`iban`: `string`; \}\>

Move an existing IBAN to a specified address an chain.
All incoming EUR payments will automatically be routed to the address on that chain.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params`? | `object` | No required parameters. |
| `params.mutation`? | [`MutationOptions`](/docs/packages/sdk-react-provider/type-aliases/MutationOptions.md)\<[`ResponseStatus`](/docs/packages/sdk-react-provider/type-aliases/ResponseStatus.md), `Error`, [`MoveIbanPayload`](/docs/packages/sdk-react-provider/interfaces/MoveIbanPayload.md) & \{`iban`: `string`; \}\> | See [Tanstack Query - useMutation](https://tanstack.com/query/latest/docs/framework/react/reference/useMutation) options. |

## Returns

[`MutationResult`](/docs/packages/sdk-react-provider/type-aliases/MutationResult.md)\<`"moveIban"`, [`ResponseStatus`](/docs/packages/sdk-react-provider/type-aliases/ResponseStatus.md), `Error`, [`MoveIbanPayload`](/docs/packages/sdk-react-provider/interfaces/MoveIbanPayload.md) & \{`iban`: `string`; \}\>

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

## Defined in

[sdk-react-provider/src/lib/hooks.tsx:816](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/hooks.tsx#L816)
