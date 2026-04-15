import { FC, useEffect, useState } from 'react';
import { GuidesList } from './GuideList';
import { ChainList, ApiToken, ApiChain, ChainWithTokens } from './TokenList';
import styles from './Token.module.css';

const SYMBOL_ORDER = ['EURe', 'GBPe'];

function buildChainList(
  tokens: ApiToken[],
  chains: ApiChain[]
): ChainWithTokens[] {
  return chains
    .map((chain) => ({
      ...chain,
      tokens: tokens
        .filter((t) => t.chain === chain.id && SYMBOL_ORDER.includes(t.symbol))
        .sort(
          (a, b) =>
            SYMBOL_ORDER.indexOf(a.symbol) - SYMBOL_ORDER.indexOf(b.symbol)
        ),
    }))
    .filter((chain) => chain.tokens.length > 0);
}

async function fetchChainList(baseUrl: string): Promise<ChainWithTokens[]> {
  const [tokens, chains] = await Promise.all([
    fetch(`${baseUrl}/api/tokens`).then((r) => r.json()),
    fetch(`${baseUrl}/api/chains`).then((r) => r.json()),
  ]);
  return buildChainList(tokens, chains);
}

export const TokensPage: FC = () => {
  const [production, setProduction] = useState<ChainWithTokens[]>([]);
  const [sandbox, setSandbox] = useState<ChainWithTokens[]>([]);

  useEffect(() => {
    fetchChainList('https://monerium.app')
      .then(setProduction)
      .catch(console.error);

    fetchChainList('https://sandbox.monerium.dev')
      .then(setSandbox)
      .catch(console.error);
  }, []);

  return (
    <div id="docs-content" className={styles.root}>
      <p>
        Monerium e-money tokens are live on Ethereum, Gnosis, Polygon,
        Arbitrum, Linea, Scroll, Base, Noble, and Camino. The source code, info
        about the token design, and supported ERC standards can be found at our{' '}
        <a href="https://github.com/monerium/smart-contracts">GitHub repo.</a>{' '}
        You can also reach us for technical support on{' '}
        <a href="https://monerium.com/invite/discord">our Discord channel</a>.
      </p>

      <ContractsUpgradeNotice />

      <h2 id="mainnet">Mainnets / Production</h2>
      <ChainList chains={production} />

      <h2 id="sandbox">Testnets / Sandbox</h2>
      <p>
        Our <a href="https://sandbox.monerium.dev/">sandbox</a> is connected to
        Sepolia, Amoy, Chiado and other test networks and can be used for
        testing before releasing to mainnets.
      </p>
      <ChainList chains={sandbox} />

      <GuidesList />
    </div>
  );
};

const ContractsUpgradeNotice: FC = () => (
  <p>
    <a
      href="./contracts-v2"
      style={{
        backgroundColor: '#2f3949',
        color: '#fff',
        padding: '30px',
        borderRadius: '15px',
        display: 'flex',
        cursor: 'pointer',
      }}
    >
      <span style={{ marginRight: '10px' }}>
        <i className="fa fa-info-circle" aria-hidden="true" />
      </span>
      <b>
        The tokens on Ethereum, Gnosis, and Polygon have been upgraded. Click
        here to read everything you need to know.
      </b>
    </a>
  </p>
);

export default TokensPage;
