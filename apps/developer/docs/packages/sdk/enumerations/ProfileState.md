# Enumeration: ProfileState

## Enumeration Members

| Enumeration Member | Value | Description | Defined in |
| ------ | ------ | ------ | ------ |
| `approved` | `"approved"` | The profile is active and all Monerium services are supported. | [types.ts:153](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L153) |
| `blocked` | `"blocked"` | Monerium is unable to offer the applicant services because of compliance reasons. Details cannot be re-submitted. | [types.ts:157](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L157) |
| `created` | `"created"` | The profile has been created but no details have been submitted. | [types.ts:149](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L149) |
| `pending` | `"pending"` | The details have been submitted and are being processed. | [types.ts:151](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L151) |
| `rejected` | `"rejected"` | The applicant details did not meet the compliance requirements of Monerium. Details can be fixed and re-submitted for processing. | [types.ts:155](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L155) |
