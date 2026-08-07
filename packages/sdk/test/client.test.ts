import { MoneriumPrivateClient } from '../src/client';
import { BearerProfile, Currency } from '../src/types';

describe('Monerium Client Classes with dynamic getAccessToken', () => {
  let mockTransport: jest.Mock;

  beforeEach(() => {
    mockTransport = jest.fn();
  });

  it('should dynamically fetch, cache, and reuse access token without infinite loops', async () => {
    // 1. Setup mock storage
    const memoryCache = new Map<string, string>();
    const db = {
      token: undefined as string | undefined,
      async getToken() {
        return this.token;
      },
      async saveToken(token: string) {
        this.token = token;
      },
    };

    // 2. Setup transport mock responses
    // First call will be auth/token
    mockTransport.mockResolvedValueOnce({
      status: 200,
      bodyText: JSON.stringify({
        access_token: 'mock_token_123',
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: 'mock_refresh',
        profile: 'prof_123',
        userId: 'user_123',
      } as BearerProfile),
    });

    // Second call will be the actual API request (e.g. placeOrder)
    mockTransport.mockResolvedValueOnce({
      status: 200,
      bodyText: JSON.stringify({ id: 'order_123', status: 'placed' }),
    });

    // Third call will be another API request (e.g. getProfile)
    mockTransport.mockResolvedValueOnce({
      status: 200,
      bodyText: JSON.stringify({ id: 'prof_123', name: 'Test' }),
    });

    // 3. Initialize the client
    const client: MoneriumPrivateClient = new MoneriumPrivateClient({
      environment: 'sandbox',
      transport: mockTransport,
      getAccessToken: async () => {
        let token = memoryCache.get('monerium_token');

        if (!token) {
          token = await db.getToken();
          if (token) memoryCache.set('monerium_token', token);
        }

        // Simulate expiration check by just checking existence for the test
        if (!token) {
          const auth = await client.clientCredentialsGrant(
            'TEST_CLIENT_ID',
            'TEST_SECRET'
          );
          token = auth.access_token;

          memoryCache.set('monerium_token', token);
          await db.saveToken(token);
        }

        return token;
      },
    });

    // 4. Trigger an API request that requires authentication
    // This should trigger: getAccessToken -> clientCredentialsGrant -> placeOrder
    await client.placeOrder({
      address: '0x123',
      chain: 'ethereum',
      amount: '100',
      signature: '0xTestSignature...',
      currency: Currency.eur,
      message: 'test order',
      counterpart: {
        identifier: {
          standard: 'iban',
          iban: 'TEST_IBAN',
          bic: 'TESTBIC',
        },
        details: {
          firstName: 'John',
          lastName: 'Doe',
          country: 'IS',
        },
      },
    });

    // Verify auth was called first
    expect(mockTransport).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        url: 'https://api.monerium.dev/auth/token',
        method: 'POST',
      })
    );

    // Verify place order was called second WITH the token from auth
    expect(mockTransport).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        url: 'https://api.monerium.dev/orders',
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer mock_token_123',
        }),
      })
    );

    // Verify caches are populated
    expect(memoryCache.get('monerium_token')).toBe('mock_token_123');
    expect(await db.getToken()).toBe('mock_token_123');

    // 5. Trigger a second API request
    // This should NOT trigger auth again, as token is in cache
    await client.getProfile('prof_123');

    // Verify it just made the API call directly
    expect(mockTransport).toHaveBeenCalledTimes(3);
    expect(mockTransport).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        url: 'https://api.monerium.dev/profiles/prof_123',
        method: 'GET',
        headers: expect.objectContaining({
          Authorization: 'Bearer mock_token_123',
        }),
      })
    );
  });
});

describe('MoneriumPrivateClient.getOrderPayments', () => {
  let mockTransport: jest.Mock;

  beforeEach(() => {
    mockTransport = jest.fn();
  });

  it('requests orders/{orderId}/payments with the bearer token and returns the parsed response', async () => {
    const orderId = '379dce7b-bef4-4a76-8ac2-baad27bc0799';
    const paymentsResponse = {
      payments: [
        {
          id: 'e69940ba-9286-11f1-accf-bac9bf26c37d',
          orderId,
          direction: 'out',
          currency: 'eur',
          amount: '1',
          counterpart: {
            identifier: {
              standard: 'iban',
              iban: 'GR16 0110 1250 0000 0001 2300 695',
            },
            details: {
              name: 'Mockbankson',
              companyName: 'Mockbankson',
              country: 'GR',
            },
          },
          details: {
            paymentType: '',
            UETR: '',
            InstructionId: '',
          },
          memo: 'Powered by Monerium',
          reference: '',
          meta: {
            provider: 'fake',
            state: 'processed',
          },
        },
      ],
      total: 1,
    };

    mockTransport.mockResolvedValueOnce({
      status: 200,
      bodyText: JSON.stringify(paymentsResponse),
    });

    const client: MoneriumPrivateClient = new MoneriumPrivateClient({
      environment: 'sandbox',
      transport: mockTransport,
      getAccessToken: async () => 'mock_token_123',
    });

    const result = await client.getOrderPayments(orderId);

    expect(mockTransport).toHaveBeenCalledTimes(1);
    expect(mockTransport).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: `https://api.monerium.dev/orders/${orderId}/payments`,
        headers: expect.objectContaining({
          Authorization: 'Bearer mock_token_123',
        }),
      })
    );
    expect(result).toEqual(paymentsResponse);
    expect(result.payments).toHaveLength(1);
    expect(result.total).toBe(1);
    expect(result.payments[0].direction).toBe('out');
    expect(result.payments[0].meta.state).toBe('processed');
  });

  it('surfaces a 404 "order not found" as a MoneriumApiError', async () => {
    const orderId = '00000000-0000-4000-8000-000000000000';

    mockTransport.mockResolvedValueOnce({
      status: 404,
      bodyText: JSON.stringify({
        code: 404,
        status: 'Not Found',
        message: 'order not found',
      }),
    });

    const client: MoneriumPrivateClient = new MoneriumPrivateClient({
      environment: 'sandbox',
      transport: mockTransport,
      getAccessToken: async () => 'mock_token_123',
    });

    await expect(client.getOrderPayments(orderId)).rejects.toMatchObject({
      code: 404,
      status: 'Not Found',
      message: 'order not found',
    });

    expect(mockTransport).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: `https://api.monerium.dev/orders/${orderId}/payments`,
      })
    );
  });
});
