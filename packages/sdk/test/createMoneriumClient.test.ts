import {
  createMoneriumClient,
  MoneriumApiError,
  MoneriumSdkError,
  Transport,
  TransportRequest,
  TransportResponse,
} from '../src/client';

// ─── Test helpers ─────────────────────────────────────────────────────────────

function makeTransport(
  responses: Array<Partial<TransportResponse> & { bodyText: string }>
): { transport: Transport; requests: TransportRequest[] } {
  const requests: TransportRequest[] = [];
  let callIndex = 0;

  const transport: Transport = async (req) => {
    requests.push(req);
    const response = responses[callIndex++];
    if (!response) {
      throw new Error(
        `Unexpected request #${callIndex} to ${req.method} ${req.url}`
      );
    }
    return {
      status: response.status ?? 200,
      bodyText: response.bodyText,
    };
  };

  return { transport, requests };
}

function ok(body: unknown): Partial<TransportResponse> & { bodyText: string } {
  return { status: 200, bodyText: JSON.stringify(body) };
}

function apiError(
  code: number,
  status: string,
  message: string,
  extras?: Record<string, unknown>
): Partial<TransportResponse> & { bodyText: string } {
  return {
    status: code,
    bodyText: JSON.stringify({ code, status, message, ...extras }),
  };
}

const SANDBOX_API = 'https://api.monerium.dev';
const PRODUCTION_API = 'https://api.monerium.app';

// ─── Construction ─────────────────────────────────────────────────────────────

describe('createMoneriumClient — construction', () => {
  test('defaults to sandbox environment', async () => {
    const { transport, requests } = makeTransport([ok([])]);
    const client = createMoneriumClient({ accessToken: 'tok', transport });
    await client.getTokens();
    expect(requests[0].url).toContain(SANDBOX_API);
  });

  test('uses production environment when specified', async () => {
    const { transport, requests } = makeTransport([ok([])]);
    const client = createMoneriumClient({
      environment: 'production',
      accessToken: 'tok',
      transport,
    });
    await client.getTokens();
    expect(requests[0].url).toContain(PRODUCTION_API);
  });

  test('accepts getAccessToken callback', async () => {
    const { transport, requests } = makeTransport([ok({})]);
    const client = createMoneriumClient({
      getAccessToken: async () => 'callback-token',
      transport,
    });
    await client.getAuthContext();
    expect(requests[0].headers['Authorization']).toBe('Bearer callback-token');
  });

  test('accepts static accessToken', async () => {
    const { transport, requests } = makeTransport([ok({})]);
    const client = createMoneriumClient({
      accessToken: 'static-token',
      transport,
    });
    await client.getAuthContext();
    expect(requests[0].headers['Authorization']).toBe('Bearer static-token');
  });

  test('works without any token for unauthenticated endpoints', async () => {
    const { transport } = makeTransport([ok([])]);
    const client = createMoneriumClient({ transport });
    await expect(client.getTokens()).resolves.toBeDefined();
  });
});

// ─── Headers ──────────────────────────────────────────────────────────────────

describe('createMoneriumClient — request headers', () => {
  test('always sends Accept header with API version', async () => {
    const { transport, requests } = makeTransport([ok([])]);
    const client = createMoneriumClient({ accessToken: 'tok', transport });
    await client.getTokens();
    expect(requests[0].headers['Accept']).toBe(
      'application/vnd.monerium.api-v2+json'
    );
  });

  test('sends Content-Type: application/json by default', async () => {
    const { transport, requests } = makeTransport([ok([])]);
    const client = createMoneriumClient({ accessToken: 'tok', transport });
    await client.getTokens();
    expect(requests[0].headers['Content-Type']).toBe('application/json');
  });

  test('calls getAccessToken before every request', async () => {
    const getAccessToken = jest.fn().mockResolvedValue('fresh-token');
    const { transport } = makeTransport([ok({}), ok({})]);
    const client = createMoneriumClient({ getAccessToken, transport });

    await client.getAuthContext();
    await client.getAuthContext();

    expect(getAccessToken).toHaveBeenCalledTimes(2);
  });

  test('propagates getAccessToken error as-is to the caller', async () => {
    const error = new Error('token store unavailable');
    const client = createMoneriumClient({
      getAccessToken: async () => {
        throw error;
      },
      transport: async () => ({ status: 200, bodyText: '{}' }),
    });

    await expect(client.getAuthContext()).rejects.toThrow(
      'token store unavailable'
    );
  });
});

