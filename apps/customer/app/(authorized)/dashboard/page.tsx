'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import { Currency } from '@monerium/sdk';
import { useAuth } from '@monerium/sdk-react-provider';

import ChainFilter from 'components/Dashboard/Filters/ChainFilter';
import TokenFilter from 'components/Dashboard/Filters/TokenFilter';
import TotalBalance from 'components/Dashboard/TotalBalance';
import { ChainSelection } from 'components/Dashboard/types';
import WalletList from 'components/Dashboard/WalletList';
import { useTotalBalance } from 'hooks/useTotalBalance';

function Dashboard() {
  const [selectedChain, setSelectedChain] = useState<ChainSelection>('all');
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(
    Currency.eur
  );

  const { data: totalBalance } = useTotalBalance(
    selectedChain === 'all' ? undefined : selectedChain,
    selectedCurrency
  );

  const { revokeAccess } = useAuth();

  return (
    <Box sx={{ pt: 7 }}>
      <Stack direction="row" sx={{ p: 3 }}>
        <ChainFilter selected={selectedChain} setSelected={setSelectedChain} />
        <TokenFilter
          selected={selectedCurrency}
          setSelected={setSelectedCurrency}
        />
      </Stack>
      <TotalBalance
        totalBalance={totalBalance || 0.0}
        currency={selectedCurrency}
      />

      <WalletList
        selectedChain={selectedChain}
        selectedCurrency={selectedCurrency}
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 2, // adds some margin top, adjust as needed
        }}
      >
        <Button
          color="error"
          size="large"
          variant="outlined"
          onClick={() => {
            window.localStorage.removeItem(
              'monerium.insecurely_store_refresh_token'
            );
            revokeAccess();
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
}
export default Dashboard;
