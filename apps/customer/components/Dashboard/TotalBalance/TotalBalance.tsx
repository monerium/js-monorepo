import { memo } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import { Currency } from '@monerium/sdk';

function amountFormat(amount: number, currencyCode: Currency) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(amount);
}

const TotalBalance = memo(
  ({
    totalBalance,
    currency,
  }: {
    totalBalance: number;
    currency: Currency;
  }) => {
    return (
      <Card
        sx={{
          mx: 2,
          mb: 1,
          border: 'none',
          borderRadius: 4,
          background: 'linear-gradient(135deg, #316df4 0%, #234dad 100%)',
          color: '#fff',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Decorative circles */}
        <Box
          sx={{
            position: 'absolute',
            width: 180,
            height: 180,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            top: -60,
            right: -40,
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            bottom: -30,
            right: 60,
            pointerEvents: 'none',
          }}
        />

        <CardContent sx={{ p: '24px !important' }}>
          <Typography
            variant="overline"
            sx={{
              color: 'rgba(255,255,255,0.7)',
              letterSpacing: '0.1em',
              fontSize: '0.7rem',
              display: 'block',
              mb: 0.5,
            }}
          >
            Total balance
          </Typography>
          <Typography
            sx={{
              fontSize: 'clamp(2rem, 8vw, 2.75rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              color: '#fff',
            }}
          >
            {amountFormat(totalBalance, currency)}
          </Typography>
        </CardContent>
      </Card>
    );
  }
);
TotalBalance.displayName = 'TotalBalance';
export default TotalBalance;
