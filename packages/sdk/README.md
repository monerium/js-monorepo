| [Monerium.com](https://monerium.com/) | [Monerium.app](https://monerium.app/) | [Monerium.dev](https://monerium.dev/) |
| ------------------------------------- | ------------------------------------- | ------------------------------------- |

# Monerium SDK Documentation

  <a href="https://monerium.dev/">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/Developer_portal-2c6ca7"></source>
      <img src="https://img.shields.io/badge/Developer_portal-2c6ca7" alt="Static Badge"></img>
    </picture>
  </a>
  <a href="https://monerium.dev/api-docs">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/API_documentation-2c6ca7"></source>
      <img src="https://img.shields.io/badge/API_documentation-2c6ca7" alt="Static Badge"></img>
    </picture>
  </a>
  <br></br>
    <a href="https://www.npmjs.com/package/@monerium/sdk">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/npm/v/%40monerium%2Fsdk?colorA=2c6ca7&colorB=21262d"></source>
      <img src="https://img.shields.io/npm/v/%40monerium%2Fsdk?colorA=f6f8fa&colorB=f6f8fa" alt="Version"></img>
    </picture>
  </a>
  <a href="https://github.com/monerium/js-monorepo/issues">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/github/issues/monerium/js-monorepo?colorA=2c6ca7&colorB=21262d"></source>
      <img src="https://img.shields.io/github/issues/monerium/js-monorepo?colorA=2c6ca7&colorB=21262d" alt="Version"></img>
    </picture>
  </a>

## Introduction

Monerium connects your web3 wallet to any euro bank account with your personal IBAN.
All incoming euro payments are automatically minted as EURe tokens to your wallet.
Sending EURe to traditional bank accounts is just as easy.
With a single signature from your wallet, your EURe is burned and sent as Euros to any bank account.

## Documentation

- [Documentation](../../apps/developer/docs/packages/SDK/index.md)
- [Documentation - MoneriumClient](../../apps/developer/docs/packages/SDK/classes/MoneriumClient.md)

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Usage Examples](#usage-examples)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [FAQs](#faqs)
- [Support](#support)
- [Release Notes](#release-notes)
- [License](#license)

## Installation

### Prerequisites

Node v16.15 or higher is required.

```sh
yarn add @monerium/sdk
```

## Configuration

### Environments - URLs

| Environment | Web                  | API                      |
| ----------- | -------------------- | ------------------------ |
| sandbox     | https://monerium.dev | https://api.monerium.dev |
| production  | https://monerium.app | https://api.monerium.app |

### Environments - Networks

| Environment | Chain    | Network |
| ----------- | -------- | ------- |
| sandbox     | ethereum | sepolia |
|             | polygon  | mumbai  |
|             | gnosis   | chiado  |
| production  | ethereum | mainnet |
|             | polygon  | mainnet |
|             | gnosis   | mainnet |

## Usage Examples

We recommend starting in the [Developer Portal](https://monerium.dev/docs/welcome). There, you will learn more about `client_id`'s and ways of authenticating.

#### Initialize and authenticate using Client Credentials

> Client Credentials is used when there's no need for user interaction, and the system-to-system interaction requires authentication.

```ts
import { MoneriumClient } from '@monerium/sdk';
// Initialize the client with credentials
const monerium = new MoneriumClient({
  environment: 'sandbox',
  clientId: 'your_client_credentials_uuid', // replace with your client ID
  clientSecret: 'your_client_secret', // replace with your client secret
});

await monerium.getAccess();

// Retrieve profiles the client has access to.
await monerium.getProfiles();

// Access tokens are now available for use.
const { access_token, refresh_token } = monerium.bearerProfile as BearerProfile;

// Use refresh token to get a new access token
await monerium.getAccess(refresh_token);
```

API documentation:

- [/auth/token](https://monerium.dev/api-docs#operation/auth-token)

#### Initialize and authenticate using Authorization Code Flow with PKCE

> Authorization Code Flow with PKCE is used for apps where direct user interaction is involved, and the application is running on an environment where the confidentiality of a secret cannot be safely maintained. It allows the application to authorize users without handling their passwords and mitigates the additional risk involved in this sort of delegation.

First, you have to navigate the user to the Monerium authentication flow. This can be done by generating a URL and redirecting the user to it. After the user has authenticated, Monerium will redirect back to your specified URI with a code. You can then finalize the authentication process by exchanging the code for access and refresh tokens.

```ts
import { MoneriumClient } from '@monerium/sdk';

export function App() {
  const [profiles, setProfiles] = useState<Profile[] | null>(null);
  const [monerium, setMonerium] = useState<MoneriumClient>();
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

  useEffect(() => {
    const sdk = new MoneriumClient({
      environment: 'sandbox',
      clientId: 'f99e629b-6dca-11ee-8aa6-5273f65ed05b',
      redirectUri: 'http://localhost:4200',
    });
    setMonerium(sdk);
  }, []);

  useEffect(() => {
    const connect = async () => {
      if (monerium) {
        setIsAuthorized(await monerium.getAccess());
      }
    };

    connect();

    return () => {
      if (monerium) {
        monerium.disconnect();
      }
    };
  }, [monerium]);

  useEffect(() => {
    const fetchData = async () => {
      if (monerium && isAuthorized) {
        try {
          const { profiles } = await monerium.getProfiles();
          setProfiles(profiles);
        } catch (err) {
          console.error('Error fetching data:', err);
        }
      }
    };
    fetchData();
  }, [monerium, isAuthorized]);

  return (
    <div>
      {!isAuthorized && <button onClick={() => monerium?.authorize()}>Connect</button>}

      <p>{profiles[0]?.name}</p>
    </div>
  );
}
```

API documentation:

- [/auth](https://monerium.dev/api-docs#operation/auth)
- [/auth/token](https://monerium.dev/api-docs#operation/auth-token)

#### Get account information

```ts
// Get all profiles
const { profiles }: Profile[] = await monerium.getProfiles();

// Fetching all accounts for a specific profile
const { id: profileId, accounts }: Profile = await monerium.getProfile(
  profiles[0].id
);

// Fetching all balances for a specific profile
const balances: Balances = await monerium.getBalances();
```

API documentation:

- [/profile](https://monerium.dev/api-docs#operation/profile)
- [/profile/&#123;profileId&#123;/balances](https://monerium.dev/api-docs#operation/profile-balances)

#### Get token information

Get the contract addresses of EURe tokens.

```ts
const tokens: Token[] = await monerium.getTokens();
```

API documentation:

- [/tokens](https://monerium.dev/api-docs#operation/tokens)

#### Link a new address to Monerium

It's important to understand when interacting with a blockchain, the user needs to provide a signature in their wallet.
This signature is used to verify that the user is the owner of the wallet address.

We recommend Viem as an Ethereum interface, see: https://viem.sh/docs/actions/wallet/signMessage.html

```ts

import { constants } from '@monerium/sdk';
import { walletClient } from '...' // See Viem documentation

const { LINK_MESSAGE } = constants; // "I hereby declare that I am the address owner."

// Send a signature request to the wallet.
const signature = await walletClient.signMessage({
  message: LINK_MESSAGE,
})

// Link a new address to Monerium and create accounts for ethereum and gnosis.
await monerium.linkAddress({
  profile: 'your-profile-id',
  address: '0xUserAddress72413Fa92980B889A1eCE84dD', // user wallet address
  message: LINK_MESSAGE
  signature,
  chain: 'ethereum',
} as LinkAddress);
```

API documentation:

- [/profile/&#123;profileId&#123;/addresses](https://monerium.dev/api-docs#operation/profile-addresses)

#### Get and place orders

```ts
// Get orders for a specific profile
const orders: Order[] = await monerium.getOrders(profileId);
```

```ts
// Place a redeem order
import { placeOrderMessage } from '@monerium/sdk';
import { walletClient } from '...'; // See Viem documentation

const amount = '100'; // replace with the amount in EUR
const iban = 'EE12341234123412341234'; // replace with requested IBAN

// First you have to form the message that will be signed by the user
const message = placeOrderMessage(amount, 'eur', iban);

// The message should look like this, with the current date and time in RFC3339 format:
// Send EUR 100 to EE12341234123412341234 at Thu, 29 Dec 2022 14:58:29Z

// Send a signature request to the wallet.
const signature = await walletClient.signMessage({
  message: message,
});

// Place the order
const order = await monerium.placeOrder({
  amount,
  signature,
  currency: 'eur',
  address: '0xUserAddress72413Fa92980B889A1eCE84dD', // user wallet address
  counterpart: {
    identifier: {
      standard: 'iban', // PaymentStandard.iban,
      iban,
    },
    details: {
      firstName: 'User',
      lastName: 'Userson',
      county: 'IS',
    },
  },
  message,
  memo: 'Powered by Monerium SDK',
  chain: 'ethereum',
  network: 'sepolia',
  // supportingDocumentId, see below
});
```

API documentation:

- [GET /orders](https://monerium.dev/api-docs#operation/orders)
- [POST /orders](https://monerium.dev/api-docs#operation/post-orders)

#### Add supporting documents

When placing orders with payouts above 15,000 EUR, a supporting document is required. The document must be uploaded to Monerium before the order can be placed. Supporting documents can be an invoice or an agreement.

```ts
// Upload a supporting document
const supportingDocumentId: SupportingDoc =
  await uploadSupportingDocument(document);
```

API documentation:

- [/files](https://monerium.dev/api-docs#operation/supporting-document)

#### Subscribe to order events

```ts
import { OrderState } from '@monerium/sdk';
const [orderState, setOrderState] = useState<OrderState>();

// Subscribe to all order events
monerium.subscribeOrderNotifications();

// Subscribe to specific order events
monerium.subscribeOrderNotifications({ 
  filter: {
    state: OrderState.pending,
    profile: 'my-profile-id',
  },
  // optional callback functions
  onMessage: (order) => console.log(order)
  onError: (error) => console.error(error)
});

// Unsubscribe from specific order events
monerium.unsubscribeOrderNotifications({ 
  state: OrderState.pending,
  profile: 'my-profile-id'
});
// Unsubscribe from all order events
monerium.unsubscribeOrderNotifications();

```

## API Reference

[API Documentation](https://monerium.dev/docs/api)

## Contributing

We are using [commitlint](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional) to enforce that developers format the commit messages according to the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) guidelines.

We are using PNPM as a package manager.

#### Development mode

```
pnpm dev
```

While in development mode, TypeScript declaration maps (`.d.ts.map`) are generated. TypeScript declaration maps are mainly used to quickly jump to type definitions in the context of a monorepo.

#### Build

```
pnpm build
```

### Documentation

Refer to [Typedocs](https://typedoc.org/) syntaxes to use for this [documentation](https://monerium.github.io/js-monorepo/).

#### Publishing

When changes are merged to the `main` branch that follows the [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) standard, [release-please](https://github.com/googleapis/release-please) workflow creates a pull request, preparing for the next release. If kept open, the following commits will also be added to the PR. Merging that PR will create a new release, a workflow will publish it on NPM and tag it on Github.

## FAQs

Common questions developers have regarding the SDK.

## Support

[Support](https://monerium.app/help)

[Telegram](https://t.me/+lGtM1gY9zWthNGE8)

[Github Issues](https://github.com/monerium/js-monorepo/issues)

## Release Notes

https://github.com/monerium/js-monorepo/releases
