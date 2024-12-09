/**
 * Construct query parameters
 * @internal
 * @hidden
 * */
export const queryParams = (params?: Record<string, any>): string => {
  if (!params) return '';
  const queryString = Object.entries(params)
    .filter(
      ([key, value]) => value !== '' && value !== undefined && value !== null
    ) // Filter out empty, undefined, or null values
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join('&');

  return queryString ? '?' + queryString : '';
};
