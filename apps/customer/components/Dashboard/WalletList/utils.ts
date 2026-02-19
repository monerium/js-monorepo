import { Balances } from '@monerium/sdk';

import { Account } from '../types';

export function flattenSortAndSumBalances(
  accounts: Balances[],
  currentCurrency: string
): {
  list: Account[];
  sum: number;
} {
  const result = accounts.reduce(
    (acc, account) => {
      // Find the balance object for the specified currency
      const balance = account.balances.find(
        (b) => b.currency === currentCurrency
      );

      // If the balance is found, flatten it to the root
      if (balance) {
        const { amount } = balance;
         
        const { balances: _balances, ...rest } = account; // Exclude the balances property
        acc.list.push({
          ...rest,
          amount, // Add the amount property to the root
          currency: currentCurrency, // Add the currency property to the root
        });
        acc.sum += parseFloat(amount); // Accumulate the total amount
      }

      // If the balance is not found, skip the account
      return acc;
    },
    { list: [] as Account[], sum: 0 }
  );

  // Sort the flattened accounts by amount in descending order
  result.list.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));

  return result;
}
