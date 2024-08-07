// --- Config --- //

export type Environment = { api: string; web: string; wss: string };

export type Config = {
  environments: { production: Environment; sandbox: Environment };
};

export type ENV = 'sandbox' | 'production';

export type EthereumTestnet = 'sepolia';
export type GnosisTestnet = 'chiado';
export type PolygonTestnet = 'amoy';

export type Chain = 'ethereum' | 'gnosis' | 'polygon' | 'gnosismainnet';
export type Networks =
  | EthereumTestnet
  | GnosisTestnet
  | PolygonTestnet
  | 'mainnet';

// -- Commons
export type NetworkSemiStrict<C extends Chain> = C extends 'ethereum'
  ? EthereumTestnet | 'mainnet'
  : C extends 'gnosis'
    ? GnosisTestnet | 'mainnet'
    : C extends 'polygon'
      ? PolygonTestnet | 'mainnet'
      : never;

export type NetworkStrict<
  C extends Chain,
  E extends ENV,
> = E extends 'production'
  ? 'mainnet'
  : E extends 'sandbox'
    ? C extends 'ethereum'
      ? EthereumTestnet
      : C extends 'gnosis'
        ? GnosisTestnet
        : C extends 'polygon'
          ? PolygonTestnet
          : never
    : never;

/*
 * -- isValid:
 * const network: Network<'ethereum', 'sandbox'> = 'sepolia';
 * const network: Network<'ethereum'> = 'mainnet';
 * const network: Network<'ethereum'> = 'sepolia'
 * const network: Network = 'chiado'
 *
 * -- isInValid:
 * const network: Network<'ethereum', 'sandbox'> = 'chiado';
 * const network: Network<'ethereum'> = 'chiado';
 */
export type Network<
  C extends Chain = Chain,
  E extends ENV = ENV,
> = C extends Chain
  ? E extends ENV
    ? NetworkStrict<C, E> & NetworkSemiStrict<C>
    : never
  : never;

export type ChainId = number | 1 | 11155111 | 100 | 137 | 10200 | 80002;

export enum Currency {
  eur = 'eur',
  usd = 'usd',
  gbp = 'gbp',
  isk = 'isk',
}

export type TokenSymbol = 'EURe' | 'GBPe' | 'USDe' | 'ISKe';
export type Ticker = 'EUR' | 'GBP' | 'USD' | 'ISK';

// -- auth

export type AuthArgs =
  | Omit<AuthCodeRequest, 'grant_type'>
  | Omit<RefreshTokenRequest, 'grant_type'>
  | Omit<ClientCredentialsRequest, 'grant_type'>;

export type OpenArgs =
  | Omit<AuthCodeRequest, 'grant_type' | 'code' | 'code_verifier'>
  | Omit<RefreshTokenRequest, 'grant_type'>
  | Omit<ClientCredentialsRequest, 'grant_type'>
  | PKCERequestArgs;

/** One of the options for the {@link AuthArgs}.
 *
 * [Auth endpoint in API documentation:](https://monerium.dev/api-docs#operation/auth).
 * */
export interface AuthCodeRequest {
  grant_type: 'authorization_code';
  client_id: string;
  code: string;
  code_verifier: string;
  redirect_uri: string;
  scope?: string;
}

/** One of the options for the {@link AuthArgs}.
 *
 * [Auth endpoint in API documentation:](https://monerium.dev/api-docs#operation/auth).
 * */
export interface RefreshTokenRequest {
  grant_type: 'refresh_token';
  client_id: string;
  refresh_token: string;
  scope?: string;
}

/** One of the options for the {@link AuthArgs}.
 *
 * [Auth endpoint in API documentation:](https://monerium.dev/api-docs#operation/auth).
 * */
export interface ClientCredentialsRequest {
  grant_type: 'client_credentials';
  client_id: string;
  client_secret: string;
  scope?: string;
}

export interface BearerProfile {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  profile: string;
  userId: string;
}

// -- pkceRequest

/**
 * @returns A {@link PKCERequest} object with properties omitted that are automatically computed in by the SDK.
 */
export type PKCERequestArgs = Omit<
  PKCERequest,
  'code_challenge' | 'code_challenge_method' | 'response_type'
>;

export type PKCERequest = {
  /** the authentication flow client id of the application */
  client_id: string;
  /** the code challenge automatically generated by the SDK */
  code_challenge: string;
  /** the code challenge method for the authentication flow , handled by the SDK  */
  code_challenge_method: 'S256';
  /** the response type of the authentication flow, handled by the SDK */
  response_type: 'code';
  /** the state of the application */
  state?: string;
  /** the redirect uri of the application */
  redirect_uri: string;
  /** the scope of the application */
  scope?: string;
  /** the address of the wallet to automatically link */
  address?: string;
  /** the signature of the wallet to automatically link */
  signature?: string;
  /** The network of the wallet to automatically link  */
  chain?: Chain | ChainId;
};

// -- authContext

export enum Method {
  password = 'password',
  resource = 'resource',
  jwt = 'jwt',
  apiKey = 'apiKey',
}

export enum ProfileType {
  corporate = 'corporate',
  personal = 'personal',
}

export enum Permission {
  read = 'read',
  write = 'write',
}

export interface AuthProfile {
  id: string;
  type: ProfileType;
  name: string;
  perms: Permission[];
}

export interface AuthContext {
  userId: string;
  email: string;
  name: string;
  roles: 'admin'[];
  auth: { method: Method; subject: string; verified: boolean };
  defaultProfile: string;
  profiles: AuthProfile[];
}

// -- getProfile

export enum KYCState {
  absent = 'absent',
  submitted = 'submitted',
  pending = 'pending',
  confirmed = 'confirmed',
}

