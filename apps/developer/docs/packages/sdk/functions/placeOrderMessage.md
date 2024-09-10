# Function: placeOrderMessage()

> **placeOrderMessage**(`amount`: `string` \| `number`, `currency`: [`Currency`](/docs/packages/sdk/enumerations/Currency.md), `receiver`: `string`, `chain`?: `number` \| [`Chain`](/docs/packages/sdk/type-aliases/Chain.md)): `string`

The message to be signed when placing an order.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `amount` | `string` \| `number` | The amount to be sent |
| `currency` | [`Currency`](/docs/packages/sdk/enumerations/Currency.md) | The currency to be sent |
| `receiver` | `string` | The receiver of the funds |
| `chain`? | `number` \| [`Chain`](/docs/packages/sdk/type-aliases/Chain.md) | The chainId of the network if it's a cross-chain transaction |

## Returns

`string`

cross-chain:
```ts
 Send {CURRENCY} {AMOUNT} to {RECEIVER} on {CHAIN} at {DATE}`
```

off-ramp:
```ts
 Send {CURRENCY} {AMOUNT} to {RECEIVER} at {DATE}
```

## Examples

```ts
`Send EUR 1 to 0x1234123412341234123412341234123412341234 on ethereum at 2023-04-30T12:00:00+01:00`
```

```ts
`Send EUR 1 to IS1234123412341234 at 2023-04-30T12:00:00+01:00`
```

## Defined in

[utils.ts:75](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/utils.ts#L75)
