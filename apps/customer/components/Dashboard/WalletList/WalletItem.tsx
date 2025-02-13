'use client';

import { ListItemText } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';

import { Currency, shortenAddress } from '@monerium/sdk';
import { useBalances } from '@monerium/sdk-react-provider';

import { useEns } from 'hooks/useEns';

const WalletItem = ({
  address,
  chain,
  currency,
}: {
  address: string;
  chain: string;
  currency: Currency;
}) => {
  const { data } = useBalances({
    address: address,
    chain: chain,
    currencies: [currency],
  });

  const { data: ensName } = useEns(address);

  return (
    <ListItemButton key={address}>
      <ListItemAvatar>
        <Avatar alt="Currency" src={`/tokens/${currency}.png`} />
      </ListItemAvatar>
      <ListItemText
        primary={ensName || shortenAddress(address)}
        secondary={chain}
      />
      <p>{data?.balances?.[0]?.amount}</p>
    </ListItemButton>
  );
};

export default WalletItem;
