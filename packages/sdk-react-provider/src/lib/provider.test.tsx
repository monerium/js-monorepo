import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// eslint-disable-next-line no-redeclare
import { screen } from '@testing-library/dom';
import { render, waitFor } from '@testing-library/react';

import { useAuth, useProfile } from './hooks';
import { MoneriumProvider } from './provider';

jest.mock('../../../sdk/dist', () => {
  const mockMoneriumClient = {
    authorize: jest.fn().mockResolvedValue(true),
    getAccess: jest.fn().mockResolvedValue(true),
    disconnect: jest.fn(),
    getAuthContext: jest
      .fn()
      .mockResolvedValue({ defaultProfile: 'defaultProfile' }),
    getProfile: jest.fn().mockResolvedValue({
      name: 'John Doe',
    }),
    getBalances: jest.fn().mockResolvedValue([
      /* mock balance data */
    ]),
    getOrders: jest.fn().mockResolvedValue([
      /* mock order data */
    ]),
    getTokens: jest.fn().mockResolvedValue([
      /* mock token data */
    ]),
    // mock other methods as needed
  };

  return {
    MoneriumClient: jest.fn(() => mockMoneriumClient),
    // mock other exports as needed
  };
});
// Mock Test Consumer Component
const TestConsumerComponent = () => {
  const {
    authorize,
    isAuthorized,
    // include other pieces of context you want to test
  } = useAuth();
  const { data: profile } = useProfile({ profile: 'testProfileId' });

  return (
    <div>
      <button onClick={() => authorize()}>Authorize</button>
      {isAuthorized && <p>Authorized!</p>}
      {profile && <p data-testid="profile">{profile.name}</p>}
      {/* You can add more elements for other context values */}
    </div>
  );
};

describe('MoneriumProvider', () => {
  test('provides context to consumer and allows function calls', async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <MoneriumProvider clientId="testClient" redirectUri="testRedirectUri">
          <TestConsumerComponent />
        </MoneriumProvider>
      </QueryClientProvider>
    );

    // Test initial state
    expect(screen.queryByText('Authorized!')).toBeNull();

    // Simulate button click to authorize
    screen.getByRole('button', { name: /authorize/i }).click();

    // Test if authorize function has been called
    await waitFor(() =>
      expect(screen.getByText('Authorized!')).toBeInTheDocument()
    );

    // Test if profile data is present
    await waitFor(() => {
      expect(screen.getByTestId('profile')).toBeInTheDocument();
      expect(screen.getByTestId('profile')).toHaveTextContent('John Doe');
    });
  });

  // Add more tests for other functions and state changes
});
