import { useContext } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import MoneriumClient, {
  Address,
  Balances,
  Chain,
  ChainId,
  IBAN,
  LinkAddress,
  MoveIbanPayload,
  NewOrder,
  Order,
  OrderState,
  Profile,
  ProfilePermissions,
  RequestIbanPayload,
  ResponseStatus,
  SubmitProfileDetailsPayload,
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
  getProfile: (profileId: string) => [
    'monerium',
    'profile',
    ...(profileId ? [profileId] : []),
  ],
  getProfiles: ['monerium', 'profiles'],
  getAddress: (address: string) => ['monerium', 'address', [address]],
  getAddresses: (filter?: unknown) => [
    'monerium',
    'addresses',
    ...(filter ? [filter] : []),
  ],
  getBalances: (profileId?: string) => [
    'monerium',
    'balances',
    ...(profileId ? [profileId] : []),
  ],
  getIban: (iban: string) => ['monerium', 'iban', iban],
  getIbans: (filter?: unknown) => [
    'monerium',
    'ibans',
    ...(filter ? [filter] : []),
  ],
  getTokens: ['monerium', 'tokens'],
  getOrder: (orderId: string) => ['monerium', 'order', orderId],
  getOrders: (filter?: unknown) => [
    'monerium',
    'orders',
    ...(filter ? [filter] : []),
  ],
  submitProfileDetails: ['monerium', 'submit-profile-details'],
  moveIban: ['monerium', 'move-iban'],
  requestIban: ['monerium', 'request-iban'],
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
 * @category Authentication
 * @example
 * ```ts
 * const { authorize, isAuthorized, isLoading, error } = useAuth();
 *
 * authorize(); // Redirects to the Monerium auth flow.
 *
 * // Opt-in to automated wallet linking with these parameters.
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
 * # Get single profile
 * If no `profileId` is provided, the default profile is used.
 * @group Hooks
 * @category Profiles
 * @param {Object} params
 * @param {string} [params.profile] The id of the profile.
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
 * [Profile interface](/docs/packages/sdk/interfaces/Profile.md)
 */
export function useProfile({
  profile,
  query,
}: {
  profile?: string;
  query?: QueryOptions<Profile>;
} = {}): QueryResult<'profile', Profile> {
  const { isAuthorized } = useAuth();
  const sdk = useSdk();
  const { profiles } = useProfiles();

  const profileToUse = profile || (profiles?.[0]?.id as string);

  const { data, ...rest } = useQuery({
    ...query,
    queryKey: keys.getProfile(profileToUse),
    queryFn: async () => {
      if (!sdk) {
        throw new Error('No SDK instance available');
      }
      if (!isAuthorized) {
        throw new Error('User not authorized');
      }
      if (!profileToUse) {
        throw new Error('Profile Id is required');
      }

      return sdk.getProfile(profileToUse);
    },
    enabled: Boolean(
      sdk && isAuthorized && profileToUse && (query?.enabled ?? true)
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
 * @category Profiles
 *
 * @param {Object} [params] No required parameters.
 * @param {QueryOptions<ProfilesResponse>} [params.query] {@inheritDoc QueryOptions}
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
 * [Profile interface](/docs/packages/sdk/interfaces/Profile.md)
 */
export function useProfiles({
  query,
}: {
  query?: QueryOptions<ProfilePermissions[]>;
} = {}): QueryResult<'profiles', ProfilePermissions[]> {
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
      const { profiles } = await sdk.getProfiles();
      return profiles;
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
 * [Token interface](/docs/packages/sdk/interfaces/Token.md)
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
 * # Get address
 * @group Hooks
 * @category Addresses
 * @param {Object} params 
 * @param {QueryOptions<Address>} params.address Fetch a specific address.
 * @param {QueryOptions<Address>} [params.query] {@inheritDoc QueryOptions}

 * @example
 * ```ts
 * const {
 *    address, // useQuery's `data` property
 *    isLoading,
 *    isError,
 *    error,
 *    refetch,
 *    ...moreUseQueryResults
 * } = useAddress();
 * ```
 * @see
 * [API Documentation](https://monerium.dev/api-docs-v2#tag/addresses/operation/address)
 *
 * [Address interface](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/docs/generated/interfaces/Address.md)
 */
export function useAddress({
  address,
  query = {},
}: {
  address: string;
  query?: QueryOptions<Address>;
}): QueryResult<'address', Address> {
  const sdk = useSdk();
  const { isAuthorized } = useAuth();

  const { data, ...rest } = useQuery({
    ...query,
    queryKey: keys.getAddress(address),
    queryFn: async () => {
      if (!sdk) {
        throw new Error('No SDK instance available');
      }
      if (!isAuthorized) {
        throw new Error('User not authorized');
      }

      return sdk.getAddress(address);
    },
    enabled: Boolean(
      sdk && isAuthorized && address && (query?.enabled ?? true)
    ),
  });
  return {
    address: data,
    ...rest,
  };
}
/**
 * # Get addresses
 * @group Hooks
 * @category Addresses
 * @param {Object} [params] No required parameters.
 * @param {QueryOptions<Address[]>} [params.profile] Fetch addresses for a specific profile.
 * @param {QueryOptions<Address[]>} [params.chain] Fetch addresses for a specific chain.
 * @param {QueryOptions<Address[]>} [params.query] {@inheritDoc QueryOptions}

 * @example
 * ```ts
 * const {
 *    addresses, // useQuery's `data` property
 *    isLoading,
 *    isError,
 *    error,
 *    refetch,
 *    ...moreUseQueryResults
 * } = useAddresses();
 * ```
 * @see
 * [API Documentation](https://monerium.dev/api-docs-v2#tag/addresses/operation/addresses)
 *
 * [Address interface](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/docs/generated/interfaces/Address.md)
 */
export function useAddresses({
  profile,
  chain,
  query = {},
}: {
  profile?: string;
  chain?: Chain | ChainId;
  query?: QueryOptions<Address[]>;
} = {}): QueryResult<'addresses', Address[]> {
  const sdk = useSdk();
  const { isAuthorized } = useAuth();

  const { data, ...rest } = useQuery({
    ...query,
    queryKey: keys.getAddresses({ profile, chain }),
    queryFn: async () => {
      if (!sdk) {
        throw new Error('No SDK instance available');
      }
      if (!isAuthorized) {
        throw new Error('User not authorized');
      }

      const { addresses } = await sdk.getAddresses({ profile, chain });
      return addresses;
    },
    enabled: Boolean(sdk && isAuthorized && (query?.enabled ?? true)),
  });
  return {
    addresses: data,
    ...rest,
  };
}
/**
 * # Get balances
 * @group Hooks
 * @category Addresses
 * @param {Object} [params] No required parameters.
 * @param {QueryOptions<Balances[]>} [params.profile] Fetch balances for a specific profile.
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
 * [Balances interface](/docs/packages/sdk/interfaces/Balances.md)
 */
export function useBalances({
  profile,
  query,
}: {
  profile: string;
  query?: QueryOptions<Balances[]>;
}): QueryResult<'balances', Balances[]> {
  const sdk = useSdk();
  const { isAuthorized } = useAuth();

  const { data, ...rest } = useQuery({
    ...query,
    queryKey: keys.getBalances(profile),
    queryFn: async () => {
      if (!sdk) {
        throw new Error('No SDK instance available');
      }
      if (!isAuthorized) {
        throw new Error('User not authorized');
      }

      return sdk.getBalances(profile);
    },
    enabled: Boolean(
      sdk && isAuthorized && profile && (query?.enabled ?? true)
    ),
  });
  return {
    balances: data,
    ...rest,
  };
}

/**
 * # Get IBAN
 * @group Hooks
 * @category IBANs
 * @param {Object} params
 * @param {QueryOptions<IBAN>} params.iban Fetch a specific IBAN
 * @param {QueryOptions<IBAN>} [params.query] {@inheritDoc QueryOptions}

 * @example
 * ```ts
 * const {
 *    iban, // useQuery's `data` property
 *    isLoading,
 *    isError,
 *    error,
 *    refetch,
 *    ...moreUseQueryResults
 * } = useIBAN();
 * ```
 * @see
 * [API Documentation](https://monerium.dev/api-docs-v2#tag/ibans/operation/iban)
 *
 * [IBAN interface](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/docs/generated/interfaces/IBAN.md)
 */
export function useIBAN({
  iban,
  query,
}: {
  iban: string;
  query?: QueryOptions<IBAN>;
}): QueryResult<'iban', IBAN> {
  const sdk = useSdk();
  const { isAuthorized } = useAuth();

  const { data, ...rest } = useQuery({
    ...query,
    queryKey: keys.getIban(iban),
    queryFn: async () => {
      if (!sdk) {
        throw new Error('No SDK instance available');
      }
      if (!isAuthorized) {
        throw new Error('User not authorized');
      }

      return sdk.getIban(iban);
    },
    enabled: Boolean(sdk && isAuthorized && iban && (query?.enabled ?? true)),
  });

  return {
    iban: data,
    ...rest,
  };
}
/**
 * # Get IBANs
 * @group Hooks
 * @category IBANs
 * @param {Object} [params] No required parameters.
 * @param {QueryOptions<IBAN[]>} [params.profile] Fetch IBANs for a specific profile.
 * @param {QueryOptions<IBAN[]>} [params.chain] Fetch IBANs for a specific chain.
 * @param {QueryOptions<IBAN[]>} [params.query] {@inheritDoc QueryOptions}

 * @example
 * ```ts
 * const {
 *    ibans, // useQuery's `data` property
 *    isLoading,
 *    isError,
 *    error,
 *    refetch,
 *    ...moreUseQueryResults
 * } = useIBANs();
 * ```
 * @see
 * [API Documentation](https://monerium.dev/api-docs-v2#tag/ibans/operation/ibans)
 *
 * [IBAN interface](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/docs/generated/interfaces/IBAN.md)
 */
export function useIBANs({
  profile,
  chain,
  query = {},
}: {
  profile?: string;
  chain?: Chain | ChainId;
  query?: QueryOptions<IBAN[]>;
} = {}): QueryResult<'ibans', IBAN[]> {
  const sdk = useSdk();
  const { isAuthorized } = useAuth();

  const { data, ...rest } = useQuery({
    ...query,
    queryKey: keys.getIbans({ profile, chain }),
    queryFn: async () => {
      if (!sdk) {
        throw new Error('No SDK instance available');
      }
      if (!isAuthorized) {
        throw new Error('User not authorized');
      }

      const { ibans } = await sdk.getIbans({ profile, chain });
      return ibans;
    },
    enabled: Boolean(sdk && isAuthorized && (query?.enabled ?? true)),
  });

  return {
    ibans: data,
    ...rest,
  };
}

/**
 * # Get single order
 * @group Hooks
 * @category Orders
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
 * [Order interface](/docs/packages/sdk/interfaces/Order.md)
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
 * @category Orders
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
 * [Order interface](/docs/packages/sdk/interfaces/Order.md)
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
 * # Submit profile details.
 * Submit the required compliance information to onboard the customer.
 *
 * Note that you won't be able to change the profile "kind" from personal to corporate or vice versa once the profile has been approved.
 * @group Hooks
 * @category Profiles
 * @param param
 * @param {string} param.profile The id of the profile to submit to.
 * @param {Object} [param.mutation] {@inheritDoc MutationOptions}
 *
 * @example
 * ```ts
 * const {
 *    submitProfileDetails, // useMutation's `mutateAsync` property
 *    isPending,
 *    isError,
 *    error,
 *    status,
 *    ...moreUseMutationResults
 * } = useSubmitProfileDetails();
 * ```
 * @see
 * [API Documentation](https://monerium.dev/api-docs-v2#tag/profiles/operation/profile-details)
 *
 * [SubmitProfileDetailsPayload type](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/docs/generated/type-aliases/SubmitProfileDetailsPayload.md)
 */

export function useSubmitProfileDetails({
  profile,
  mutation = {},
}: {
  profile: string;
  mutation?: MutationOptions<
    ResponseStatus,
    Error,
    SubmitProfileDetailsPayload
  >;
}): MutationResult<
  'submitProfileDetails',
  ResponseStatus,
  Error,
  SubmitProfileDetailsPayload
> {
  const sdk = useSdk();
  const { isAuthorized } = useAuth();
  const queryClient = useQueryClient();

  const { mutateAsync, ...rest } = useMutation({
    ...mutation,
    mutationKey: keys.submitProfileDetails,
    mutationFn: async (body: SubmitProfileDetailsPayload) => {
      if (!sdk) {
        throw new Error('No SDK instance available');
      }
      if (!isAuthorized) {
        throw new Error('User not authorized');
      }

      return sdk.submitProfileDetails(profile, body);
    },
    onSuccess(data, variables, context) {
      // Refetch all orders on success.
      queryClient.invalidateQueries({
        queryKey: keys.getProfile(profile),
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
    submitProfileDetails: mutateAsync,
    ...rest,
  };
}
/**
 * # Request Iban
 * Create an IBAN for a specified address and chain.
 * All incoming EUR payments will automatically be routed to the linked address on that chain.
 * Any linked address can use this IBAN for outgoing payments.
 * @group Hooks
 * @category IBANs
 * @param {Object} [params] No required parameters.
 * @param {Object} [param.mutation] {@inheritDoc MutationOptions}
 *
 * @example
 * ```ts
 * const {
 *    requestIban, // useMutation's `mutateAsync` property
 *    isPending,
 *    isError,
 *    error,
 *    status,
 *    ...moreUseMutationResults
 * } = useRequestIban();
 * ```
 * @see
 * [API Documentation](https://monerium.dev/api-docs-v2#tag/ibans/operation/request-iban)
 *
 * [RequestIbanPayload type](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/docs/generated/interfaces/RequestIbanPayload.md)
 */

export function useRequestIban({
  mutation = {},
}: {
  mutation?: MutationOptions<ResponseStatus, Error, RequestIbanPayload>;
} = {}): MutationResult<
  'requestIban',
  ResponseStatus,
  Error,
  RequestIbanPayload
> {
  const sdk = useSdk();
  const { isAuthorized } = useAuth();

  const { mutateAsync, ...rest } = useMutation({
    ...mutation,
    mutationKey: keys.requestIban,
    mutationFn: async ({
      address,
      chain,
      emailNotifications,
    }: RequestIbanPayload) => {
      if (!sdk) {
        throw new Error('No SDK instance available');
      }
      if (!isAuthorized) {
        throw new Error('User not authorized');
      }

      return sdk.requestIban({ address, chain, emailNotifications });
    },
    onSuccess(data, variables, context) {
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
    requestIban: mutateAsync,
    ...rest,
  };
}
/**
 * # Move Iban
 * Move an existing IBAN to a specified address an chain.
 * All incoming EUR payments will automatically be routed to the address on that chain.
 * @group Hooks
 * @category IBANs
 * @param {Object} [params] No required parameters.
 * @param {Object} [param.mutation] {@inheritDoc MutationOptions}
 *
 * @example
 * ```ts
 * const {
 *    moveIban, // useMutation's `mutateAsync` property
 *    isPending,
 *    isError,
 *    error,
 *    status,
 *    ...moreUseMutationResults
 * } = useMoveIban();
 * ```
 * @see
 * [API Documentation](https://monerium.dev/api-docs-v2#tag/ibans/operation/move-iban)
 *
 * [NewOrder type](https://github.com/monerium/js-monorepo/blob/main/packages/sdk/docs/generated/interfaces/MoveIbanPayload.md)
 */

export function useMoveIban({
  mutation = {},
}: {
  mutation?: MutationOptions<
    ResponseStatus,
    Error,
    MoveIbanPayload & { iban: string }
  >;
} = {}): MutationResult<
  'moveIban',
  ResponseStatus,
  Error,
  MoveIbanPayload & { iban: string }
> {
  const sdk = useSdk();
  const { isAuthorized } = useAuth();
  const queryClient = useQueryClient();

  const { mutateAsync, ...rest } = useMutation({
    ...mutation,
    mutationKey: keys.moveIban,
    mutationFn: async ({
      iban,
      address,
      chain,
    }: MoveIbanPayload & { iban: string }) => {
      if (!sdk) {
        throw new Error('No SDK instance available');
      }
      if (!isAuthorized) {
        throw new Error('User not authorized');
      }

      return sdk.moveIban(iban, { address, chain });
    },
    onSuccess(data, variables, context) {
      // Refetch all orders on success.
      queryClient.invalidateQueries({
        queryKey: keys.getIban(variables.iban),
      });
      queryClient.invalidateQueries({
        queryKey: keys.getIbans(),
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
    moveIban: mutateAsync,
    ...rest,
  };
}
/**
 * # Place an order.
 * When the order has been placed, the orders query will be invalidated and re-fetched.
 *
 * If the order amount is above 15000, a supporting document is required.
 * @group Hooks
 * @category Orders
 * @param param
 * @param {File} param.supportingDocument Supporting document file.
 * @param {Object} [param.mutation] {@inheritDoc MutationOptions}
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
 * [NewOrder type](/docs/packages/sdk/type-aliases/NewOrder.md)
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
 *
 * @group Hooks
 * @category Profiles
 * @param param
 * @param {File} param.profileId Which profile to link the address.
 * @param {Object} [param.mutation] {@inheritDoc MutationOptions}
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
 * [LinkAddress interface](/docs/packages/sdk/interfaces/LinkAddress.md)
 */

export function useLinkAddress({
  profileId,
  mutation,
}: {
  profileId: string;
  mutation?: MutationOptions<
    { status: number; statusText: string },
    Error,
    LinkAddress
  >;
}): MutationResult<
  'linkAddress',
  { status: number; statusText: string },
  Error,
  LinkAddress
> {
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
      return sdk.linkAddress({ profile: profileId, ...body });
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
