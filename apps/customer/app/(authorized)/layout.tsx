'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

import { useAuth } from '@monerium/sdk-react-provider';

import { LoadingScreen } from 'components/LoadingScreen';
import BottomNavigation from 'components/Navigation/BottomNavigation';
import { TopBar } from 'components/Navigation/TopBar';

export default function AuthorizedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { isAuthorized, isLoading } = useAuth();

  useEffect(() => {
    if (!isAuthorized && !isLoading) {
      router.push('/');
    }
  }, [isAuthorized, isLoading, router]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <>
      <TopBar />
      <Box sx={{ pb: 7 }}>
        {/* Toolbar acts as a spacer so content isn't hidden under the fixed AppBar */}
        <Toolbar />
        {children}
      </Box>
      <BottomNavigation />
    </>
  );
}
