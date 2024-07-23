import { ReactNode, useCallback, useEffect, useState } from 'react';

import { MoneriumClient } from '@monerium/sdk';

import { MoneriumContext } from './context';

/**
 * Place this provider at the root of your application.
 * @group Provider
 * @param params
 * @param params.children - Rest of the application.
 * @param params.clientId - Monerium auth flow client id.
 * @param params.redirectUrl - Monerium auth flow redirect url.
 * @param params.environment - Monerium environment.
 * @returns
 */
export const MoneriumProvider = ({
  children,
  clientId = 'f99e629b-6dca-11ee-8aa6-5273f65ed05b',
  redirectUrl = 'http://localhost:5173',
  environment = 'sandbox',
}: {
  children: ReactNode;
  clientId?: string;
  redirectUrl?: string;
  environment?: 'sandbox' | 'production';
}) => {
  const [sdk, setSdk] = useState<MoneriumClient>();
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [error, setError] = useState<Error | unknown | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Initialize the SDK
  useEffect(() => {
    const sdkInstance = new MoneriumClient({
      environment: environment,
      clientId,
      redirectUrl,
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

  const authorize = useCallback(async () => {
    try {
      if (sdk) {
        await sdk.authorize();
      }
    } catch (err) {
      console.error('Error during authorization:', err);
      setError(err);
    }
  }, [sdk]);

  return (
    <MoneriumContext.Provider
      value={{
        sdk,
        authorize,
        isAuthorized,
        isLoading: loadingAuth,
        error,
      }}
    >
      {children}
    </MoneriumContext.Provider>
  );
};
