import { FC } from 'react';
import styles from './TokenList.module.css';
import { findMatchingUrlAndVersion } from './util';

interface Token {
  address: string;
  chainId: number;
  decimals: number;
  logoURI: string;
  name: string;
  symbol: string;
  tags: string[];
}

interface Network {
  name: string;
  iconUrl: string;
  chainId: number;
  color: string;
  tokens: Token[];
  explorerUrl: string;
  explorerName: string;
}

interface TokenListProps {
  networks: Network[];
}

export const TokenList: FC<TokenListProps> = ({ networks }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };
  console.log('networks', networks);

  return (
    <div id="token-list" className={styles.tokenList}>
      {networks?.map((network) => (
        <div
          key={network.name}
          id={`chain-${network.name}`}
          className={styles.chainRoot}
          style={{ backgroundColor: network.color }}
        >
          <h6>
            <img
              src={network.iconUrl}
              width="30"
              height="30"
              alt={network.name}
            />
            {network.name}
          </h6>
          <ul>
            <li>
              <b>{network.name} chain ID</b>: {network.chainId}
            </li>
            <li>
              <b>Token decimals</b>: 18
            </li>
          </ul>

          <div className={styles.chainTokens}>
            {network?.tokens?.map((token) => {
              const isLegacy = token.tags?.includes('legacy') ?? false;
              const { url, version } = findMatchingUrlAndVersion(token);
              return (
                <div key={token.address} className={styles.chainToken}>
                  <div className={styles.tColCurrency}>
                    <img
                      src={token.logoURI}
                      width="20"
                      height="20"
                      alt={token.symbol}
                    />{' '}
                    {token.symbol}
                  </div>
                  <div className={styles.tColAddress}>
                    {`${token.address.slice(0, 6)}...${token.address.slice(-4)}`}{' '}
                    <button onClick={() => copyToClipboard(token.address)}>
                      <i className="fa-regular fa-copy" aria-hidden="true" />
                    </button>{' '}
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={network.explorerUrl + token.address}
                      title={`View on ${network.explorerName}`}
                    >
                      <i
                        className="fa-solid fa-arrow-up-right-from-square"
                        aria-hidden="true"
                      />
                    </a>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={url}
                      className={styles.version}
                    >
                      {' '}
                      {version}{' '}
                      <i className="fa-brands fa-github" aria-hidden="true" />
                    </a>
                    {isLegacy && (
                      <a href="./contracts-v2#legacy" className={styles.legacy}>
                        Legacy
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
