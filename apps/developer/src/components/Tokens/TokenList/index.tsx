import { FC, useState } from 'react';
import { Icon } from '@iconify/react';
import styles from './TokenList.module.css';

export interface ApiToken {
  address: string;
  chain: string;
  chainId: string;
  currency: string;
  decimals: number;
  symbol: string;
  kind: string;
  ticker: string;
}

export interface ApiChain {
  id: string;
  chain: string;
  chainId: string;
  kind: string;
  label: string;
  explorerUrl: string;
  explorerName: string;
  logo: string;
  color: string;
}

export interface ChainWithTokens extends ApiChain {
  tokens: ApiToken[];
}

const ChainAccordion: FC<{ chain: ChainWithTokens }> = ({ chain }) => {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  const explorerUrl = (token: ApiToken): string | null => {
    if (!token.address || chain.kind === 'cosmos') return null;
    return `${chain.explorerUrl}/token/${token.address}`;
  };

  return (
    <div className={styles.accordion}>
      <button
        className={styles.header}
        style={{ backgroundColor: chain.color }}
        onClick={() => setExpanded(!expanded)}
      >
        <div className={styles.headerLeft}>
          <img
            src={chain.logo}
            width={26}
            height={26}
            alt={chain.label}
            className={styles.chainLogo}
          />
          <span className={styles.chainName}>{chain.label}</span>
          <span className={styles.chainIdBadge}>{chain.chainId}</span>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.tokenBadges}>
            {chain.tokens.map((t) => (
              <span key={t.symbol} className={styles.tokenBadge}>
                {t.symbol}
              </span>
            ))}
          </div>
          <Icon
            icon={
              expanded
                ? 'solar:alt-arrow-up-linear'
                : 'solar:alt-arrow-down-linear'
            }
            className={styles.chevron}
          />
        </div>
      </button>

      {expanded && (
        <div className={styles.body}>
          {chain.tokens.map((token) => {
            const url = explorerUrl(token);
            const isCopied = copied === token.address;
            return (
              <div key={token.symbol} className={styles.tokenRow}>
                <span className={styles.tokenSymbol}>{token.symbol}</span>
                <div className={styles.tokenAddress}>
                  {token.address ? (
                    <>
                      <code className={styles.address}>{token.address}</code>
                      <button
                        className={styles.iconBtn}
                        onClick={() => copyToClipboard(token.address)}
                        title="Copy address"
                      >
                        <Icon
                          icon={
                            isCopied
                              ? 'solar:check-circle-linear'
                              : 'solar:copy-line-duotone'
                          }
                        />
                      </button>
                      {url && (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.iconBtn}
                          title={`View on ${chain.explorerName}`}
                        >
                          <Icon icon="solar:arrow-right-up-linear" />
                        </a>
                      )}
                    </>
                  ) : (
                    <span className={styles.noAddress}>—</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

interface ChainListProps {
  chains: ChainWithTokens[];
}

export const ChainList: FC<ChainListProps> = ({ chains }) => {
  if (!chains.length) {
    return <div className={styles.loading}>Loading…</div>;
  }
  return (
    <div className={styles.chainList}>
      {chains.map((chain) => (
        <ChainAccordion key={chain.id} chain={chain} />
      ))}
    </div>
  );
};
