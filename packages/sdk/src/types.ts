// --- Config --- //

export type Environment = { name: ENV; api: string; web: string; wss: string };

export type Config = {
  environments: { production: Environment; sandbox: Environment };
};

export type ENV = 'sandbox' | 'production';

export type SandboxChain =
  | 'sepolia'
  | 'chiado'
  | 'amoy'
  | 'arbitrumsepolia'
  | 'lineasepolia'
  | 'scrollsepolia'
  | 'columbus'
  | 'grand';

export type ProductionChain =
  | 'ethereum'
  | 'gnosis'
  | 'polygon'
  | 'arbitrum'
  | 'linea'
  | 'scroll'
  | 'camino'
  | 'noble';

export type Chain = string | ProductionChain | SandboxChain;

export type EvmChainId =
  | number
  | 1 // ethereum mainnet
  | 11155111 // ethereum sepolia
  | 100 // gnosis
  | 10200 // gnosis chiado
  | 500 // camino
  | 501 // camino columbus
  | 137 // polygon
  | 80002 // polygon amoy
  | 42161 // arbitrum
  | 421614 // arbitrum sepolia
  | 59141 // linea sepolia
  | 59144 // linea
  | 534352 // scroll
  | 534351; // scroll sepolia

export type ChainId = EvmChainId | CosmosChainId;

export type CosmosChainId = 'noble-1' | 'grand-1' | 'florin-1';

export enum Currency {
  eur = 'eur',
  usd = 'usd',
  gbp = 'gbp',
  isk = 'isk',
}

export type TokenSymbol = 'EURe' | 'GBPe' | 'USDe' | 'ISKe';
export type Ticker = 'EUR' | 'GBP' | 'USD' | 'ISK';
export type CurrencyCode = 'eur' | 'gbp' | 'usd' | 'isk';

// -- auth

export type AuthArgs =
  | Omit<AuthCodePayload, 'grant_type'>
  | Omit<RefreshTokenPayload, 'grant_type'>
  | Omit<ClientCredentialsPayload, 'grant_type'>;

/** One of the options for the {@link AuthArgs}.
 *
 * [Auth endpoint in API documentation:](https://monerium.dev/api-docs#operation/auth).
 * */
export interface AuthCodePayload {
  grant_type: 'authorization_code';
  client_id: string;
  code: string;
  code_verifier: string;
  redirect_uri: string;
}

/** One of the options for the {@link AuthArgs}.
 *
 * [Auth endpoint in API documentation:](https://monerium.dev/api-docs#operation/auth).
 * */
export interface RefreshTokenPayload {
  grant_type: 'refresh_token';
  client_id: string;
  refresh_token: string;
}

/** One of the options for the {@link AuthArgs}.
 *
 * [Auth endpoint in API documentation:](https://monerium.dev/api-docs#operation/auth).
 * */
export interface ClientCredentialsPayload {
  grant_type: 'client_credentials';
  client_id: string;
  client_secret: string;
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

export interface PKCERequestShared {
  /** the authentication flow client id of the application */
  client_id: string;
  /** the redirect uri of the application */
  redirect_uri?: string;
  /** the code challenge automatically generated by the SDK */
  code_challenge: string;
  /** the code challenge method for the authentication flow , handled by the SDK  */
  code_challenge_method: 'S256';
  /** the state of the application */
  state?: string;
}
/**
 * @returns A {@link PKCERequest} object with properties omitted that are automatically computed in by the SDK.
 */
export type PKCERequestArgs = Omit<
  PKCERequest,
  'code_challenge' | 'code_challenge_method' | 'response_type'
>;

export interface PKCERequest extends PKCERequestShared {
  /** the response type of the authentication flow, handled by the SDK */
  response_type: 'code';
  /** the email of the user to prefill the login form */
  email?: string;
  /** @deprecated: will be removed, the scope of the application */
  scope?: string;
  /** the address of the wallet to automatically link */
  address?: string;
  /** the signature of the wallet to automatically link */
  signature?: string;
  /** The network of the wallet to automatically link  */
  chain?: Chain | ChainId;
  /** You can skip the connect wallet and request IBAN steps in the Authorization Flow and use the Link Address and Request IBAN API endpoints after you have gotten the authorization */
  skip_create_account?: boolean;
  /** You can skip the KYC onboarding steps in the Authorization Flow and use the the details, additional data, and verifications API endpoints after you have gotten the authorization. */
  skip_kyc?: boolean;
}

/**
 * @returns A {@link PKCESIWERequest} object with properties omitted that are automatically computed in by the SDK.
 */
export type PKCERSIWERequestArgs = Omit<
  PKCESIWERequest,
  'code_challenge' | 'code_challenge_method' | 'authentication_method'
>;

export interface PKCESIWERequest extends PKCERequestShared {
  /**
   * Authentication method used. The default is to redirect the user to Monerium login screen, where the user can either sign in, or go through the register flow.
   * `siwe` is only applicable for existing Monerium customers who have already linked at least one of their addresses with Monerium.
   **/
  authentication_method: 'siwe';
  /** An EIP-4361 compatible message. https://eips.ethereum.org/EIPS/eip-4361
   *  https://monerium.com/siwe
   * */
  message: string;
  /** Signature for the SIWE message. Must include the 0x prefix. */
  signature: string;
}

// -- authContext

export enum Method {
  password = 'password',
  resource = 'resource',
  jwt = 'jwt',
  apiKey = 'apiKey',
  bearer = 'bearer',
}

export enum ProfileType {
  corporate = 'corporate',
  personal = 'personal',
}

export enum Permission {
  read = 'read',
  write = 'write',
}
// -- getProfile

export enum ProfileState {
  /** The profile has been created but no details have been submitted.*/
  created = 'created',
  /** The details have been submitted and are being processed. */
  pending = 'pending',
  /** The profile is active and all Monerium services are supported.*/
  approved = 'approved',
  /**The applicant details did not meet the compliance requirements of Monerium. Details can be fixed and re-submitted for processing.*/
  rejected = 'rejected',
  /**Monerium is unable to offer the applicant services because of compliance reasons. Details cannot be re-submitted.*/
  blocked = 'blocked',
}

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
  rejected = 'rejected',
  closed = 'closed',
}

