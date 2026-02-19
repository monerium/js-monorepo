import { useContext, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import MoneriumClient, {
  Address,
  AddressesResponse,
  AuthContext,
  Balances,
  Chain,
  ChainId,
  Currency,
  CurrencyCode,
  IBAN,
  IBANsResponse,
  LinkAddress,
  LinkedAddress,
  MoveIbanPayload,
  NewOrder,
  Order,
  OrdersResponse,
  OrderState,
  parseChain,
  Profile,
  ProfilesResponse,
  RequestIbanPayload,
  ResponseStatus,
  SignaturesQueryParams,
  SignaturesResponse,
  SubmitProfileDetailsPayload,
  Token,
} from '@monerium/sdk';

import { MoneriumContext } from './context';
import {
  MutationOptions,
  MutationResult,
  QueryOptions,
  UseAuthReturn,
} from './types';

/**
 * @internal
 * Query keys for React query
 * */
export const keys = {
  getAll: ['monerium'],
  getAuthContext: ['monerium', 'auth-context'],
  getProfile: (profile: string) => [
    'monerium',
    'profile',
    ...(profile ? [profile] : []),
  ],
  getProfiles: ['monerium', 'profiles'],
  getAddress: (address: string) => ['monerium', 'address', [address]],
  getAddresses: (filter?: unknown) => [
    'monerium',
    'addresses',
    ...(filter ? [filter] : []),
  ],
  getBalances: (
    address: string,
    chain: Chain,
    currencies?: CurrencyCode | CurrencyCode[]
  ) => [
    'monerium',
    'balances',
    {
      currencies: currencies ? [...currencies] : [],
      chain,
      address,
    },
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
  getSignatures: (filter?: unknown) => [
    'monerium',
    'signatures',
    ...(filter ? [filter] : []),
  ],
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
 * - `siwe`       - Sign in with Ethereum. https://monerium.com/siwe
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
    siwe: context.siwe,
    isLoading: context.isLoading,
    error: context.error,
    disconnect: context.disconnect,
    revokeAccess: context.revokeAccess,
  };
}

/**
 * @group Hooks
 * @category Authentication
 * @param {Object} params
 *
 * @example
 * ```ts
 * const {
 *    data
 *    isLoading,
 *    isError,
 *    error,
 *    refetch,
 *    ...moreUseQueryResults
 * } = useAuthContext();
 * ```

 * @see {@link https://monerium.dev/api-docs/v2#tag/auth/operation/auth-context | API Documentation}
 */
export function useAuthContext({
  query,
}: {
  /** {@inheritDoc QueryOptions} */
  query?: QueryOptions<AuthContext>;
} = {}) {
  const { isAuthorized } = useAuth();
  const sdk = useSdk();

  return useQuery({
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
 *    data
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
} = {}) {
  const { isAuthorized } = useAuth();
  const sdk = useSdk();

  const { data } = useProfiles();

  const profileToUse = profile || (data?.profiles?.[0]?.id as string);

  return useQuery({
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
 *    data,
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
  query?: QueryOptions<ProfilesResponse>;
} = {}) {
  const { isAuthorized } = useAuth();
  const sdk = useSdk();

  return useQuery({
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
}
/**
 * @group Hooks
 * @param {Object} [params] No required parameters.
 *
 * @example
 * ```ts
 * const {
 *    data,
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
} = {}) {
  const sdk = useSdk();
  const { isAuthorized } = useAuth();
  return useQuery({
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
}

/**
 * @group Hooks
 * @category Addresses
 * @param {Object} params

 * @example
 * ```ts
 * const {
 *    data,
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
}) {
  const sdk = useSdk();
  const { isAuthorized } = useAuth();

  return useQuery({
    ...query,
    queryKey: keys.getAddress(address),
    queryFn: async () => {
      if (!sdk) {
        throw new Error('No SDK instance available');
      }
      if (!isAuthorized) {
        throw new Error('User not authorized');
      }

      if (!address) {
        throw new Error('Address is required');
      }

      return sdk.getAddress(address);
    },
    enabled: Boolean(
      sdk && isAuthorized && address && (query?.enabled ?? true)
    ),
  });
}
/**
 * @group Hooks
 * @category Addresses
 * @param {Object} [params] No required parameters.
 * @param {Object} [params.profile] Filter based on profile id.
 * @param {Object} [params.chain] Filter based on chain - CURRENTLY RETURNS AN ERROR.
 * @example
 * ```ts
 * const {
 *    data,
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
  profile?: string;
  chain?: Chain | ChainId;
  /** {@inheritDoc QueryOptions} */
  query?: QueryOptions<AddressesResponse>;
} = {}) {
  const sdk = useSdk();

  const { isAuthorized } = useAuth();

  return useQuery({
    ...query,
    queryKey: keys.getAddresses({
      profile,
      chain: chain ? parseChain(chain) : undefined,
    }),
    queryFn: async () => {
      if (!sdk) {
        throw new Error('No SDK instance available');
      }
      if (!isAuthorized) {
        throw new Error('User not authorized');
      }
      return sdk.getAddresses({ profile, chain });
    },
    enabled: Boolean(sdk && isAuthorized && (query?.enabled ?? true)),
  });
}
/**
 * # Get balance for a an address on a give chain
 * @group Hooks
 * @category Addresses
 * @param {Object} params
 * @param {QueryOptions<Balances>} params.address The address to fetch the balance for.
 * @param {QueryOptions<Balances>} params.chain The chain to fetch the balance for.
 * @param {QueryOptions<Balances>} [params.currencies] One or many: `eur`, `usd`, `gbp`, `isk`
 * @example
 * ```ts
 * const {
 *    data,
 *    isLoading,
 *    isError,
 *    error,
 *    refetch,
 *    ...moreUseQueryResults
 * } = useBalances();
 * ```
 * @see {@link https://monerium.dev/api-docs/v2#tag/addresses/operation/balances | API Documentation}
 *
 */
export function useBalances({
  address,
  chain,
  currencies,
  query,
}: {
  address: string;
  chain: Chain | ChainId;
  currencies?: Currency | Currency[];
  /** {@inheritDoc QueryOptions} */
  query?: QueryOptions<Balances>;
}) {
  const sdk = useSdk();
  const { isAuthorized } = useAuth();

  return useQuery({
    ...query,
    queryKey: keys.getBalances(address, parseChain(chain), currencies),
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      if (!sdk) {
        throw new Error('No SDK instance available');
      }
      if (!isAuthorized) {
        throw new Error('User not authorized');
      }
      return sdk.getBalances(address, chain, currencies);
    },
    enabled: Boolean(sdk && isAuthorized && (query?.enabled ?? true)),
  });
}

/**
 * @group Hooks
 * @category IBANs
 * @param {Object} params
 * @example
 * ```ts
 * const {
 *    data,
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
}) {
  const sdk = useSdk();
  const { isAuthorized } = useAuth();

  return useQuery({
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
}
/**
 * @group Hooks
 * @category IBANs
 * @param {Object} [params] No required parameters.
 * @example
 * ```ts
 * const {
 *    data,
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
  query?: QueryOptions<IBANsResponse>;
} = {}) {
  const sdk = useSdk();
  const { isAuthorized } = useAuth();

  return useQuery({
    ...query,
    queryKey: keys.getIbans({ profile, chain }),
    queryFn: async () => {
      if (!sdk) {
        throw new Error('No SDK instance available');
      }
      if (!isAuthorized) {
        throw new Error('User not authorized');
      }

      return sdk.getIbans({ profile, chain });
    },
    enabled: Boolean(sdk && isAuthorized && (query?.enabled ?? true)),
  });
}

/**
 * @group Hooks
 * @category Orders
 * @param {Object} params
 * @example
 * ```ts
 * const {
 *    data,
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
}) {
  const sdk = useSdk();
  const { isAuthorized } = useAuth();
  return useQuery({
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
 *    data,
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
  query?: QueryOptions<OrdersResponse>;
  address?: string;
  txHash?: string;
  profile?: string;
  memo?: string;
  state?: OrderState;
} = {}) {
  const sdk = useSdk();
  const { isAuthorized } = useAuth();
  return useQuery({
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
    onSuccess(data, variables, context, mutationContext) {
      // Refetch all orders on success.
      queryClient.invalidateQueries({
        queryKey: keys.getProfile(profile),
      });
      // Allow the caller to add custom logic on success.
      mutation?.onSuccess?.(data, variables, context, mutationContext);
    },
    onError(error, vars, context, mutationContext) {
      // Allow the caller to add custom logic on error.
      mutation?.onError?.(error, vars, context, mutationContext);
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
    onSuccess(data, variables, context, mutationContext) {
      // Allow the caller to add custom logic on success.
      mutation?.onSuccess?.(data, variables, context, mutationContext);
    },
    onError(error, vars, context, mutationContext) {
      // Allow the caller to add custom logic on error.
      mutation?.onError?.(error, vars, context, mutationContext);
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
 * @see {@link https://monerium.dev/api-docs/v2#tag/ibans/operation/move-iban | API Documentation}
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
    onSuccess(data, variables, context, mutationContext) {
      // Refetch the iban on success.
      queryClient.invalidateQueries({
        queryKey: keys.getIban(variables.iban),
      });
      queryClient.invalidateQueries({
        queryKey: keys.getIbans(),
      });
      queryClient.invalidateQueries({
        queryKey: keys.getAddress(variables.address),
      });
      // Allow the caller to add custom logic on success.
      mutation?.onSuccess?.(data, variables, context, mutationContext);
    },
    onError(error, vars, context, mutationContext) {
      // Allow the caller to add custom logic on error.
      mutation?.onError?.(error, vars, context, mutationContext);
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
 *
 * **Note:** For multi-signature orders, the API returns a 202 Accepted response
 * with `{status: 202, statusText: "Accepted"}` instead of the full Order object.
 *
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
  mutation?: MutationOptions<Order | ResponseStatus, Error, NewOrder>;
} = {}): MutationResult<'placeOrder', Order | ResponseStatus, Error, NewOrder> {
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
    onSuccess(data, variables, context, mutationContext) {
      // Refetch all orders on success.
      queryClient.invalidateQueries({
        queryKey: keys.getOrders(),
      });
      // Only invalidate balances if we got a full Order response (not a 202 multi-sig response)
      const orderData = data as Order;
      if (orderData.address && orderData?.chain) {
        queryClient.invalidateQueries({
          queryKey: keys.getBalances(orderData.address, orderData.chain),
        });
      }
      // Allow the caller to add custom logic on success.
      mutation?.onSuccess?.(data, variables, context, mutationContext);
    },
    onError(error, vars, context, mutationContext) {
      // Allow the caller to add custom logic on error.
      mutation?.onError?.(error, vars, context, mutationContext);
      throw error;
    },
  });
  return {
    placeOrder: mutateAsync,
    ...rest,
  };
}
/**
 * Get pending signatures for the authenticated user.
 *
 * Returns pending signatures that require user action, such as order signatures
 * or link address signatures. Accepts filtering by address, chain, kind, and profile.
 *
 * @group Hooks
 * @category Signatures
 * @param {Object} params
 * @param {SignaturesQueryParams} params.query - Optional query parameters to filter signatures
 *
 * @example
 * ```ts
 * // Get all pending signatures
 * const {
 *    data: signatures,
 *    isLoading,
 *    isError,
 *    error,
 *    refetch,
 *    ...moreUseQueryResults
 * } = useSignatures();
 *
 * // Get pending order signatures for a specific address
 * const { data: orderSignatures } = useSignatures({
 *   query: {
 *     address: '0x1234...',
 *     kind: 'order'
 *   }
 * });
 *
 * // Check the kind of signature
 * signatures?.pending.forEach(sig => {
 *   if (sig.kind === 'order') {
 *     console.log('Order signature:', sig.id, sig.amount);
 *   } else {
 *     console.log('Link address signature');
 *   }
 * });
 * ```
 * @see {@link https://monerium.dev/api-docs-v2#tag/signatures/operation/get-signatures | API Documentation}
 */
export function useSignatures({
  query,
  options,
}: {
  query?: SignaturesQueryParams;
  /** {@inheritDoc QueryOptions} */
  options?: QueryOptions<SignaturesResponse>;
} = {}) {
  const sdk = useSdk();
  const { isAuthorized } = useAuth();

  return useQuery<SignaturesResponse>({
    ...options,
    queryKey: keys.getSignatures(query),
    queryFn: () => {
      if (!sdk) {
        throw new Error('No SDK instance available');
      }
      return sdk.getSignatures(query);
    },
    enabled: Boolean(sdk && isAuthorized && (options?.enabled ?? true)),
  });
}

/**
 * # Add address to profile.
 *
 * @group Hooks
 * @category Profiles
 * @param {Object} [params] No required parameters.
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
  mutation,
}: {
  /** {@inheritDoc MutationOptions} */
  mutation?: MutationOptions<LinkedAddress, Error, LinkAddress>;
} = {}): MutationResult<'linkAddress', LinkedAddress, Error, LinkAddress> {
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
      return sdk.linkAddress(body);
    },
    onSuccess(data, variables, context, mutationContext) {
      // Refetch all orders on success.
      queryClient.invalidateQueries({
        queryKey: keys.getAddresses(),
      });
      if (variables.profile) {
        queryClient.invalidateQueries({
          queryKey: keys.getProfile(variables.profile),
        });
      }
      // Allow the caller to add custom logic on success.
      mutation?.onSuccess?.(data, variables, context, mutationContext);
    },
    onError(error, vars, context, mutationContext) {
      // Allow the caller to add custom logic on error.
      mutation?.onError?.(error, vars, context, mutationContext);
      throw error;
    },
  });
  return {
    linkAddress: mutateAsync,
    ...rest,
  };
}

