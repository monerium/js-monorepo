# Function: useIBANs()

> **useIBANs**(`params`?: \{`chain`: `number` \| `Chain`;`profile`: `string`;`query`: `{}`; \}): [`QueryResult`](/docs/packages/sdk-react-provider/type-aliases/QueryResult.md)\<`"ibans"`, [`IBAN`](/docs/packages/sdk-react-provider/interfaces/IBAN.md)[]\>

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params`? | `object` | No required parameters. |
| `params.chain`? | `number` \| `Chain` | Fetch IBANs for a specific chain. |
| `params.profile`? | `string` | Fetch IBANs for a specific profile. |
| `params.query`? | [`QueryOptions`](/docs/packages/sdk-react-provider/type-aliases/QueryOptions.md)\<[`IBAN`](/docs/packages/sdk-react-provider/interfaces/IBAN.md)[]\> | See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) options. |

## Returns

[`QueryResult`](/docs/packages/sdk-react-provider/type-aliases/QueryResult.md)\<`"ibans"`, [`IBAN`](/docs/packages/sdk-react-provider/interfaces/IBAN.md)[]\>

## Example

```ts
const {
   ibans, // useQuery's `data` property
   isLoading,
   isError,
   error,
   refetch,
   ...moreUseQueryResults
} = useIBANs();
```

## See

[API Documentation](https://monerium.dev/api-docs-v2#tag/ibans/operation/ibans)

## Defined in

[sdk-react-provider/src/lib/hooks.tsx:503](https://github.com/monerium/js-monorepo/blob/main/packages/sdk-react-provider/src/lib/hooks.tsx#L503)
