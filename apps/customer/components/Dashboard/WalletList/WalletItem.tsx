'use client';

// import { useRouter } from 'next/navigation';
import { ListItemText } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';

import { Currency } from '@monerium/sdk';
import { useBalances } from '@monerium/sdk-react-provider';

const WalletItem = ({
  address,
  chain,
  currency,
}: {
  address: string;
  chain: string;
  currency: Currency;
}) => {
  // const router = useRouter();
  const { data } = useBalances({
    address: address,
    chain: chain,
    currencies: [currency],
  });

  return (
    <ListItemButton
      key={address}
      // onClick={() => router.push(`/wallet/${address}`)}
    >
      <ListItemAvatar>
        <Avatar alt="Currency" src={`/tokens/${currency}.png`} />
      </ListItemAvatar>
      <ListItemText primary={address} secondary={chain} />
      <p>{data?.balances?.[0]?.amount}</p>
    </ListItemButton>
  );
};
export default WalletItem;
