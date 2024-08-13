/**
 * Only activated in tests, speeds up debugging.
 * @internal
 * @hidden
 */
export const consoleCurl = (
  method: string,
  url: string,
  body: BodyInit | Record<string, string> | undefined,
  headers: Record<string, string> | undefined
) => {
  if (process.env.NODE_ENV !== 'test') return;
  // Log the curl command
  let curl = `curl -X ${method.toUpperCase()} '${url}'`;
  if (headers) {
    for (const [key, value] of Object.entries(headers)) {
      curl += ` -H '${key}: ${value}'`;
    }
  }
  if (body) {
    curl += ` -d '${body}'`;
  }

  // Equivalent cURL command:
  console.log(curl);
};
