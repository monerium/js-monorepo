import { MoneriumSdkError } from './errors';

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * @group Transport
 * @category Types
 */
export type TransportRequest = {
  method: string;
  url: string;
  headers: Record<string, string>; // always pre-populated by the SDK
  body?: BodyInit | string;
  signal?: AbortSignal; // for request cancellation
};

/**
 * @group Transport
 * @category Types
 */
export type TransportResponse = {
  status: number;
  headers?: Record<string, string>;
  bodyText: string; // raw response body — SDK handles JSON parsing
};

/**
 * Replaces the internal `fetch` call. Headers (`Authorization`, `Content-Type`,
 * `Accept`) are pre-populated. Must return a `Promise` resolving with the raw
 * response `status` and `bodyText`. Throw on network-level failures.
 * The SDK owns JSON parsing and error normalisation.
 * @group Transport
 * @category Types
 */
export type Transport = (
  request: TransportRequest
) => Promise<TransportResponse>;

// ─── Default implementation ───────────────────────────────────────────────────

/**
 * Default transport — wraps the platform's built-in `fetch`.
 * Throws `MoneriumSdkError('network_error')` on network-level failures
 * (DNS, timeout, connection refused). Non-2xx responses are returned as-is;
 * the SDK maps them to `MoneriumApiError` after parsing the body.
 */
export const defaultTransport: Transport = async ({
  method,
  url,
  headers,
  body,
  signal,
}) => {
  let response: Response;
  try {
    response = await fetch(url, { method, headers, body, signal });
  } catch (err) {
    throw new MoneriumSdkError('network_error', 'Network request failed', err);
  }
  const bodyText = await response.text();
  return { status: response.status, bodyText };
};
