import { urlEncoded } from '../utils';

/**
 * Construct query parameters
 * @internal
 * @hidden
 * */
export const queryParams = (params?: Record<string, any>): string => {
  if (!params) return '';
  const encoded = urlEncoded(
    params as Record<string, string | boolean | number | undefined>
  );
  return encoded ? `?${encoded}` : '';
};
