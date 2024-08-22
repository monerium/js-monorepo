import { useContext } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import MoneriumClient, {
  AuthContext,
  Balances,
  LinkAddress,
  LinkedAddress,
  NewOrder,
  Order,
  OrderState,
  Profile,
  Token,
} from '@monerium/sdk';

import { MoneriumContext } from './context';
import {
  MutationOptions,
  MutationResult,
  QueryOptions,
  QueryResult,
  UseAuthReturn,
} from './types';

/**
 * @internal
 * Query keys
 * */
export const keys = {
  getAll: ['monerium'],
  getAuthContext: ['monerium', 'auth-context'],
  getProfile: (profileId: string) => [
    'monerium',
    'profile',
    ...(profileId ? [profileId] : []),
  ],
  getProfiles: ['monerium', 'profiles'],
  getBalances: (profileId?: string) => [
    'monerium',
    'balances',
    ...(profileId ? [profileId] : []),
  ],
  getTokens: ['monerium', 'tokens'],
  getOrder: (orderId: string) => ['monerium', 'order', orderId],
  getOrders: (filter?: unknown) => [
    'monerium',
    'orders',
    ...(filter ? [filter] : []),
  ],
  placeOrder: ['monerium', 'place-order'],
  linkAddress: ['monerium', 'link-address'],
};

/** Internal hook to use SDK */
function useSdk(): MoneriumClient | undefined {
  const context = useContext(MoneriumContext);

  if (context === null) {
    throw new Error('useSdk must be used within a MoneriumProvider');
  }
  return context?.sdk;
}

/**
 * # Redirect to the Monerium auth flow.
 * @group Hooks
 * @example
 * ```ts
 * const { authorize, isAuthorized, isLoading, error } = useAuth();
 *
 * authorize(); // Redirects to the Monerium auth flow.
 *
 * // To opt-in to automated wallet linking, pass the address, signature and chain.
 * authorize({ address, signature, chain }).
 * ```
 *
 * @returns {UseAuthReturn}
 * - `authorize`  - Redirects to the Monerium auth flow.
 * - `isAuthorized` - Whether the user is authorized.
 * - `isLoading` - Whether the auth flow is loading.
 * - `error` - Error message if the auth flow fails.
 * - `disconnect` - Disconnect the user.
 * - `revokeAccess` - Revoke the user's access.
 */
export function useAuth(): UseAuthReturn {
  const context = useContext(MoneriumContext);

  if (context === null) {
    throw new Error('useAuth must be used within a MoneriumProvider');
  }
  return {
    isAuthorized: context.isAuthorized,
    authorize: context.authorize,
    isLoading: context.isLoading,
    error: context.error,
    disconnect: context.disconnect,
    revokeAccess: context.revokeAccess,
  };
}

/**
 * # Get the authentication context.
 * @group Hooks
 *
 * @param {Object} [params] No required parameters.
 * @param {QueryOptions<AuthContext>} [params.query] {@inheritDoc QueryOptions}
 *
 * @example
 * ```ts
 * const {
 *    authContext, // useQuery's `data` property
 *    isLoading,
 *    isError,
 *    error,
 *    refetch,
 *    ...moreUseQueryResults
 * } = useAuthContext();
 * ```
 *
 * @see
 * [API Documentation](https://monerium.dev/api-docs#operation/auth-context)
 *
 * [AuthContext interface](/docs/tools/SDK/interfaces/AuthContext.md)
 */
export function useAuthContext({
  query,
}: {
  query?: QueryOptions<AuthContext>;
} = {}): QueryResult<'authContext', AuthContext> {
  const { isAuthorized } = useAuth();
  const sdk = useSdk();

  const { data, ...rest } = useQuery({
    ...query,
    queryKey: keys.getAuthContext,
    queryFn: async () => {
      if (!sdk) {
        throw new Error('No SDK instance available');
      }
      if (!isAuthorized) {
        throw new Error('User not authorized');
      }
      return sdk.getAuthContext();
    },
    enabled: Boolean(sdk && isAuthorized && (query?.enabled ?? true)),
  });
  return {
    authContext: data,
    ...rest,
  };
}

