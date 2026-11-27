import { type AppKit, createAppKit } from '@reown/appkit';
import { type AppKitNetwork, mainnet, sepolia } from '@reown/appkit/networks';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';

const projectId = import.meta.env.VITE_REOWN_PROJECT_ID as string | undefined;
type PartnerEnvironment = 'localhost' | 'sandbox' | 'production';
export const partnerEnvironment: PartnerEnvironment = (import.meta.env
  .VITE_PARTNER_ENV ?? 'sandbox') as PartnerEnvironment;
export const mainChain: 'ethereum' | 'sepolia' =
  partnerEnvironment === 'sandbox' ? 'sepolia' : 'ethereum';
const localNetwork: AppKitNetwork = {
  id: 6666,
  name: 'Ethereum',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: [import.meta.env.VITE_LOCAL_RPC_URL || ''] },
  },
};
const walletNetwork: AppKitNetwork =
  partnerEnvironment === 'localhost'
    ? localNetwork
    : partnerEnvironment === 'production'
      ? mainnet
      : sepolia;
const appKit: AppKit | undefined = projectId
  ? createAppKit({
      adapters: [new EthersAdapter()],
      networks: [walletNetwork],
      defaultNetwork: walletNetwork,
      projectId,
      metadata: {
        name: 'Monerium Partner Tool',
        description: 'Monerium SDK partner test tool',
        url: window.location.origin,
        icons: [],
      },
      features: { analytics: false },
    })
  : undefined;

type Eip1193Provider = {
  request: (request: { method: string; params: unknown[] }) => Promise<unknown>;
};

export const walletConfigured: boolean = Boolean(appKit);

export const subscribeWallet = (
  onAddress: (address: string | undefined) => void,
  onError: (message: string) => void
): (() => void) => {
  if (!appKit) return () => {};

  const unsubscribeAccount = appKit.subscribeAccount((account) =>
    onAddress(account.address)
  );
  const unsubscribeConnections = appKit.subscribeConnections((state) => {
    const reownError = appKit.getError();
    console.log('[partner] Reown connection state', {
      status: state.status,
      error: reownError || undefined,
    });
    if (reownError) {
      console.error('[partner] Reown connection failed', reownError);
      onError(reownError);
    }
  });

  return () => {
    unsubscribeAccount();
    unsubscribeConnections();
  };
};

export const openWallet = async (): Promise<void> => {
  if (!appKit) return;
  try {
    await appKit.open();
  } catch (reason) {
    console.error('[partner] Reown wallet connection failed', reason);
    throw reason;
  }
};

export const signMessage = async (
  message: string,
  walletAddress: string | undefined
): Promise<unknown> => {
  if (!appKit) throw new Error('Wallet is not configured');
  const provider = appKit.getWalletProvider() as Eip1193Provider | undefined;
  if (!provider || !walletAddress) throw new Error('Connect a wallet first');
  return provider.request({
    method: 'personal_sign',
    params: [message, walletAddress],
  });
};
