'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

import { useAuth } from '@monerium/sdk-react-provider';

import { LoadingScreen } from 'components/LoadingScreen';
import BottomNavigation from 'components/Navigation/BottomNavigation';

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

  // Render loading screen if still loading
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Return null if not authorized
  if (!isAuthorized) {
    return null;
  }

  // Render main content if authorized
  return (
    <Box sx={{ pb: 7 }}>
      {children}
      <Paper></Paper>
      <BottomNavigation />
    </Box>
  );
}