/**
 * # Get single profile
 * If no `profileId` is provided, the default profile is used.
 * @group Hooks
 * @param {Object} params
 * @param {string} [params.profileId] The id of the profile.
 * @param {QueryOptions<Profile>} [params.query] {@inheritDoc QueryOptions}
 *
 * @example
 * ```ts
 * const {
 *    profile, // useQuery's `data` property
 *    isLoading,
 *    isError,
 *    error,
 *    refetch,
 *    ...moreUseQueryResults
 * } = useProfile();
 * ```

 * @see
 * [API Documentation](https://monerium.dev/api-docs#operation/profile)
 *
 * [Profile interface](/docs/tools/SDK/interfaces/Profile.md)
 */
export function useProfile({
  profileId,
  query,
}: {
  profileId?: string;
  query?: QueryOptions<Profile>;
} = {}): QueryResult<'profile', Profile> {
  const { isAuthorized } = useAuth();
  const sdk = useSdk();
  const { authContext } = useAuthContext();

  const profileIdToUse = profileId || (authContext?.defaultProfile as string);

  const { data, ...rest } = useQuery({
    ...query,
    queryKey: keys.getProfile(profileIdToUse),
    queryFn: async () => {
      if (!sdk) {
        throw new Error('No SDK instance available');
      }
      if (!isAuthorized) {
        throw new Error('User not authorized');
      }
      if (!profileIdToUse) {
        throw new Error('Profile Id is required');
      }

      return sdk.getProfile(profileIdToUse);
    },
    enabled: Boolean(
      sdk && isAuthorized && profileIdToUse && (query?.enabled ?? true)
    ),
  });
  return {
    profile: data,
    ...rest,
  };
}
/**
 * # Get profiles
 * @group Hooks
 * @param {Object} [params] No required parameters.
 * @param {QueryOptions<Profile[]>} [params.query] {@inheritDoc QueryOptions}
 *
 * @example
 * ```ts
 * const {
 *    profiles, // useQuery's `data` property
 *    isLoading,
 *    isError,
 *    error,
 *    refetch,
 *    ...moreUseQueryResults
 * } = useProfiles();
 * ```

 * @see
 * [API Documentation](https://monerium.dev/api-docs#operation/profiles)
 *
 * [Profile interface](/docs/tools/SDK/interfaces/Profile.md)
 */
export function useProfiles({
  query,
}: {
  query?: QueryOptions<Profile[]>;
} = {}): QueryResult<'profiles', Profile[]> {
  const { isAuthorized } = useAuth();
  const sdk = useSdk();

  const { data, ...rest } = useQuery({
    ...query,
    queryKey: keys.getProfiles,
    queryFn: async () => {
      if (!sdk) {
        throw new Error('No SDK instance available');
      }
      if (!isAuthorized) {
        throw new Error('User not authorized');
      }
      return sdk.getProfiles();
    },
    enabled: Boolean(sdk && isAuthorized && (query?.enabled ?? true)),
  });
  return {
    profiles: data,
    ...rest,
  };
}
/**
 * # Get tokens
 * @group Hooks
 * @param {Object} [params] No required parameters.
 * @param {QueryOptions<Token[]>} [params.query] {@inheritDoc QueryOptions}
 *
 * @example
 * ```ts
 * const {
 *    tokens, // useQuery's `data` property
 *    isLoading,
 *    isError,
 *    error,
 *    refetch,
 *    ...moreUseQueryResults
 * } = useTokens();
 * ```

 * @see
 * [API Documentation](https://monerium.dev/api-docs#operation/tokens)
 *
 * [Token interface](/docs/tools/SDK/interfaces/Token.md)
 */
export function useTokens({
  query,
}: { query?: QueryOptions<Token[]> } = {}): QueryResult<'tokens', Token[]> {
  const sdk = useSdk();
  const { isAuthorized } = useAuth();
  const { data, ...rest } = useQuery({
    ...query,
    queryKey: keys.getTokens,
    queryFn: async () => {
      if (!sdk) {
        throw new Error('No SDK instance available');
      }
      if (!isAuthorized) {
        throw new Error('User not authorized');
      }
      return sdk.getTokens();
    },
    enabled: Boolean(sdk && isAuthorized && (query?.enabled ?? true)),
  });
  return {
    tokens: data,
    ...rest,
  };
}

