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
  Chain,
  Currency,
  Order,
  PaymentStandard,
  placeOrderMessage,
  shortenAddress,
} from '@monerium/sdk';
import { useAddresses, usePlaceOrder } from '@monerium/sdk-react-provider';

import { getChainConfig } from 'config/chains';

type Status = 'idle' | 'signing' | 'sending' | 'success' | 'error';

interface AddressChainOption {
  address: string;
  chain: Chain;
  label: string;
}

export default function BridgePage() {
  const { address: walletAddress } = useAccount();
  const chainId = useChainId();
  const { signMessageAsync } = useSignMessage();
  const { data: addressesData, isLoading: addressesLoading } = useAddresses();

  // Flatten all user-owned address+chain pairs into a single list
  const addressOptions: AddressChainOption[] =
    addressesData?.addresses.flatMap((addr) =>
      addr.chains.map((chain) => ({
        address: addr.address,
        chain,
        label: `${shortenAddress(addr.address)} — ${getChainConfig(chain)?.name ?? chain}`,
      }))
    ) ?? [];

  const [selectedOption, setSelectedOption] = useState<string>('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<Currency>(Currency.eur);
  const [memo, setMemo] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { placeOrder } = usePlaceOrder();

  // Derive the selected address and chain from the composite key "address::chain"
  const selectedParsed = selectedOption
    ? addressOptions.find((o) => `${o.address}::${o.chain}` === selectedOption)
    : undefined;

  const handleBridge = async () => {
    if (!walletAddress || !selectedParsed || !amount) return;

    setErrorMessage(null);
    setStatus('signing');

    const msg = placeOrderMessage(
      amount,
      currency,
      selectedParsed.address,
      selectedParsed.chain
    );

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
            standard: PaymentStandard.chain,
            address: selectedParsed.address,
            chain: selectedParsed.chain,
          },
          details: {},
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
    setSelectedOption('');
    setAmount('');
    setMemo('');
  };

  if (status === 'success') {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="success" sx={{ mb: 2 }}>
          Bridge order placed successfully!
        </Alert>
        {orderId && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Order ID: {orderId}
          </Typography>
        )}
        <Button variant="outlined" onClick={handleReset}>
          Bridge again
        </Button>
      </Box>
    );
  }

  const isLoading = status === 'signing' || status === 'sending';

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Bridge
      </Typography>

      {/* From */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            From
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
            {walletAddress ? shortenAddress(walletAddress) : '—'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Chain ID: {chainId}
          </Typography>
        </CardContent>
      </Card>

      {/* To — only the user's own Monerium-linked addresses */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
            To
          </Typography>
          {addressesLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
              <CircularProgress size={24} />
            </Box>
          ) : addressOptions.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No linked addresses found.
            </Typography>
          ) : (
            <Select
              fullWidth
              displayEmpty
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
              disabled={isLoading}
              renderValue={(v) =>
                v
                  ? (addressOptions.find(
                      (o) => `${o.address}::${o.chain}` === v
                    )?.label ?? v)
                  : 'Select destination address'
              }
            >
              {addressOptions.map((opt) => {
                const key = `${opt.address}::${opt.chain}`;
                return (
                  <MenuItem key={key} value={key}>
                    <Stack>
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: 'monospace' }}
                      >
                        {opt.address}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {getChainConfig(opt.chain)?.name ?? opt.chain}
                      </Typography>
                    </Stack>
                  </MenuItem>
                );
              })}
            </Select>
          )}
        </CardContent>
      </Card>

      {/* Amount */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
            Amount
          </Typography>
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
        </CardContent>
      </Card>

      {/* Memo */}
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
            placeholder="Note for this transaction"
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
        onClick={handleBridge}
        disabled={isLoading || !selectedOption || !amount || !walletAddress}
        startIcon={
          isLoading ? <CircularProgress size={20} color="inherit" /> : null
        }
      >
        {status === 'signing'
          ? 'Awaiting signature…'
          : status === 'sending'
            ? 'Bridging…'
            : 'Sign & Bridge'}
      </Button>
    </Box>
  );
}
