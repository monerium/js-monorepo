#!/usr/bin/env bun

import { createHmac } from 'crypto';

// Default values that match the example in the README
const DEFAULT_WEBHOOK_ID = '3f3d820e-d01c-4c56-8be4-b20053225679';
const DEFAULT_TIMESTAMP = '1745118540';
const DEFAULT_PAYLOAD =
  '{"type":"subscription.created","timestamp":"2024-08-09T12:44:04.777884Z"}';
const DEFAULT_SECRET = 'whsec_mUt3nH+3wx/djdHf8RHn9yJMMiAhq10b';

/**
 * Generates a webhook signature
 *
 * @param webhookId The webhook ID
 * @param timestamp The webhook timestamp
 * @param payload The request payload
 * @param secret The secret key
 * @returns The full webhook signature
 */
function generateSignature(
  webhookId: string,
  timestamp: string,
  payload: string,
  secret: string
): string {
  // Create the envelope
  const envelope = `${webhookId}.${timestamp}.${payload}`;

  // Calculate the signature
  const hmac = createHmac('sha256', secret);
  hmac.update(envelope);
  const signature = hmac.digest('base64');

  // Return the full signature with version prefix
  return `v1,${signature}`;
}

/**
 * Tests the webhook signature generation and verification
 */
async function testSignature() {
  // Get values from command line arguments or use defaults
  const webhookId = process.argv[2] || DEFAULT_WEBHOOK_ID;
  const timestamp = process.argv[3] || DEFAULT_TIMESTAMP;
  const payload = process.argv[4] || DEFAULT_PAYLOAD;
  const secret = process.env.WEBHOOK_SECRET || DEFAULT_SECRET;

  // Generate the signature
  const signature = generateSignature(webhookId, timestamp, payload, secret);

  console.log('\n=== Webhook Signature Test ===\n');
  console.log('Input:');
  console.log(`  webhook-id: ${webhookId}`);
  console.log(`  webhook-timestamp: ${timestamp}`);
  console.log(`  payload: ${payload}`);
  console.log(`  secret: ${secret.substring(0, 5)}...`);

  console.log('\nGenerated Signature:');
  console.log(`  webhook-signature: ${signature}`);

  // Generate curl command for testing
  const curlCommand = `curl -X POST \\
  -H "Content-Type: application/json" \\
  -H "webhook-id: ${webhookId}" \\
  -H "webhook-timestamp: ${timestamp}" \\
  -H "webhook-signature: ${signature}" \\
  -d '${payload}' \\
  http://localhost:1337`;

  console.log('\nTest with curl:');
  console.log(curlCommand);

  // Try to test the server if it's running
  try {
    const response = await fetch('http://localhost:1337', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'webhook-id': webhookId,
        'webhook-timestamp': timestamp,
        'webhook-signature': signature,
      },
      body: payload,
    });

    const result = await response.json();

    console.log('\nServer Response:');
    console.log(JSON.stringify(result, null, 2));

    if (result.signature_verification?.valid) {
      console.log('\n✅ Signature verification successful!');
    } else {
      console.log('\n❌ Signature verification failed!');
    }
  } catch (error) {
    console.log(
      '\n⚠️ Could not connect to server. Is it running on port 1337?'
    );
  }
}

// Run the test
testSignature();
