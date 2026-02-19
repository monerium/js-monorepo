import { Dispatch, memo, SetStateAction } from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

import { Chain } from '@monerium/sdk';
import { useTokens } from '@monerium/sdk-react-provider';

import { getChainConfig } from 'config/chains';
import { ChainSelection } from '../types';

const ChainFilter = memo(
  ({
    selected,
    setSelected,
  }: {
    selected: ChainSelection;
    setSelected: Dispatch<SetStateAction<ChainSelection>>;
  }) => {
    const { data: tokens } = useTokens();
    const uniqueChains: Chain[] = Array.from(
      new Set(tokens?.map((token) => token.chain))
    );

    return (
      <Stack direction="row" spacing={1} sx={{ flexGrow: 1, flexWrap: 'wrap' }}>
        <Chip
          label="All"
          onClick={() => setSelected('all')}
          variant={selected === 'all' ? 'filled' : 'outlined'}
          color={selected === 'all' ? 'primary' : 'default'}
          size="small"
          sx={{ fontWeight: selected === 'all' ? 700 : 500 }}
        />
        {uniqueChains.map((chain) => (
          <Chip
            key={chain}
            label={getChainConfig(chain)?.name ?? chain}
            onClick={() => setSelected(chain)}
            variant={selected === chain ? 'filled' : 'outlined'}
            color={selected === chain ? 'primary' : 'default'}
            size="small"
            sx={{ fontWeight: selected === chain ? 700 : 500 }}
          />
        ))}
      </Stack>
    );
  }
);
ChainFilter.displayName = 'ChainFilter';
export default ChainFilter;
