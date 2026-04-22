// --- Config --- //

export type Environment = { name: ENV; api: string; web: string; wss: string };

export type Config = {
  environments: { production: Environment; sandbox: Environment };
};

export type ENV = 'sandbox' | 'production';

import type { EvmChainId, ProductionChain, SandboxChain } from './chains';
export type { EvmChainId, ProductionChain, SandboxChain };

export type Chain = string | ProductionChain | SandboxChain;

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

export interface BearerProfile {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  profile: string;
  userId: string;
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
  referenceNumber?: string; // see https://help.monerium.com/article/22-using-memos-and-references-in-sepa-payments
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
  /** The unique identifier of the order */
  id?: string;
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
   * https://docs.monerium.com/api#tag/addresses/operation/link-address
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

export type ResponseStatus = {
  status: number;
  statusText: string;
};

// -- Signatures

/**
 * Type of pending signature
 */
export type PendingSignatureKind = 'linkAddress' | 'order';

/**
 * Base interface for pending signatures
 */
interface PendingSignatureBase {
  kind: PendingSignatureKind;
  chain: Chain;
  address: string;
  createdAt: string;
}

/**
 * Pending signature for an order
 */
export interface PendingOrderSignature extends PendingSignatureBase {
  id: string;
  kind: 'order';
  amount: string;
  counterpart: Counterpart;
  currency: Currency;
}

/**
 * Pending signature for linking an address
 */
export interface PendingLinkAddressSignature extends PendingSignatureBase {
  kind: 'linkAddress';
}

/**
 * Union type for all pending signature types
 */
export type PendingSignature =
  | PendingOrderSignature
  | PendingLinkAddressSignature;

/**
 * Query parameters for fetching pending signatures
 */
export interface SignaturesQueryParams {
  /** Filter by blockchain address */
  address?: string;
  /** Filter by blockchain network */
  chain?: Chain | ChainId;
  /** Filter by signature request kind */
  kind?: PendingSignatureKind;
  /** UUID of the profile (defaults to authenticated user's default profile) */
  profile?: string;
}

/**
 * Response from the signatures endpoint
 */
export interface SignaturesResponse {
  /** Array of pending signatures */
  pending: PendingSignature[];
  /** Total number of pending signatures */
  total: number;
}
