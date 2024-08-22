[Monerium SDK React Provider](../README.md) / useIBAN

# Function: useIBAN()

> **useIBAN**(`params`: \{`iban`: `string`;`query`: [`QueryOptions`](../type-aliases/QueryOptions.md)\<`IBAN`\>; \}): [`QueryResult`](../type-aliases/QueryResult.md)\<`"iban"`, `IBAN`\>

# Get IBAN

## Parameters

| Parameter       | Type                                                        | Description                                                                                                         |
| --------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `params`        | `object`                                                    |                                                                                                                     |
| `params.iban`   | `string`                                                    | -                                                                                                                   |
| `params.query`? | [`QueryOptions`](../type-aliases/QueryOptions.md)\<`IBAN`\> | See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) options. |

## Returns

[`QueryResult`](../type-aliases/QueryResult.md)\<`"iban"`, `IBAN`\>

## Example

```ts
const {
  iban, // useQuery's `data` property
  isLoading,
  isError,
  error,
  refetch,
  ...moreUseQueryResults
} = useIBAN();
```

## See

[API Documentation](https://monerium.dev/api-docs-v2#tag/ibans/operation/iban)

[IBAN interface](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/docs/generated/interfaces/IBAN.md)

## Defined in

[hooks.tsx:482](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/hooks.tsx#L482)