export interface KYC {
  state: KYCState;
  outcome: KYCOutcome;
}

export enum PaymentStandard {
  iban = 'iban',
  scan = 'scan',
  chain = 'chain',
  account = 'account',
}
/**
 * The type of ID document. Passports, National ID cards, and driving licenses are supported.
 * The ID document must verify the person's name, birthday, and nationality
 */
export enum IdDocumentKind {
  passport = 'passport',
  nationalIdentityCard = 'nationalIdentityCard',
  drivingLicense = 'drivingLicense',
}

export interface Identifier {
  standard: PaymentStandard;
  bic?: string;
}

export interface AuthContext {
  userId: string;
  email: string;
  name: string;
  roles: [] | null;
  auth: {
    method: Method;
    subject: string;
    verified: boolean;
    invited?: boolean;
  };
  defaultProfile: string;
  profiles: {
    id: string;
    kind: ProfileType | 'unknown';
    name: string;
    perms: Permission[];
  }[];
}

export interface ProfilesResponse {
  profiles: Profile[];
}
export interface Profile {
  id: string;
  name: string;
  kind: ProfileType;
  state: ProfileState;
  // kyc: KYC;
}
/** @deprecated use Profile */
export type ProfilePermissions = Profile;

export interface ProfilesQueryParams {
  /** profile state to filter by */
  state?: ProfileState;
  /** profile kind to filter by */
  kind?: ProfileType;
}

export interface PersonalProfileDetails {
  idDocument: {
    number: string;
    kind: IdDocumentKind;
  };
  firstName: string;
  lastName: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  countryState?: string;
  nationality: string;
  birthday: string;
}

export interface PersonalProfileDetailsRequest {
  personal: PersonalProfileDetails;
}

export type Representative = PersonalProfileDetails;
export type Beneficiary = Omit<PersonalProfileDetails, 'idDocument'> & {
  /** Ownership in % that is between 25% and 100%. */
  ownershipPercentage: number;
};
export type Director = Omit<PersonalProfileDetails, 'idDocument'>;

export interface CorporateProfileDetails {
  name: string;
  registrationNumber: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  countryState: string;
  /** List of individuals representing the company and authorized to act on it's behalf. */
  representatives: Representative[];
  /** List of beneficial owner that owns 25% or more in a corporation. */
  finalBeneficiaries: Beneficiary[];
  /** List of Individual who has powers to legally bind the company (power of procuration). */
  directors: Director[];
}
export interface CorporateProfileDetailsRequest {
  corporate: CorporateProfileDetails;
}

export type SubmitProfileDetailsPayload =
  | PersonalProfileDetailsRequest
  | CorporateProfileDetailsRequest;

// -- getAddresses
export interface AddressesQueryParams {
  /** Filter the list by profile */
  profile?: string;
  /** Filter the list by chain */
  chain?: Chain | ChainId;
}

export interface Address {
  /** The id of the profile the address belongs to. */
  profile: string;
  /** The address  */
  address: string;
  /** Which chains is the address linked on. */
  chains: Chain[];
}

export interface AddressesResponse {
  addresses: Address[];
}

// -- getBalances

export interface CurrencyBalance {
  currency: Currency;
  amount: string;
}

