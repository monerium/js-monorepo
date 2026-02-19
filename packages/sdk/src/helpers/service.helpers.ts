import { ResponseStatus } from '../types';
// import { consoleCurl } from './internal.helpers';

export const rest = async <T = ResponseStatus>(
  url: string,
  method: string,
  body?: BodyInit | Record<string, string>,
  headers?: Record<string, string>
): Promise<T> => {
  const res = await fetch(`${url}`, {
    method,
    headers,
    body: body as unknown as BodyInit,
  });

  // consoleCurl(method, url, body, headers);

  let response;
  const text = await res.text();

  try {
    response = JSON.parse(text);
    if (Object.keys(response).length === 0 && response.constructor === Object) {
      switch (res.status) {
        case 201:
        case 202:
          return {
            status: res.status,
            statusText: res.statusText,
          } as T;
      }
    }
  } catch (_err) {
    throw text;
  }

  if (!res.ok) {
    throw response;
  }

  return response as T;
};
