'use client';
import React from 'react';
import Image from 'next/image';
import { useChainId, useSignMessage } from 'wagmi';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { siweMessage } from '@monerium/sdk';
import { useAuth } from '@monerium/sdk-react-provider';

export const MoneriumConnect = () => {
  const { address } = useAccount();
  const { authorize, siwe, error } = useAuth();
  const { signMessageAsync } = useSignMessage();
  const [open, setOpen] = React.useState(!!(error as Error)?.message);
  const chainId = useChainId();

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  const message = siweMessage({
    domain: 'localhost:5000',
    address: `${address}`,
    appName: 'SDK TEST APP',
    redirectUri: 'http://localhost:5000/dashboard',
    chainId: chainId,
    privacyPolicyUrl: 'https://monerium.com/policies/privacy-policy',
    termsOfServiceUrl:
      'https://monerium.com/policies/personal-terms-of-service',
  });

  const signInWithEthereum = () => {
    signMessageAsync({ message }).then((signature) => {
      siwe({ message, signature });
    });
  };

  return (
    <>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleClose}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {(error as Error)?.message}
        </Alert>
      </Snackbar>

      <Stack
        spacing={2}
        sx={{ width: '100%', maxWidth: 400, mx: 'auto', mt: 4 }}
      >
        {/* Primary CTA */}
        <Button
          fullWidth
          size="large"
          variant="contained"
          onClick={() => authorize({ skipKyc: true })}
          sx={{
            py: 1.75,
            fontSize: '1rem',
            fontWeight: 700,
            borderRadius: '50px',
            background: 'linear-gradient(135deg, #316df4 0%, #234dad 100%)',
            boxShadow: '0 4px 24px rgba(49,109,244,0.35)',
            '&:hover': {
              background: 'linear-gradient(135deg, #2d63de 0%, #1b3c86 100%)',
              boxShadow: '0 6px 28px rgba(49,109,244,0.45)',
            },
          }}
          startIcon={
            <Image
              src="/monerium-icon.png"
              alt="Monerium"
              width={20}
              height={24}
              priority
            />
          }
        >
          Continue with Monerium
        </Button>

        {/* Divider */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Divider sx={{ flex: 1 }} />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ whiteSpace: 'nowrap' }}
          >
            or connect your wallet
          </Typography>
          <Divider sx={{ flex: 1 }} />
        </Box>

        {/* Wallet options */}
        <Stack spacing={1.5}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <ConnectButton />
          </Box>

          {address && (
            <Button
              fullWidth
              size="large"
              variant="outlined"
              onClick={signInWithEthereum}
              sx={{ borderRadius: '50px', py: 1.5 }}
            >
              Sign in with Ethereum
            </Button>
          )}
        </Stack>

        <Typography
          variant="caption"
          color="text.secondary"
          align="center"
          sx={{ pt: 1 }}
        >
          By continuing you agree to Monerium&apos;s{' '}
          <Box
            component="a"
            href="https://monerium.com/terms-of-service"
            target="_blank"
            sx={{
              color: 'primary.main',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            Terms of Service
          </Box>{' '}
          and{' '}
          <Box
            component="a"
            href="https://monerium.com/privacy-policy"
            target="_blank"
            sx={{
              color: 'primary.main',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            Privacy Policy
          </Box>
        </Typography>
      </Stack>
    </>
  );
};
