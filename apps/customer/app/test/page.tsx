'use client';
import { ChangeEvent, FormEvent, useContext, useState } from 'react';
import Link from 'next/link';
import { useAccount, useChainId, useSignMessage } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

import {
  Chain,
  ChainId,
  constants,
  Currency,
  IdDocumentKind,
  Order,
  OrderState,
  PaymentStandard,
  placeOrderMessage,
  rfc3339,
  siweMessage,
} from '@monerium/sdk';
import {
  MoneriumContext,
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
  useSubmitProfileDetails,
  useSubscribeOrderNotification,
  useTokens,
} from '@monerium/sdk-react-provider';
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
  const context = useContext(MoneriumContext);

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

  /**
   * Monerium mutations
   */
  const { linkAddress, error: linkAddressError } = useLinkAddress();

  const { submitProfileDetails, error: submitProfileDetailsError } =
    useSubmitProfileDetails({ profile: profile?.id as string });

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

  const { requestIban, error: requestIbanError } = useRequestIban();
  const { moveIban, error: moveIbanError } = useMoveIban();

  const handleOrderNotification = (order: Order) => {
    console.log(
      '%c order notification!',
      'color:white; padding: 30px; background-color: darkgreen',
      order
    );
  };

  let unsubscribe = useSubscribeOrderNotification({
    state: OrderState.placed,
    profile: profile?.id as string,
    onMessage: handleOrderNotification,
  });

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
      context?.sdk?.uploadSupportingDocument(file);
    };

    return (
      <>
        <input type="file" onChange={handleFileChange} />

        <div>{file && `${file.name} - ${file.type}`}</div>

        <button onClick={handleUploadClick}>Upload</button>
      </>
    );
  };

  const SubmitProfileDetails = () => {
    const [profileKind, setProfileKind] = useState<string>('personal');

    const handleProfileKindChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      setProfileKind(event.target.value);
    };
    function submittingProfileDetails(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);

      if (profileKind === 'personal') {
        submitProfileDetails({
          personal: {
            idDocument: {
              number: formData.get(
                'profile-detail-id-document-number'
              ) as string,
              kind: formData.get(
                'profile-detail-id-document-type'
              ) as IdDocumentKind,
            },
            firstName: formData.get('profile-detail-first-name') as string,
            lastName: formData.get('profile-detail-last-name') as string,
            birthday: formData.get('profile-detail-birthday') as string,
            nationality: formData.get('profile-detail-nationality') as string,
            address: formData.get('profile-detail-address') as string,
            postalCode: formData.get('profile-detail-postal-code') as string,
            city: formData.get('profile-detail-city') as string,
            country: formData.get('profile-detail-country') as string,
            countryState: formData.get(
              'personal-detail-country-state'
            ) as string,
          },
        });
      }
      if (profileKind === 'corporate') {
        submitProfileDetails({
          corporate: {
            name: formData.get('profile-detail-name') as string,
            registrationNumber: formData.get(
              'profile-detail-registration-number'
            ) as string,
            address: formData.get('profile-detail-address') as string,
            postalCode: formData.get('profile-detail-postal-code') as string,
            city: formData.get('profile-detail-city') as string,
            country: formData.get('profile-detail-country') as string,
            countryState: formData.get(
              'personal-detail-country-state'
            ) as string,
            representatives: [
              {
                idDocument: {
                  number: formData.get(
                    'representative-id-document-number'
                  ) as string,
                  kind: formData.get(
                    'representative-id-document-type'
                  ) as IdDocumentKind,
                },
                firstName: formData.get('representative-first-name') as string,
                lastName: formData.get('representative-last-name') as string,
                birthday: formData.get('representative-birthday') as string,
                nationality: formData.get(
                  'representative-nationality'
                ) as string,
                address: formData.get('representative-address') as string,
                postalCode: formData.get(
                  'representative-postal-code'
                ) as string,
                city: formData.get('representative-city') as string,
                country: formData.get('representative-country') as string,
                countryState: formData.get(
                  'representative-country-state'
                ) as string,
              },
            ],
            finalBeneficiaries: [
              {
                ownershipPercentage: parseInt(
                  formData.get('beneficiary-ownershipPercentage') as string
                ),
                firstName: formData.get('beneficiary-first-name') as string,
                lastName: formData.get('beneficiary-last-name') as string,
                birthday: formData.get('beneficiary-birthday') as string,
                nationality: formData.get('beneficiary-nationality') as string,
                address: formData.get('beneficiary-address') as string,
                postalCode: formData.get('beneficiary-postal-code') as string,
                city: formData.get('beneficiary-city') as string,
                country: formData.get('beneficiary-country') as string,
                countryState: formData.get(
                  'beneficiary-country-state'
                ) as string,
              },
            ],
            directors: [
              {
                firstName: formData.get('director-first-name') as string,
                lastName: formData.get('director-last-name') as string,
                birthday: formData.get('director-birthday') as string,
                nationality: formData.get('director-nationality') as string,
                address: formData.get('director-address') as string,
                postalCode: formData.get('director-postal-code') as string,
                city: formData.get('director-city') as string,
                country: formData.get('director-country') as string,
                countryState: formData.get('director-country-state') as string,
              },
            ],
          },
        });
      }
    }
    return (
      <form onSubmit={submittingProfileDetails}>
        <div>
          <h3>Profile kind:</h3>
          <label>
            <input
              id="profile-kind"
              type="checkbox"
              name="profile-kind"
              value="personal"
              checked={profileKind === 'personal'}
              onChange={handleProfileKindChange}
            />
            Personal
          </label>
          <label>
            <input
              id="profile-kind"
              type="checkbox"
              name="profile-kind"
              value="corporate"
              checked={profileKind === 'corporate'}
              onChange={handleProfileKindChange}
            />{' '}
            Corporate
          </label>
        </div>

        {profileKind === 'personal' && (
          <>
            <Input
              name="profile-detail-id-document-number"
              defaultValue="A1234566788"
            />
            <Input
              name="profile-detail-id-document-type"
              defaultValue="passport"
            />
            <Input name="profile-detail-first-name" defaultValue="John" />
            <Input name="profile-detail-last-name" defaultValue="Doe" />
            <Input name="profile-detail-birthday" defaultValue="1990-05-15" />
            <Input name="profile-detail-nationality" defaultValue="IS" />
          </>
        )}
        {profileKind === 'corporate' && (
          <>
            <Input name="profile-detail-name" defaultValue="EvilCorp" />
            <Input
              name="profile-detail-registration-number"
              defaultValue="passport"
            />
            <div>
              <h3>Representative:</h3>
              <Input
                name="representative-id-document-number"
                defaultValue="A1234566788"
              />
              <Input
                name="representative-id-document-type"
                defaultValue="passport"
              />
              <Input
                name="representative-first-name"
                defaultValue="Representative"
              />
              <Input name="representative-last-name" defaultValue="Doe" />
              <Input
                name="representative-address"
                defaultValue="Pennylane 123"
              />
              <Input name="representative-birthday" defaultValue="1990-05-15" />
              <Input name="representative-nationality" defaultValue="IS" />
              <Input
                name="representative-postal-code"
                type="number"
                defaultValue="1001"
              />
              <Input name="representative-country" defaultValue="IS" />
              <Input
                name="representative-country-state"
                defaultValue="Reykjavík"
              />
              <Input name="representative-city" defaultValue="Liverpool" />
            </div>
            <div>
              <h3>Final Beneficiary:</h3>
              <Input
                name="beneficiary-ownershipPercentage"
                type="number"
                defaultValue="100"
              />
              <Input name="beneficiary-first-name" defaultValue="Beneficiary" />
              <Input name="beneficiary-last-name" defaultValue="Doe" />
              <Input name="beneficiary-birthday" defaultValue="1990-05-15" />
              <Input name="beneficiary-nationality" defaultValue="IS" />
              <Input name="beneficiary-address" defaultValue="Pennylane 123" />
              <Input
                name="beneficiary-postal-code"
                type="number"
                defaultValue="1001"
              />
              <Input name="beneficiary-country" defaultValue="IS" />
              <Input
                name="beneficiary-country-state"
                defaultValue="Reykjavík"
              />
              <Input name="beneficiary-city" defaultValue="Liverpool" />
            </div>
            <div>
              <h3>Director:</h3>
              <Input name="director-first-name" defaultValue="Director" />
              <Input name="director-last-name" defaultValue="Doe" />
              <Input name="director-birthday" defaultValue="1990-05-15" />
              <Input name="director-nationality" defaultValue="IS" />
              <Input name="director-address" defaultValue="Pennylane 123" />
              <Input
                name="director-postal-code"
                type="number"
                defaultValue="1001"
              />
              <Input name="director-country" defaultValue="IS" />
              <Input name="director-country-state" defaultValue="Reykjavík" />
              <Input name="director-city" defaultValue="Liverpool" />
            </div>
          </>
        )}

        <Input name="profile-detail-address" defaultValue="Pennylane 123" />
        <Input
          name="profile-detail-postal-code"
          type="number"
          defaultValue="1001"
        />
        <Input name="profile-detail-country" defaultValue="IS" />
        <Input name="profile-detail-country-state" defaultValue="Reykjavík" />
        <Input name="profile-detail-city" defaultValue="Liverpool" />

        <div style={{ color: 'red' }}>
          <PrettyPrintJson data={submitProfileDetailsError} />
        </div>
        <button type="submit">Submit Profile Details</button>
      </form>
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
          address: walletAddress as string,
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

  const autoLink = () => {
    signMessageAsync({ message: constants.LINK_MESSAGE }).then((signature) => {
      authorize({ address: `${address}`, signature, chain: chainId });
    });
  };
  const authorizeSiwe = () => {
    const siwe_message = siweMessage({
      domain: 'localhost:3000',
      address: `${walletAddress}`,
      appName: 'SDK TEST APP',
      redirectUri: 'http://localhost:3000/dashboard',
      chainId: chainId,
      privacyPolicyUrl: 'https://example.com/privacy-policy',
      termsOfServiceUrl: 'https://example.com/terms-of-service',
    });

    signMessageAsync({ message: siwe_message }).then((signature) => {
      siwe({ message: siwe_message, signature });
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <Link href="/dashboard">Dashboard</Link>
      <button
        type="submit"
        onClick={() => {
          unsubscribe();
        }}
      >
        Close Order Notifications
      </button>
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
                  email: 'test@test.is',
                  skipCreateAccount: true,
                  skipKyc: true,
                })
              }
            >
              Authorize min (skip KYC and Wallet Connection)
            </button>
            <button type="submit" onClick={autoLink}>
              Authorize with auto linking.
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
              <p>address: {address?.address}</p>
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
              <p>iban: {iban?.iban}</p>
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
                    walletBalances?.balances.find((b) => b.currency === 'eur')
                      ?.amount
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
                      (b) => b.currency === 'gbp'
                    )?.amount
                  }{' '}
                  GBP,
                  {
                    walletBalancesGbpUsd?.balances.find(
                      (b) => b.currency === 'usd'
                    )?.amount
                  }{' '}
                  USD
                </summary>
                <PrettyPrintJson data={walletBalancesGbpUsd} />
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
          <h2>Submit Profile Details</h2>
          <details>
            <summary>Click to Expand</summary>
            <SubmitProfileDetails />
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
