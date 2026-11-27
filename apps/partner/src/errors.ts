export const errorMessage = (reason: unknown): string => {
  if (reason instanceof Error) return reason.message;
  if (typeof reason === 'string') return reason;
  if (reason && typeof reason === 'object') {
    const value = reason as {
      code?: unknown;
      shortMessage?: unknown;
      message?: unknown;
    };
    if (value.code === 4001 || value.code === '4001') {
      return 'Signature request was cancelled in the wallet';
    }
    if (typeof value.shortMessage === 'string') return value.shortMessage;
    if (typeof value.message === 'string') return value.message;
    try {
      const serialized = JSON.stringify(reason);
      return serialized && serialized !== '{}'
        ? serialized
        : 'An unknown error occurred';
    } catch {
      return 'An unknown error occurred';
    }
  }
  return reason ? String(reason) : 'An unknown error occurred';
};
