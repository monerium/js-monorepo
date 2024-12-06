import { Dispatch, memo, SetStateAction } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';

import { CurrencyCode } from '@monerium/sdk';
import { useAddresses } from '@monerium/sdk-react-provider';

import { ChainSelection } from '../types';
import WalletItem from './WalletItem';

const WalletList = memo(
  ({
    selectedChain,
    selectedCurrency,
    setTotalBalance,
  }: {
    selectedChain: ChainSelection;
    selectedCurrency: CurrencyCode;
    setTotalBalance: Dispatch<SetStateAction<number>>;
  }) => {
    const { data, isLoading } = useAddresses();

    const filteredList =
      selectedChain !== 'all'
        ? data?.addresses?.filter((a) => a.chains?.includes(selectedChain))
        : data?.addresses;

    return (
      <Card sx={{ m: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ pb: 1 }}>
            Wallets
          </Typography>
          <List>
            {isLoading ? (
              <Typography variant="body1">Loading...</Typography>
            ) : (
              <>
                {filteredList?.map((add, i) => (
                  <WalletItem
                    key={i}
                    address={add.address}
                    chain={selectedChain}
                    currency={selectedCurrency}
                  />
                ))}
              </>
            )}
            {!isLoading && filteredList?.length === 0 && (
              <Typography variant="body1">No wallets found.</Typography>
            )}
          </List>
        </CardContent>
      </Card>
    );
  }
);
export default WalletList;
