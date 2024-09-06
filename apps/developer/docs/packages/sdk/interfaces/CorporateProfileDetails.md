# Interface: CorporateProfileDetails

## Properties

| Property | Type | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `address` | `string` | - | [types.ts:258](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L258) |
| `city` | `string` | - | [types.ts:260](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L260) |
| `country` | `string` | - | [types.ts:261](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L261) |
| `countryState` | `string` | - | [types.ts:262](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L262) |
| `directors` | [`Director`](/docs/packages/sdk/type-aliases/Director.md)[] | List of Individual who has powers to legally bind the company (power of procuration). | [types.ts:268](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L268) |
| `finalBeneficiaries` | [`Beneficiary`](/docs/packages/sdk/type-aliases/Beneficiary.md)[] | List of beneficial owner that owns 25% or more in a corporation. | [types.ts:266](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L266) |
| `name` | `string` | - | [types.ts:256](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L256) |
| `postalCode` | `string` | - | [types.ts:259](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L259) |
| `registrationNumber` | `string` | - | [types.ts:257](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L257) |
| `representatives` | [`PersonalProfileDetails`](/docs/packages/sdk/interfaces/PersonalProfileDetails.md)[] | List of individuals representing the company and authorized to act on it's behalf. | [types.ts:264](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L264) |
