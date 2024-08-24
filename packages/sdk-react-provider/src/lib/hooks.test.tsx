import { ReactNode } from 'react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';

import { LinkAddress, NewOrder } from '@monerium/sdk';

import {
  useAddress,
  useAddresses,
  useAuth,
  useBalances,
  useLinkAddress,
  useOrder,
  useOrders,
  usePlaceOrder,
  useProfile,
  useProfiles,
  useTokens,
} from './hooks';
import { MoneriumProvider } from './provider';

const MS_DELAY = 150;

/**
 * Added a 150ms delay to consistently catch the isLoading state.
 */
jest.mock('@monerium/sdk', () => {
  const mockHook = (response: unknown) => {
    return jest
      .fn()
      .mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve(response), MS_DELAY)
          )
      );
  };
  const mockMoneriumClient = {
    // authorize: jest.fn().mockResolvedValue(true),
    getAccess: mockHook(true),
    disconnect: jest.fn(),
    getAuthContext: mockHook('mockedAuthContext'),
    getOrders: mockHook('mockedOrders'),
    getOrder: mockHook('mockedOrder'),
    getProfile: mockHook('mockedProfile'),
    getProfiles: mockHook({ profiles: ['mockedProfiles'] }),
    getTokens: mockHook('mockedTokens'),
    getAddress: mockHook('mockedAddress'),
    getAddresses: mockHook({ addresses: ['mockedAddresses'] }),
    getBalances: mockHook('mockedBalances'),
    placeOrder: mockHook('mockedPlacedOrder'),
    linkAddress: mockHook('mockedLinkedAddress'),
  };

  return {
    MoneriumClient: jest.fn(() => mockMoneriumClient),
    MoneriumContext: jest.fn(() => null),
  };
});

const Providers = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <MoneriumProvider clientId="testClient" redirectUri="testRedirectUri">
        {children}
      </MoneriumProvider>
    </QueryClientProvider>
  );
};

const wrapper = ({ children }: { children: ReactNode }) => (
  <Providers>{children}</Providers>
);

describe('useAuth', () => {
  test('returns the auth', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.isAuthorized).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });
  });

  test('throws an error when used outside a MoneriumProvider', async () => {
    let error = null;
    renderHook(() => {
      try {
        useAuth();
      } catch (e) {
        error = e;
      }
    });
    expect(error).toBeDefined();
    expect((error as unknown as Error).message).toEqual(
      'useAuth must be used within a MoneriumProvider'
    );
  });
});

describe('useOrder', () => {
  test('returns the order', async () => {
    const { result } = renderHook(() => useOrder({ orderId: '1234' }), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.order).toBe('mockedOrder');
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });
  });
  test('throws an error when trying to skip orderId', async () => {
    let error = null;
    renderHook(
      () => {
        try {
          (useOrder as any)();
        } catch (e) {
          error = e;
        }
      },
      {
        wrapper,
      }
    );
    expect((error as unknown as Error).message).toEqual(
      "Cannot destructure property 'orderId' of 'undefined' as it is undefined."
    );
  });
});
describe('useOrders', () => {
  test('returns the orders', async () => {
    const { result } = renderHook(() => useOrders(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.orders).toBe('mockedOrders');
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });
  });
});
describe('useProfile', () => {
  test('returns the profile', async () => {
    const { result } = renderHook(() => useProfile({ profile: '1234' }), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.profile).toBe('mockedProfile');
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });
  });
});
describe('useProfiles', () => {
  test('returns profiles', async () => {
    const { result } = renderHook(() => useProfiles(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.profiles?.[0]).toBe('mockedProfiles');
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });
  });
});
describe('useTokens', () => {
  test('returns the profile', async () => {
    const { result } = renderHook(() => useTokens(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.tokens).toBe('mockedTokens');
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });
  });
});
describe('useAddress', () => {
  test('returns the address info', async () => {
    const { result } = renderHook(
      () => useAddress({ address: 'mockedAddress' }),
      {
        wrapper,
      }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.address).toBe('mockedAddress');
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });
  });
});
describe('useAddresses', () => {
  test('returns the addresses info', async () => {
    const { result } = renderHook(() => useAddresses(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.addresses?.[0]).toBe('mockedAddresses');
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });
  });
});
describe('useBalances', () => {
  test('returns the profile', async () => {
    const { result } = renderHook(
      () => useBalances({ profile: 'testProfileId' }),
      {
        wrapper,
      }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.balances).toBe('mockedBalances');
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });
  });
});

describe('usePlaceOrder', () => {
  test('places order', async () => {
    const { result } = renderHook(() => usePlaceOrder(), {
      wrapper,
    });
    const { result: authResult } = renderHook(() => useAuth(), {
      wrapper,
    });
    await waitFor(() => {
      expect(authResult.current.isAuthorized).toBe(true);
    });

    result.current.placeOrder({} as NewOrder);

    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
      expect(result.current.isSuccess).toBe(false);
    });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.isPending).toBe(false);
      expect(result.current.data).toBe('mockedPlacedOrder');
    });
  });
});
describe('useLinkAddress', () => {
  test('links address', async () => {
    const { result } = renderHook(
      () => useLinkAddress({ profileId: 'profileId-12345' }),
      {
        wrapper,
      }
    );
    const { result: authResult } = renderHook(() => useAuth(), {
      wrapper,
    });
    await waitFor(() => {
      expect(authResult.current.isAuthorized).toBe(true);
    });

    result.current.linkAddress({} as LinkAddress);

    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
      expect(result.current.isSuccess).toBe(false);
    });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.isPending).toBe(false);
      expect(result.current.data).toBe('mockedLinkedAddress');
    });
  });
});
