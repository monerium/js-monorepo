'use client';
import { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useMonerium } from '@monerium/sdk-react-provider';

import { MoneriumConnect } from 'components/MoneriumConnect/MoneriumConnect';
import { LoadingScreen } from 'src/components/LoadingScreen';

import s from './page.module.scss';

export default function Home() {
  const { isAuthorized, loadingAuth } = useMonerium();
  const router = useRouter();

  useEffect(() => {
    if (isAuthorized) {
      router.push('/dashboard');
    }
  }, [isAuthorized]);

  if (!loadingAuth && !isAuthorized) {
    return (
      <Container component="main" maxWidth="md">
        <Box className={s.logoWrapper}>
          <Image
            className={s.logo}
            src="/monerium-logo.png"
            alt="Monerium logo"
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </Box>
        <Typography variant="h1" sx={{ paddingBottom: 2 }}>
          Onchain fiat infrastructure for builders and businesses
        </Typography>
        <Typography variant="h3">
          Transfer regular money directly between offchain banks and web3 easily
          and instantly. All onchain fiat minted through Monerium is fully
          authorized, fully regulated, and fully backed.
        </Typography>
        <MoneriumConnect />
      </Container>
    );
  }
  return <LoadingScreen />;
}
