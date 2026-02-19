import Image from 'next/image';

import { Chain } from '@monerium/sdk';

import { getChainConfig } from 'config/chains';

const ChainIcon = ({ chain, size = 24 }: { chain: Chain; size?: number }) => {
  const config = getChainConfig(chain as string);

  if (!config) {
    // Fallback: render a plain text abbreviation if chain is unknown
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: size,
          height: size,
          borderRadius: '50%',
          background: '#eee',
          fontSize: size * 0.4,
          fontWeight: 700,
          color: '#666',
        }}
      >
        {(chain as string).slice(0, 2).toUpperCase()}
      </span>
    );
  }

  return (
    <Image
      src={config.logo}
      alt={config.name}
      width={size}
      height={size}
      style={{ borderRadius: '50%' }}
    />
  );
};

export { ChainIcon };
export default ChainIcon;
