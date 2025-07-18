'use client';
import React from 'react';
import Image from 'next/image';
import { useChainId, useSignMessage } from 'wagmi';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';

import { siweMessage } from '@monerium/sdk';
import { useAuth } from '@monerium/sdk-react-provider';

import s from './MoneriumConnect.module.scss';
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
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const message = siweMessage({
    domain: 'localhost:3000',
    address: `${address}`,
    appName: 'SDK TEST APP',
    redirectUri: 'http://localhost:3000/dashboard',
    chainId: chainId,
    privacyPolicyUrl: 'https://example.com/privacy-policy',
    termsOfServiceUrl: 'https://example.com/terms-of-service',
  });

  const signInWithEthereum = () => {
    signMessageAsync({
      message: message,
    }).then((signature) => {
      siwe({
        message: message,
        signature: signature,
      });
    });
  };

  return (
    <>
      <Snackbar
        color="error"
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
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
      <Box className={s.wrapper}>
        <Box className={s.topwrapper}>
          <Button
            href="https://monerium.com"
            size="large"
            variant="contained"
            onClick={() => {}}
          >
            Read more
          </Button>
          <Button
            size="large"
            variant="outlined"
            onClick={() => authorize()}
            startIcon={
              <Image
                src="/monerium-icon.png"
                alt="Monerium icon"
                width={16}
                height={20}
                priority
              />
            }
          >
            Connect
          </Button>
        </Box>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <ConnectButton />
          <Button
            size="large"
            variant="outlined"
            onClick={() => signInWithEthereum()}
          >
            Sign In with Ethereum
          </Button>
        </div>
      </Box>
    </>
  );
};
