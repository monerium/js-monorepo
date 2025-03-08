# Authorization

## Authorization code flow with proof key for code exchange (PKCE)

When public clients, e.g. native or single-page applications, request access tokens, some additional security concerns are posed that are not mitigated by the authorization code flow alone. This is because:

- **Native apps**
  - Cannot securely store a client secret. Decompiling the app will reveal the client secret, which is bound to the app and is the same for all users and devices.
  - May make use of a custom URL scheme to capture redirects, e.g. MyApp://, potentially allowing malicious applications to receive an authorization code from your authorization server.
- **Single page apps**
  - Cannot securely store a client secret because their entire source is available to the browser.

Given this, OAuth 2.0 provides a version of the authorization code flow which makes use of a proof key for code exchange (PKCE) (defined in [OAuth 2.0 RFC 7636](https://tools.ietf.org/html/rfc7636)). The PKCE-enhanced authorization code flow introduces a secret created by the calling application that can be verified by the authorization server; this secret is called the code verifier. Additionally, the calling app creates a code challenge, by hashing the code verifier, and sends this value over HTTPS to retrieve an authorization code. This way, a malicious attacker can only intercept the authorization code but they cannot exchange it for a token without the code verifier.

At a high level, the entire authorization flow for a partner application looks a like this:

![Authorization flow](../../static/img/AuthorizationCodeFlowPKCE.jpg)

### 1. Generating the code challenge for PKCE in OAuth 2.0

When the user initiates an authentication flow, the client should compute a `code_verifier`. This must be a random, high entropy string between 43 and 128 characters. Next up, the client computes a `code_challenge` starting from the `code_verifier` (see also [RFC 7636, section 4](https://tools.ietf.org/html/rfc7636#section-4)). This is the result of the following pseudo-code:

```
code_challenge = base64urlEncode(SHA256(ASCII(code_verifier)))
```

The `code_challenge` must be sent in the first step of the authorization flow. The `code_verifier` instead must be included along the initial request to the authorization server for requesting the Access Token.

### 2. Authorization code request query parameters

The authorization flow begins with the application directing the user to the Monerium API by either POST or GET request to the `/auth` endpoint, sending the `code_challenge`, so it can be verified later.

```sh
curl --location --request POST 'https://api.monerium.dev/auth' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'client_id="your-auth-flow-client-uuid",' \
--data-urlencode 'code_challenge=${codeChallenge}' \
--data-urlencode 'code_challenge_method=S256' \
--data-urlencode 'redirect_uri=https://app.com/landingpage' \

# optional parameters to automate the wallet linking
--data-urlencode 'address=0x0000000000000000000000000000000000000000' \
--data-urlencode 'signature=0xVALID_SIGNATURE_2c23962f5a2f189b777b6ecc19a395f446c86aaf3b5d1dc0ba919ddb34372f4c9f0c8686cfc2e8266b3e4d8d1bc7bc67c34a11f9dfe8e691b' \
--data-urlencode 'chain=chaido'
```

A successful response will be a temporary redirect to the Monerium manage screen.

[Manage screen example](https://sandbox.monerium.dev/partners/9f2b364e-cc19-11ef-92b5-aae55502171d/auth?client_id=9ee602d1-cc19-11ef-92b5-aae55502171d&code_challenge=WV2IpInAYuSKarMDnYxmkstBqZl6LlIv9Qtl1I8CEjw&code_challenge_method=S256&redirect_uri=https%3A%2F%2Fmonerium.netlify.app%2Fdashboard&response_type=code)

Endpoint documentation: [Authorization](https://monerium.dev/api-docs/v2#tag/auth/operation/auth-post)

### 3-4. Authorization and onboarding

During the authorization flow, the users are automatically directed to a Monerium authorization screen that can be styled to fit the application. The user either authenticates with their username or passwords or signs up. After they have successfully on-boarded, they grant your application access.

![Authorization screen](../../static/img/AuthFlowScreen.jpg)

Endpoint documentation: [Authorization](https://monerium.dev/api-docs/v2#tag/auth/operation/auth-post)

### 5. Authorization response

Once the authorization is granted, users will be redirected to the redirect URL with the authorization code as a query parameter. If you include a state parameter in the initial authorization URL, it will be included in the redirect URL after the user authorizes your app.

Your app should compare the state with the state it created in the initial request. This helps ensure that you only exchange authorization codes that you requested, preventing attackers from redirecting to your callback URL with arbitrary or stolen authorization codes.

Example authorization code successful response:

```
HTTP/2 301
Location: https://app.com/landingpage
?code=123456789d&state=session-123
```

Error responses may also be sent to the redirect URL so the application can handle them appropriately:

| Error Parameter     | Description                                                                                                       |
| ------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `error`             | An error code string that can be used to classify types of errors that occur, and can be used to react to errors. |
| `error_description` | A specific error message that can help a developer identify the root cause of an authentication error.            |
| `error_uri`         | A link to more detailed information about the error and how to resolve it.                                        |

The following table describes the various error codes that can be returned in the error parameter of the error response.

| Error code                  | Description                                                                                                                     |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `access_denied`             | Resource owner denied consent.                                                                                                  |
| `invalid_request`           | The request is missing a required parameter, includes an invalid parameter value, or is otherwise malformed.                    |
| `unauthorized_client`       | The client is not authorized to request an authorization code using this method.                                                |
| `unsupported_response_type` | The authorization server does not support obtaining an authorization code using this method.                                    |
| `server_error`              | The authorization server encountered an unexpected condition which prevented it from fulfilling the request.                    |
| `temporarily_unavailable`   | The authorization server is currently unable to handle the request due to a temporary overloading or maintenance of the server. |

### 6. Redeem code for access token

Having accessed the authorization code, you can now use that and a `code_verifier` to authenticate and redeem an access_token. Submit a POST or GET request to `/auth/token` with `grant_type=authorization_code`.

Endpoint documentation: [Getting an access_token with authorization code](https://monerium.dev/api-docs/v2#tag/auth/operation/auth-token)

Example request

```
curl --silent --show-err --data code=xxx -d grant_type=authorization_code
-d client_id=1234 -d code_verifier=abc -d redirect_uri=http://app.com/landing
https://api.monerium.dev/auth/token
```

### 9-10. Refreshing the access token

Access tokens are short lived and you must refresh them after they expire to continue accessing resources. You can do so by submitting another POST or GET request to the `/auth/token` endpoint, this time providing the `refresh_token` instead of the `code`.
A refresh token is invalidated when a new access token is requested..

Endpoint documentation: [Access Token](https://monerium.dev/api-docs/v2#tag/auth/operation/auth-token)

## Client credentials authorization

Confidential clients which can hide their credentials, e.g. backend servers, can be enlisted in Monerium's partner program, which enables them simultaneous access to multiple profiles which have granted authorization. These clients can get an access_token by submitting a POST or GET request to `/auth/token`:

```
 curl --location --request POST 'http://api.monerium.app/auth/token' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode 'client_id=1234567890abcdef' \
  --data-urlencode 'client_secret=27b871f28ab834b6be75c21578b4c944527fe34fce3952dc59f9c928b8502ee8' \
  --data-urlencode 'grant_type=client_credentials'
```

Endpoint documentation: [Auth Token](https://monerium.dev/api-docs/v2#tag/auth/operation/auth-token)