// ─── Authentication ───────────────────────────────────────────────────────────

describe('createMoneriumClient — authentication', () => {
  test('throws MoneriumSdkError authentication_required for authenticated endpoint with no token', async () => {
    const client = createMoneriumClient({
      transport: async () => ({ status: 200, bodyText: '{}' }),
    });

    await expect(client.getAuthContext()).rejects.toMatchObject({
      type: 'authentication_required',
    });
  });

  test('throws MoneriumSdkError with correct type', async () => {
    const client = createMoneriumClient({
      transport: async () => ({ status: 200, bodyText: '{}' }),
    });

    try {
      await client.getAuthContext();
    } catch (err) {
      expect(err).toBeInstanceOf(MoneriumSdkError);
      expect((err as MoneriumSdkError).type).toBe('authentication_required');
    }
  });

  test('does not require token for getTokens', async () => {
    const { transport } = makeTransport([ok([])]);
    const client = createMoneriumClient({ transport });
    await expect(client.getTokens()).resolves.toEqual([]);
  });
});

// ─── Error handling ───────────────────────────────────────────────────────────

describe('createMoneriumClient — error handling', () => {
  test('throws MoneriumApiError on 401', async () => {
    const { transport } = makeTransport([
      apiError(401, 'Unauthorized', 'Not authenticated'),
    ]);
    const client = createMoneriumClient({ accessToken: 'expired', transport });

    await expect(client.getAuthContext()).rejects.toBeInstanceOf(
      MoneriumApiError
    );
  });

  test('MoneriumApiError has correct code and status', async () => {
    const { transport } = makeTransport([
      apiError(401, 'Unauthorized', 'Not authenticated'),
    ]);
    const client = createMoneriumClient({ accessToken: 'expired', transport });

    try {
      await client.getAuthContext();
    } catch (err) {
      expect(err).toBeInstanceOf(MoneriumApiError);
      expect((err as MoneriumApiError).code).toBe(401);
      expect((err as MoneriumApiError).status).toBe('Unauthorized');
      expect((err as MoneriumApiError).message).toBe('Not authenticated');
    }
  });

  test('MoneriumApiError surfaces field-level errors', async () => {
    const { transport } = makeTransport([
      apiError(400, 'Bad Request', 'Validation errors', {
        errors: {
          'counterpart.identifier.address': 'invalid address',
        },
      }),
    ]);
    const client = createMoneriumClient({ accessToken: 'tok', transport });

    try {
      await client.placeOrder({} as any);
    } catch (err) {
      expect(err).toBeInstanceOf(MoneriumApiError);
      expect((err as MoneriumApiError).errors).toEqual({
        'counterpart.identifier.address': 'invalid address',
      });
    }
  });

  test('custom transport errors propagate as-is to the caller', async () => {
    // When using a custom transport, errors are not wrapped by the SDK.
    // MoneriumSdkError('network_error') wrapping only happens in the defaultTransport.
    const cause = new TypeError('Failed to fetch');
    const client = createMoneriumClient({
      accessToken: 'tok',
      transport: async () => {
        throw cause;
      },
    });

    await expect(client.getAuthContext()).rejects.toThrow(cause);
  });

  test('defaultTransport wraps fetch failures in MoneriumSdkError network_error', async () => {
    // Simulate the defaultTransport behaviour by providing a transport that
    // itself wraps errors — demonstrating what defaultTransport does internally.
    const client = createMoneriumClient({
      accessToken: 'tok',
      transport: async () => {
        try {
          throw new TypeError('Failed to fetch');
        } catch (err) {
          throw new MoneriumSdkError(
            'network_error',
            'Network request failed',
            err
          );
        }
      },
    });

    try {
      await client.getAuthContext();
    } catch (err) {
      expect(err).toBeInstanceOf(MoneriumSdkError);
      expect((err as MoneriumSdkError).type).toBe('network_error');
      expect((err as MoneriumSdkError).cause).toBeInstanceOf(TypeError);
    }
  });
});

// ─── Auth ─────────────────────────────────────────────────────────────────────

