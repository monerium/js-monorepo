'use client';

import { useRouter } from 'next/navigation';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Chain, ProfileState } from '@monerium/sdk';
import {
  useAddresses,
  useAuth,
  useAuthContext,
  useProfile,
} from '@monerium/sdk-react-provider';

import ChainIcon from 'components/Chains/Icon';
import { getChainConfig } from 'config/chains';

const profileStateColor = (
  state?: ProfileState
): 'success' | 'warning' | 'error' | 'default' => {
  switch (state) {
    case ProfileState.approved:
      return 'success';
    case ProfileState.pending:
      return 'warning';
    case ProfileState.rejected:
    case ProfileState.blocked:
      return 'error';
    default:
      return 'default';
  }
};

export default function ProfilePage() {
  const router = useRouter();
  const { revokeAccess } = useAuth();
  const { data: authContext, isLoading: authLoading } = useAuthContext();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: addressesData, isLoading: addressesLoading } = useAddresses();

  const isLoading = authLoading || profileLoading;
  const addresses = addressesData?.addresses ?? [];

  const handleLogout = () => {
    window.localStorage.removeItem('monerium.insecurely_store_refresh_token');
    revokeAccess();
    router.push('/');
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* User header */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}>
          <AccountCircleIcon sx={{ fontSize: 40 }} />
        </Avatar>
        <Box>
          {isLoading ? (
            <CircularProgress size={20} />
          ) : (
            <>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {authContext?.name || authContext?.email || 'User'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {authContext?.email}
              </Typography>
            </>
          )}
        </Box>
      </Stack>

      {/* Profile details */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Profile
          </Typography>
          {profileLoading ? (
            <CircularProgress size={20} />
          ) : (
            <Stack spacing={1.5}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="body2" color="text.secondary">
                  Type
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ textTransform: 'capitalize' }}
                >
                  {profile?.kind ?? '—'}
                </Typography>
              </Stack>
              <Divider />
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="body2" color="text.secondary">
                  KYC status
                </Typography>
                <Chip
                  label={profile?.state ?? 'unknown'}
                  size="small"
                  color={profileStateColor(profile?.state)}
                />
              </Stack>
              <Divider />
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="body2" color="text.secondary">
                  Profile ID
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}
                >
                  {profile?.id ?? '—'}
                </Typography>
              </Stack>
            </Stack>
          )}
        </CardContent>
      </Card>

      {/* Linked wallets */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Linked wallets
          </Typography>
          {addressesLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : addresses.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No linked wallets.
            </Typography>
          ) : (
            <List disablePadding>
              {addresses.flatMap((addr) =>
                addr.chains.map((chain, i) => (
                  <Box key={`${addr.address}-${chain}`}>
                    {i > 0 && <Divider />}
                    <ListItem disablePadding sx={{ py: 1 }}>
                      <ListItemText
                        disableTypography
                        primary={
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: 'monospace',
                              fontSize: '0.8rem',
                              wordBreak: 'break-all',
                            }}
                          >
                            {addr.address}
                          </Typography>
                        }
                        secondary={
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={0.5}
                            sx={{ mt: 0.5 }}
                          >
                            <ChainIcon chain={chain as Chain} />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {getChainConfig(chain)?.name ?? chain}
                            </Typography>
                          </Stack>
                        }
                      />
                    </ListItem>
                  </Box>
                ))
              )}
            </List>
          )}
        </CardContent>
      </Card>

      <Button
        fullWidth
        variant="outlined"
        color="error"
        size="large"
        startIcon={<LogoutIcon />}
        onClick={handleLogout}
      >
        Log out
      </Button>
    </Box>
  );
}
