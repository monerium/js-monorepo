import { ReactNode, useCallback, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { MoneriumClient } from '@monerium/sdk';

import { MoneriumContext } from './context';
import { AuthorizeParams } from './types';

/**
 * Place this provider at the root of your application.
 * @group Provider
 * @param params
 * @param params.children - Rest of the application.
 * @param params.clientId - Monerium auth flow client id.
 * @param params.redirectUri - Monerium auth flow redirect url.
 * @param params.environment - Monerium environment.
 * @returns
 */
export const MoneriumProvider = ({
  children,
  clientId,
  redirectUrl,
  redirectUri,
  environment = 'sandbox',
}: {
  children: ReactNode;
  clientId: string;
  redirectUri: string;
  /** @deprecated use redirectUri */
  redirectUrl?: string;
  environment?: 'sandbox' | 'production';
}) => {
  const queryClient = useQueryClient();

  const [sdk, setSdk] = useState<MoneriumClient>();
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [error, setError] = useState<Error | unknown | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Initialize the SDK
  useEffect(() => {
    const sdkInstance = new MoneriumClient({
      environment: environment,
      clientId,
      redirectUri: redirectUri,
    });
    setSdk(sdkInstance);
  }, []);

  useEffect(() => {
    const connect = async () => {
      if (sdk) {
        try {
          setIsAuthorized(await sdk.getAccess());
        } catch (error) {
          console.error('Failed to get access:', error);
        } finally {
          setLoadingAuth(false);
        }
      }
    };

    connect();

    return () => {
      if (sdk) {
        sdk.disconnect();
      }
    };
  }, [sdk]);

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
