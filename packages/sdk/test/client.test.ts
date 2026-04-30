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
