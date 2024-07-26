import { Balances, Chain, ChainId, Currency, Networks, Profile } from './types';

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

/**
 * This will resolve the chainId number to the corresponding chain name.
 * @param chain The chainId of the network
 * @returns chain name, 'ethereum', 'polygon', 'gnosis', etc.
 */
export const parseChain = (chain: Chain | ChainId) => {
  if (typeof chain === 'number') {
    return getChain(chain);
  }
  return chain;
};

/**
 * The message to be signed when placing an order.
 * @param amount The amount to be sent
 * @param currency The currency to be sent
 * @param receiver The receiver of the funds
 * @param chain The chainId of the network if it's a cross-chain transaction
 * @returns string
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
  return `Send ${curr} ${amount} to ${receiver} at ${rfc3339(new Date())}`;
};

/**
 * Replacement for URLSearchParams, Metamask snaps do not include node globals.
 * It will not handle all special characters the same way as URLSearchParams, but it will be good enough for our use case.
 * @param body a json format of the body to be encoded
 * @returns 'application/x-www-form-urlencoded' compatible string
 */
export const urlEncoded = (
  body: Record<string, string>
): string | undefined => {
  return body && Object.entries(body)?.length > 0
    ? Object.entries(body)
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        )
        .join('&')
    : '';
};

/**
 * Get the corresponding Monerium SDK Chain from the current chain id
 * @returns The Chain
 */
export const getChain = (chainId: number): Chain => {
  switch (chainId) {
    case 1:
    case 11155111:
      return 'ethereum';
    case 100:
    case 10200:
      return 'gnosis';
    case 137:
    case 80002:
      return 'polygon';
    default:
      throw new Error(`Chain not supported: ${chainId}`);
  }
};

export const getIban = (
  profile: Profile,
  address: string,
  chain: Chain | ChainId
) => {
  return (
    profile.accounts.find(
      (account) =>
        account.address === address &&
        account.iban &&
        account.chain === parseChain(chain)
    )?.iban ?? ''
  );
};

export const getAmount = (
  balances?: Balances[],
  address?: string,
  chain?: Chain | ChainId,
  currency?: Currency
): string => {
  if (!balances || !address || !chain) return '0';
  const curr = currency || Currency.eur;

  const balance = balances.find(
    (account) =>
      account.address === address && account.chain === parseChain(chain)
  )?.balances;

  return balance?.find((balance) => balance.currency === curr)?.amount || '0';
};

export const mapChainIdToChain = (body: any) => {
  if (body?.chain) {
    const { chain, ...rest } = body;
    return {
      ...rest,
      chain: parseChain(chain),
    };
  }
  return body;
};