/**
 * API consumers have the option to subscribe to a WebSocket for real-time order notifications. This WebSocket complies with the standard WebSocket Protocol, allowing the use of standard WebSocket libraries for subscription.
 *
 * The WebSocket emits an event when a order changes state:
 *
 * `placed`: The order has been created but not yet processed.
 *
 * `pending`: The order is awaiting fulfillment (e.g., review, minting/burning tokens, or sending/receiving SEPA payment).
 *
 * `processed`: The order has been completed successfully.
 *
 * `rejected`: The order was rejected, possibly due to compliance reasons or insufficient funds.
 * @group Hooks
 * @category Orders
 * @param {Object} params
 * @param {OrderState} [params.state] Filter based on the state of the order.
 * @param {string} [params.profile] Filter based on the profile id of the order.
 * @param {Function} params.onMessage Callback function to handle the order notification.
 * @param {Function} [params.onError] Callback function to handle the error notification.
 *
 * @example
 * ```ts
 * const {
 *    state,
 *    profile,
 *    onMessage,
 *    onError
 * } = useSubscribeOrderNotification();
 * ```
 * @see {@link https://monerium.dev/api-docs/v1#operation/orders-notifications| API Documentation}
 * @returns {Function} Unsubscribe from order notifications.
 */

export const useSubscribeOrderNotification = ({
  state,
  profile,
  onMessage,
  onError,
}: {
  state?: OrderState;
  profile?: string;
  onMessage: (order: Order) => void;
  onError?: ((err: Event) => void) | undefined;
}) => {
  const sdk = useSdk();

  useEffect(() => {
    if (sdk) {
      sdk.subscribeOrderNotifications({
        filter: {
          state: state,
          profile: profile,
        },
        onMessage: onMessage,
        onError: onError,
      });
    }
    return () => {
      /**
       * Note that in development mode, React Strict mode will cause this
       * cleanup function to be called twice on client side route changes.
       * So a socket will be immediately closed and opened again.
       * This is not an issue in production mode.
       */
      if (sdk) {
        sdk?.unsubscribeOrderNotifications({ state: state, profile: profile });
      }
    };
  }, [sdk, profile, state]);

  return () =>
    sdk?.unsubscribeOrderNotifications({ state: state, profile: profile });
};

/** Export types for documentation */
export type {
  Address,
  Balances,
  IBAN,
  MoveIbanPayload,
  LinkAddress,
  Profile,
  Token,
  SubmitProfileDetailsPayload,
  NewOrder,
  ResponseStatus,
  Order,
};