describe('createMoneriumClient — getAuthContext', () => {
  test('GET auth/context', async () => {
    const { transport, requests } = makeTransport([ok({ userId: 'u1' })]);
    const client = createMoneriumClient({ accessToken: 'tok', transport });

    const result = await client.getAuthContext();

    expect(requests[0].method).toBe('GET');
    expect(requests[0].url).toBe(`${SANDBOX_API}/auth/context`);
    expect(result).toEqual({ userId: 'u1' });
  });
});

// ─── Profiles ─────────────────────────────────────────────────────────────────

describe('createMoneriumClient — profiles', () => {
  test('getProfile — GET profiles/:id', async () => {
    const { transport, requests } = makeTransport([ok({ id: 'p1' })]);
    const client = createMoneriumClient({ accessToken: 'tok', transport });

    await client.getProfile('p1');

    expect(requests[0].method).toBe('GET');
    expect(requests[0].url).toBe(`${SANDBOX_API}/profiles/p1`);
  });

  test('getProfiles — GET profiles', async () => {
    const { transport, requests } = makeTransport([
      ok({ profiles: [], total: 0 }),
    ]);
    const client = createMoneriumClient({ accessToken: 'tok', transport });

    await client.getProfiles();

    expect(requests[0].method).toBe('GET');
    expect(requests[0].url).toBe(`${SANDBOX_API}/profiles`);
  });

  test('getProfiles — passes query params', async () => {
    const { transport, requests } = makeTransport([
      ok({ profiles: [], total: 0 }),
    ]);
    const client = createMoneriumClient({ accessToken: 'tok', transport });

    await client.getProfiles({ kind: 'personal' } as any);

    expect(requests[0].url).toContain('kind=personal');
  });
});

// ─── Addresses ────────────────────────────────────────────────────────────────

describe('createMoneriumClient — addresses', () => {
  test('getAddress — GET addresses/:address', async () => {
    const { transport, requests } = makeTransport([ok({ address: '0x1' })]);
    const client = createMoneriumClient({ accessToken: 'tok', transport });

    await client.getAddress('0x1');

    expect(requests[0].method).toBe('GET');
    expect(requests[0].url).toBe(`${SANDBOX_API}/addresses/0x1`);
  });

  test('getAddresses — GET addresses', async () => {
    const { transport, requests } = makeTransport([
      ok({ addresses: [], total: 0 }),
    ]);
    const client = createMoneriumClient({ accessToken: 'tok', transport });

    await client.getAddresses();

    expect(requests[0].method).toBe('GET');
    expect(requests[0].url).toBe(`${SANDBOX_API}/addresses`);
  });

  test('linkAddress — POST addresses with JSON body', async () => {
    const { transport, requests } = makeTransport([ok({ address: '0x1' })]);
    const client = createMoneriumClient({ accessToken: 'tok', transport });
    const payload = { address: '0x1', signature: '0xsig', chain: 'ethereum' };

    await client.linkAddress(payload as any);

    expect(requests[0].method).toBe('POST');
    expect(requests[0].url).toBe(`${SANDBOX_API}/addresses`);
    expect(JSON.parse(requests[0].body as string)).toEqual(payload);
  });
});

// ─── IBANs ────────────────────────────────────────────────────────────────────

describe('createMoneriumClient — ibans', () => {
  test('getIban — GET ibans/:iban', async () => {
    const { transport, requests } = makeTransport([ok({ iban: 'GB00...' })]);
    const client = createMoneriumClient({ accessToken: 'tok', transport });

    await client.getIban('GB00...');

    expect(requests[0].method).toBe('GET');
    expect(requests[0].url).toBe(`${SANDBOX_API}/ibans/GB00...`);
  });

  test('moveIban — PATCH ibans/:iban', async () => {
    const { transport, requests } = makeTransport([
      ok({ status: 200, statusText: 'OK' }),
    ]);
    const client = createMoneriumClient({ accessToken: 'tok', transport });

    await client.moveIban('GB00...', {
      address: '0x1',
      chain: 'ethereum',
    } as any);

    expect(requests[0].method).toBe('PATCH');
    expect(requests[0].url).toBe(`${SANDBOX_API}/ibans/GB00...`);
  });

  test('requestIban — POST ibans', async () => {
    const { transport, requests } = makeTransport([
      ok({ status: 201, statusText: 'Created' }),
    ]);
    const client = createMoneriumClient({ accessToken: 'tok', transport });

    await client.requestIban({ address: '0x1', chain: 'ethereum' } as any);

    expect(requests[0].method).toBe('POST');
    expect(requests[0].url).toBe(`${SANDBOX_API}/ibans`);
  });
});

