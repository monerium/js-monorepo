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

export interface ChainEntry {
  chain: ApiChain;
  token: ApiToken;
}

function short(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

const ChainAccordion: FC<{ entry: ChainEntry }> = ({ entry }) => {
  const { chain, token } = entry;
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const explorerUrl = `${chain.explorerUrl}/token/${token.address}`;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(token.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyIcon = copied ? 'solar:check-circle-linear' : 'solar:copy-line-duotone';

  return (
    <div className={styles.accordion}>
      <div
        className={styles.header}
        onClick={() => setExpanded(!expanded)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? setExpanded(!expanded) : undefined}
      >
        <div className={styles.headerLeft}>
          <img
            src={chain.logo}
            width={32}
            height={32}
            alt={chain.label}
            className={styles.chainLogo}
          />
          <span className={styles.chainName}>{chain.label}</span>
        </div>
        <div className={styles.headerRight}>
          {!expanded && (
            <>
              <span
                className={`${styles.addressPill} ${styles.addressFull}`}
                onClick={(e) => e.stopPropagation()}
              >
                {token.address}
              </span>
              <span
                className={`${styles.addressPill} ${styles.addressShort}`}
                onClick={(e) => e.stopPropagation()}
              >
                {short(token.address)}
              </span>
              <button
                className={styles.iconBtn}
                onClick={(e) => { e.stopPropagation(); copyToClipboard(); }}
                title="Copy address"
              >
                <Icon icon={copyIcon} width={16} />
              </button>
              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.iconBtn}
                title={`View on ${chain.explorerName}`}
                onClick={(e) => e.stopPropagation()}
              >
                <Icon icon="solar:arrow-right-up-linear" width={16} />
              </a>
            </>
          )}
          <div className={`${styles.iconBtn} ${expanded ? styles.iconBtnActive : ''}`}>
            <Icon
              icon="solar:alt-arrow-down-linear"
              width={16}
              className={`${styles.chevron} ${expanded ? styles.chevronExpanded : ''}`}
            />
          </div>
        </div>
      </div>

      {expanded && (
        <div className={styles.body}>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Address</span>
            <div className={styles.detailValue}>
              <span className={`${styles.addressPill} ${styles.addressPillExpanded}`}>
                {token.address}
              </span>
              <button className={styles.iconBtn} onClick={copyToClipboard} title="Copy address">
                <Icon icon={copyIcon} width={16} />
              </button>
              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.iconBtn}
                title={`View on ${chain.explorerName}`}
              >
                <Icon icon="solar:arrow-right-up-linear" width={16} />
              </a>
            </div>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Chain ID</span>
            <span className={styles.detailText}>{chain.chainId}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Token</span>
            <span className={styles.detailText}>
              {token.symbol} &middot; {token.decimals} decimals
            </span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Explorer</span>
            <a
              href={chain.explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.explorerLink}
            >
              {chain.explorerName}{' '}
              <Icon icon="solar:arrow-right-up-linear" width={12} />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export const ChainList: FC<{ entries: ChainEntry[] }> = ({ entries }) => {
  if (!entries.length) {
    return <div className={styles.loading}>Loading…</div>;
  }
  return (
    <div className={styles.chainList}>
      {entries.map((entry) => (
        <ChainAccordion key={entry.chain.id} entry={entry} />
      ))}
    </div>
  );
};
