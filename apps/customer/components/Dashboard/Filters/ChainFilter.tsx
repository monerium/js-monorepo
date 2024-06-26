import { Dispatch, memo, SetStateAction } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import ChainIcon from 'components/Chains/Icon';
import { ChainSelection } from '../types';

const ChainFilter = memo(
  ({
    selected,
    setSelected,
  }: {
    selected: ChainSelection;
    setSelected: Dispatch<SetStateAction<ChainSelection>>;
  }) => {
    return (
      <Stack direction="row" spacing={1} sx={{ flexGrow: 1 }}>
        <Button
          variant="plain"
          onClick={() => setSelected('all')}
          disabled={selected === 'all'}
        >
          All chains
        </Button>
        <Button
          variant="plain"
          onClick={() => setSelected('gnosis')}
          disabled={selected === 'gnosis'}
          startIcon={<ChainIcon chain="gnosis" />}
        >
          Gnosis
        </Button>
        <Button
          variant="plain"
          onClick={() => setSelected('polygon')}
          disabled={selected === 'polygon'}
          startIcon={<ChainIcon chain="polygon" />}
        >
          Polygon
        </Button>
        <Button
          variant="plain"
          onClick={() => setSelected('ethereum')}
          disabled={selected === 'ethereum'}
          startIcon={<ChainIcon chain="ethereum" />}
        >
          Ethereum
        </Button>
      </Stack>
    );
  }
);
export default ChainFilter;
