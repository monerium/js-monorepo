'use server';

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
  UpdateProfileDetailsInput,
} from '@monerium/sdk';

import { getMoneriumClient } from '../../lib/sdk';

function cleanParams(params: any) {
  if (!params) return undefined;
  const clean = { ...params };
  for (const key in clean) {
    if (clean[key] === undefined) delete clean[key];
  }
  return Object.keys(clean).length > 0 ? clean : undefined;
}

export async function getAuthContextAction() {
  const client = getMoneriumClient();
  return client.getAuthContext();
}

export async function getProfileAction(profileId: string) {
  const client = getMoneriumClient();
  return client.getProfile(profileId);
}

export async function getProfilesAction(params?: GetProfilesParams) {
  const client = getMoneriumClient();
  return client.getProfiles(cleanParams(params));
}

export async function getAddressesAction(params?: AddressesQueryParams) {
  const client = getMoneriumClient();
  return client.getAddresses(cleanParams(params));
}

export async function getBalancesAction(params?: GetBalancesParams) {
  const client = getMoneriumClient();
  if (!params?.address || !params?.chain) return { balances: [] };
  return client.getBalances(params as GetBalancesParams);
}

export async function getTokensAction() {
  const client = getMoneriumClient();
  return client.getTokens();
}

export async function getOrdersAction(params?: OrderParams) {
  const client = getMoneriumClient();
  return client.getOrders(cleanParams(params));
}

export async function placeOrderAction(order: PlaceOrderInput) {
  const client = getMoneriumClient();
  return client.placeOrder(order);
}

export async function getIbansAction(params?: IbansParams) {
  const client = getMoneriumClient();
  return client.getIbans(cleanParams(params));
}

export async function requestIbanAction(payload: RequestIbanInput) {
  const client = getMoneriumClient();
  return client.requestIban(payload);
}

export async function linkAddressAction(payload: LinkAddressInput) {
  const client = getMoneriumClient();
  return client.linkAddress(payload);
}

export async function getAddressAction(address: string) {
  const client = getMoneriumClient();
  return client.getAddress(address);
}

export async function getOrderAction(orderId: string) {
  const client = getMoneriumClient();
  return client.getOrder(orderId);
}

export async function getIbanAction(iban: string) {
  const client = getMoneriumClient();
  return client.getIban(iban);
}

export async function getSignaturesAction(params?: SignaturesParams) {
  const client = getMoneriumClient();
  return client.getSignatures(cleanParams(params));
}

export async function moveIbanAction(payload: MoveIbanInput) {
  const client = getMoneriumClient();
  return client.moveIban(payload);
}

export async function updateProfileDetailsAction(
  payload: UpdateProfileDetailsInput
) {
  const client = getMoneriumClient();
  return client.updateProfileDetails(payload);
}
