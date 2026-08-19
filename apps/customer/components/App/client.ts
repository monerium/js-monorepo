import { createPublicClient, http, type PublicClient } from 'viem';
import { mainnet } from 'viem/chains';

export const publicClient: PublicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});
