import Image from 'next/image';

import { Currency } from '@monerium/sdk';

const TokenIcon = ({
  currency,
  className,
}: {
  currency: Currency;
  className?: string;
}) => {
  return (
    <Image
      className={className}
      src={`/tokens/${currency}.png`}
      alt={`${currency} logo`}
      height={24}
      width={24}
    />
  );
};
export default TokenIcon;
