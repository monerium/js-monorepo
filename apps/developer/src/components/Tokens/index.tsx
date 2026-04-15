import { FC, useEffect, useMemo, useState } from 'react';
import { GuidesList } from './GuideList';
import { ChainList, ChainEntry, ApiToken, ApiChain } from './TokenList';
import styles from './Token.module.css';

const CHAIN_ORDER = [
  'ethereum',
  'gnosis',
  'polygon',
  'arbitrum',
  'base',
  'linea',
  'scroll',
  'camino',
  'noble',
];

function toEntries(
  chains: ApiChain[],
  tokens: ApiToken[],
  currency: string
): ChainEntry[] {
  return chains
    .map((chain) => ({
      chain,
      token: tokens.find((t) => t.chain === chain.id && t.symbol === currency),
    }))
    .filter((e): e is ChainEntry => !!e.token?.address)
    .sort((a, b) => {
      const ai = CHAIN_ORDER.indexOf(a.chain.chain);
      const bi = CHAIN_ORDER.indexOf(b.chain.chain);
      if (ai === -1 && bi === -1)
        return a.chain.label.localeCompare(b.chain.label);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
}

interface NetworkData {
  chains: ApiChain[];
  tokens: ApiToken[];
}

const CURRENCIES = ['EURe', 'GBPe'] as const;
type Currency = (typeof CURRENCIES)[number];

export const TokensPage: FC = () => {
  const [mainnet, setMainnet] = useState<NetworkData>({
    chains: [],
    tokens: [],
  });
  const [testnet, setTestnet] = useState<NetworkData>({
    chains: [],
    tokens: [],
  });
  const [currency, setCurrency] = useState<Currency>('EURe');

  useEffect(() => {
    fetch('https://monerium.app/api/chains')
      .then((r) => r.json())
      .then((chains) =>
        fetch('https://monerium.app/api/tokens')
          .then((r) => r.json())
          .then((tokens) => setMainnet({ chains, tokens }))
      )
      .catch(console.error);

    fetch('https://sandbox.monerium.dev/api/chains')
      .then((r) => r.json())
      .then((chains) =>
        fetch('https://sandbox.monerium.dev/api/tokens')
          .then((r) => r.json())
          .then((tokens) => setTestnet({ chains, tokens }))
      )
      .catch(console.error);
  }, []);

  const mainnetEntries = useMemo(
    () => toEntries(mainnet.chains, mainnet.tokens, currency),
    [mainnet, currency]
  );

  const testnetEntries = useMemo(
    () => toEntries(testnet.chains, testnet.tokens, currency),
    [testnet, currency]
  );

  return (
    <div id="docs-content" className={styles.root}>
      <p>
        Monerium e-money tokens are live on Ethereum, Gnosis, Polygon, Arbitrum,
        Base, Linea, Scroll, Noble, and Camino. The source code, info about the
        token design, and supported ERC standards can be found at our{' '}
        <a href="https://github.com/monerium/smart-contracts">GitHub repo.</a>.
      </p>

      <p>
        Select a currency to browse its contract address on each supported
        chain. Expand a chain to view the full address and chain details.
      </p>

      <div className={styles.tabs}>
        {CURRENCIES.map((c) => (
          <button
            key={c}
            className={`${styles.tab} ${currency === c ? styles.tabActive : ''}`}
            onClick={() => setCurrency(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <h2 id="mainnet">Mainnets</h2>
      <ChainList entries={mainnetEntries} />

      <h2 id="testnet">Testnets</h2>
      <p>
        Our <a href="https://sandbox.monerium.dev/">sandbox</a> is connected to
        Sepolia, Amoy, Chiado and other test networks and can be used for
        testing before releasing to mainnet.
      </p>
      <ChainList entries={testnetEntries} />
      <GuidesList />

      <h2 id="icons">Icons</h2>
      <p>Download the {currency} token icon for use in your application.</p>
      <div className={styles.iconCards}>
        {(['svg', 'png'] as const).map((fmt) => {
          const url = `/img/tokens/${currency.toLowerCase()}.${fmt}`;
          return (
            <div key={fmt} className={styles.iconCard}>
              <img
                src={url}
                alt={`${currency} ${fmt.toUpperCase()}`}
                width={64}
                height={64}
              />
              <span className={styles.iconFormat}>{fmt.toUpperCase()}</span>
              <a href={url} download className={styles.downloadBtn}>
                Download
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TokensPage;