/**
 * # Get balances
 * @group Hooks
 * @param {Object} [params] No required parameters.
 * @param {QueryOptions<Balances[]>} [params.profileId] Fetch balances for a specific profile.
 * @param {QueryOptions<Balances[]>} [params.query] {@inheritDoc QueryOptions}

 * @example
 * ```ts
 * const {
 *    balances, // useQuery's `data` property
 *    isLoading,
 *    isError,
 *    error,
 *    refetch,
 *    ...moreUseQueryResults
 * } = useBalances();
 * ```
 * @see
 * [API Documentation](https://monerium.dev/api-docs#operation/profile-balances)
 *
 * [Balances interface](/docs/tools/SDK/interfaces/Balances.md)
 */
export function useBalances({
  profileId,
  query,
}: {
  profileId?: string;
  query?: QueryOptions<Balances[]>;
} = {}): QueryResult<'balances', Balances[]> {
  const sdk = useSdk();
  const { isAuthorized } = useAuth();

  const { data, ...rest } = useQuery({
    ...query,
    queryKey: keys.getBalances(profileId),
    queryFn: async () => {
      if (!sdk) {
        throw new Error('No SDK instance available');
      }
      if (!isAuthorized) {
        throw new Error('User not authorized');
      }
      return sdk.getBalances(profileId);
    },
    enabled: Boolean(sdk && isAuthorized && (query?.enabled ?? true)),
  });
  return {
    balances: data,
    ...rest,
  };
}

/**
 * # Get single order
 * @group Hooks
 * @param {Object} params
 * @param {Object} params.orderId The id of the order.
 * @param {QueryOptions<Order>} [params.query] {@inheritDoc QueryOptions}
 * @example
 * ```ts
 * const {
 *    order, // useQuery's `data` property
 *    isLoading,
 *    isError,
 *    error,
 *    refetch,
 *    ...moreUseQueryResults
 * } = useOrder();
 * ```
 * @see
 * [API Documentation](https://monerium.dev/api-docs#operation/order)
 *
 * [Order interface](/docs/tools/SDK/interfaces/Order.md)
 */
export function useOrder({
  orderId,
  query = {},
}: {
  orderId: string;
  query?: QueryOptions<Order>;
}): QueryResult<'order', Order> {
  const sdk = useSdk();
  const { isAuthorized } = useAuth();
  const { data, ...rest } = useQuery({
    ...query,
    queryKey: keys.getOrder(orderId),
    queryFn: async () => {
      if (!sdk) {
        throw new Error('No SDK instance available');
      }
      if (!isAuthorized) {
        throw new Error('User not authorized');
      }
      if (!orderId) {
        throw new Error('Order id is required');
      }

      return sdk.getOrder(orderId);
    },
    enabled: Boolean(sdk && isAuthorized && orderId && (query.enabled ?? true)),
  });
  return {
    order: data,
    ...rest,
  };
}

/**
 * # Get orders
 * @group Hooks
 * @param {Object} [params] No required parameters.
 * @param {Object} [params.address] Filter based on the blockchain address associated with the order.
 * @param {Object} [params.memo] Filter by the payment memo/reference..
 * @param {Object} [params.profile] Filter based on the profile ID associated with the order.
 * @param {Object} [params.state] Filter based on the state of the order.
 * @param {Object} [params.txHash] Filter based on the blockchain transaction hash.
 * @param {QueryOptions<Order[]>} [params.query] {@inheritDoc QueryOptions}
 *
 * @example
 * ```ts
 * const {
 *    orders, // useQuery's `data` property
 *    isLoading,
 *    isError,
 *    error,
 *    refetch,
 *    ...moreUseQueryResults
 * } = useOrders();
 * ```
 * @see
 * [API Documentation](https://monerium.dev/api-docs#operation/orders)
 *
 * [Order interface](/docs/tools/SDK/interfaces/Order.md)
 */
export function useOrders({
  query = {},
  ...filters
}: {
  query?: QueryOptions<Order[]>;
  address?: string;
  txHash?: string;
  profile?: string;
  memo?: string;
  state?: OrderState;
} = {}): QueryResult<'orders', Order[]> {
  const sdk = useSdk();
  const { isAuthorized } = useAuth();
  const { data, ...rest } = useQuery({
    ...query,
    queryKey: keys.getOrders(filters),
    queryFn: async () => {
      if (!sdk) {
        throw new Error('No SDK instance available');
      }
      if (!isAuthorized) {
        throw new Error('User not authorized');
      }

      return sdk.getOrders(filters);
    },
    enabled: Boolean(sdk && isAuthorized && (query.enabled ?? true)),
  });
  return {
    orders: data,
    ...rest,
  };
}

