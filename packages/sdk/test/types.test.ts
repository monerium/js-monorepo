/* eslint-disable */
import { Network, NetworkStrict } from '../src/types';

describe('Network type', () => {
  test('valid networks', () => {
    // loose networks
    const sepolia: Network = 'sepolia';
    const chiado: Network = 'chiado';
    const amoy: Network = 'amoy';
    const mainnet: Network = 'mainnet';

    // semi-strict networks
    const ethOnly: Network<'ethereum'> = 'mainnet';
    const ethOnlyTest: Network<'ethereum'> = 'sepolia';

    const gnoOnly: Network<'gnosis'> = 'mainnet';
    const gnoOnlyTest: Network<'gnosis'> = 'chiado';

    const polOnly: Network<'polygon'> = 'mainnet';
    const polOnlyTest: Network<'polygon'> = 'amoy';

    // strict networks
    const ethMain: Network<'ethereum', 'production'> = 'mainnet';
    const gnoMain: Network<'gnosis', 'production'> = 'mainnet';
    const polMain: Network<'polygon', 'production'> = 'mainnet';

    const ethTest: Network<'ethereum', 'sandbox'> = 'sepolia';
    const gnoTest: Network<'gnosis', 'sandbox'> = 'chiado';
    const polTest: Network<'polygon', 'sandbox'> = 'amoy';

    expect(true).toBeTruthy(); // dummy assertion to indicate test passes
  });

  test('invalid networks', () => {
    // @ts-expect-error unit test
    const ethTestErr: Network<'ethereum', 'sandbox'> = 'chiado';
    // @ts-expect-error unit test
    const gnoTestErr: Network<'gnosis', 'sandbox'> = 'amoy';
    // @ts-expect-error unit test
    const polTestErr: Network<'polygon', 'sandbox'> = 'sepolia';
    // @ts-expect-error unit test
    const err1: NetworkStrict<'polygon'> = 'sepolia';
    // @ts-expect-error unit test
    const err2: NetworkStrict<'ethereum'> = 'sepolia';
    // @ts-expect-error unit test
    const err3: NetworkStrict = 'mainnet';
    // @ts-expect-error unit test
    const err4: NetworkStrict = 'sepolia';

    // the above invalid networks should fail type checking
    // so there's no need for additional assertions here

    expect(true).toBeTruthy(); // dummy assertion to indicate test passes
  });
});
