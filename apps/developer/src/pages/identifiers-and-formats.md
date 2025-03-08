# Identifiers and time formats

## Identifiers

Identifiers are used to identify resources and actors. All identifiers used by the API are Universally Unique Identifiers (UUID) on the form `123e4567-e89b-12d3-a456-426614174000`. The UUID `00000000-0000-0000-0000-000000000000` is a special identifier reserved for the Monerium System. This essentially means that an automation was performed by the system.

## Datetime

Dates are formatted according to RFC 3339, with sub-second precision, unless otherwise specified. Example date: `2021-02-13T16:41:10:091Z`. The `Z` at the end is a suffix which denotes a UTC offset of 00:00; often spoken “Zulu”.
