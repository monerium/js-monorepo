import { generateCodeChallenge, generateRandomString } from './helpers';
import {
  Balances,
  Chain,
  ChainId,
  Currency,
  Environment,
  EvmChainId,
} from './types';

/**
 *
 * @param d Date to be formatted
 * @returns RFC3339 date format.
 * @example 2023-04-30T12:00:00+01:00
 * @example 2023-04-30T02:08:15Z
 */
export const rfc3339 = (d: Date) => {
  if (d.toString() === 'Invalid Date') {
    throw d;
  }
  const pad = (n: number) => {
    return n < 10 ? '0' + n : n;
  };

  const timezoneOffset = (offset: number) => {
    if (offset === 0) {
      return 'Z';
    }
    const sign = offset > 0 ? '-' : '+';
    offset = Math.abs(offset);
    return sign + pad(Math.floor(offset / 60)) + ':' + pad(offset % 60);
  };

  return (
    d.getFullYear() +
    '-' +
    pad(d.getMonth() + 1) +
    '-' +
    pad(d.getDate()) +
    'T' +
    pad(d.getHours()) +
    ':' +
    pad(d.getMinutes()) +
    ':' +
    pad(d.getSeconds()) +
    timezoneOffset(d.getTimezoneOffset())
  );
};

const isValidCosmosChainName = (chain: string) => {
  switch (chain) {
    case 'noble':
    case 'noble-1':
    case 'grand':
    case 'grand-1':
      return true;
    default:
      return false;
  }
};

const isValidEvmName = (chain: string) => {
  switch (chain) {
    case 'ethereum':
    case 'sepolia':
    case 'polygon':
    case 'amoy':
    case 'gnosis':
    case 'chiado':
    case 'arbitrum':
    case 'arbitrumsepolia':
    case 'linea':
    case 'lineasepolia':
    case 'scroll':
    case 'scrollsepolia':
    case 'camino':
    case 'columbus':
      return true;
    default:
      return false;
  }
};

/**
 * This will resolve the chainId number to the corresponding chain name.
 * @param chain The chainId of the network
 * @returns chain name, 'ethereum', 'polygon', 'gnosis', etc.
 */
export const parseChain = (chain: Chain | ChainId): Chain => {
  if (typeof chain === 'number') {
    return getChain(chain);
  }
  if (isValidCosmosChainName(chain)) {
    return chain.split('-')[0] as Chain;
  }
  if (isValidEvmName(chain)) {
    return chain as Chain;
  }

  try {
    return getChain(parseInt(chain));
  } catch (e) {
    throw new Error(`Chain not supported: ${chain}`);
  }
};

export const parseChainBackwardsCompatible = (
  env: Environment['name'],
  chain: Chain | ChainId
) => {
  return parseChain(chainNameBackwardsCompatibility(chain, env));
};

/**
 * The message to be signed when placing an order.
 * @param amount The amount to be sent
 * @param currency The currency to be sent
 * @param receiver The receiver of the funds
 * @param chain The chainId of the network if it's a cross-chain transaction
 * @returns
 * cross-chain:
 * ```ts
 *  Send {CURRENCY} {AMOUNT} to {RECEIVER} on {CHAIN} at {DATE}`
 * ```
 *
 * off-ramp:
 * ```ts
 *  Send {CURRENCY} {AMOUNT} to {RECEIVER} at {DATE}
 * ```
 * @example `Send EUR 1 to 0x1234123412341234123412341234123412341234 on ethereum at 2023-04-30T12:00:00+01:00`
 *
 * @example `Send EUR 1 to IS1234123412341234 at 2023-04-30T12:00:00+01:00`
 */
export const placeOrderMessage = (
  amount: string | number,
  currency: Currency,
  receiver: string,
  chain?: ChainId | Chain
) => {
  const curr = `${currency?.toUpperCase() || 'EUR'}`;

  if (chain) {
    return `Send ${curr} ${amount} to ${receiver} on ${parseChain(chain)} at ${rfc3339(new Date())}`;
  }
  if (curr === 'EUR') {
    return `Send ${curr} ${amount} to ${shortenIban(receiver)} at ${rfc3339(new Date())}`;
  }
  return `Send ${curr} ${amount} to ${receiver} at ${rfc3339(new Date())}`;
};
/**
 * https://monerium.com/siwe
 */
