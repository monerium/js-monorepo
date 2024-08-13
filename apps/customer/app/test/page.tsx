'use client';
import { ChangeEvent, FormEvent, useContext, useState } from 'react';
import { useAccount, useChainId, useSignMessage } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useQueryClient } from '@tanstack/react-query';

import {
  Chain,
  constants,
  Currency,
  PaymentStandard,
  placeOrderMessage,
} from '@monerium/sdk';
import {
  MoneriumContext,
  useAuth,
  // useAuthContext,
  useBalances,
  useLinkAddress,
  useOrder,
  useOrders,
  usePlaceOrder,
  useProfile,
  useTokens,
} from '@monerium/sdk-react-provider';
export default function Test() {
  const queryClient = useQueryClient();
  /**
   * Wagmi
   */
  const { address } = useAccount();
  const chainId = useChainId();
  const { signMessageAsync } = useSignMessage();

  /**
   * Monerium queries
   */
  const context = useContext(MoneriumContext);
  const { isAuthorized, authorize, revokeAccess, error: authError } = useAuth();

  const { profile } = useProfile();

  // const { authContext } = useAuthContext();

  const { orders } = useOrders();

  const { order } = useOrder({
    orderId: orders?.[0]?.id as string,
  });

  const { balances } = useBalances({
    profile: profile?.id as string,
    query: {
      refetchOnWindowFocus: true,
    },
  });

  const { tokens } = useTokens();

  /**
   * Monerium mutations
   */
  const { linkAddress, error: linkAddressError } = useLinkAddress({
    profileId: profile?.id as string,
  });

  const { placeOrder, error: placeOrderError } = usePlaceOrder({
    mutation: {
      onSuccess: (data, variables) => {
        console.log('onSuccess callback', data);
      },
      onError: (error) => {
        console.log('onError callback', error);
      },
    },
  });

  /**
   *
   *
   */

  const Input = ({
    name,
    defaultValue,
  }: {
    name: string;
    defaultValue: string;
  }) => {
    return (
      <div>
        <label htmlFor={name}>{name}:</label>
        <br />
        <input
          style={{ width: '400px' }}
          type="text"
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
      context?.sdk?.uploadSupportingDocument(file);
      // 👇 Uploading the file using the fetch API to the server
      // fetch('https://httpbin.org/post', {
      //   method: 'POST',
      //   body: file,
      //   // 👇 Set headers manually for single file upload
      //   headers: {
      //     'content-type': file.type,
      //     'content-length': `${file.size}`, // 👈 Headers need to be a string
      //   },
      // })
      //   .then((res) => res.json())
      //   .then((data) => console.log(data))
      //   .catch((err) => console.error(err));
    };

    return (
      <>
        <input type="file" onChange={handleFileChange} />

        <div>{file && `${file.name} - ${file.type}`}</div>

        <button onClick={handleUploadClick}>Upload</button>
      </>
    );
  };

  const PlaceOrder = () => {
    function placingOrder(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);

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
      alert(`Your message:'${msg}'`);

      signMessageAsync({ message: msg }).then((signature) => {
        alert(`You searched for '${signature}'`);
        placeOrder({
          address: address as string,
          amount: amount,
          currency: currency,
          signature,
          counterpart: {
            identifier: {
              standard: PaymentStandard.chain,
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
        <Input name="amount" defaultValue="1.33" />

        <label htmlFor="currency">currency:</label>
        <br />
        <select id="currency" name="currency">
          <option value="eur" selected>
            EUR
          </option>
          <option value="gpb">GPB</option>
          <option value="usd">USD</option>
        </select>
        <Input
          name="counterpart-identifier-address"
          defaultValue="0x1f77Bdedb8751C525E5C4223eA86C32972FB2c68"
        />
        <Input name="counterpart-identifier-chain" defaultValue="polygon" />
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
            message: constants.LINK_MESSAGE,
            address: address as string,
            chain: chainId,
            signature: signature,
          });
        }
      );
    }
    return (
      <form onSubmit={linkingAddress}>
        <div>
          <h3>Currency:</h3>
          <label>
            <input id="currency" type="checkbox" name="currency" value="eur" />{' '}
            EUR
          </label>
          <label>
            <input id="currency" type="checkbox" name="currency" value="gbp" />{' '}
            GBP
          </label>
          <label>
            <input id="currency" type="checkbox" name="currency" value="usd" />{' '}
            USD
          </label>
        </div>
        <div>
          <h3>Chain:</h3>
          <label>
            <input id="chain" type="checkbox" name="chain" value="ethereum" />{' '}
            Ethereum
          </label>
          <label>
            <input id="chain" type="checkbox" name="chain" value="polygon" />{' '}
            Polygon
          </label>
          <label>
            <input id="chain" type="checkbox" name="chain" value="gnosis" />{' '}
            Gnosis
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

  const autoLink = () => {
    signMessageAsync({ message: constants.LINK_MESSAGE }).then((signature) => {
      authorize({ address, signature, chain: chainId });
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <div>
        <ConnectButton />
      </div>
      <h1>Wallet</h1>
      <p>Address: {address}</p>
      <p>Chain ID: {chainId}</p>
      <h1>Auth</h1>
      <p>isAuthorized: {isAuthorized ? 'true' : 'false'}</p>
      <div style={{ color: 'red' }}>
        <PrettyPrintJson data={authError} />
      </div>
      <p>
        {!isAuthorized ? (
          <>
            <button type="submit" onClick={authorize}>
              Authorize
            </button>
            <button type="submit" onClick={autoLink}>
              Authorize with auto linking.
            </button>
          </>
        ) : (
          <button type="submit" onClick={revokeAccess}>
            Revoke Access
          </button>
        )}
      </p>
      {isAuthorized && (
        <>
          <h1>Queries</h1>
          <div>
            <div>
              {/* <h2>AuthContext</h2>
              <p>name: {authContext?.name}</p>
              <p>defaultProfile: {authContext?.defaultProfile}</p>
              <details>
                <summary>Click to Expand</summary>
                <PrettyPrintJson data={authContext} />
              </details> */}
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
              <h2>Balances</h2>
              <details>
                <summary>Click to Expand, total: {balances?.length}</summary>
                <PrettyPrintJson data={balances} />
              </details>
            </div>
            <div>
              <h2>Order (latest)</h2>
              <p>placedAt: {order?.meta?.placedAt}</p>
              <details>
                <summary>Click to Expand</summary>
                <PrettyPrintJson data={order} />
              </details>
            </div>
            <div>
              <h2>Orders</h2>

              <details>
                <summary>Click to Expand, total: {orders?.length}</summary>
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
        </>
      )}
      <br />
    </div>
  );
}
