'use client';

import { useState } from 'react';
import { useChainId, useSignMessage } from 'wagmi';
import { useAccount } from 'wagmi';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import {
  Currency,
  Order,
  PaymentStandard,
  placeOrderMessage,
} from '@monerium/sdk';
import { useBalances, usePlaceOrder } from '@monerium/sdk-react-provider';

import Image from 'next/image';
import { getChainConfigById } from 'config/chains';

type Status = 'idle' | 'signing' | 'sending' | 'success' | 'error';

export default function SendPage() {
  const { address: walletAddress } = useAccount();
  const chainId = useChainId();
  const { signMessageAsync } = useSignMessage();

  const [iban, setIban] = useState('FR7630006000011234567890189');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<Currency>(Currency.eur);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('');
  const [memo, setMemo] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { placeOrder } = usePlaceOrder();

  const { data: balancesData, isLoading: balancesLoading } = useBalances({
    address: walletAddress as string,
    chain: chainId,
    currencies: [currency],
  });

  const balance = balancesData?.balances?.[0]?.amount ?? null;
  const chainConfig = getChainConfigById(chainId);

  const handleSend = async () => {
    if (!walletAddress || !iban || !amount || !country) return;

    setErrorMessage(null);
    setStatus('signing');

    const msg = placeOrderMessage(amount, currency, iban);

    try {
      const signature = await signMessageAsync({ message: msg });
      setStatus('sending');

      const result = await placeOrder({
        address: walletAddress,
        amount,
        currency,
        signature,
        counterpart: {
          identifier: {
            standard: PaymentStandard.iban,
            iban,
          },
          details: {
            firstName,
            lastName,
            country,
          },
        },
        chain: chainId,
        message: msg,
        memo: memo || undefined,
      });

      setOrderId((result as Order).id ?? null);
      setStatus('success');
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Something went wrong'
      );
      setStatus('error');
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setOrderId(null);
    setErrorMessage(null);
    setIban('');
    setAmount('');
    setFirstName('');
    setLastName('');
    setCountry('');
    setMemo('');
  };

  if (status === 'success') {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="success" sx={{ mb: 2 }}>
          Payment sent successfully!
        </Alert>
        {orderId && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Order ID: {orderId}
          </Typography>
        )}
        <Button variant="outlined" onClick={handleReset}>
          Send another
        </Button>
      </Box>
    );
  }

  const isLoading = status === 'signing' || status === 'sending';

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Send money
      </Typography>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Stack direction="row" spacing={1}>
            <TextField
              fullWidth
              type="number"
              label="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              inputProps={{ min: 0, step: '0.01' }}
              disabled={isLoading}
            />
            <Select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              disabled={isLoading}
              sx={{ minWidth: 90 }}
            >
              <MenuItem value={Currency.eur}>EUR</MenuItem>
              <MenuItem value={Currency.gbp}>GBP</MenuItem>
              <MenuItem value={Currency.usd}>USD</MenuItem>
            </Select>
          </Stack>
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            spacing={0.75}
            sx={{ mt: 1 }}
          >
            {chainConfig && (
              <Image
                src={chainConfig.logo}
                alt={chainConfig.name}
                width={14}
                height={14}
                style={{ borderRadius: '50%' }}
              />
            )}
            {balancesLoading ? (
              <CircularProgress size={12} />
            ) : (
              <Typography variant="caption" color="text.secondary">
                Balance:{' '}
                <strong>
                  {balance !== null
                    ? `${parseFloat(balance).toFixed(2)} ${currency.toUpperCase()}`
                    : '—'}
                </strong>
              </Typography>
            )}
            {balance !== null && (
              <Button
                size="small"
                variant="text"
                sx={{ minWidth: 0, px: 0.5, py: 0, fontSize: '0.7rem' }}
                onClick={() => setAmount(balance)}
                disabled={isLoading}
              >
                Max
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
            Recipient
          </Typography>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="IBAN"
              value={iban}
              onChange={(e) =>
                setIban(e.target.value.toUpperCase().replace(/\s/g, ''))
              }
              placeholder="e.g. IS500159260076525510730339"
              disabled={isLoading}
            />
            <Stack direction="row" spacing={1}>
              <TextField
                fullWidth
                label="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={isLoading}
              />
              <TextField
                fullWidth
                label="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={isLoading}
              />
            </Stack>
            <TextField
              fullWidth
              label="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value.toUpperCase())}
              placeholder="2-letter code, e.g. IS"
              inputProps={{ maxLength: 2 }}
              disabled={isLoading}
            />
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
            Details (optional)
          </Typography>
          <TextField
            fullWidth
            label="Memo"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="What's this payment for?"
            disabled={isLoading}
          />
        </CardContent>
      </Card>

      {status === 'error' && errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <Button
        fullWidth
        variant="contained"
        size="large"
        onClick={handleSend}
        disabled={isLoading || !iban || !amount || !country || !walletAddress}
        startIcon={
          isLoading ? <CircularProgress size={20} color="inherit" /> : null
        }
      >
        {status === 'signing'
          ? 'Awaiting signature…'
          : status === 'sending'
            ? 'Sending…'
            : 'Sign & Send'}
      </Button>
    </Box>
  );
}
