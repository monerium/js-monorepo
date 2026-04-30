'use server';

/**
 * 🏗️ ARCHITECTURE: Server Actions for Secure API Access
 *
 * Why do we use Server Actions instead of calling the SDK directly from React Components?
 *
 * 1. Security: The Monerium API requires an `access_token` (Bearer token). Keeping this token
 *    in the browser (e.g., LocalStorage, React State) is a security risk. By routing requests
 *    through Next.js Server Actions, the token is securely read from an HTTP-only cookie on the
 *    server, used for the API request, and never exposed to the client.
 * 2. Simplicity: Client components can just call these actions directly (or via React Query)
 *    without worrying about token management or authentication headers.
 */

import type {
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

import { moneriumClient } from '../../lib/sdk';

/**
 * Helper to safely execute API calls and serialize errors.
 * If an API call fails, Next.js Server Actions can sometimes swallow the exact error details
 * and return a generic 500 error to the client. This wrapper catches SDK errors, logs them
 * securely on the server, and throws a standard Error so the client UI can react appropriately.
 */
async function executeApiCall<T>(apiCall: () => Promise<T>): Promise<T> {
  try {
    return await apiCall();
  } catch (err: unknown) {
    // Safely cast to access typical API error shapes
    const error = err as {
      response?: { data?: { message?: string } };
      message?: string;
    };

    // Log the full error details securely on the server console
    console.error(
      'Monerium API Action Error:',
      error?.response?.data || error?.message || err
    );

    // Throw a standard Error with the message to cross the Server Action boundary back to the client
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        'An unexpected error occurred while communicating with the Monerium API.'
    );
  }
}

/**
 * Helper to clean undefined values from query parameters.
 * Why? Next.js Server Actions have strict serialization rules for network boundaries.
 * Sending explicit `undefined` values can cause serialization errors or unnecessary payload bloat.
 */
function cleanParams<T extends object>(params?: T): T | undefined {
  if (!params) return undefined;
  const clean = { ...params };
  for (const key in clean) {
    if (clean[key] === undefined) delete clean[key];
  }
  return Object.keys(clean).length > 0 ? clean : undefined;
}

export async function getAuthContextAction() {
  return executeApiCall(() => moneriumClient.getAuthContext());
}

export async function getProfileAction(profileId: string) {
  return executeApiCall(() => moneriumClient.getProfile(profileId));
}

export async function getProfilesAction(params?: GetProfilesParams) {
  return executeApiCall(() => moneriumClient.getProfiles(cleanParams(params)));
}

export async function getAddressesAction(params?: AddressesQueryParams) {
  return executeApiCall(() => moneriumClient.getAddresses(cleanParams(params)));
}

export async function getBalancesAction(params?: GetBalancesParams) {
  if (!params?.address || !params?.chain) return { balances: [] };
  return executeApiCall(() => moneriumClient.getBalances(params));
}

export async function getTokensAction() {
  return executeApiCall(() => moneriumClient.getTokens());
}

export async function getOrdersAction(params?: OrderParams) {
  return executeApiCall(() => moneriumClient.getOrders(cleanParams(params)));
}

export async function placeOrderAction(order: PlaceOrderInput) {
  return executeApiCall(() => moneriumClient.placeOrder(order));
}

export async function getIbansAction(params?: IbansParams) {
  return executeApiCall(() => moneriumClient.getIbans(cleanParams(params)));
}

export async function requestIbanAction(payload: RequestIbanInput) {
  return executeApiCall(() => moneriumClient.requestIban(payload));
}

export async function linkAddressAction(payload: LinkAddressInput) {
  return executeApiCall(() => moneriumClient.linkAddress(payload));
}

export async function getAddressAction(address: string) {
  return executeApiCall(() => moneriumClient.getAddress(address));
}

export async function getOrderAction(orderId: string) {
  return executeApiCall(() => moneriumClient.getOrder(orderId));
}

export async function getIbanAction(iban: string) {
  return executeApiCall(() => moneriumClient.getIban(iban));
}

export async function getSignaturesAction(params?: SignaturesParams) {
  return executeApiCall(() =>
    moneriumClient.getSignatures(cleanParams(params))
  );
}

export async function moveIbanAction(payload: MoveIbanInput) {
  return executeApiCall(() => moneriumClient.moveIban(payload));
}
