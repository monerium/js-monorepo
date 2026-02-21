import { serve } from 'bun';
import { createHmac } from 'crypto';

const SECRET =
  process.env.WEBHOOK_SECRET || 'whsec_mUt3nH+3wx/djdHf8RHn9yJMMiAhq10b';

/**
 * Verifies the webhook signature
 *
 * @param signature The webhook-signature header value
 * @param webhookId The webhook-id header value
 * @param timestamp The webhook-timestamp header value
 * @param payload The request body
 * @param secret The secret key used for verification
 * @returns Boolean indicating if the signature is valid
 */
function verifySignature(
  signature: string,
  webhookId: string,
  timestamp: string,
  payload: string,
  secret: string
): boolean {
  // Check if signature follows the expected format (v1,{signature})
  if (!signature.startsWith('v1,')) {
    console.error('Invalid signature format: expected v1,{signature}');
    return false;
  }

  // Extract the signature part
  const providedSignature = signature.substring(3); // Remove 'v1,' prefix

  // Create the envelope as specified
  const envelope = `${webhookId}.${timestamp}.${payload}`;

  // Calculate the expected signature
  const hmac = createHmac('sha256', secret);
  hmac.update(envelope);
  const expectedSignature = hmac.digest('base64');

  // Compare the signatures
  const isValid = providedSignature === expectedSignature;

  if (!isValid) {
    console.error('Signature verification failed');
    console.debug(`Expected: ${expectedSignature}`);
    console.debug(`Provided: ${providedSignature}`);
  }

  return isValid;
}

// Create a minimal HTTP server that echoes POST request bodies
const server = serve({
  port: 1337,
  async fetch(req) {
    // Get request method
    const method = req.method;

    // Only process POST requests
    if (method === 'POST') {
      try {
        // Read the request body
        const body = await req.text();

        // Get required headers
        const signature = req.headers.get('webhook-signature');
        const webhookId = req.headers.get('webhook-id');
        const timestamp = req.headers.get('webhook-timestamp');

        // Verify signature if all required headers are present
        let signatureValid = false;
        let signatureStatus = 'Not verified';

        if (signature && webhookId && timestamp) {
          signatureValid = verifySignature(
            signature,
            webhookId,
            timestamp,
            body,
            SECRET
          );
          signatureStatus = signatureValid ? 'Valid' : 'Invalid';
        } else {
          signatureStatus = 'Missing required headers';
        }

        // Return the body along with signature verification status
        return new Response(
          JSON.stringify({
            body: body,
            signature_verification: {
              status: signatureStatus,
              valid: signatureValid,
            },
          }),
          {
            status: signatureValid || !signature ? 200 : 401,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      } catch (error) {
        // Handle any errors
        return new Response(
          JSON.stringify({
            error: `Error processing request: ${error}`,
          }),
          {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      }
    } else {
      // Return a helpful message for non-POST requests
      return new Response(
        JSON.stringify({
          error: 'This server only accepts POST requests',
        }),
        {
          status: 405,
          headers: {
            'Content-Type': 'application/json',
            Allow: 'POST',
          },
        }
      );
    }
  },
});

console.log(`Webhook Echo Server running at http://localhost:${server.port}`);
console.log(
  `Using webhook secret: ${SECRET.substring(0, 10)}...${SECRET.substring(SECRET.length - 5, SECRET.length)}`
);
