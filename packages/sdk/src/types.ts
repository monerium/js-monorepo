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
  | Omit<AuthCodePayload, 'grant_type'>
  | Omit<RefreshTokenPayload, 'grant_type'>
  | Omit<ClientCredentialsPayload, 'grant_type'>;

export type OpenArgs =
  | Omit<AuthCodePayload, 'grant_type' | 'code' | 'code_verifier'>
  | Omit<RefreshTokenPayload, 'grant_type'>
  | Omit<ClientCredentialsPayload, 'grant_type'>
  | PKCERequestArgs;

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
  /** You can skip the connect wallet and request IBAN steps in the Authorization Flow and use the Link Address and Request IBAN API endpoints after you have gotten the authorization */
  skipCreateAccount?: boolean;
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

export interface ProfilePermissions {
  id: string;
  kind: ProfileType;
  name: string;
  perms: Permission[];
}
export interface ProfilesResponse {
  profiles: ProfilePermissions[];
}
export interface Profile {
  id: string;
  name: string;
  kind: ProfileType;
  state: ProfileState;
  kyc: KYC;
}

export interface ProfilesQueryParams {
  state?: ProfileState;
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
  postalCode: number;
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
  postalCode: number;
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
  /** Filter the list on profile ID */
  profile?: string;
  /** Filter the list on the chain */
  chain?: Chain | ChainId;
}
// export interface AddressFilters {
//   /** The public key of the blockchain account.*/
//   address: string;
// }

export interface Address {
  profile: string;
  address: string;
  chains: Chain[];
}

export interface Addresses {
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

export interface SCANIdentifier extends Identifier {
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
  identifier: IBANIdentifier | SCANIdentifier | CrossChainIdentifier;
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

// -- signUp

export interface SignUpPayload {
  email: string;
}
export interface SignUpResponse {
  email: string;
  profile: string;
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
  message: string;
  /**
   * The signature hash of signing the `message` with the private key associated with the given address.
   * For signing on-chain with ERC1271 contracts, use `0x`, visit the documentation for further details.
   * https://monerium.dev/api-docs-v2#tag/addresses/operation/link-address
   */
  signature: string;
  chain?: Chain | ChainId;
}

// -- IBANs

export interface RequestIbanPayload {
  address: string;
  chain: Chain | ChainId;
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
}

export interface IBANsResponse {
  ibans: IBAN[];
}

export interface MoveIbanPayload {
  address: string;
  chain: Chain | ChainId;
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

export interface OrderNotificationQueryParams {
  state?: OrderState;
  profile?: string;
}

export type MoneriumEvent = OrderState;

export type MoneriumEventListener = (notification: OrderNotification) => void;

export type ClassOptions = {
  environment?: ENV;
} & BearerTokenCredentials;

export interface AuthFlowOptions {
  clientId?: string;
  redirectUri?: string;
  address?: string;
  signature?: string;
  chain?: Chain | ChainId;
  state?: string;
  skipCreateAccount?: boolean;
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
