import { ReactNode, useCallback, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { MoneriumClient } from '@monerium/sdk';

import { MoneriumContext } from './context';
import { AuthorizeParams } from './types';

/**
 * Wrap your application with the Monerium provider.
 * @group Provider
 * @param params
 * @param params.children - Rest of the application.
 * @param params.clientId - Monerium auth flow client id.
 * @param params.redirectUri - Monerium auth flow redirect url.
 * @param params.environment - Monerium environment.
 * @param params.onRefreshTokenUpdate - Callback that is called when the refresh token is updated. Store it securely.
 * @param params.refreshToken - Provide the securely stored refresh token to reconnect.
 * @param params.debug - Enable debug mode.
 * @returns
 */
export const MoneriumProvider = ({
  children,
  clientId,
  redirectUri,
  environment = 'sandbox',
  refreshToken,
  onRefreshTokenUpdate,
  debug = false,
}: {
  children: ReactNode;
  clientId: string;
  redirectUri: string;
  /** @deprecated use redirectUri */
  redirectUrl?: string;
  environment?: 'sandbox' | 'production';
  refreshToken?: string;
  onRefreshTokenUpdate?: (token: string) => void;
  debug?: boolean;
}) => {
  const queryClient = useQueryClient();

  const [sdk] = useState(() => {
    // Initialize the SDK
    return new MoneriumClient({
      environment,
      clientId,
      redirectUri,
      debug: debug,
    });
  });

  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [error, setError] = useState<Error | unknown | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const connect = async () => {
      if (sdk) {
        try {
          setIsAuthorized(await sdk.getAccess());
        } catch (error) {
          console.error('Failed to get access:', error);
        } finally {
          setLoadingAuth(false);
          if (sdk?.bearerProfile) {
            onRefreshTokenUpdate?.(sdk.bearerProfile.refresh_token);
          }
        }
      }
    };

    connect();

    return () => {
      if (sdk) {
        sdk.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    const reconnect = async () => {
      if (sdk) {
        try {
          setIsAuthorized(await sdk.getAccess(refreshToken));
        } catch (error) {
          console.error('Failed to get access:', error);
        } finally {
          if (sdk?.bearerProfile) {
            onRefreshTokenUpdate?.(sdk.bearerProfile.refresh_token);
          }
        }
      }
    };
    if (refreshToken && !isAuthorized && !loadingAuth) {
      reconnect();
    }
  }, [refreshToken]);

  const authorize = useCallback(
    async (params?: AuthorizeParams) => {
      try {
        if (sdk) {
          await sdk.authorize(params);
        }
      } catch (err) {
        console.error('Error during authorization:', err);
        setError(err);
      }
    },
    [sdk]
  );

  const revokeAccess = async () => {
    try {
      if (sdk) {
        await sdk.revokeAccess();
      }
    } catch (err) {
      console.error('Error during revoking access:', err);
      setError(err);
    } finally {
      queryClient.clear();
      setIsAuthorized(false);
    }
  };

  return (
    <MoneriumContext.Provider
      value={{
        sdk,
        authorize,
        isAuthorized,
        isLoading: loadingAuth,
        error,
        disconnect: async () => sdk?.disconnect(),
        revokeAccess: async () => revokeAccess(),
      }}
    >
      {children}
    </MoneriumContext.Provider>
  );
};
