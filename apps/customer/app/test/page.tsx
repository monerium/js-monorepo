'use client';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useAccount, useChainId, useSignMessage } from 'wagmi';

import {
  Chain,
  ChainId,
  Currency,
  placeOrderMessage,
  siweMessage,
} from '@monerium/sdk';
import {
  useAddress,
  useAddresses,
  useAuth,
  useAuthContext,
  useBalances,
  useIBAN,
  useIBANs,
  useLinkAddress,
  useMoveIban,
  useOrder,
  useOrders,
  usePlaceOrder,
  useProfile,
  useRequestIban,
  useSignatures,
  useTokens,
} from 'hooks/monerium';

const constants = {} as any;
export default function Test() {
  // https://punkwallet.io/pk#0xc3dba5f61acf6675aee27b7141db8decf7d4e7514afafdd6b764e02138c53cac
  const COUNTERPART_ADDRESS = '0x28Bd09f59A40A0B42dAC69Ef43ef7Ffa37F12Ead';
  /**
   * Wagmi
   */
  const { address: walletAddress } = useAccount();
  const chainId = useChainId();
  const { signMessageAsync } = useSignMessage();

  /**
   * Monerium queries
   */
  const {
    isAuthorized,
    authorize,
    siwe,
    revokeAccess,
    error: authError,
  } = useAuth();

  const { data: profile } = useProfile();

  const { data: authContext } = useAuthContext();

  const { data: orders } = useOrders();

  const { data: order } = useOrder({
    orderId: orders?.orders?.[0]?.id as string,
  });

  const { data: walletBalances } = useBalances({
    address: walletAddress as string,
    chain: chainId,
  });
  const { data: walletBalancesGbpUsd } = useBalances({
    address: walletAddress as string,
    chain: chainId,
    currencies: [Currency.gbp, Currency.usd],
  });

  const { data: ibans } = useIBANs();
  const { data: iban } = useIBAN({
    iban: ibans?.ibans?.[0]?.iban as string,
  });

  const { data: addresses } = useAddresses();
  const { data: addressesByChains } = useAddresses({
    profile: profile?.id as string,
    // chain: chainId,
  });
  const { data: address } = useAddress({
    address: addresses?.addresses?.[0]?.address as string,
  });

  const { data: tokens } = useTokens();
  const { data: signatures } = useSignatures();

  /**
   * Monerium mutations
   */
  const { linkAddress, error: linkAddressError } = useLinkAddress();

  const { placeOrder, error: placeOrderError } = usePlaceOrder({
    mutation: {
      onSuccess: (data: any) => {
        console.log('onSuccess callback', data);
      },
      onError: (error: any) => {
        console.log('onError callback', error);
      },
    },
  });

  const { requestIban, error: requestIbanError } = useRequestIban();
  const { moveIban, error: moveIbanError } = useMoveIban();

  const Input = ({
    name,
    defaultValue,
    type = 'text',
  }: {
    name: string;
    defaultValue: string;
    type?: string;
  }) => {
    return (
      <div>
        <label htmlFor={name}>{name}:</label>
        <br />
        <input
          style={{ width: '400px' }}
          type={type}
          id={name}
          name={name}
          defaultValue={defaultValue}
        />
      </div>
    );
  };

  const UploadSupportingDocument = () => {
    const [file, setFile] = useState<File>();

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        setFile(e.target.files[0]);
      }
    };

    const handleUploadClick = () => {
      if (!file) {
        return;
      }
      console.log('Uploading document', file);
    };

    return (
      <>
        <input type="file" onChange={handleFileChange} />

        <div>{file && `${file.name} - ${file.type}`}</div>

        <button onClick={handleUploadClick}>Upload</button>
      </>
    );
  };

  const RequestIban = () => {
    function requestingIban(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);

      requestIban({
        address: walletAddress as string,
        chain: chainId,
        emailNotifications:
          formData.get('notification') === 'true' ? true : false,
      });
    }
    return (
      <form onSubmit={requestingIban}>
        <label htmlFor="notification">email notification:</label>
        <br />
        <select id="notification" name="notification" defaultValue="true">
          <option value="true">true</option>
          <option value="false">false</option>
        </select>
        <div style={{ color: 'red' }}>
          <PrettyPrintJson data={requestIbanError} />
        </div>
        <button type="submit">Request Iban for wallet address</button>
      </form>
    );
  };
  const MoveIban = () => {
    function movingIban(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);

      moveIban({
        iban: formData.get('move-iban') as string,
        address:
          (formData.get('move-iban-address') as string) ||
          (walletAddress as string),
        chain: (formData.get('move-iban-chain') as ChainId | Chain) || chainId,
      });
    }
    return (
      <form onSubmit={movingIban}>
        <Input name="move-iban" defaultValue="" />
        <Input name="move-iban-address" defaultValue={`${walletAddress}`} />
        <Input name="move-iban-chain" defaultValue={`${chainId}`} />

        <div style={{ color: 'red' }}>
          <PrettyPrintJson data={moveIbanError} />
        </div>
        <button type="submit">Move Iban</button>
      </form>
    );
  };
  const PlaceOrder = () => {
    function placingOrder(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);

      const id = formData.get('id') as string;
      const amount = formData.get('amount') as string;
      const currency = formData.get('currency') as Currency;
      const counterpartIdentifierAddress = formData.get(
        'counterpart-identifier-address'
      ) as string;
      const counterpartIdentifierChain = formData.get(
        'counterpart-identifier-chain'
      ) as Chain;
      const msg = placeOrderMessage(
        amount,
        currency,
        counterpartIdentifierAddress,
        counterpartIdentifierChain
      );
      alert(`Message:'${msg}'`);

      signMessageAsync({ message: msg }).then((signature) => {
        alert(`Signature: '${signature}'`);
        placeOrder({
          id: id,
          address: walletAddress as string,
          amount: amount,
          currency: currency,
          signature,
          counterpart: {
            identifier: {
              standard: 'chain',
              address: counterpartIdentifierAddress,
              chain: counterpartIdentifierChain,
            },
            details: {
              firstName: formData.get(
                'counterpart-details-first-name'
              ) as string,
              lastName: formData.get('counterpart-details-last-name') as string,
              country: formData.get('counterpart-details-country') as string,
            },
          },
          chain: chainId,
          message: msg,
          memo: formData.get('memo') as string,
        });
      });
    }
    return (
      <form onSubmit={placingOrder}>
        <Input name="id" defaultValue="" />
        <Input name="amount" defaultValue="1.33" />

        <label htmlFor="currency">currency:</label>
        <br />
        <select id="currency" name="currency" defaultValue="eur">
          <option value="eur">EUR</option>
          <option value="gpb">GPB</option>
          <option value="usd">USD</option>
        </select>
        <Input
          name="counterpart-identifier-address"
          defaultValue={COUNTERPART_ADDRESS}
        />
        <Input name="counterpart-identifier-chain" defaultValue="amoy" />
        <Input name="counterpart-details-first-name" defaultValue="John" />
        <Input name="counterpart-details-last-name" defaultValue="Doe" />
        <Input name="counterpart-details-country" defaultValue="IS" />
        <Input name="memo" defaultValue="Powered by Monerium SDK Provider!" />
        <div style={{ color: 'red' }}>
          <PrettyPrintJson data={placeOrderError} />
        </div>
        <button type="submit">Place order</button>
      </form>
    );
  };
  const LinkAddress = () => {
    function linkingAddress(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const currencies = formData.getAll('currency') as Currency[];
      const chains = formData.getAll('chain') as Chain[];

      if (currencies.length === 0) {
        currencies.push(Currency.eur);
      }
      if (chains.length === 0) {
        chains.push('ethereum');
      }

      signMessageAsync({ message: constants.LINK_MESSAGE }).then(
        (signature) => {
          linkAddress({
            // message: constants.LINK_MESSAGE,
            address: walletAddress as string,
            chain: chains?.[0] || 'ethereum',
            signature: signature,
          });
        }
      );
    }
    return (
      <form onSubmit={linkingAddress}>
        <div>
          <h3>Currency (not used):</h3>
          <label>
            <input id="currency" type="radio" name="currency" value="eur" /> EUR
          </label>
          <label>
            <input id="currency" type="radio" name="currency" value="gbp" /> GBP
          </label>
          <label>
            <input id="currency" type="radio" name="currency" value="usd" /> USD
          </label>
        </div>
        <div>
          <h3>Chain:</h3>
          <label>
            <input
              id="chain"
              type="radio"
              name="chain"
              value="ethereum"
              defaultChecked
            />{' '}
            Ethereum
          </label>
          <label>
            <input id="chain" type="radio" name="chain" value="polygon" />{' '}
            Polygon
          </label>
          <label>
            <input id="chain" type="radio" name="chain" value="gnosis" /> Gnosis
          </label>
        </div>
        <div style={{ color: 'red' }}>
          <PrettyPrintJson data={linkAddressError} />
        </div>
        <button type="submit">Link address</button>
      </form>
    );
  };

  const PrettyPrintJson = ({ data }: { data: any }) => {
    if (data) {
      return <pre id="json">{JSON.stringify(data, undefined, 2)}</pre>;
    }
    return '';
  };

  const authorizeSiwe = () => {
    console.log('walletAddress', walletAddress);
    const siwe_message = siweMessage({
      domain: 'localhost:5001',
      address: `${walletAddress}`,
      appName: 'SDK TEST APP',
      redirectUri: 'http://localhost:5001/dashboard',
      chainId: chainId,
      privacyPolicyUrl: 'https://monerium.com/policies/privacy-policy',
      termsOfServiceUrl:
        'https://monerium.com/policies/personal-terms-of-service',
    });

    signMessageAsync({ message: siwe_message }).then((signature) => {
      siwe({ message: siwe_message, signature });
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <Link href="/dashboard">Dashboard</Link>
      <div>
        <ConnectButton />
      </div>
      {/* <h1>Wallet</h1>
      <p>Address: {walletAddress}</p>
      <p>Chain ID: {chainId}</p> */}
      <h1>Auth</h1>
      <p>isAuthorized: {isAuthorized ? 'true' : 'false'}</p>
      <div style={{ color: 'red' }}>
        <PrettyPrintJson data={authError} />
      </div>
      <p>
        {!isAuthorized ? (
          <>
            <button type="submit" onClick={() => authorize()}>
              Authorize
            </button>
            <button
              type="submit"
              onClick={() =>
                authorize({
                  skipKyc: true,
                })
              }
            >
              Authorize min (skip KYC and Wallet Connection)
            </button>
            <button type="submit" onClick={authorizeSiwe}>
              Siwe.
            </button>
          </>
        ) : (
          <button
            type="submit"
            onClick={() => {
              window.localStorage.removeItem(
                'monerium.insecurely_store_refresh_token'
              );
              revokeAccess();
            }}
          >
            Revoke Access
          </button>
        )}
      </p>
      {isAuthorized && (
        <>
          <h1>Queries</h1>
          <div>
            <div>
              <h2>AuthContext</h2>
              <p>UserId: {authContext?.userId}</p>
              <details>
                <summary>Click to Expand</summary>
                <PrettyPrintJson data={authContext} />
              </details>
            </div>
            <div>
              <h2>Profile</h2>
              <p>id: {profile?.id}</p>
              <details>
                <summary>Click to Expand</summary>
                <PrettyPrintJson data={profile} />
              </details>
            </div>
            <div>
              <h2>Address (first)</h2>
              <p>address: {(address as any)?.address}</p>
              <details>
                <summary>Click to Expand</summary>
                <PrettyPrintJson data={address} />
              </details>
            </div>
            <div>
              <h2>Addresses</h2>
              <details>
                <summary>
                  Click to Expand, total: {addresses?.addresses.length}
                </summary>
                <PrettyPrintJson data={addresses} />
              </details>
            </div>
            <div>
              <h2>Addresses On Ethereum</h2>
              <details>
                <summary>
                  Click to Expand, total: {addressesByChains?.addresses?.length}
                </summary>
                <PrettyPrintJson data={addressesByChains} />
              </details>
            </div>
            <div>
              <h2>Iban (first)</h2>
              <p>iban: {(iban as any)?.iban}</p>
              <details>
                <summary>Click to Expand</summary>
                <PrettyPrintJson data={iban} />
              </details>
            </div>
            <div>
              <h2>Ibans</h2>
              <details>
                <summary>
                  Click to Expand, total: {ibans?.ibans?.length}
                </summary>
                <PrettyPrintJson data={ibans} />
              </details>
            </div>

            <div>
              <h2>Balance (wallet)</h2>
              <details>
                <summary>
                  Click to Expand, balance:{' '}
                  {
                    walletBalances?.balances.find(
                      (b: any) => b.currency === 'eur'
                    )?.amount
                  }{' '}
                  EUR
                </summary>
                <PrettyPrintJson data={walletBalances} />
              </details>
            </div>
            <div>
              <h2>Balance (wallet) GBP & USD</h2>
              <details>
                <summary>
                  Click to Expand, balance:{' '}
                  {
                    walletBalancesGbpUsd?.balances.find(
                      (b: any) => b.currency === 'gbp'
                    )?.amount
                  }{' '}
                  GBP,
                  {
                    walletBalancesGbpUsd?.balances.find(
                      (b: any) => b.currency === 'usd'
                    )?.amount
                  }{' '}
                  USD
                </summary>
                <PrettyPrintJson data={walletBalancesGbpUsd} />
              </details>
            </div>
            <div>
              <h2>Order (latest)</h2>
              <p>placedAt: {(order as any)?.meta?.placedAt}</p>
              <details>
                <summary>Click to Expand</summary>
                <PrettyPrintJson data={order} />
              </details>
            </div>
            <div>
              <h2>Orders</h2>

              <details>
                <summary>
                  Click to Expand, total: {orders?.orders?.length}
                </summary>
                <PrettyPrintJson data={orders} />
              </details>
            </div>
            <div>
              <h2>Tokens</h2>
              <details>
                <summary>Click to Expand, total: {tokens?.length}</summary>
                <PrettyPrintJson data={tokens} />
              </details>
            </div>
            <div>
              <h2>Signatures</h2>
              <details>
                <summary>
                  Click to Expand, total: {(signatures as any)?.total}
                </summary>
                <PrettyPrintJson data={signatures} />
              </details>
            </div>
          </div>
          <br />

          <h1>Mutations</h1>
          <h2>Upload supporting document</h2>
          <UploadSupportingDocument />
          <h2>Place order</h2>
          <details>
            <summary>Click to Expand</summary>
            <PlaceOrder />
          </details>
          <h2>Link Address</h2>
          <details>
            <summary>Click to Expand</summary>
            <LinkAddress />
          </details>
          <h2>Request IBAN</h2>
          <details>
            <summary>Click to Expand</summary>
            <RequestIban />
          </details>
          <h2>Move IBAN</h2>
          <details>
            <summary>Click to Expand</summary>
            <MoveIban />
          </details>
          {/* Order notifications */}
        </>
      )}
      <br />
    </div>
  );
}
