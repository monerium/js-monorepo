import { useQuery } from '@tanstack/react-query';

import { publicClient } from 'src/components/App/client';

export const useEns = (address: string) => {
  return useQuery({
    queryKey: ['ens', address],
    queryFn: () =>
      publicClient.getEnsName({ address: address as `0x${string}` }),
    enabled: !!address,
  });
};