export interface Balances {
  id: string;
  address: string;
  chain: Chain;
  balances: CurrencyBalance[];
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

export interface IBANIdentifier extends Identifier {
  standard: PaymentStandard.iban;
  iban: string;
}

export interface CrossChainIdentifier extends Identifier {
  standard: PaymentStandard.chain;
  /** The receivers address */
  address: string;
  /** The receivers network  */
  chain: Chain | ChainId;
}

export interface BankAccountIdentifier extends Identifier {
  /** The standard of the bank account. This is used to identify generic bank account. */
  standard: PaymentStandard.account;
  /** The account number of the bank account. */
  accountNumber: number;
  /** The address of the bank account holder. */
  address: string;
}
export interface SCANIdentifier extends Identifier {
  standard: PaymentStandard.scan;
  sortCode: string;
  accountNumber: string;
}

export interface Individual extends CounterpartDetails {
  firstName?: string;
  lastName?: string;
  address?: string;
}

export interface Corporation extends CounterpartDetails {
  companyName: string;
}

export interface Issuer {
  /** The sender name. This can be a corporate or an individual. */
  name: string;
}

export interface Counterpart {
  identifier:
    | IBANIdentifier
    | SCANIdentifier
    | CrossChainIdentifier
    | BankAccountIdentifier;
  details: Individual | Corporation | Issuer;
}

export interface CounterpartDetails {
  name?: string;
  bank?: CounterpartBank;
  country?: string;
}

export interface CounterpartBank {
  name?: string;
  address?: string;
  bic?: string;
}

export interface OrderMetadata {
  placedAt: string;
  processedAt?: string;
  rejectedReason?: string;
  txHashes?: string[];
  supportingDocumentId?: string;
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
  address: string;
  kind: OrderKind;
  chain: Chain;
  amount: string;
  currency: Currency;
  // totalFee: string;
  // fees: Fee[];
  counterpart: Counterpart;
  memo: string;
  meta: OrderMetadata;
  state: OrderState;
}

export interface OrdersResponse {
  orders: Order[];
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

export interface LinkAddress {
  /** Profile ID that owns the address. */
  profile?: string;
  /** The public key of the blockchain account. */
  address: string;
  /**
   * Fixed message to be signed with the private key corresponding to the given address.
   *
   * `I hereby declare that I am the address owner.`
   */
  message?: string;
  /**
   * The signature hash of signing the `message` with the private key associated with the given address.
   * For signing on-chain with ERC1271 contracts, use `0x`, visit the documentation for further details.
   * https://monerium.dev/api-docs-v2#tag/addresses/operation/link-address
   */
  signature: string;
  chain: Chain | ChainId;
}
export interface LinkedAddress {
  profile: string;
  address: string;
  state: string;
  meta: {
    linkedBy: string;
    linkedAt: string;
  };
}

// -- IBANs

export interface RequestIbanPayload {
  /** the address to request the IBAN. */
  address: string;
  /** the chain to request the IBAN. */
  chain: Chain | ChainId;
  /** payment email notifications sent to customers, `true` by default. */
  emailNotifications: boolean;
}

export interface IbansQueryParams {
  profile?: string;
  chain?: Chain | ChainId;
}

export interface IBAN {
  iban: string;
  bic: string;
  profile: string;
  address: string;
  chain: Chain;
  state: AccountState;
  emailNotifications: boolean;
}

export interface IBANsResponse {
  ibans: IBAN[];
}

export interface MoveIbanPayload {
  /** the address to move iban to */
  address: string;
  /** the chain to move iban to */
  chain: Chain | ChainId;
}

// -- Notifications

export interface OrderNotificationQueryParams {
  state?: OrderState;
  profile?: string;
}

export type ClassOptions = {
  environment?: ENV;
  debug?: boolean;
} & BearerTokenCredentials;

export interface AuthFlowOptionsShared {
  /** the state oauth parameter */
  state?: string;
}
export interface AuthFlowOptions extends AuthFlowOptionsShared {
  /** the email of the user to prefill the login form */
  email?: string;
  /** skip account creation in auth flow */
  skipCreateAccount?: boolean;
  /** skip KYC in auth flow */
  skipKyc?: boolean;
  /** the address your customer should link in auth flow */
  address?: string;
  /** the signature of the address */
  signature?: string;
  /** the chain of the address */
  chain?: Chain | ChainId;
}

export interface AuthFlowSIWEOptions extends AuthFlowOptionsShared {
  /** Signature for the SIWE message. Must include the 0x prefix. */
  signature: string;
  /**
   * An EIP-4361 compatible message. https://eips.ethereum.org/EIPS/eip-4361
   *
   * https://monerium.com/siwe
   * */
  message: string;
}

export interface ClientCredentials {
  clientId: string;
  clientSecret: string;
}

export interface AuthorizationCodeCredentials {
  clientId: string;
  redirectUri: string;
}

export type BearerTokenCredentials =
  | ClientCredentials
  | AuthorizationCodeCredentials;

export type ResponseStatus = {
  status: number;
  statusText: string;
};
