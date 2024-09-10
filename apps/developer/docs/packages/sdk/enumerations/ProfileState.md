# Enumeration: ProfileState

## Enumeration Members

| Enumeration Member | Value | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `approved` | `"approved"` | The profile is active and all Monerium services are supported. | [types.ts:144](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L144) |
| `blocked` | `"blocked"` | Monerium is unable to offer the applicant services because of compliance reasons. Details cannot be re-submitted. | [types.ts:148](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L148) |
| `created` | `"created"` | The profile has been created but no details have been submitted. | [types.ts:140](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L140) |
| `pending` | `"pending"` | The details have been submitted and are being processed. | [types.ts:142](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L142) |
| `rejected` | `"rejected"` | The applicant details did not meet the compliance requirements of Monerium. Details can be fixed and re-submitted for processing. | [types.ts:146](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L146) |
