'use client';
import { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useAuth } from '@monerium/sdk-react-provider';

import { MoneriumConnect } from 'components/MoneriumConnect/MoneriumConnect';
import { LoadingScreen } from 'components/LoadingScreen';

export default function Home() {
  const { isAuthorized, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthorized) {
      router.push('/dashboard');
    }
  }, [isAuthorized, router]);

  if (isLoading) return <LoadingScreen />;
  if (isAuthorized) return null;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 6,
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
        }}
      >
        {/* Logo */}
        <Box sx={{ position: 'relative', width: 140, height: 40 }}>
          <Image
            src="/monerium-logo.png"
            alt="Monerium"
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </Box>

        {/* Hero text */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            component="h1"
            sx={{
              fontSize: 'clamp(2rem, 6vw, 2.75rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              color: 'text.primary',
              mb: 2,
            }}
          >
            Onchain fiat,{' '}
            <Box component="span" sx={{ color: 'primary.main' }}>
              instant
            </Box>{' '}
            and regulated.
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              fontSize: '1.05rem',
              lineHeight: 1.6,
              maxWidth: 420,
              mx: 'auto',
            }}
          >
            Send and receive money between your wallet and bank accounts. Fully
            authorized, fully backed.
          </Typography>
        </Box>

        {/* Connect card */}
        <MoneriumConnect />
      </Container>
    </Box>
  );
}
