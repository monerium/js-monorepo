import { useQuery, useQueryClient } from '@tanstack/react-query';

import { Balances, Chain, Currency } from '@monerium/sdk';

export function useTotalBalance(chain?: Chain, currency?: Currency) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['monerium', 'total-balance', chain, currency],
    queryFn: () => {
      const queryCache = queryClient.getQueryCache();
      const balanceQueries = queryCache.findAll({
        queryKey: [
          'monerium',
          'balances',
          { currencies: [currency], ...(chain ? { chain } : {}) },
        ],
      });
      // Get the latest data from all balance queries
      const balances = balanceQueries.map(
        (query) => query.state.data as Balances
      );

      // Calculate total by summing all valid balance amounts
      /**
       * TODO: this is not taking currency into account
       */
      const total = balances.reduce((sum, balance) => {
        if (!balance?.balances?.[0]?.amount) return sum;
        return sum + parseFloat(balance.balances[0].amount);
      }, 0);

      return total;
    },
    // Refetch when any balance query updates
    refetchInterval: 1000,
  });
}