export enum KYCOutcome {
  approved = 'approved',
  rejected = 'rejected',
  unknown = 'unknown',
}

export enum AccountState {
  requested = 'requested',
  approved = 'approved',
  pending = 'pending',
}

export interface KYC {
  state: KYCState;
  outcome: KYCOutcome;
}

export enum PaymentStandard {
  iban = 'iban',
  scan = 'scan',
  chain = 'chain',
}

export interface Identifier {
  standard: PaymentStandard;
  bic?: string;
}

export interface Account {
  address: string;
  currency: Currency;
  standard: PaymentStandard;
  iban?: string;
  // sortCode?: string;
  // accountNumber?: string;
  network?: Network;
  chain: Chain;
  id?: string;
  state?: AccountState;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  kyc: KYC;
  kind: ProfileType;
  accounts: Account[];
}

// -- getBalances
export interface Balance {
  currency: Currency;
  amount: string;
}

export interface Balances {
  id: string;
  address: string;
  chain: Chain;
  network: Network;
  balances: Balance[];
}

// --getOrders

export enum OrderKind {
  redeem = 'redeem',
  issue = 'issue',
}

export enum OrderState {
  placed = 'placed',
  pending = 'pending',
  processed = 'processed',
  rejected = 'rejected',
}

export interface Fee {
  provider: 'satchel';
  currency: Currency;
  amount: string;
}

export interface IBAN extends Identifier {
  standard: PaymentStandard.iban;
  iban: string;
}

export interface CrossChain extends Identifier {
  standard: PaymentStandard.chain;
  /** The receivers address */
  address: string;
  /** The receivers network  */
  chain: Chain | ChainId;
}

export interface SCAN extends Identifier {
  standard: PaymentStandard.scan;
  sortCode: string;
  accountNumber: string;
}

export interface Individual {
  firstName: string;
  lastName: string;
  country?: string;
}

export interface Corporation {
  companyName: string;
  country: string;
}

export interface Counterpart {
  identifier: IBAN | SCAN | CrossChain;
  details: Individual | Corporation;
}

export interface OrderMetadata {
  approvedAt: string;
  processedAt: string;
  rejectedAt: string;
  state: OrderState;
  placedBy: string;
  placedAt: string;
  receivedAmount: string;
  sentAmount: string;
}

export interface OrderFilter {
  address?: string;
  txHash?: string;
  profile?: string;
  memo?: string;
  accountId?: string;
  state?: OrderState;
}

export interface Order {
  id: string;
  profile: string;
  accountId: string;
  address: string;
  kind: OrderKind;
  amount: string;
  currency: Currency;
  totalFee: string;
  fees: Fee[];
  counterpart: Counterpart;
  memo: string;
  rejectedReason: string;
  supportingDocumentId: string;
  meta: OrderMetadata;
}

// -- getTokens
/**
 * Information about the EURe token on different networks.
 */
export interface Token {
  currency: Currency;
  ticker: Ticker;
  symbol: TokenSymbol;
  chain: Chain;
  network: Network;
  /** The address of the EURe contract on this network */
  address: string;
  /** How many decimals this token supports */
  decimals: number;
}

// --placeOrder

export type NewOrder = NewOrderByAddress | NewOrderByAccountId;

export interface NewOrderCommon {
  amount: string;
  signature: string;
  currency: Currency;
  counterpart: Counterpart;
  message: string;
  memo?: string;
  supportingDocumentId?: string;
}
export interface NewOrderByAddress extends NewOrderCommon {
  address: string;
  /** The senders network  */
  chain: Chain | ChainId;
}
export interface NewOrderByAccountId extends NewOrderCommon {
  accountId: string;
}

// -- uploadSupportingDocument

export interface SupportingDocMetadata {
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupportingDoc {
  id: string;
  name: string;
  type: string;
  size: number;
  hash: string;
  meta: SupportingDocMetadata;
}

// -- linkAddress

export interface CurrencyAccounts {
  /** The accounts network  */
  chain: Chain | ChainId;
  currency: Currency;
}

export interface LinkAddress {
  address: string;
  message: string;
  signature: string;
  accounts: CurrencyAccounts[];
  chain?: Chain | ChainId;
}

export interface LinkedAddress {
  id: string;
  profile: string;
  address: string;
  message: string;
  meta: {
    linkedBy: string;
    linkedAt: string;
  };
}

// -- Notifications

export interface OrderNotification {
  id: string;
  profile: string;
  accountId: string;
  address: string;
  kind: string;
  amount: string;
  currency: string;
  totalFee: string;
  fees: Fee[];
  counterpart: Counterpart;
  memo: string;
  rejectedReason: string;
  supportingDocumentId: string;
  meta: OrderMetadata;
}

export type MoneriumEvent = OrderState;

export type MoneriumEventListener = (notification: OrderNotification) => void;

export type ClassOptions = {
  environment?: ENV;
  version?: 'v1' | 'v2';
} & BearerTokenCredentials;

export interface AuthFlowOptions {
  clientId?: string;
  redirectUri?: string;
  /** @deprecated use redirectUri */
  redirectUrl?: string;
  address?: string;
  signature?: string;
  chain?: Chain | ChainId;
  state?: string;
  scope?: string; // TODO: type 'orders:write' etc.
}

export interface ClientCredentials {
  clientId: string;
  clientSecret: string;
}

export interface AuthorizationCodeCredentials {
  clientId: string;
  redirectUri: string;
}
/** @deprecated use redirectUri */
export interface DeprecatedAuthorizationCodeCredentials {
  clientId?: string;
  /** @deprecated use redirectUri */
  redirectUrl?: string;
}

export type BearerTokenCredentials =
  | ClientCredentials
  | AuthorizationCodeCredentials
  | DeprecatedAuthorizationCodeCredentials;
