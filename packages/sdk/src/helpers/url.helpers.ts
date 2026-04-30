/**
 * Converts an object into a URL-encoded query string.
 * Automatically filters out undefined, null, and empty string values.
 * Handles arrays by appending the same key multiple times (e.g. currency=eur&currency=usd).
 */
export const urlEncoded = (params: Record<string, any>): string => {
  if (!params) return '';

  const tuples = Object.entries(params)
    .filter(
      ([, value]) => value !== undefined && value !== null && value !== ''
    )
    .flatMap(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map((item) => [key, String(item)]);
      }
      return [[key, String(value)]];
    });

  return new URLSearchParams(tuples).toString();
};

/**
 * Constructs query parameters with a leading '?' if valid parameters exist.
 * Returns an empty string if no valid parameters are provided.
 */
export const queryParams = (params?: Record<string, any>): string => {
  if (!params) return '';
  const encoded = urlEncoded(params);
  return encoded ? `?${encoded}` : '';
};
