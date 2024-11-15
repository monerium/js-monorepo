# Enumeration: ProfileState

## Enumeration Members

| Enumeration Member | Value | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `approved` | `"approved"` | The profile is active and all Monerium services are supported. | [types.ts:154](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L154) |
| `blocked` | `"blocked"` | Monerium is unable to offer the applicant services because of compliance reasons. Details cannot be re-submitted. | [types.ts:158](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L158) |
| `created` | `"created"` | The profile has been created but no details have been submitted. | [types.ts:150](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L150) |
| `pending` | `"pending"` | The details have been submitted and are being processed. | [types.ts:152](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L152) |
| `rejected` | `"rejected"` | The applicant details did not meet the compliance requirements of Monerium. Details can be fixed and re-submitted for processing. | [types.ts:156](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L156) |
