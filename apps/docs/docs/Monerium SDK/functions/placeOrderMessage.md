[**Monerium SDK v2.14.0**](../Packages.md) • **Docs**

***

[Monerium Packages](../../Packages.md) / [Monerium SDK](../Monerium%20SDK.md) / placeOrderMessage

# Function: placeOrderMessage()

> **placeOrderMessage**(`amount`, `currency`, `receiver`, `chain`?): `string`

## Parameters

• **amount**: `string` \| `number`

The amount to be sent

• **currency**: [`Currency`](../enumerations/Currency.md)

The currency to be sent

• **receiver**: `string`

The receiver of the funds

• **chain?**: `number` \| [`Chain`](../type-aliases/Chain.md)

The chainId of the network if it's a cross-chain transaction

## Returns

`string`

string

## Defined in

[utils.ts:56](https://github.com/monerium/js-monorepo/blob/ffeefd2a9bccc0d18acecd9390a7bfced5720c17/packages/sdk/src/utils.ts#L56)