export const siweMessage = ({
  domain,
  address,
  appName,
  redirectUri,
  chainId,
  issuedAt = new Date().toISOString(),
  expiryAt = new Date(Date.now() + 1000 * 60 * 5).toISOString(),
  privacyPolicyUrl,
  termsOfServiceUrl,
}: {
  domain: string;
  address: string;
  appName: string;
  redirectUri: string;
  chainId: EvmChainId;
  issuedAt?: string;
  expiryAt?: string;
  privacyPolicyUrl: string;
  termsOfServiceUrl: string;
}) => {
  return `${domain} wants you to sign in with your Ethereum account:
${address}

Allow ${appName} to access my data on Monerium

URI: ${redirectUri}
Version: 1
Chain ID: ${chainId}
Nonce: ${generateRandomString().slice(0, 16)}
Issued At: ${issuedAt}
Expiration Time: ${expiryAt}
Resources:
- https://monerium.com/siwe
- ${privacyPolicyUrl}
- ${termsOfServiceUrl}`;
};

/**
 * Replacement for URLSearchParams, Metamask snaps do not include node globals.
 * It will not handle all special characters the same way as URLSearchParams, but it will be good enough for our use case.
 * @param body a json format of the body to be encoded
 * @returns 'application/x-www-form-urlencoded' compatible string
 */
export const urlEncoded = (
  body: Record<string, string | boolean | number | undefined>
): string | undefined => {
  return body && Object.entries(body)?.length > 0
    ? Object.entries(body)
        .filter(([_, value]) => value !== undefined) // Filter out undefined values
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value as string | boolean | number)}`
        )
        .join('&')
    : '';
};

/**
 * This will resolve the chainId number to the corresponding chain name.
 * @param chainId The chainId of the network
 * @returns chain name
 * @example
 * ```ts
 * getChain(1) // 'ethereum'
 * getChain(11155111) // 'sepolia'
 *
 * getChain(100) // 'gnosis'
 * getChain(10200) // 'chiado'
 *
 * getChain(137) // 'polygon'
 * getChain(80002) // 'amoy'
 * ```
 */
export const getChain = (chainId: number): Chain => {
  switch (chainId) {
    case 1:
      return 'ethereum';
    case 11155111:
      return 'sepolia';
    case 100:
      return 'gnosis';
    case 10200:
      return 'chiado';
    case 137:
      return 'polygon';
    case 80002:
      return 'amoy';
    case 42161:
      return 'arbitrum';
    case 421614:
      return 'arbitrumsepolia';
    case 59144:
      return 'linea';
    case 59141:
      return 'lineasepolia';
    case 534352:
      return 'scroll';
    case 534351:
      return 'scrollsepolia';
    case 501:
      return 'columbus';
    case 500:
      return 'camino';
    default:
      throw new Error(`Chain not supported: ${chainId}`);
  }
};

export const shortenIban = (iban?: string) => {
  if (typeof iban !== 'string' || !iban?.length) return iban;
  const ns = iban.replace(/\s/g, ''); // remove spaces
  return iban?.length > 11
    ? `${ns.substring(0, 4)}...${ns.substring(ns.length - 4)}`
    : iban;
};

export const shortenAddress = (address?: string) => {
  if (typeof address !== 'string' || !address?.length) return address;
  return address?.length > 11
    ? `${address.substring(0, 7)}...${address.substring(address.length - 5)}`
    : address;
};

export const getAmount = (
  balances?: Balances[],
  address?: string,
  chain?: Chain | ChainId,
  currency?: Currency
): string => {
  if (!balances || !address || !chain) return '0';
  const curr = currency || Currency.eur;

  const balance = balances?.find(
    (account) =>
      account.address === address && account.chain === parseChain(chain)
  )?.balances;

  return balance?.find((balance) => balance.currency === curr)?.amount || '0';
};

const chainNameBackwardsCompatibility = (
  chain: Chain | ChainId,
  env: Environment['name']
) => {
  if (env === 'sandbox') {
    switch (chain) {
      case 'ethereum':
        return 'sepolia';
      case 'polygon':
        return 'amoy';
      case 'gnosis':
        return 'chiado';
      case 'arbitrum':
        return 'arbitrumsepolia';
      case 'linea':
        return 'lineasepolia';
      case 'scroll':
        return 'scrollsepolia';
      case 'camino':
        return 'columbus';
      case 'noble':
        // return 'grand'; // TODO: this might be fixed at some point?
        return 'noble';
      default:
        return chain;
    }
  }
  return chain;
};

export const mapChainIdToChain = (env: Environment['name'], body: any) => {
  if (body?.chain) {
    const { chain, ...rest } = body;

    return {
      ...rest,
      chain: parseChain(chainNameBackwardsCompatibility(chain, env)),
    };
  }
  return body;
};
