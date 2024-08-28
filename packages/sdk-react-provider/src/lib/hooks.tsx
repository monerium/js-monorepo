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
 * Query keys for React query
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
 * If no `profile` id is provided, the default profile is used.
 * @group Hooks
 * @category Profiles
 * @param {Object} params
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

 * @see {@link https://monerium.dev/api-docs#operation/profile | API Documentation}
 */
export function useProfile({
  profile,
  query,
}: {
  /** The id of the profile */
  profile?: string;
  /** {@inheritDoc QueryOptions} */
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
 * @see {@link https://monerium.dev/api-docs#operation/profiles | API Documentation}
 */
export function useProfiles({
  query,
}: {
  /** {@inheritDoc QueryOptions} */
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
 * @group Hooks
 * @param {Object} [params] No required parameters.
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

 * @see {@link https://monerium.dev/api-docs#operation/tokens | API Documentation}
 */
export function useTokens({
  query,
}: {
  /** {@inheritDoc QueryOptions} */
  query?: QueryOptions<Token[]>;
} = {}): QueryResult<'tokens', Token[]> {
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
 * @group Hooks
 * @category Addresses
 * @param {Object} params 

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
 * @see {@link https://monerium.dev/api-docs-v2#tag/addresses/operation/address | API Documentation}
 */
export function useAddress({
  address,
  query = {},
}: {
  /** Fetch a specific address. */
  address: string;
  /** {@inheritDoc QueryOptions} */
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
 * @group Hooks
 * @category Addresses
 * @param {Object} [params] No required parameters.
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
 * @see {@link https://monerium.dev/api-docs-v2#tag/addresses/operation/addresses | API Documentation}
 */
export function useAddresses({
  profile,
  chain,
  query = {},
}: {
  /** Fetch addresses for a specific profile. */
  profile?: string;
  /** Fetch addresses for a specific chain. */
  chain?: Chain | ChainId;
  /** {@inheritDoc QueryOptions} */
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
 * @group Hooks
 * @category Addresses
 * @param {Object} params

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
 * @see {@link https://monerium.dev/api-docs#operation/profile-balances | API Documentation}
 */
export function useBalances({
  profile,
  query,
}: {
  /** Fetch balances for a specific profile. */
  profile: string;
  /** {@inheritDoc QueryOptions} */
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
 * @group Hooks
 * @category IBANs
 * @param {Object} params
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
 * @see {@link https://monerium.dev/api-docs-v2#tag/ibans/operation/iban | API Documentation}
 */
export function useIBAN({
  iban,
  query,
}: {
  /** Fetch a specific IBAN */
  iban: string;
  /** {@inheritDoc QueryOptions} */
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
 * @group Hooks
 * @category IBANs
 * @param {Object} [params] No required parameters.
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
 * @see {@link https://monerium.dev/api-docs-v2#tag/ibans/operation/ibans | API Documentation}
 */
export function useIBANs({
  profile,
  chain,
  query = {},
}: {
  /** Fetch IBANs for a specific profile. */
  profile?: string;
  /** Fetch IBANs for a specific chain. */
  chain?: Chain | ChainId;
  /** {@inheritDoc QueryOptions} */
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
 * @group Hooks
 * @category Orders
 * @param {Object} params
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
 * @see {@link https://monerium.dev/api-docs#operation/order| API Documentation}
 */
export function useOrder({
  orderId,
  query = {},
}: {
  /**  The id of the order. */
  orderId: string;
  /** {@inheritDoc QueryOptions} */
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
 * @group Hooks
 * @category Orders
 * @param {Object} [params] No required parameters.
 * @param {Object} [params.address] Filter based on the blockchain address associated with the order.
 * @param {Object} [params.memo] Filter by the payment memo/reference..
 * @param {Object} [params.profile] Filter based on the profile ID associated with the order.
 * @param {Object} [params.state] Filter based on the state of the order.
 * @param {Object} [params.txHash] Filter based on the blockchain transaction hash.
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
 * @see {@link https://monerium.dev/api-docs#operation/orders | API Documentation}
 */
export function useOrders({
  query = {},
  ...filters
}: {
  /** {@inheritDoc QueryOptions} */
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
 * Submit the required compliance information to onboard the customer.
 *
 * Note that you won't be able to change the profile "kind" from personal to corporate or vice versa once the profile has been approved.
 * @group Hooks
 * @category Profiles
 * @param param
 * @param {string} param.profile The id of the profile to submit to.
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
 * @see {@link https://monerium.dev/api-docs-v2#tag/profiles/operation/profile-details | API Documentation}}
 */

export function useSubmitProfileDetails({
  profile,
  mutation = {},
}: {
  profile: string;
  /** {@inheritDoc MutationOptions} */
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
 * Create an IBAN for a specified address and chain.
 * All incoming EUR payments will automatically be routed to the linked address on that chain.
 * Any linked address can use this IBAN for outgoing payments.
 * @group Hooks
 * @category IBANs
 * @param {Object} [params] No required parameters.
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
 * @see {@link https://monerium.dev/api-docs-v2#tag/ibans/operation/request-iban | API Documentation}}
 */

export function useRequestIban({
  mutation = {},
}: {
  /** {@inheritDoc MutationOptions} */
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
 * Move an existing IBAN to a specified address an chain.
 * All incoming EUR payments will automatically be routed to the address on that chain.
 * @group Hooks
 * @category IBANs
 * @param {Object} [params] No required parameters.
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
 * @see {@link https://monerium.dev/api-docs-v2#tag/ibans/operation/move-iban  | API Documentation}
 */

export function useMoveIban({
  mutation = {},
}: {
  /** {@inheritDoc MutationOptions} */
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
 * When the order has been placed, the orders query will be invalidated and re-fetched.
 *
 * If the order amount is above 15000, a supporting document is required.
 * @group Hooks
 * @category Orders
 * @param param
 * @param {File} param.supportingDocument Supporting document file.
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
 * @see {@link https://monerium.dev/api-docs#operation/post-orders| API Documentation}
 */

export function usePlaceOrder({
  supportingDocument,
  mutation,
}: {
  supportingDocument?: File;
  /** {@inheritDoc MutationOptions} */
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
 * @see {@link https://monerium.dev/api-docs#operation/profile-addresses | API Documentation}
 */

export function useLinkAddress({
  profileId,
  mutation,
}: {
  profileId: string;
  /** {@inheritDoc MutationOptions} */
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

/** Export types for documentation */
export type {
  Address,
  Balances,
  IBAN,
  MoveIbanPayload,
  LinkAddress,
  Profile,
  ProfilePermissions,
  Token,
  SubmitProfileDetailsPayload,
  NewOrder,
  ResponseStatus,
  Order,
};
