# Webhook Echo Server with Signature Verification

A minimal HTTP server that echoes back the body of POST requests and verifies webhook signatures.

## Features

- Simple HTTP server built with Bun
- Echoes back the body of any POST request
- Verifies webhook signatures using HMAC-SHA256
- Returns verification status in the response

## Installation

To install dependencies:

```bash
bun install
```

## Usage

### Running the server

Start the server:

```bash
bun run server.ts
```

The server will be available at http://localhost:1337.

### Making requests

You can test the server with curl:

```bash
# Send a POST request with a JSON body (without signature verification)
curl -X POST -H "Content-Type: application/json" -d '{"message":"Hello World"}' http://localhost:3000

# Send a POST request with webhook signature verification
curl -X POST \
  -H "Content-Type: application/json" \
  -H "webhook-id: 3f3d820e-d01c-4c56-8be4-b20053225679" \
  -H "webhook-timestamp: 1745118540" \
  -H "webhook-signature: v1,4gOAiajJT7ah++XpDFdRyK/TJ75whRjUcKOWnvsHNlk=" \
  -d '{"type":"subscription.created","timestamp":"2024-08-09T12:44:04.777884Z"}' \
  http://localhost:3000
```

### Webhook Signature Verification

The server verifies webhook signatures using the following formula:

```
envelope = webhook-id.webhook-timestamp.payload
signature = base64Encode(HMAC-SHA256(envelope, secret))
webhook-signature = v1,signature
```

Required headers for verification:
- `webhook-id`: A unique identifier for the webhook
- `webhook-timestamp`: A Unix timestamp
- `webhook-signature`: The signature in the format `v1,{base64_signature}`

If all headers are present, the server will verify the signature using the secret key defined in the environment variable `WEBHOOK_SECRET` or the default one hardcoded in the server.

Example:
- webhook-id: `3f3d820e-d01c-4c56-8be4-b20053225679`
- webhook-timestamp: `1745118540`
- payload: `{"type":"subscription.created","timestamp":"2024-08-09T12:44:04.777884Z"}`
- secret: `whsec_mUt3nH+3wx/djdHf8RHn9yJMMiAhq10b`
- webhook-signature: `v1,4gOAiajJT7ah++XpDFdRyK/TJ75whRjUcKOWnvsHNlk=`

### Response Format

The server responds with a JSON object containing:
- `body`: The original request body
- `signature_verification`: Object containing verification status
  - `status`: String indicating verification status ("Valid", "Invalid", "Missing required headers", or "Not verified")
  - `valid`: Boolean indicating if the signature is valid

Example response for a valid signature:
```json
{
  "body": "{\"type\":\"subscription.created\",\"timestamp\":\"2024-08-09T12:44:04.777884Z\"}",
  "signature_verification": {
    "status": "Valid",
    "valid": true
  }
}
```

Example response for an invalid signature:
```json
{
  "body": "{\"type\":\"subscription.created\",\"timestamp\":\"2024-08-09T12:44:04.777884Z\"}",
  "signature_verification": {
    "status": "Invalid",
    "valid": false
  }
}
```

## Environment Variables

- `WEBHOOK_SECRET`: The secret key used for signature verification (default: `whsec_mUt3nH+3wx/djdHf8RHn9yJMMiAhq10b`)

## Development

This project was created using Bun, a fast all-in-one JavaScript runtime.
