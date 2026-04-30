'use client';

/**
 * ARCHITECTURE NOTE:
 *
 * This file contains React Query hooks that wrap the Next.js Server Actions
 * defined in `app/actions/monerium.ts`.
 *
 * Why this pattern?
 * 1. Security: The Monerium SDK is initialized strictly on the server within the
 *    Server Actions. This ensures that the `access_token` and any other secrets
 *    remain securely on the server and are never exposed to the browser.
 * 2. Developer Experience: We use React Query (`@tanstack/react-query`) on the
 *    client side to call these Server Actions. This provides out-of-the-box caching,
 *    loading states, automatic refetching, and mutation handling for a smooth UI experience.
 */

import {
  AddressesQueryParams,
  GetBalancesParams,
  GetProfilesParams,
  IbansParams,
  LinkAddressInput,
  MoveIbanInput,
  OrderParams,
  PlaceOrderInput,
  RequestIbanInput,
  SignaturesParams,
} from '@monerium/sdk';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  authorizeAction,
  callbackAction,
  clearSession,
  getSession,
  siweAuthorizeAction,
} from '../app/actions/auth';
import {
  getAddressAction,
  getAddressesAction,
  getAuthContextAction,
  getBalancesAction,
  getIbanAction,
  getIbansAction,
  getOrderAction,
  getOrdersAction,
  getProfileAction,
  getProfilesAction,
  getSignaturesAction,
  getTokensAction,
  linkAddressAction,
  moveIbanAction,
  placeOrderAction,
  requestIbanAction,
} from '../app/actions/monerium';

export function useAuth() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const code = searchParams?.get('code');
  const [isProcessingCode, setIsProcessingCode] = useState(false);

  useEffect(() => {
    if (code && !isProcessingCode) {
      console.log('Intercepting auth callback with code:', code);
      setTimeout(() => setIsProcessingCode(true), 0);
      callbackAction(window.location.href).catch((err) => {
        console.error('Callback action error (could be redirect):', err);
        if (err.message && err.message.includes('NEXT_REDIRECT')) {
          return;
        }
        const url = new URL(window.location.href);
        url.searchParams.delete('code');
        url.searchParams.delete('state');
        window.history.replaceState({}, document.title, url.toString());
        setTimeout(() => setIsProcessingCode(false), 0);
      });
    } else if (!code && isProcessingCode) {
      setTimeout(() => {
        setIsProcessingCode(false);
        queryClient.invalidateQueries({ queryKey: ['session'] });
      }, 0);
    }
  }, [code, isProcessingCode, queryClient]);

  const {
    data: session,
    isLoading: sessionLoading,
    error,
  } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      console.log('Fetching session...');
      const s = await getSession();
      console.log('Session fetched:', s);
      return s;
    },
  });

  const isLoading = sessionLoading || !!code || isProcessingCode;
  const isAuthorized = !!session || !!code || isProcessingCode;

  console.log('useAuth state:', {
    code,
    isProcessingCode,
    sessionLoading,
    isLoading,
    isAuthorized,
    hasSession: !!session,
  });

  return {
    isAuthorized,
    isLoading,
    error,
    authorize: async (options?: { skipKyc?: boolean }) => {
      await authorizeAction(options?.skipKyc);
    },
    siwe: async ({
      message,
      signature,
    }: {
      message: string;
      signature: string;
    }) => {
      await siweAuthorizeAction(message, signature);
    },
    revokeAccess: async () => {
      queryClient.clear();
      await clearSession();
      window.location.href = '/';
    },
  };
}

export function useAuthContext() {
  return useQuery({
    queryKey: ['authContext'],
    queryFn: () => getAuthContextAction(),
  });
}

export function useProfiles(params?: GetProfilesParams) {
  return useQuery({
    queryKey: ['profiles', params],
    queryFn: () => getProfilesAction(params),
  });
}

export function useProfile(profileId?: string) {
  const { data: profilesData } = useProfiles();
  const id = profileId || profilesData?.profiles?.[0]?.id;

  return useQuery({
    queryKey: ['profile', id],
    queryFn: () =>
      id ? getProfileAction(id) : Promise.reject('No profile ID'),
    enabled: !!id,
  });
}

export function useAddresses(params?: AddressesQueryParams) {
  return useQuery({
    queryKey: ['addresses', params],
    queryFn: () => getAddressesAction(params),
  });
}

export function useBalances(params?: GetBalancesParams) {
  return useQuery({
    queryKey: ['balances', params],
    queryFn: () => getBalancesAction(params),
  });
}

export function useTokens() {
  return useQuery({
    queryKey: ['tokens'],
    queryFn: () => getTokensAction(),
  });
}

export function useOrders(params?: OrderParams) {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => getOrdersAction(params),
  });
}

export function useIBANs(params?: IbansParams) {
  return useQuery({
    queryKey: ['ibans', params],
    queryFn: () => getIbansAction(params),
  });
}

export function usePlaceOrder(options?: {
  mutation?: Omit<
    import('@tanstack/react-query').UseMutationOptions<
      any,
      Error,
      PlaceOrderInput,
      unknown
    >,
    'mutationFn'
  >;
}) {
  const queryClient = useQueryClient();
  const { mutateAsync, ...rest } = useMutation({
    ...options?.mutation,
    mutationFn: (order: PlaceOrderInput) => placeOrderAction(order),
    onSuccess: (...args: any[]) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['balances'] });
      if (options?.mutation?.onSuccess) {
        (options.mutation.onSuccess as any)(...args);
      }
    },
  });
  return { placeOrder: mutateAsync, ...rest };
}

export function useRequestIban() {
  const queryClient = useQueryClient();
  const { mutateAsync, ...rest } = useMutation({
    mutationFn: (payload: RequestIbanInput) => requestIbanAction(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ibans'] });
    },
  });
  return { requestIban: mutateAsync, ...rest };
}

export function useLinkAddress() {
  const queryClient = useQueryClient();
  const { mutateAsync, ...rest } = useMutation({
    mutationFn: (payload: LinkAddressInput) => linkAddressAction(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
  return { linkAddress: mutateAsync, ...rest };
}

export function useAddress(params?: { address?: string }) {
  return useQuery({
    queryKey: ['address', params?.address],
    queryFn: () => getAddressAction(params?.address as string),
    enabled: !!params?.address,
  });
}

export function useOrder(params?: { orderId?: string }) {
  return useQuery({
    queryKey: ['order', params?.orderId],
    queryFn: () => getOrderAction(params?.orderId as string),
    enabled: !!params?.orderId,
  });
}

export function useIBAN(params?: { iban?: string }) {
  return useQuery({
    queryKey: ['iban', params?.iban],
    queryFn: () => getIbanAction(params?.iban as string),
    enabled: !!params?.iban,
  });
}

export function useSignatures(params?: SignaturesParams) {
  return useQuery({
    queryKey: ['signatures', params],
    queryFn: () => getSignaturesAction(params),
  });
}

export function useMoveIban() {
  const queryClient = useQueryClient();
  const { mutateAsync, ...rest } = useMutation({
    mutationFn: (payload: MoveIbanInput) => moveIbanAction(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ibans'] });
    },
  });
  return { moveIban: mutateAsync, ...rest };
}
