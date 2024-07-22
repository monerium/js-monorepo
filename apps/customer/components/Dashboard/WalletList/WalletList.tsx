import {
  Dispatch,
  memo,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ListItemText } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import Typography from '@mui/material/Typography';

import { Balances, Currency } from '@monerium/sdk';
import { useBalances } from '@monerium/sdk-react-provider';

import { Account, ChainSelection } from '../types';
import { flattenSortAndSumBalances } from './utils';

const WalletList = memo(
  ({
    selectedChain,
    selectedCurrency,
    setTotalBalance,
  }: {
    selectedChain: ChainSelection;
    selectedCurrency: Currency;
    setTotalBalance: Dispatch<SetStateAction<number>>;
  }) => {
    const router = useRouter();
    const [filteredList, setFilteredList] = useState<Account[]>();
    const { balances, isLoading: loadingBalances } = useBalances({
      query: {
        refetchOnWindowFocus: false,
      },
    });

    const handleBalanceFiltering = useCallback(() => {
      let filtered: Balances[] | undefined = balances;

      if (!filtered) return;
      if (selectedChain !== 'all') {
        filtered = filtered?.filter((b) => b.chain === selectedChain);
      }

      let { list, sum } = flattenSortAndSumBalances(filtered, selectedCurrency);

      setFilteredList(list);
      setTotalBalance(sum);
    }, [selectedChain, balances, selectedCurrency]);

    useEffect(() => {
      handleBalanceFiltering();
    }, [selectedChain, selectedCurrency, balances]);

    return (
      <Card sx={{ m: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ pb: 1 }}>
            Wallets
          </Typography>
          <List>
            {loadingBalances ? (
              <Typography variant="body1">Loading...</Typography>
            ) : (
              <>
                {filteredList?.map((account, i) => (
                  <ListItemButton
                    key={i + account.id}
                    onClick={() => router.push(`/wallet/${account.address}`)}
                  >
                    <ListItemAvatar>
                      <Avatar
                        alt="Currency"
                        src={`/tokens/${account.currency}.png`}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={account.address}
                      secondary={'testing'}
                    />
                    <p>
                      {account.amount} {account.currency}
                    </p>
                  </ListItemButton>
                ))}
              </>
            )}
            {!loadingBalances && balances?.length === 0 && (
              <Typography variant="body1">No wallets found.</Typography>
            )}
          </List>
        </CardContent>
      </Card>
    );
  }
);
export default WalletList;
