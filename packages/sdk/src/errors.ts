/**
 * Thrown when the Monerium API returns a non-2xx response.
 * Fields map directly to the API response body — nothing is translated or normalised.
 *
 * @example
 * try {
 *   await client.getProfiles();
 * } catch (err) {
 *   if (err instanceof MoneriumApiError) {
 *     console.log(err.code);    // 401
 *     console.log(err.status);  // "Unauthorized"
 *     console.log(err.message); // "Not authenticated"
 *     console.log(err.errors);  // field-level validation errors, if present
 *   }
 * }
 * @group Errors
 */
export class MoneriumApiError extends Error {
  code: number;
  status: string;
  errors?: Record<string, string>;
  details?: unknown;

  constructor(body: {
    code: number;
    status: string;
    message: string;
    errors?: Record<string, string>;
    details?: unknown;
  }) {
    super(body.message);
    this.name = 'MoneriumApiError';
    this.code = body.code;
    this.status = body.status;
    this.errors = body.errors;
    this.details = body.details;
  }
}

/**
 * @group Errors
 */
export type MoneriumSdkErrorType =
  | 'network_error' //          fetch failed (DNS, timeout, connection refused)
  | 'authentication_required' // authenticated endpoint called with no token
  | 'invalid_configuration'; //  bad options passed to createMoneriumClient

/**
 * Thrown for SDK-level failures — no HTTP response involved.
 *
 * @example
 * try {
 *   await client.getProfiles();
 * } catch (err) {
 *   if (err instanceof MoneriumSdkError) {
 *     console.log(err.type);  // 'network_error' | 'authentication_required' | ...
 *     console.log(err.cause); // underlying fetch error, if type === 'network_error'
 *   }
 * }
 * @group Errors
 */
export class MoneriumSdkError extends Error {
  type: MoneriumSdkErrorType;
  cause?: unknown;

  constructor(type: MoneriumSdkErrorType, message: string, cause?: unknown) {
    super(message);
    this.name = 'MoneriumSdkError';
    this.type = type;
    this.cause = cause;
  }
}
