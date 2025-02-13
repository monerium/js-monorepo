import { Dispatch, memo, SetStateAction } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import { useTokens } from '@monerium/sdk-react-provider';

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
    const uniqueChains = Array.from(
      new Set(tokens?.map((token) => token.chain))
    );
    return (
      <Stack direction="row" spacing={1} sx={{ flexGrow: 1 }}>
        <Button
          variant="plain"
          onClick={() => setSelected('all')}
          disabled={selected === 'all'}
        >
          All chains
        </Button>
        {uniqueChains.map((chain) => (
          <Button
            key={chain}
            variant="plain"
            onClick={() => setSelected(chain)}
            disabled={selected === chain}
          >
            {chain}
          </Button>
        ))}
      </Stack>
    );
  }
);
export default ChainFilter;
