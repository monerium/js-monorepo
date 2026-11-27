export const api = async <T,>(method: string, input?: unknown): Promise<T> => {
  const response = await fetch('/api/sdk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ method, input }),
  });
  const value = (await response.json()) as unknown;
  if (!response.ok) {
    const apiError = value as {
      error?: unknown;
      errors?: unknown;
      details?: unknown;
    };
    const message =
      typeof apiError.error === 'string'
        ? apiError.error
        : JSON.stringify(apiError.error ?? value);
    const extra = Object.fromEntries(
      Object.entries({
        errors: apiError.errors,
        details: apiError.details,
      }).filter(([, item]) => item !== undefined)
    );
    throw new Error(
      Object.keys(extra).length > 0
        ? `${message}\n${JSON.stringify(extra, null, 2)}`
        : message
    );
  }
  return value as T;
};
