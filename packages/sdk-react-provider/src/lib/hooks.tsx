import { useContext } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/** @namespace */
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

// Query keys
const keys = {
  getAuthContext: ['monerium-auth-context'],
  getProfile: ['monerium-profile'],
  getBalances: ['monerium-balances'],
  getTokens: ['monerium-tokens'],
  getOrders: (filter?: unknown) =>
    filter ? ['monerium-orders', filter] : ['monerium-orders'],
  placeOrder: ['monerium-place-order'],
  linkAddress: ['monerium-link-address'],
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
 * ```
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
  };
}

export type Test = {
  query?: QueryOptions<unknown>;
};
/**
 * Testesss
 * @param {Test} params No required parameters.
 * @param {QueryOptions<unknown>} params.query No required parameters.
 */
export function test({
  /**
   * test
   */
  query,
}: Test) {
  return null;
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
 * [AuthContext interface](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/docs/generated/interfaces/AuthContext.md)
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
    enabled: !!sdk && isAuthorized && (query?.enabled ?? true),
  });
  return {
    authContext: data,
    ...rest,
  };
}
/**
 * # Get profile
 * @group Hooks
 * @param {Object} [params] No required parameters.
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
 * [Profile interface](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/docs/generated/interfaces/Profile.md)
 */
export function useProfile({
  query,
}: {
  query?: QueryOptions<Profile>;
} = {}): QueryResult<'profile', Profile> {
  const { isAuthorized } = useAuth();
  const sdk = useSdk();
  const { authContext } = useAuthContext();

  const { data, ...rest } = useQuery({
    ...query,
    queryKey: keys.getProfile,
    queryFn: async () => {
      if (!sdk) {
        throw new Error('No SDK instance available');
      }
      if (!isAuthorized) {
        throw new Error('User not authorized');
      }
      if (!authContext) {
        throw new Error('Auth context is not available');
      }
      return sdk.getProfile(authContext.defaultProfile);
    },
    enabled: !!sdk && isAuthorized && !!authContext && (query?.enabled ?? true),
  });
  return {
    profile: data,
    ...rest,
  };
}

/**
 * TODO useProfiles
 *
 * TODO change useProfile to accept profileId
 */

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
 * [Token interface](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/docs/generated/interfaces/Token.md)
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
    enabled: !!sdk && isAuthorized && (query?.enabled ?? true),
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
 * [Balances interface](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/docs/generated/interfaces/Balances.md)
 */
export function useBalances({
  query,
}: {
  query?: QueryOptions<Balances[]>;
} = {}): QueryResult<'balances', Balances[]> {
  const sdk = useSdk();
  const { isAuthorized } = useAuth();

  const { data, ...rest } = useQuery({
    ...query,
    queryKey: keys.getBalances,
    queryFn: async () => {
      if (!sdk) {
        throw new Error('No SDK instance available');
      }
      if (!isAuthorized) {
        throw new Error('User not authorized');
      }
      return sdk.getBalances();
    },
    enabled: !!sdk && isAuthorized && (query?.enabled ?? true),
  });
  return {
    balances: data,
    ...rest,
  };
}

/**
 * TODO: useOrder
 */

type UseOrdersParameters = {
  orderId?: string;
  address?: string;
  txHash?: string;
  profile?: string;
  memo?: string;
  state?: OrderState;
};

/**
 * # Get orders
 * @group Hooks
 * @param {Object} [params] No required parameters.
 * @param {QueryOptions<Balances[]>} [params.query] {@inheritDoc QueryOptions}
 * TODO FILTERS

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
 * [Order interface](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/docs/generated/interfaces/Order.md)
 */
export function useOrders({
  query = {},
  ...parameters
}: UseOrdersParameters & {
  // TODO: destruct filters when I move orderId out to useOrder
  query?: QueryOptions<Order | Order[]>;
} = {}): QueryResult<'orders', Order | Order[]> {
  const { orderId, ...filters } = parameters;
  const sdk = useSdk();
  const { isAuthorized } = useAuth();
  const { data, ...rest } = useQuery({
    ...query,
    queryKey: keys.getOrders(parameters),
    queryFn: async () => {
      if (!sdk) {
        throw new Error('No SDK instance available');
      }
      if (!isAuthorized) {
        throw new Error('User not authorized');
      }

      if (orderId) {
        return sdk.getOrder(orderId);
      }
      return sdk.getOrders(filters);
    },
    enabled: !!sdk && isAuthorized && (query.enabled ?? true),
  });
  return {
    orders: data,
    ...rest,
  };
}

/**
 * # Place an order.
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
 * [NewOrder type](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/docs/generated/type-aliases/NewOrder.md)
 */

export function usePlaceOrder({
  supportingDocument,
  mutation,
}: {
  supportingDocument?: File;
  mutation?: MutationOptions<Order, Error, NewOrder>;
}): MutationResult<'placeOrder', Order, Error, NewOrder> {
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
 * [LinkAddress interface](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/docs/generated/interfaces/LinkAddress.md)
 */
export function useLinkAddress({
  profileId,
  // TODO: add missing parameters
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
        queryKey: keys.getProfile,
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
