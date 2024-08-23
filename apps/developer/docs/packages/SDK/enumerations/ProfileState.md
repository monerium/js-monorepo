# Enumeration: ProfileState

## Enumeration Members

### approved

> **approved**: `"approved"`

The profile is active and all Monerium services are supported.

#### Defined in

[types.ts:144](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L144)

***

### blocked

> **blocked**: `"blocked"`

Monerium is unable to offer the applicant services because of compliance reasons. Details cannot be re-submitted.

#### Defined in

[types.ts:148](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L148)

***

### created

> **created**: `"created"`

The profile has been created but no details have been submitted.

#### Defined in

[types.ts:140](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L140)

***

### pending

> **pending**: `"pending"`

The details have been submitted and are being processed.

#### Defined in

[types.ts:142](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L142)

***

### rejected

> **rejected**: `"rejected"`

The applicant details did not meet the compliance requirements of Monerium. Details can be fixed and re-submitted for processing.

#### Defined in

[types.ts:146](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/src/types.ts#L146)
