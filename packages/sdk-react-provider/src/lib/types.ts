import {
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import type MoneriumClient from '@monerium/sdk';
import { ChainId } from '@monerium/sdk';

export type SdkInstance = {
  /** Monerium SDK instance. */
  sdk?: MoneriumClient;
};

export type AuthorizeParams =
  | { address: string; signature: string; chainId?: ChainId }
  | { state?: string; scope?: string }
  | {};

export type UseAuthReturn = {
  /**
   * Constructs the url and redirects to the Monerium auth flow.
   */
  authorize: (params?: AuthorizeParams) => Promise<void>;
  /**
   * Indicates whether the SDK is authorized.
   */
  isAuthorized: boolean;
  /**
   * Indicates whether the SDK authorization is loading.
   */
  isLoading: boolean;

  error: unknown;

  disconnect: () => Promise<void>;
  revokeAccess: () => Promise<void>;
};

/**
 * See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) options.
 * @see # [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery)
 * @template {Object} TData - The data returned.
 * @example
 * ```ts
 * useQueryHook({
 *  query: {
 *    enabled: isReady,
 *    staleTime: 1000,
 *    placeHolderData: { foo: 'bar' },
 *  }
 * })
 * ```
 * ## Options
 * > `queryKey` and `queryFn` are used internally and therefore not included as an options.
 * ```diff
 * query: {
 *    gcTime,
 *    enabled,
 *    networkMode,
 *    initialData,
 *    initialDataUpdatedAt,
 *    meta,
 *    notifyOnChangeProps,
 *    placeholderData,
 *    queryKeyHashFn,
 *    refetchInterval,
 *    refetchIntervalInBackground,
 *    refetchOnMount,
 *    refetchOnReconnect,
 *    refetchOnWindowFocus,
 *    retry,
 *    retryOnMount,
 *    retryDelay,
 *    select,
 *    staleTime,
 *    structuralSharing,
 *    throwOnError
 * }
 *  ```
 */
export type QueryOptions<TData = unknown> = Omit<
  UseQueryOptions<TData>,
  'queryKey' | 'queryFn'
>;

/**
 * See [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) returns.
 * @see # [Tanstack Query - useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery)
 *
 * @template {string} TVarName - The name of the variable that returns the data.
 * @template {Object} TData - The data returned.
 *
 * @example
 * > `data` is renamed according to the `TVarName` and therefore not included in the result.
 * ```diff
 * {
 * -   data,
 *    dataUpdatedAt,
 *    error,
 *    errorUpdatedAt,
 *    failureCount,
 *    failureReason,
 *    fetchStatus,
 *    isError,
 *    isFetched,
 *    isFetchedAfterMount,
 *    isFetching,
 *    isInitialLoading,
 *    isLoading,
 *    isLoadingError,
 *    isPaused,
 *    isPending,
 *    isPlaceholderData,
 *    isRefetchError,
 *    isRefetching,
 *    isStale,
 *    isSuccess,
 *    refetch,
 *    status,
 *}
 *  ```
 *
 */
export type QueryResult<TVarName extends string, TData = unknown> = Omit<
  UseQueryResult<TData>,
  'data'
> & {
  [P in TVarName]: UseQueryResult<TData>['data'];
};

/**
 * See [Tanstack Query - useMutation](https://tanstack.com/query/latest/docs/framework/react/reference/useMutation) options.
 * @see # [Tanstack Query - useMutation](https://tanstack.com/query/latest/docs/framework/react/reference/useMutation)
 *
 * @template {Object} TData - The data returned.
 * @template {Object} TError - The error returned.
 * @template {Object} TVariables - The variables used in the mutation.
 *
 * @example
 * ```ts
 * useMutationHook({
 *  mutation: {
 *    onSuccess: (data, variables) => {
 *      console.log('onSuccess callback', data, variables);
 *    },
 *    onError: (error) => {
 *      console.log('onError callback', error);
 *    },
 *  },
 * })
 *
 * ```
 * ## Options
 * > `mutationKey` and `mutationFn` are used internally and therefore not included as an options.
 * ```diff
 * mutation: {
 *    gcTime,
 *    meta,
 *    networkMode,
 *    onError,
 *    onMutate,
 *    onSettled,
 *    onSuccess,
 *    retry,
 *    retryDelay,
 *    scope,
 *    throwOnError,
 * }
 *  ```
 */
export type MutationOptions<
  TData = unknown,
  TError = unknown,
  TVariables = unknown,
> = Omit<
  UseMutationOptions<TData, TError, TVariables>,
  'mutationKey' | 'mutationFn'
>;

/**
 * See [Tanstack Query - useMutation](https://tanstack.com/query/latest/docs/framework/react/reference/useMutation) returns.
 * @see # [Tanstack Query - useMutation](https://tanstack.com/query/latest/docs/framework/react/reference/useMutation)
 *
 * @template {string} TFuncName - The name of the function that mutates.
 * @template {Object} TData - The data returned.
 * @template {Object} TError - The error returned.
 * @template {Object} TVariables - The variables used in the mutation.
 * @template {Object} TContext - The context used in the mutation.
 *
 * @example
 * > `mutateAsync` is renamed according to the `TFuncName` and therefore not included in the result.
 * ```diff
 * const {
 *    data,
 *    error,
 *    isError,
 *    isIdle,
 *    isPending,
 *    isPaused,
 *    isSuccess,
 *    failureCount,
 *    failureReason,
 *    mutate,
 * -  mutateAsync,
 *    reset,
 *    status,
 *    submittedAt,
 *    variables,
 * } = useMutationHook();
 *  ```
 */
export type MutationResult<
  TFuncName extends string,
  TData,
  TError,
  TVariables,
  TContext = unknown,
> = Omit<
  UseMutationResult<TData, TError, TVariables, TContext>,
  'mutateAsync'
> & {
  [P in TFuncName]: UseMutationResult<
    TData,
    TError,
    TVariables,
    TContext
  >['mutateAsync'];
};
