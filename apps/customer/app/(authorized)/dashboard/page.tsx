'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { Currency } from '@monerium/sdk';

import ChainFilter from 'components/Dashboard/Filters/ChainFilter';
import TokenFilter from 'components/Dashboard/Filters/TokenFilter';
import TotalBalance from 'components/Dashboard/TotalBalance';
import { ChainSelection } from 'components/Dashboard/types';
import WalletList from 'components/Dashboard/WalletList';

function Dashboard() {
  const [selectedChain, setSelectedChain] = useState<ChainSelection>('all');
  const [totalBalance, setTotalBalance] = useState<number>(0.0);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(
    Currency.eur
  );

  return (
    <Box sx={{ pt: 7 }}>
      <Stack direction="row" sx={{ p: 3 }}>
        <ChainFilter selected={selectedChain} setSelected={setSelectedChain} />
        <TokenFilter
          selected={selectedCurrency}
          setSelected={setSelectedCurrency}
        />
      </Stack>
      <TotalBalance totalBalance={totalBalance} currency={selectedCurrency} />

      <WalletList
        setTotalBalance={setTotalBalance}
        selectedChain={selectedChain}
        selectedCurrency={selectedCurrency}
      />
    </Box>
  );
}
export default Dashboard;