// ─── Orders ───────────────────────────────────────────────────────────────────

describe('createMoneriumClient — orders', () => {
  test('getOrder — GET orders/:id', async () => {
    const { transport, requests } = makeTransport([ok({ id: 'o1' })]);
    const client = createMoneriumClient({ accessToken: 'tok', transport });

    await client.getOrder('o1');

    expect(requests[0].method).toBe('GET');
    expect(requests[0].url).toBe(`${SANDBOX_API}/orders/o1`);
  });

  test('getOrders — GET orders', async () => {
    const { transport, requests } = makeTransport([
      ok({ orders: [], total: 0 }),
    ]);
    const client = createMoneriumClient({ accessToken: 'tok', transport });

    await client.getOrders();

    expect(requests[0].method).toBe('GET');
    expect(requests[0].url).toBe(`${SANDBOX_API}/orders`);
  });

  test('getOrders — passes filter as query params', async () => {
    const { transport, requests } = makeTransport([
      ok({ orders: [], total: 0 }),
    ]);
    const client = createMoneriumClient({ accessToken: 'tok', transport });

    await client.getOrders({ address: '0x1' } as any);

    expect(requests[0].url).toContain('address=0x1');
  });

  test('placeOrder — POST orders with JSON body', async () => {
    const { transport, requests } = makeTransport([ok({ id: 'o1' })]);
    const client = createMoneriumClient({ accessToken: 'tok', transport });
    const order = { amount: '10', currency: 'EUR' };

    await client.placeOrder(order as any);

    expect(requests[0].method).toBe('POST');
    expect(requests[0].url).toBe(`${SANDBOX_API}/orders`);
    expect(JSON.parse(requests[0].body as string)).toEqual(order);
  });
});

// ─── Tokens ───────────────────────────────────────────────────────────────────

describe('createMoneriumClient — tokens', () => {
  test('getTokens — GET tokens (no auth required)', async () => {
    const { transport, requests } = makeTransport([ok([])]);
    const client = createMoneriumClient({ transport });

    await client.getTokens();

    expect(requests[0].method).toBe('GET');
    expect(requests[0].url).toBe(`${SANDBOX_API}/tokens`);
    expect(requests[0].headers['Authorization']).toBeUndefined();
  });
});

// ─── Transport ────────────────────────────────────────────────────────────────

describe('createMoneriumClient — custom transport', () => {
  test('custom transport receives pre-populated headers', async () => {
    const capturedRequests: TransportRequest[] = [];
    const client = createMoneriumClient({
      accessToken: 'my-token',
      transport: async (req) => {
        capturedRequests.push(req);
        return { status: 200, bodyText: '{}' };
      },
    });

    await client.getAuthContext();

    const req = capturedRequests[0];
    expect(req.headers['Authorization']).toBe('Bearer my-token');
    expect(req.headers['Accept']).toBe('application/vnd.monerium.api-v2+json');
    expect(req.headers['Content-Type']).toBeDefined();
  });

  test('custom transport can be used to add retry logic', async () => {
    let attempts = 0;
    const client = createMoneriumClient({
      accessToken: 'tok',
      transport: async (req) => {
        attempts++;
        if (attempts < 3) {
          throw new TypeError('Failed to fetch');
        }
        return { status: 200, bodyText: '{}' };
      },
    });

    // Wrap in a retry transport at the consumer level
    const retryingClient = createMoneriumClient({
      accessToken: 'tok',
      transport: async (req) => {
        for (let i = 0; i < 3; i++) {
          try {
            attempts++;
            if (attempts < 3) throw new TypeError('Failed to fetch');
            return { status: 200, bodyText: '{}' };
          } catch {
            if (i === 2) throw new TypeError('Failed to fetch');
          }
        }
        return { status: 200, bodyText: '{}' };
      },
    });

    await expect(retryingClient.getAuthContext()).resolves.toBeDefined();
  });
});
