# Getting started

To allow your application to interact with the Monerium API, you must first register it.

Visit https://monerium.app/developers and press "+ Add app". Fill in your application details and click "Save".

Once registered, you will receive both [Client Credentials Authorization](#client-credentials) client ID and client secret, as well as an [Authorization Code Flow](#authorization-code-flow) client ID. You'll also have a field to register a redirect URI, which is the URI where the **Authorization Code Flow** will redirect after a user has signed up with Monerium and granted your application access to their profile information.

:::tip

Notice that there are two client ID's. Make sure to use the correct one for the grant type you are using.

:::

<figure>
  <img
  src="https://monerium.dev/images/authScreen.jpg"
  alt="The authorization code flow screen."/>
  <figcaption>Monerium's authorization code flow screen.</figcaption>
</figure>

### Client Credentials

The Client Credentials grant type is used by clients which can hide their credentials, e.g. backend server, to obtain an access token outside of the context of a user.

Further reading:

- [The OAuth 2.0 Authorization Framework - Client Credentials Grant](https://datatracker.ietf.org/doc/html/rfc6749#section-4.4)

### Authorization Code Flow

The Authorization Code grant type is used by public clients which can not securely store a secret, e.g. native or single-page applications, to obtain an access token for a user.

Further reading:

- [The OAuth 2.0 Authorization Framework - Authorization Code Grant](https://datatracker.ietf.org/doc/html/rfc6749#section-4.1)

#### Authorization code flow with proof key for code exchange (PKCE)

OAuth 2.0 includes an extension of the Authorization Code Flow to safeguard public clients against authorization code interception attacks. This extension is known as Proof Key for Code Exchange (PKCE).

In the PKCE-enhanced authorization code flow, the calling application generates a secret called the code verifier, which is later validated by the authorization server. The application also creates a code challenge by hashing the code verifier and sends this value over HTTPS to obtain an authorization code. This approach ensures that even if a malicious attacker intercepts the authorization code, they cannot exchange it for a token without the code verifier.

At a high level, the entire authorization flow for a partner application works as follows:

<figure>
  <img
  src="https://monerium.dev/images/AuthorizationCodeFlowPKCE.jpg"
  alt="Monerium's OAuth PKCE flow diagram."/>
  <figcaption>Monerium's OAuth 2.0 PKCE flow diagram.</figcaption>
</figure>

Further reading:

- [Proof Key for Code Exchange (PKCE) by OAuth Public Clients ](https://datatracker.ietf.org/doc/html/rfc7636)

# Packages

## [@monerium/sdk](packages/sdk/index.md)

The goal of the SDK is to provide a simplified way for developers to interact with the Monerium API by abstracting the complexity of the OAuth 2.0 Authorization Framework.

TBD

## [@monerium/sdk-react-provider](packages/sdk-react-provider/index.md)
