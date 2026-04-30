# Migration Guide

## SDK to v4.0.0

Version `4.0.0` of the Monerium SDK introduces major breaking changes as part of a fundamental shift in how the SDK is designed and consumed.

### What Changed?

The core concept of the SDK has been completely re-architected. Instead of relying on a single monolithic class, the SDK now splits functionality across specialized client classes (such as `MoneriumOAuthClient`, `MoneriumServerClient`, and `MoneriumWhitelabelClient`). This modular approach to interacting with Monerium's services improves separation of concerns, ensures better type safety, and makes the API more intuitive for developers.

### Examples and Details

Due to the extensive nature of these breaking changes, we have centralized all documentation, examples, and detailed integration steps in the SDK package documentation.

For a comprehensive breakdown of the breaking changes, new concepts, and usage examples, please refer to the [Monerium SDK README](/packages/sdk).
