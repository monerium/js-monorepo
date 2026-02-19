'use client';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

import { Currency, shortenAddress } from '@monerium/sdk';
import { useBalances } from '@monerium/sdk-react-provider';

import ChainIcon from 'components/Chains/Icon';
import { getChainConfig } from 'config/chains';
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
    address,
    chain,
    currencies: [currency],
  });

  const { data: ensName } = useEns(address);
  const balance = data?.balances?.[0]?.amount ?? null;
  const chainName = getChainConfig(chain)?.name ?? chain;

  return (
    <ListItemButton sx={{ borderRadius: 2, px: 1, py: 1.25 }}>
      <ListItemAvatar sx={{ minWidth: 44 }}>
        <Avatar
          alt={currency}
          src={`/tokens/${currency}.png`}
          sx={{ width: 36, height: 36 }}
        />
      </ListItemAvatar>

      <ListItemText
        disableTypography
        primary={
          <Typography variant="body2" fontWeight={600} noWrap>
            {ensName || shortenAddress(address)}
          </Typography>
        }
        secondary={
          <Box
            component="span"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              mt: 0.25,
            }}
          >
            <ChainIcon chain={chain} size={14} />
            <Typography variant="caption" color="text.secondary">
              {chainName}
            </Typography>
          </Box>
        }
      />

      {/* Right-aligned balance */}
      <Box sx={{ textAlign: 'right', flexShrink: 0, ml: 1 }}>
        <Typography variant="body2" fontWeight={700}>
          {balance !== null ? parseFloat(balance).toFixed(2) : '—'}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ textTransform: 'uppercase' }}
        >
          {currency}
        </Typography>
      </Box>
    </ListItemButton>
  );
};

export default WalletItem;
