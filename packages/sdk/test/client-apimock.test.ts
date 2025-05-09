/**
 * @jest-environment jsdom
 */

import 'jest-localstorage-mock';
import fetchMock from 'jest-fetch-mock';

import constants from '../src/constants';
import { generateCodeChallenge } from '../src/helpers';
import { MoneriumClient } from '../src/index';
import {
  AuthFlowSIWEOptions,
  Chain,
  Currency,
  NewOrder,
  PaymentStandard,
  PersonalProfileDetails,
  ProfileState,
  ProfileType,
} from '../src/types';
import { OWNER_SIGNATURE, PUBLIC_KEY } from './constants';

const { STORAGE_CODE_VERIFIER } = constants;

const assignMock = jest.fn();

const clientId = 'testClientId';
const redirectUri = 'http://example.com';

let client: MoneriumClient;
describe.only('MoneriumClient - production', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      value: {
        assign: assignMock,
      },
      writable: true,
    });
  });
  afterEach(() => {
    window.localStorage.clear();
    jest.restoreAllMocks();
    assignMock.mockRestore();
  });
  test('get tokens', async () => {
    const client = new MoneriumClient({
      environment: 'production',
      clientId,
      redirectUri,
    });
    await client.getTokens().catch(() => ({}));

    expect(fetchMock?.mock?.calls?.length).toEqual(1);

    expect(fetchMock?.mock?.calls?.[0]?.[0]).toEqual(
      `https://api.monerium.app/tokens`
    );
    expect(fetchMock?.mock?.calls?.[0]?.[1]).toEqual(
      expect.objectContaining({
        method: 'GET',
      })
    );
  });
});
describe('MoneriumClient - sandbox', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      value: {
        assign: assignMock,
      },
      writable: true,
    });
  });
  beforeEach(async () => {
    client = new MoneriumClient({ clientId, redirectUri });
    fetchMock.resetMocks();
  });
  afterEach(() => {
    window.localStorage.clear();
    jest.restoreAllMocks();
    assignMock.mockRestore();
  });

  test('get tokens', async () => {
    await client.getTokens().catch(() => ({}));

    expect(fetchMock?.mock?.calls?.length).toEqual(1);

    expect(fetchMock?.mock?.calls?.[0]?.[0]).toEqual(
      `https://api.monerium.dev/tokens`
    );
    expect(fetchMock?.mock?.calls?.[0]?.[1]).toEqual(
      expect.objectContaining({
        method: 'GET',
      })
    );
  });
  describe('Authorize', () => {
    const setupAuthorizeTest = async (
      params?: Record<string, any>,
      isSiwe: boolean = false
    ) => {
      if (isSiwe) {
        await client.siwe(params as AuthFlowSIWEOptions).catch(() => ({}));
      } else {
        await client.authorize(params).catch(() => ({}));
      }

      const codeVerifier = localStorage.getItem(STORAGE_CODE_VERIFIER);
      const challenge = generateCodeChallenge(codeVerifier as string);

      const assignedURL = assignMock.mock.calls[0][0]; // Retrieve the called URL

      expect(assignMock).toHaveBeenCalled();
      expect(assignedURL).toMatch(/^https:\/\/api\.monerium\.dev\/auth\?/);
      expect(assignedURL).toContain(`code_challenge=${challenge}`);
      expect(assignedURL).toContain(`code_challenge_method=S256`);

      if (isSiwe) {
        expect(assignedURL).toContain(`authentication_method=siwe`);
      } else {
        expect(assignedURL).toContain(`response_type=code`);
      }

      return assignedURL;
    };
    test('authorize', async () => {
      const assignedURL = await setupAuthorizeTest();

      expect(assignedURL).toContain(`client_id=${clientId}`);
      expect(assignedURL).toContain(
        `redirect_uri=${encodeURIComponent(redirectUri)}`
      );
    });
    test('authorize - should skip incomplete autoLink params', async () => {
      const args = {
        signature: '0xShouldBeSkipped',
        chain: 'ethereum',
      };
      const assignedURL = await setupAuthorizeTest(args);

      expect(assignedURL).toContain(`client_id=${clientId}`);
      expect(assignedURL).not.toContain(`signature=`);
      expect(assignedURL).not.toContain(`chain=`);
    });
    test('authorize - should include autoLink params', async () => {
      const args = {
        address: '0xAddress',
        signature: '0xSignature',
        chain: 'ethereum',
      };
      const assignedURL = await setupAuthorizeTest(args);

      expect(assignedURL).toContain(`client_id=${clientId}`);
      expect(assignedURL).toContain(`address=${args.address}`);
      expect(assignedURL).toContain(`signature=${args.signature}`);
      expect(assignedURL).toContain(`chain=sepolia`);
    });
    test('authorize - should include various params', async () => {
      const args = {
        skipKyc: true,
        skipCreateAccount: true,
        signature: undefined,
        email: 'test@email.is',
      };
      const assignedURL = await setupAuthorizeTest(args);

      expect(assignedURL).toContain(`email=${encodeURIComponent(args.email)}`);
      expect(assignedURL).toContain(`skip_kyc=${args.skipKyc}`);
      expect(assignedURL).toContain(
        `skip_create_account=${args.skipCreateAccount}`
      );
      expect(assignedURL).not.toContain('signature=');
    });
    test('siwe', async () => {
      const args = {
        message: '0xEIP-4361Message',
        signature: 'signature',
      };
      const assignedURL = await setupAuthorizeTest(args, true);

      expect(assignedURL).toContain(`client_id=${clientId}`);
      expect(assignedURL).toContain(`message=${args.message}`);
      expect(assignedURL).toContain(`signature=${args.signature}`);
      expect(assignedURL).not.toContain(`state=`);
    });
    test('siwe - with state', async () => {
      const args = {
        message: '0xEIP-4361Message',
        signature: 'signature',
        state: 'fooBar',
      };
      const assignedURL = await setupAuthorizeTest(args, true);

      expect(assignedURL).toContain(`client_id=${clientId}`);
      expect(assignedURL).toContain(`message=${args.message}`);
      expect(assignedURL).toContain(`signature=${args.signature}`);
      expect(assignedURL).toContain(`state=${args.state}`);
    });
    test('siwe', async () => {
      const args = {
        message: '0xEIP-4361Message',
        signature: 'signature',
      };
      const assignedURL = await setupAuthorizeTest(args, true);

      expect(assignedURL).toContain(`client_id=${clientId}`);
      expect(assignedURL).toContain(`message=${args.message}`);
      expect(assignedURL).toContain(`signature=${args.signature}`);
    });
  });
  describe('Addresses', () => {
    test('link address using chainId', async () => {
      const body = {
        // profile: 'testProfile',
        address: PUBLIC_KEY,
        // message: message,
        signature: OWNER_SIGNATURE,
        chain: 11155111,
      };
      await client.linkAddress(body).catch(() => ({}));

      expect(fetchMock?.mock?.calls?.length).toEqual(1);

      expect(fetchMock?.mock?.calls?.[0]?.[0]).toEqual(
        `https://api.monerium.dev/addresses`
      );
      expect(fetchMock?.mock?.calls?.[0]?.[1]).toEqual(
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            // profile: 'testProfile',
            address: PUBLIC_KEY,
            // message: message,
            signature: OWNER_SIGNATURE,
            chain: 'sepolia',
          }),
        })
      );
    });
    test('get address', async () => {
      await client.getAddress('0x1234').catch(() => ({}));

      expect(fetchMock?.mock?.calls?.length).toEqual(1);

      expect(fetchMock?.mock?.calls?.[0]?.[0]).toEqual(
        `https://api.monerium.dev/addresses/0x1234`
      );
      expect(fetchMock?.mock?.calls?.[0]?.[1]).toEqual(
        expect.objectContaining({
          method: 'GET',
        })
      );
    });
    test('get addresses', async () => {
      await client.getAddresses().catch(() => ({}));

      expect(fetchMock?.mock?.calls?.length).toEqual(1);

      expect(fetchMock?.mock?.calls?.[0]?.[0]).toEqual(
        `https://api.monerium.dev/addresses`
      );
      expect(fetchMock?.mock?.calls?.[0]?.[1]).toEqual(
        expect.objectContaining({
          method: 'GET',
        })
      );
    });
    test('get addresses with params', async () => {
      await client
        .getAddresses({
          profile: 'mockTestProfile',
          chain: 11155111,
        })
        .catch(() => ({}));

      expect(fetchMock?.mock?.calls?.length).toEqual(1);

      expect(fetchMock?.mock?.calls?.[0]?.[0]).toEqual(
        `https://api.monerium.dev/addresses?profile=mockTestProfile&chain=sepolia`
      );
      expect(fetchMock?.mock?.calls?.[0]?.[1]).toEqual(
        expect.objectContaining({
          method: 'GET',
        })
      );
    });
    test('get balances', async () => {
      await client.getBalances('0x1234', 100).catch(() => ({}));

      expect(fetchMock?.mock?.calls?.length).toEqual(1);

      expect(fetchMock?.mock?.calls?.[0]?.[0]).toEqual(
        `https://api.monerium.dev/balances/gnosis/0x1234`
      );
      expect(fetchMock?.mock?.calls?.[0]?.[1]).toEqual(
        expect.objectContaining({
          method: 'GET',
        })
      );
    });
    test('get balances - support old chain translation', async () => {
      await client.getBalances('0x1234', 'ethereum').catch(() => ({}));

      expect(fetchMock?.mock?.calls?.length).toEqual(1);

      expect(fetchMock?.mock?.calls?.[0]?.[0]).toEqual(
        `https://api.monerium.dev/balances/sepolia/0x1234`
      );
      expect(fetchMock?.mock?.calls?.[0]?.[1]).toEqual(
        expect.objectContaining({
          method: 'GET',
        })
      );
    });
  });

  describe('IBANs', () => {
    test('get iban', async () => {
      await client.getIban('IS1234').catch(() => ({}));

      expect(fetchMock?.mock?.calls?.length).toEqual(1);

      expect(fetchMock?.mock?.calls?.[0]?.[0]).toEqual(
        `https://api.monerium.dev/ibans/IS1234`
      );
      expect(fetchMock?.mock?.calls?.[0]?.[1]).toEqual(
        expect.objectContaining({
          method: 'GET',
        })
      );
    });

    test('move iban with chain', async () => {
      const body = {
        address: PUBLIC_KEY,
        chain: 'ethereum' as Chain,
      };
      await client.moveIban('IS1234', body).catch(() => ({}));

      expect(fetchMock?.mock?.calls?.length).toEqual(1);

      expect(fetchMock?.mock?.calls?.[0]?.[0]).toEqual(
        `https://api.monerium.dev/ibans/IS1234`
      );
      expect(fetchMock?.mock?.calls?.[0]?.[1]).toEqual(
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({
            address: PUBLIC_KEY,
            chain: 'sepolia',
          }),
        })
      );
    });
    test('move iban with chainId', async () => {
      const body = {
        address: PUBLIC_KEY,
        chain: 11155111,
      };
      await client.moveIban('IS1234', body).catch(() => ({}));

      expect(fetchMock?.mock?.calls?.length).toEqual(1);

      expect(fetchMock?.mock?.calls?.[0]?.[0]).toEqual(
        `https://api.monerium.dev/ibans/IS1234`
      );
      expect(fetchMock?.mock?.calls?.[0]?.[1]).toEqual(
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({
            address: PUBLIC_KEY,
            chain: 'sepolia',
          }),
        })
      );
    });
    test('request iban with chainId', async () => {
      const body = {
        address: PUBLIC_KEY,
        chain: 11155111,
        emailNotifications: true, // not sure if this should be here
      };
      await client.requestIban(body).catch(() => ({}));

      expect(fetchMock?.mock?.calls?.length).toEqual(1);

      expect(fetchMock?.mock?.calls?.[0]?.[0]).toEqual(
        `https://api.monerium.dev/ibans`
      );
      expect(fetchMock?.mock?.calls?.[0]?.[1]).toEqual(
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            address: PUBLIC_KEY,
            chain: 'sepolia',
            emailNotifications: true,
          }),
        })
      );
    });
  });
  test('request iban with chainId - support old chain translation', async () => {
    const body = {
      address: PUBLIC_KEY,
      chain: 'ethereum',
      emailNotifications: true, // not sure if this should be here
    };
    await client.requestIban(body).catch(() => ({}));

    expect(fetchMock?.mock?.calls?.length).toEqual(1);

    expect(fetchMock?.mock?.calls?.[0]?.[0]).toEqual(
      `https://api.monerium.dev/ibans`
    );
    expect(fetchMock?.mock?.calls?.[0]?.[1]).toEqual(
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          address: PUBLIC_KEY,
          chain: 'sepolia',
          emailNotifications: true,
        }),
      })
    );
  });
  describe('Orders', () => {
    test('place order with chainId', async () => {
      const date = 'Thu, 29 Dec 2022 14:58 +00:00';
      const placeOrderMessage = `Send EUR 10 to GR1601101250000000012300695 at ${date}`;
      const placeOrderSignatureHash =
        '0x23bf7e1b240d238b13cb293673c3419915402bb34435af62850b1d8e63f82c564fb73ab19691cf248594423dd01e441bb2ccb38ce2e2ecc514dfc3075bea829e1c';

      await client
        .placeOrder({
          amount: '10',
          signature: placeOrderSignatureHash,
          currency: Currency.eur,
          address: PUBLIC_KEY,
          counterpart: {
            identifier: {
              standard: PaymentStandard.iban,
              iban: 'GR1601101250000000012300695',
            },
            details: {
              firstName: 'Mockbank',
              lastName: 'Testerson',
            },
          },
          message: placeOrderMessage,
          memo: 'Powered by Monerium SDK',
          chain: 11155111,
        })
        .catch(() => ({}));

      expect(fetchMock?.mock?.calls?.[0]?.[0]).toEqual(
        `https://api.monerium.dev/orders`
      );
      expect(fetchMock?.mock?.calls?.[0]?.[1]).toEqual(
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            kind: 'redeem',
            amount: '10',
            signature: placeOrderSignatureHash,
            currency: 'eur',
            address: PUBLIC_KEY,
            counterpart: {
              identifier: {
                standard: PaymentStandard.iban,
                iban: 'GR1601101250000000012300695',
              },
              details: {
                firstName: 'Mockbank',
                lastName: 'Testerson',
              },
            },
            message: placeOrderMessage,
            memo: 'Powered by Monerium SDK',
            chain: 'sepolia',
          }),
        })
      );
    });
    test('place cross chain order with chainId', async () => {
      const date = 'Thu, 29 Dec 2022 14:58 +00:00';
      const placeOrderMessage = `Send EUR 10 to GR1601101250000000012300695 at ${date}`;
      const placeOrderSignatureHash =
        '0x23bf7e1b240d238b13cb293673c3419915402bb34435af62850b1d8e63f82c564fb73ab19691cf248594423dd01e441bb2ccb38ce2e2ecc514dfc3075bea829e1c';

      await client
        .placeOrder({
          amount: '10',
          signature: placeOrderSignatureHash,
          currency: Currency.eur,
          address: PUBLIC_KEY,
          counterpart: {
            identifier: {
              standard: PaymentStandard.chain,
              address: '0x1234567890123456789012345678901234567890',
              chain: 11155111,
            },
            details: {
              firstName: 'Mockbank',
              lastName: 'Testerson',
            },
          },
          message: placeOrderMessage,
          memo: 'Powered by Monerium SDK',
          chain: 'ethereum',
        } as NewOrder)
        .catch(() => ({}));

      expect(fetchMock?.mock?.calls?.[0]?.[0]).toEqual(
        `https://api.monerium.dev/orders`
      );
      expect(fetchMock?.mock?.calls?.[0]?.[1]).toEqual(
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            kind: 'redeem',
            amount: '10',
            signature: placeOrderSignatureHash,
            currency: 'eur',
            address: PUBLIC_KEY,
            counterpart: {
              identifier: {
                standard: PaymentStandard.chain,
                address: '0x1234567890123456789012345678901234567890',
                chain: 'sepolia',
              },
              details: {
                firstName: 'Mockbank',
                lastName: 'Testerson',
              },
            },
            message: placeOrderMessage,
            memo: 'Powered by Monerium SDK',
            chain: 'sepolia',
          }),
        })
      );
    });
    test('place cross chain order with incorrect chainId', async () => {
      const date = 'Thu, 29 Dec 2022 14:58 +00:00';
      const placeOrderMessage = `Send EUR 10 to GR1601101250000000012300695 at ${date}`;
      const placeOrderSignatureHash =
        '0x23bf7e1b240d238b13cb293673c3419915402bb34435af62850b1d8e63f82c564fb73ab19691cf248594423dd01e441bb2ccb38ce2e2ecc514dfc3075bea829e1c';

      await expect(
        Promise.resolve().then(() =>
          client.placeOrder({
            amount: '10',
            signature: placeOrderSignatureHash,
            currency: Currency.eur,
            address: PUBLIC_KEY,
            counterpart: {
              identifier: {
                standard: PaymentStandard.chain,
                address: '0x1234567890123456789012345678901234567890',
                chain: 7,
              },
              details: {
                firstName: 'Mockbank',
                lastName: 'Testerson',
              },
            },
            message: placeOrderMessage,
            memo: 'Powered by Monerium SDK',
            chain: 'ethereum',
          } as NewOrder)
        )
      ).rejects.toThrow('Chain not supported: 7');
    });
    test('get orders', async () => {
      await client.getOrders().catch(() => ({}));

      expect(fetchMock?.mock?.calls?.length).toEqual(1);

      expect(fetchMock?.mock?.calls?.[0]?.[0]).toEqual(
        `https://api.monerium.dev/orders`
      );
      expect(fetchMock?.mock?.calls?.[0]?.[1]).toEqual(
        expect.objectContaining({
          method: 'GET',
        })
      );
    });
    test('get orders with params', async () => {
      await client
        .getOrders({
          address: undefined,
          txHash: '0x3333',
          memo: 'Powered by Monerium SDK',
        })
        .catch(() => ({}));

      expect(fetchMock?.mock?.calls?.length).toEqual(1);

      expect(fetchMock?.mock?.calls?.[0]?.[0]).toEqual(
        `https://api.monerium.dev/orders?txHash=0x3333&memo=Powered%20by%20Monerium%20SDK`
      );
      expect(fetchMock?.mock?.calls?.[0]?.[1]).toEqual(
        expect.objectContaining({
          method: 'GET',
        })
      );
    });
    test('upload supporting document', async () => {
      const mockFile = new File(['file content'], 'myfile.exe', {
        type: 'application/octet-stream',
        lastModified: new Date().getTime(),
      });
      await client.uploadSupportingDocument(mockFile).catch(() => ({}));

      expect(fetchMock?.mock?.calls?.length).toEqual(1);

      expect(fetchMock?.mock?.calls?.[0]?.[0]).toEqual(
        `https://api.monerium.dev/files`
      );

      const fd = fetchMock?.mock?.calls?.[0]?.[1]?.body as FormData;
      expect(fd.get('file')).toEqual(mockFile);

      expect(fetchMock?.mock?.calls?.[0]?.[1]).toEqual(
        expect.objectContaining({
          body: fd,
        })
      );
    });
  });
  describe('Profiles', () => {
    test('submit profile details', async () => {
      const body = {
        personal: {
          idDocument: {
            number: 'A1234566788',
            kind: 'passport',
          },
          firstName: 'Jane',
          lastName: 'Doe',
          address: 'Pennylane 123',
          postalCode: '7890',
          city: 'Liverpool',
          country: 'FR',
          countryState: 'Merseyside',
          nationality: 'FR',
          birthday: '1990-05-15',
        } as PersonalProfileDetails,
      };
      await client
        .submitProfileDetails('testProfileId', body)
        .catch(() => ({}));

      expect(fetchMock?.mock?.calls?.length).toEqual(1);

      expect(fetchMock?.mock?.calls?.[0]?.[0]).toEqual(
        `https://api.monerium.dev/profiles/testProfileId/details`
      );
      expect(fetchMock?.mock?.calls?.[0]?.[1]).toEqual(
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({
            personal: {
              idDocument: {
                number: 'A1234566788',
                kind: 'passport',
              },
              firstName: 'Jane',
              lastName: 'Doe',
              address: 'Pennylane 123',
              postalCode: '7890',
              city: 'Liverpool',
              country: 'FR',
              countryState: 'Merseyside',
              nationality: 'FR',
              birthday: '1990-05-15',
            },
          }),
        })
      );
    });
    test('get profile', async () => {
      await client.getProfile('testProfileId').catch(() => ({}));

      expect(fetchMock?.mock?.calls?.length).toEqual(1);

      expect(fetchMock?.mock?.calls?.[0]?.[0]).toEqual(
        `https://api.monerium.dev/profiles/testProfileId`
      );
      expect(fetchMock?.mock?.calls?.[0]?.[1]).toEqual(
        expect.objectContaining({
          method: 'GET',
        })
      );
    });

    test('get profiles', async () => {
      await client.getProfiles().catch(() => ({}));

      expect(fetchMock?.mock?.calls?.length).toEqual(1);

      expect(fetchMock?.mock?.calls?.[0]?.[0]).toEqual(
        `https://api.monerium.dev/profiles`
      );
      expect(fetchMock?.mock?.calls?.[0]?.[1]).toEqual(
        expect.objectContaining({
          method: 'GET',
        })
      );
    });
    test('get profiles with params', async () => {
      await client
        .getProfiles({
          kind: 'personal' as ProfileType,
          state: 'created' as ProfileState,
        })
        .catch(() => ({}));

      expect(fetchMock?.mock?.calls?.length).toEqual(1);

      expect(fetchMock?.mock?.calls?.[0]?.[0]).toEqual(
        `https://api.monerium.dev/profiles?kind=personal&state=created`
      );
      expect(fetchMock?.mock?.calls?.[0]?.[1]).toEqual(
        expect.objectContaining({
          method: 'GET',
        })
      );
    });
  });
});
