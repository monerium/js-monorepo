/**
 * Used to identify open websockets.
 * @param obj any query params
 * @returns string identifier
 */
export const getKey = (obj: Record<string, unknown>) => {
  // Filter out properties with null or undefined values
  const validEntries = Object.entries(obj).filter(
    ([_, value]) => value != null
  );

  // Join the entries with a hyphen
  return validEntries.map(([key, value]) => `${key}-${value}`).join('-');
};

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
