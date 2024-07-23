import { ReactNode } from 'react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// eslint-disable-next-line no-redeclare
import {
  act,
  render,
  renderHook,
  screen,
  waitFor,
} from '@testing-library/react';

import { useAuth, useAuthContext, useOrders } from './hooks';
import { MoneriumProvider } from './provider';

// import { useMonerium } from './hooks';
// import { MoneriumProvider } from './provider';

const MS_DELAY = 150;
/**
 * Added a 150ms delay to consistently catch the isLoading state.
 */
jest.mock('@monerium/sdk', () => {
  const mockMoneriumClient = {
    authorize: jest.fn().mockResolvedValue(true),
    getAccess: jest
      .fn()
      .mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(true), 150))
      ),
    disconnect: jest.fn(),

    getAuthContext: jest
      .fn()
      .mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve('mockedAuthContext'), 150)
          )
      ),
    getOrders: jest
      .fn()
      .mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve('mockedOrders'), 150)
          )
      ),
  };

  return {
    MoneriumClient: jest.fn(() => mockMoneriumClient),
    MoneriumContext: jest.fn(() => null),
  };
});

// const renderWithProvider = (component: React.ReactNode) => {
//   const queryClient = new QueryClient();
//   return render(
//     <MoneriumProvider>
//       <QueryClientProvider client={queryClient}>
//         {component}
//       </QueryClientProvider>
//     </MoneriumProvider>
//   );
// };
const Providers = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return (
    <MoneriumProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MoneriumProvider>
  );
};

// const UseAuth = () => {
//   const context = useAuth();

//   return (
//     <div>
//       <p data-testid="context">{JSON.stringify(context)}</p>
//     </div>
//   );
// };
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
    // Suppress console error for this test
    const consoleError = console.error;
    console.error = jest.fn();

    let error = null;
    try {
      renderHook(() => useAuth());
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect((error as Error)?.message).toMatch(
      'useAuth must be used within a MoneriumProvider'
    );

    // Restore console error
    console.error = consoleError;
  });
});

describe('useAuthContext', () => {
  test('returns the auth context', async () => {
    const { result } = renderHook(() => useAuthContext(), {
      wrapper,
    });

    console.log('result', result.current);
    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.authContext).toBe('mockedAuthContext');
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });
  });
});
describe('useOrders', () => {
  test('returns the auth context', async () => {
    const { result } = renderHook(() => useOrders(), {
      wrapper,
    });

    console.log('result', result.current);
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
