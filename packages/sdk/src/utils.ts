import { Balances, Chain, ChainId, Currency } from './types';

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
 * This will resolve the chainId number to the corresponding chain name.
 * @param chainId The chainId of the network
 * @returns chain name
 * @example
 * ```ts
 * getChain(1) // 'ethereum'
 * getChain(11155111) // 'ethereum'
 *
 * getChain(100) // 'gnosis'
 * getChain(10200) // 'gnosis'
 *
 * getChain(137) // 'polygon'
 * getChain(80002) // 'polygon'
 * ```
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
