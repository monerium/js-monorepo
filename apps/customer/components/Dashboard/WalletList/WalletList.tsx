import { memo } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';

import { Currency } from '@monerium/sdk';
import { useAddresses } from '@monerium/sdk-react-provider';

import { ChainSelection } from '../types';
import WalletItem from './WalletItem';

const WalletList = memo(
  ({
    selectedChain,
    selectedCurrency,
  }: {
    selectedChain: ChainSelection;
    selectedCurrency: Currency;
  }) => {
    const { data, isLoading } = useAddresses();

    const filteredList =
      selectedChain !== 'all'
        ? data?.addresses?.filter((a) => a.chains?.includes(selectedChain))
        : data?.addresses;

    const addressAndChain =
      data?.addresses?.flatMap((address) => {
        return address.chains.map((chain) => ({
          address: address.address,
          chain: chain,
        }));
      }) || [];

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
                {addressAndChain?.map((add, i) => (
                  <WalletItem
                    key={i}
                    address={add.address}
                    chain={add.chain}
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
