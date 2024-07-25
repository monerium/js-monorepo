'use client';
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
  const { isAuthorized, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isLoading && !isAuthorized) {
    router.push('/');
  }

  if (isAuthorized) {
    return (
      <>
        <Box sx={{ pb: 7 }}>
          {children}
          <Paper></Paper>
          <BottomNavigation />
        </Box>
      </>
    );
  }
  return null;
}