/**
 * # Place an order.
 * When the order has been placed, the orders query will be invalidated and re-fetched.
 *
 * If the order amount is above 15000, a supporting document is required.
 * @group Hooks
 * @param param
 * @param {File} param.supportingDocument Supporting document file.
 * @param {Object} param.mutation {@inheritDoc MutationOptions}
 *
 * @example
 * ```ts
 * const {
 *    placeOrder, // useMutation's `mutateAsync` property
 *    isPending,
 *    isError,
 *    error,
 *    status,
 *    ...moreUseMutationResults
 * } = usePlaceOrder();
 * ```
 * @see
 * [API Documentation](https://monerium.dev/api-docs#operation/post-orders)
 *
 * [NewOrder type](/docs/tools/SDK/type-aliases/NewOrder.md)
 */

export function usePlaceOrder({
  supportingDocument,
  mutation,
}: {
  supportingDocument?: File;
  mutation?: MutationOptions<Order, Error, NewOrder>;
} = {}): MutationResult<'placeOrder', Order, Error, NewOrder> {
  const sdk = useSdk();
  const { isAuthorized } = useAuth();
  const queryClient = useQueryClient();

  const { mutateAsync, ...rest } = useMutation({
    ...mutation,
    mutationKey: keys.placeOrder,
    mutationFn: async (body: NewOrder) => {
      if (!sdk) {
        throw new Error('No SDK instance available');
      }
      if (!isAuthorized) {
        throw new Error('User not authorized');
      }
      let documentId;
      if (parseInt(body.amount) > 15000) {
        if (!supportingDocument) {
          throw new Error(
            'Supporting document is required for orders above 15000'
          );
        }
        const uploadedDocument =
          await sdk.uploadSupportingDocument(supportingDocument);
        documentId = uploadedDocument.id;
      }

      const newBody = {
        ...body,
        documentId: documentId,
      };

      return sdk.placeOrder(newBody);
    },
    onSuccess(data, variables, context) {
      // Refetch all orders on success.
      queryClient.invalidateQueries({
        queryKey: keys.getOrders(),
      });
      // Allow the caller to add custom logic on success.
      mutation?.onSuccess?.(data, variables, context);
    },
    onError(error, vars, context) {
      // Allow the caller to add custom logic on error.
      mutation?.onError?.(error, vars, context);
      throw error;
    },
  });
  return {
    placeOrder: mutateAsync,
    ...rest,
  };
}
/**
 * # Add address to profile.
 * When the address has been linked, the relevant profile query will be invalidated and re-fetched.
 *
 * @group Hooks
 * @param param
 * @param {File} param.profileId Which profile to link the address.
 * @param {Object} param.mutation {@inheritDoc MutationOptions}
 *
 * @example
 * ```ts
 * const {
 *    linkAddress, // useMutation's `mutateAsync` property
 *    isPending,
 *    isError,
 *    error,
 *    status,
 *    ...moreUseMutationResults
 * } = useLinkAddress();
 * ```
 * @see
 * [API Documentation](https://monerium.dev/api-docs#operation/profile-addresses)
 *
 * [LinkAddress interface](/docs/tools/SDK/interfaces/LinkAddress.md)
 */
export function useLinkAddress({
  profileId,
  mutation,
}: {
  profileId: string;
  mutation?: MutationOptions<LinkedAddress, Error, LinkAddress>;
}): MutationResult<'linkAddress', LinkedAddress, Error, LinkAddress> {
  const sdk = useSdk();
  const { isAuthorized } = useAuth();
  const queryClient = useQueryClient();

  const { mutateAsync, ...rest } = useMutation({
    ...mutation,
    mutationKey: keys.linkAddress,
    mutationFn: async (body: LinkAddress) => {
      if (!sdk) {
        throw new Error('No SDK instance available');
      }
      if (!isAuthorized) {
        throw new Error('User not authorized');
      }
      return sdk.linkAddress(profileId, body);
    },
    onSuccess(data, variables, context) {
      // Refetch all orders on success.
      queryClient.invalidateQueries({
        queryKey: keys.getProfile(profileId),
      });
      // Allow the caller to add custom logic on success.
      mutation?.onSuccess?.(data, variables, context);
    },
    onError(error, vars, context) {
      // Allow the caller to add custom logic on error.
      mutation?.onError?.(error, vars, context);
      throw error;
    },
  });
  return {
    linkAddress: mutateAsync,
    ...rest,
  };
}
