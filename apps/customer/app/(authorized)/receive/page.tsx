'use client';

import { useState } from 'react';
import CheckIcon from '@mui/icons-material/Check';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { AccountState, Chain, shortenAddress } from '@monerium/sdk';
import { getChainConfig } from 'config/chains';
import {
  useAddresses,
  useIBANs,
  useRequestIban,
} from '@monerium/sdk-react-provider';

import ChainIcon from 'components/Chains/Icon';

const ibanStateColor = (
  state: AccountState
): 'success' | 'warning' | 'info' | 'error' | 'default' => {
  switch (state) {
    case AccountState.approved:
      return 'success';
    case AccountState.pending:
      return 'warning';
    case AccountState.requested:
      return 'info';
    case AccountState.rejected:
      return 'error';
    default:
      return 'default';
  }
};

const CopyButton = ({ value }: { value: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <IconButton
      size="small"
      onClick={handleCopy}
      aria-label="Copy to clipboard"
    >
      {copied ? (
        <CheckIcon fontSize="small" color="success" />
      ) : (
        <ContentCopyIcon fontSize="small" />
      )}
    </IconButton>
  );
};

export default function ReceivePage() {
  const { data: ibansData, isLoading: ibansLoading } = useIBANs();
  const { data: addressesData, isLoading: addressesLoading } = useAddresses();
  const { requestIban } = useRequestIban();

  const [requesting, setRequesting] = useState(false);
  const [requested, setRequested] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);

  const ibans = ibansData?.ibans ?? [];
  const addresses = addressesData?.addresses ?? [];

  const handleRequestIban = async () => {
    const firstAddress = addresses[0];
    if (!firstAddress) return;
    const firstChain = firstAddress.chains[0];
    if (!firstChain) return;

    setRequesting(true);
    setRequestError(null);

    try {
      await requestIban({
        address: firstAddress.address,
        chain: firstChain,
        emailNotifications: true,
      });
      setRequested(true);
    } catch (err) {
      setRequestError(
        err instanceof Error ? err.message : 'Failed to request IBAN'
      );
    } finally {
      setRequesting(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Receive
      </Typography>

      {/* IBANs */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            IBANs
          </Typography>

          {ibansLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : ibans.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
              No IBANs yet.
            </Typography>
          ) : (
            <List disablePadding>
              {ibans.map((item, i) => (
                <Box key={item.iban}>
                  {i > 0 && <Divider />}
                  <ListItem
                    disablePadding
                    sx={{ py: 1.5 }}
                    secondaryAction={<CopyButton value={item.iban} />}
                  >
                    <ListItemText
                      disableTypography
                      primary={
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1}
                          flexWrap="wrap"
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: 'monospace',
                              letterSpacing: '0.05em',
                            }}
                          >
                            {item.iban}
                          </Typography>
                          <Chip
                            label={item.state}
                            size="small"
                            color={ibanStateColor(item.state)}
                          />
                        </Stack>
                      }
                      secondary={
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={0.5}
                          sx={{ mt: 0.5 }}
                        >
                          <ChainIcon chain={item.chain as Chain} />
                          <Typography variant="caption" color="text.secondary">
                            {getChainConfig(item.chain)?.name ?? item.chain} ·{' '}
                            {shortenAddress(item.address)}
                          </Typography>
                        </Stack>
                      }
                    />
                  </ListItem>
                </Box>
              ))}
            </List>
          )}

          {!ibansLoading && (
            <Box sx={{ mt: ibans.length > 0 ? 2 : 0 }}>
              {requestError && (
                <Alert severity="error" sx={{ mb: 1 }}>
                  {requestError}
                </Alert>
              )}
              {requested ? (
                <Alert severity="success">
                  IBAN requested — it may take a moment to appear.
                </Alert>
              ) : (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleRequestIban}
                  disabled={requesting || addresses.length === 0}
                  startIcon={requesting ? <CircularProgress size={14} /> : null}
                >
                  Request new IBAN
                </Button>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Wallet addresses */}
      <Card>
        <CardContent>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Wallet addresses
          </Typography>

          {addressesLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : addresses.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
              No addresses found.
            </Typography>
          ) : (
            <List disablePadding>
              {addresses.flatMap((addr) =>
                addr.chains.map((chain, i) => (
                  <Box key={`${addr.address}-${chain}`}>
                    {i > 0 && <Divider />}
                    <ListItem
                      disablePadding
                      sx={{ py: 1.5 }}
                      secondaryAction={<CopyButton value={addr.address} />}
                    >
                      <ListItemText
                        disableTypography
                        primary={
                          <Typography
                            variant="body2"
                            sx={{
                              fontFamily: 'monospace',
                              letterSpacing: '0.05em',
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
                            <ChainIcon chain={chain} />
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
    </Box>
  );
}
