import { FC, useEffect, useState } from 'react';
import { GuidesList } from './GuideList';
import { TokenList } from './TokenList';
import chains from './chains';
import styles from './Token.module.css';

export const TokensPage: FC = () => {
  const [tokenData, setTokenData] = useState(null);
  const [sandboxTokenData, setSandboxTokenData] = useState(null);

  const fetchMainnetTokens = async () => {
    try {
      const response = await fetch('https://monerium.app/tokens.json');
      const data = await response.json();
      setTokenData(data);
    } catch (error) {
      console.error('Error fetching mainnet tokens:', error);
    }
  };

  const fetchSandboxTokens = async () => {
    try {
      const response = await fetch('https://monerium.app/tokens-sandbox.json');
      const data = await response.json();
      setSandboxTokenData(data);
    } catch (error) {
      console.error('Error fetching sandbox tokens:', error);
    }
  };

  useEffect(() => {
    fetchMainnetTokens();
    fetchSandboxTokens();
  }, []);

  const filterAndSort = (chainId: number) => {
    const symbolOrder = ['EURe', 'GBPe', 'USDe', 'ISKe'];
    // Try mainnet tokens first
    const mainnetTokens = tokenData?.tokens.filter(
      (i) => i.chainId === chainId
    );
    // If no mainnet tokens found, try sandbox tokens
    const tokens = mainnetTokens?.length
      ? mainnetTokens
      : sandboxTokenData?.tokens?.filter((i) => i.chainId === chainId);

    return tokens?.sort((a, b) => {
      // First sort by symbol order
      const symbolDiff =
        symbolOrder.indexOf(a.symbol) - symbolOrder.indexOf(b.symbol);
      if (symbolDiff !== 0) return symbolDiff;

      // If same symbol, sort by legacy status
      const aIsLegacy = a.tags?.includes('legacy') ?? false;
      const bIsLegacy = b.tags?.includes('legacy') ?? false;
      if (aIsLegacy && !bIsLegacy) return 1;
      if (!aIsLegacy && bIsLegacy) return -1;
      return 0;
    });
  };

  const productionChains = chains
    .filter((c) => !c.testnet)
    ?.map((chain) => {
      return {
        ...chain,
        tokens: filterAndSort(chain.chainId),
        iconUrl: chain.logo,
      };
    });

  const sandboxChains = chains
    .filter((c) => c.testnet)
    .map((chain) => {
      return {
        ...chain,
        tokens: filterAndSort(chain.chainId),
        iconUrl: chain.logo,
      };
    });

  return (
    <div id="docs-content" className={styles.root}>
      <p>
        Monerium e-money tokens are live on Ethereum, Gnosis and Polygon. The
        source code, info about the token design, and supported ERC standards
        can be found at our{' '}
        <a href="https://github.com/monerium/smart-contracts">GitHub repo.</a>{' '}
        You can also reach us for technical support on{' '}
        <a href="https://monerium.com/invite/discord">our Discord channel</a>.
      </p>

      <ContractsUpgradeNotice />

      <h2 id="mainnet">Mainnets / Production</h2>
      <TokenList networks={productionChains} />

      <h2 id="sandbox">Testnets / Sandbox</h2>
      <p>
        Our <a href="https://sandbox.monerium.dev/">sandbox</a> is connected to
        Sepolia, Amoy, and Chiado test networks and can be used for testing
        before releasing to mainnets.
      </p>
      <TokenList networks={sandboxChains} />

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
