import { useQuery } from '@tanstack/react-query';

import { publicClient } from 'src/components/App/client';

export const useEns = (address: string) => {
  return useQuery({
    queryKey: ['ens', address],
    queryFn: async () => {
      if (!address) return null;

      try {
        const ensName = await publicClient.getEnsName({
          address: address as `0x${string}`,
        });
        return ensName;
      } catch (error) {
        console.error('Error fetching ENS name:', error);
        return null;
      }
    },
    enabled: !!address,
  });
};
