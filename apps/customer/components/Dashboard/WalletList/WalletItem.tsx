'use client';

import { useRouter } from 'next/navigation';
import { ListItemText } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';

import { CurrencyCode } from '@monerium/sdk';

const WalletItem = ({
  address,
  chain,
  currency,
}: {
  address: string;
  chain: string;
  currency: CurrencyCode;
}) => {
  const router = useRouter();
  return (
    <ListItemButton
      key={address}
      onClick={() => router.push(`/wallet/${address}`)}
    >
      <ListItemAvatar>
        <Avatar alt="Currency" src={`/tokens/${currency}.png`} />
      </ListItemAvatar>
      <ListItemText primary={address} secondary={'testing'} />
    </ListItemButton>
  );
};
export default WalletItem;
