# Monerium developer documentation

## Introduction

This guide will help you get started with the Monerium API to offer your users IBAN's directly connected to their blockchain address. This enables a seamless experience to collect and send money between bank accounts and blockchains over the SEPA network.

## Getting Started

### Sign Up

To get started, head over to our [Sandbox](https://sandbox.monerium.dev) and sign up.

### Creating an App

Once signed up, head over the [developer portal](https://sandbox.monerium.dev/developers) and create an app.

### Obtaining Credentials

After creating an app, users will receive a `client_id` for a client-side authentication flow and a `client_secret` and `client_id` for server-side authentication.

## Authentication Flows

### OAuth 2.0

Our platform supports OAuth 2.0 for authentication. Here’s how to implement it:

1. Redirect users to the authorization flow. [1]
2. Handle the authorization code returned.
3. Exchange the code for an access token. [2]

[1] API Documentation: [Authorization](https://monerium.dev/api-docs/v2#tag/auth/operation/auth-post)
[2] API Documentation: [Access Token](https://monerium.dev/api-docs/v2#tag/auth/operation/auth-token)

[In-depth guide](./authorization.md)

### Server-Side Authentication

For server-side authentication, use the `client_id` and `client_secret` to obtain an access token.

Concepts:

- [OAuth 2.0](https://datatracker.ietf.org/doc/html/rfc6749) RFC 6749
- [Proof key for code exchange (PKCE)](https://www.rfc-editor.org/rfc/rfc7636) RFC 7636
- [Bearer Authentication](https://datatracker.ietf.org/doc/html/rfc6750) RFC 6750

## Next steps.

Head over to the [API Documentation](https://monerium.dev/api-docs/v2#tag/start) to get started with the Monerium API.

## Need help?

We have a [Discord server](https://monerium.com/invite/discord) where you can get help from the community and the Monerium team.
