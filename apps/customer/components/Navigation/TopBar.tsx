'use client';
import { useRouter } from 'next/navigation';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { ThemeModeToggle } from 'components/ThemeModeToggle/ThemeModeToggle';

export const TopBar = () => {
  const router = useRouter();
  return (
    <AppBar position="fixed" elevation={0}>
      <Toolbar>
        <Typography
          variant="subtitle1"
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: 'text.primary',
          }}
        >
          Monerium
        </Typography>
        <ThemeModeToggle />
        <IconButton
          onClick={() => router.push('/profile')}
          aria-label="Profile"
          sx={{ color: 'text.secondary', ml: 0.5 }}
        >
          <AccountCircleIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};
