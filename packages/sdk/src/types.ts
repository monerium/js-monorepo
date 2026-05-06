import { Chain, ChainId } from './chains';

/**
 * @group Primitives
 */
export type Environment = { name: ENV; api: string; web: string };

/**
 * @group Primitives
 */
export type Config = {
  environments: { production: Environment; sandbox: Environment };
};

/**
 * @group Primitives
 */
export type ENV = 'sandbox' | 'production';

/**
 * @group Tokens
 */
export enum Currency {
  eur = 'eur',
  usd = 'usd',
  gbp = 'gbp',
  isk = 'isk',
}

/**
 * @group Tokens
 */
export type TokenSymbol = 'EURe' | 'GBPe' | 'USDe' | 'ISKe';

/**
 * @group Tokens
 */
export type Ticker = 'EUR' | 'GBP' | 'USD' | 'ISK';

/**
 * @group Tokens
 */
export type CurrencyCode = 'eur' | 'gbp' | 'usd' | 'isk';

/**
 * Information about the EURe token on different networks.
 * @group Tokens
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

/**
 * Returned by all auth grant functions. Store server-side — never in the browser.
 * @group Auth
 * @category Types
 */
export interface BearerProfile {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  profile: string;
  userId: string;
}

/**
 * @group Profiles
 */
export type Method = 'password' | 'resource' | 'jwt' | 'apiKey' | 'bearer';

/**
 * @group Profiles
 */
export type ProfileKind = 'corporate' | 'personal';
/**
 * @ignore
 * @deprecated Use ProfileKind instead
 *  */
export enum ProfileType {
  corporate = 'corporate',
  personal = 'personal',
}

/**
 * @group Profiles
 */
export type Permission = 'read' | 'write';

/**
 * The state of the profile lifecycle.
 * @group Profiles
 */
export type ProfileState =
  | 'created'
  | 'incomplete'
  | 'pending'
  | 'approved'
  | 'rejected';

/**
 * KYC details section with its current state.
 *
 * @group Profiles
 */
export interface ProfileDetailsState {
  state: ProfileState;
}
/**
 * Additional data section used for risk calculations.
 *
 * @group Profiles
 */
export interface ProfileFormState {
  state: ProfileState;
}

/**
 * The type of personal profile verification.
 *
 * @group Profiles
 */

export type PersonalVerificationKind =
  | 'idDocument'
  | 'facialSimilarity'
  | 'proofOfResidency'
  | 'sourceOfFunds';

/**
 * The type of corporate profile verification.
 *
 * @group Profiles
 */
export type CorporateVerificationKind =
  | 'sourceOfFunds'
  | 'corporateName'
  | 'corporateAddress'
  | 'registrationNumber'
  | 'dateOfRegistration'
  | 'beneficialOwnership'
  | 'powerOfAttorney';

/**
 * Verification items required for this profile, each with its current state.
 *
 * @group Profiles
 */
export interface ProfileVerificationState {
  kind: PersonalVerificationKind | CorporateVerificationKind;
  state: ProfileState;
}

/**
 * The type of ID document. Passports, National ID cards, and driving licenses are supported.
 * The ID document must verify the person's name, birthday, and nationality.
 * @group Profiles
 */
export type IdDocumentKind =
  | 'passport'
  | 'nationalIdentityCard'
  | 'drivingLicense';

/**
 * @group Profiles
 */
export interface AuthContext {
  userId: string;
  email: string;
  name: string;
  roles?: string[];
  auth: {
    method: Method;
    subject: string;
    verified: boolean;
    invited?: boolean;
  };
  defaultProfile: string;
  profiles: {
    id: string;
    kind: ProfileKind | 'unknown';
    name: string;
    perms: Permission[];
  }[];
}

/**
 * @group Profiles
 */
export interface ProfilesResponse {
  profiles: Omit<Profile, 'details' | 'form' | 'verifications'>[];
}

/**
 * @group Profiles
 */
export interface Profile {
  /** Unique identifier of the profile. The Profile ID is the main identifier used to represent ownership of other API resources */
  id: string;
  /** String identifier specifying the type of the profile. */
  kind: ProfileKind;
  /** The Profile name. This can be a corporate or an individual. */
  name: string;
  /** The state of the profile lifecycle. */
  state: ProfileState;
  /**  KYC details section with its current state. */
  details?: ProfileDetailsState;
  /** The form data for the profile. */
  form?: ProfileFormState;
  /** Verification items required for this profile, each with its current state. */
  verifications?: ProfileVerificationState[];
}

/**
 * @group Profiles
 */
export interface GetProfilesParams {
  /** Filter the list on the state of profiles */
  state?: ProfileState;
  /** Filter the list on the kind of profiles*/
  kind?: ProfileKind;
}

/**
 * @group Profiles
 */
export interface PersonalProfileDetails {
  idDocument: {
    /** The document number. */
    number: string;
    /** The type of ID document. Must verify the person's name, birthday, and nationality */
    kind: IdDocumentKind;
  };
  firstName: string;
  lastName: string;
  /** Street and building number where the person lives. */
  address: string;
  /** Postal code where the person lives. */
  postalCode: string;
  /** City where the person lives. */
  city: string;
  /**Two-letter country code [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) where the person lives */
  country: string;
  /** State/County where the person lives. */
  countryState?: string;
  /** Two-letter country code [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) for the person's nationality. */
  nationality: string;
  /** The person's date of birth in `YYYY-MM-DD format. */
  birthday: string;
}

/**
 * @group Profiles
 */
export type Representative = PersonalProfileDetails;

/**
 * @group Profiles
 */
export type Beneficiary = Omit<PersonalProfileDetails, 'idDocument'> & {
  /** Ownership in % that is between 25% and 100%. */
  ownershipPercentage: number;
};

/**
 * @group Profiles
 */
export type Director = Omit<PersonalProfileDetails, 'idDocument'>;

/**
 * @group Profiles
 */
export interface CorporateProfileDetails {
  name: string;
  registrationNumber: string;
  /** The company's registration date in the `YYYY-MM-DD` format. */
  registrationDate?: string;
  /** The company's VAT number */
  vatNumber?: string;
  /** The company's website */
  website?: string;
  /** Street and building number where the corporate is located. */
  address: string;
  /** Postal code where the corporate is located. */
  postalCode: string;
  /** City where the corporate is located. */
  city: string;
  /** Two-letter country code [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) where the corporate is located */
  country: string;
  /** State/County where the corporate is located. */
  countryState: string;
  /** List of individuals representing the company and authorized to act on it's behalf. */
  representatives: Representative[];
  /** List of beneficial owner that owns 25% or more in a corporation. */
  finalBeneficiaries: Beneficiary[];
  /** List of Individual who has powers to legally bind the company (power of procuration). */
  directors: Director[];
}

/**
 * @group Profiles
 */
export type UpdateProfileDetailsInput =
  | {
      /** The profile ID to update. */
      profile: string;
      personal: PersonalProfileDetails;
    }
  | {
      /** The profile ID to update. */
      profile: string;
      corporate: CorporateProfileDetails;
    };

/**
 * @group Profiles
 */
export type PersonalProfileForm = {
  /** The occupation code representing the individual's current employment status. */
  occupation:
    | 'OCCUPATION_STUDENT'
    | 'OCCUPATION_EMPLOYED'
    | 'OCCUPATION_SELF_EMPLOYED'
    | 'OCCUPATION_UNEMPLOYED'
    | 'OCCUPATION_RETIRED';
  /** The profession code representing the individual's professional field. */
  profession:
    | 'PROF_ACCOUNTANCY'
    | 'PROF_ADMINISTRATIVE'
    | 'PROF_AGRICULTURE'
    | 'PROF_ARTS_MEDIA'
    | 'PROF_BROKER_DEALER'
    | 'PROF_CATERING_HOSPITALITY'
    | 'PROF_CHARITY'
    | 'PROF_CONSTRUCTION_REAL_ESTATE'
    | 'PROF_DEALER_HIGH_VALUE_GOODS'
    | 'PROF_DEALER_PRECIOUS_METALS'
    | 'PROF_EDUCATION'
    | 'PROF_EMERGENCY_SERVICES'
    | 'PROF_EXTRACTIVE_INDUSTRY'
    | 'PROF_FIN_SERVICES_BANKING'
    | 'PROF_FIN_SERVICES_INSURANCE'
    | 'PROF_FIN_SERVICES_OTHER'
    | 'PROF_FIN_SERVICES_PRIVATE_BANKING'
    | 'PROF_GAMBLING'
    | 'PROF_GOVERNMENT'
    | 'PROF_HEALTHCARE_MEDICAL'
    | 'PROF_INFORMATION_TECHNOLOGY'
    | 'PROF_LEGAL'
    | 'PROF_MANUFACTURING'
    | 'PROF_MARKETING'
    | 'PROF_MILITARY_DEFENCE'
    | 'PROF_MONEY_SERVICE_BUSINESS'
    | 'PROF_PENSIONER'
    | 'PROF_PUBLIC_PROCUREMENT'
    | 'PROF_RETAIL_SALES';
  /** The origin of the fund code representing the source of the individual's funds. */
  fundOrigin:
    | 'FUND_ORIGIN_SALARY'
    | 'FUND_ORIGIN_DIVIDENDS'
    | 'FUND_ORIGIN_INHERITANCE'
    | 'FUND_ORIGIN_SAVINGS'
    | 'FUND_ORIGIN_INVESTMENT'
    | 'FUND_ORIGIN_GIFT'
    | 'FUND_ORIGIN_MINING'
    | 'FUND_ORIGIN_REAL_ESTATE'
    | 'FUND_ORIGIN_LOAN';
  /** The code representing the individual's annual income range. */
  annualIncome:
    | 'ANNUAL_INCOME_UNDER_10K'
    | 'ANNUAL_INCOME_10K_TO_50K'
    | 'ANNUAL_INCOME_50K_TO_150K'
    | 'ANNUAL_INCOME_150K_TO_300K'
    | 'ANNUAL_INCOME_OVER_300K';

  /** The code representing the individual's monthly turnover range. */
  monthlyTurnover:
    | 'TURNOVER_UNDER_10K'
    | 'TURNOVER_10K_TO_50K'
    | 'TURNOVER_50K_TO_150K'
    | 'TURNOVER_150K_TO_500K'
    | 'TURNOVER_OVER_500K';

  /** The code representing the number of transactions the individual makes each month. */
  monthlyTransactionCount:
    | 'TRANSACTION_COUNT_LESS_THAN_5'
    | 'TRANSACTION_COUNT_5_TO_50'
    | 'TRANSACTION_COUNT_50_TO_100'
    | 'TRANSACTION_COUNT_100_TO_200'
    | 'TRANSACTION_COUNT_OVER_200';

  /** List of codes representing the individual's financial activities. */
  activities: (
    | 'ACTIVITY_COMMERCE_SELLING'
    | 'ACTIVITY_COMMERCE_BUYING'
    | 'ACTIVITY_INVESTING_CRYPTO'
    | 'ACTIVITY_OTHER'
  )[];
  /** A description of the other activity if the code `ACTIVITY_OTHER` is chosen. */
  activityOther?: string;
  /** Indicates whether the individual holds a politically exposed person (PEP) status. */
  publicFunction: boolean;

  /** Indicates whether the individual is the owner of the funds. */
  fundOwner: boolean;

  /** Indicates whether the individual is a United States citizen. */
  usCitizen: boolean;

  /** Indicates whether the individual is subject to US tax obligations (e.g. holds a US tax identification number or is a US resident for tax purposes). */
  usTaxPerson: boolean;

  /** Tax Identification Number (TIN) assigned by the individual's tax authority. Format varies by country (e.g. SSN in the US, NI number in the UK). */
  taxId: string;
};

/**
 * Form for a company
 * @group Profiles
 */
export type CorporateProfileForm = {
  /** A brief description of the company's services. */
  service: string;
};

/**
 * @group Profiles
 */
export type UpdateProfileFormInput =
  | {
      /** The profile ID to update. */
      profile: string;
      personal: PersonalProfileForm;
    }
  | {
      /** The profile ID to update. */
      profile: string;
      corporate: CorporateProfileForm;
    };

/**
 * @group Profiles
 */
export interface CreateProfileInput {
  /** Determines whether the profile is personal or corporate, and which body structure to use in subsequent PATCH endpoints. */
  kind: ProfileKind;
  /** Optional partner-supplied profile ID. */
  id?: string;
}

/**
 * @group Profiles
 */
export type KYCProvider = 'sumsub';

/**
 * @group Profiles
 */
export interface ShareProfileKYCInput {
  /** Id of the profile to share. */
  profile: string;
  /** Determines whether the profile is personal or corporate, and which body structure to use in subsequent PATCH endpoints. */
  provider: KYCProvider;
  /** Token for a personal profile applicant. */
  personal: {
    /** Provider-issued applicant token. */
    token: string;
  };
}

/**
 * @group Profiles
 */
export interface PersonalProfileVerification {
  /** The type of the verification. */
  kind: PersonalVerificationKind;
  /** ID of a previously uploaded file associated with this verification. */
  fileId: string;
}
/**
 * @group Profiles
 */
export interface CorporateProfileVerification {
  /** The type of the verification. */
  kind: CorporateVerificationKind;
  /** ID of a previously uploaded file associated with this verification. */
  fileId: string;
}

/**
 * @group Profiles
 */
export type UpdateProfileVerificationsInput =
  | {
      /** The profile ID to update. */
      profile: string;
      personal: PersonalProfileVerification[];
    }
  | {
      /** The profile ID to update. */
      profile: string;
      corporate: CorporateProfileVerification[];
    };

/**
 * @group Addresses
 */
export interface AddressesQueryParams {
  /** Filter the list by profile */
  profile?: string;
  /** Filter the list by chain */
  chain?: Chain | ChainId;
}

/**
 * @group Addresses
 */
export interface Address {
  /** The id of the profile the address belongs to. */
  profile: string;
  /** The address  */
  address: string;
  /** Which chains is the address linked on. */
  chains: Chain[];
}

/**
 * @group Addresses
 */
export interface AddressesResponse {
  addresses: Address[];
}

/**
 * @group Addresses
 */
export interface CurrencyBalance {
  currency: Currency;
  amount: string;
}

/**
 * @group Addresses
 */
export interface GetBalancesParams {
  address: string;
  chain: Chain | ChainId;
  currencies?: Currency | Currency[];
}

/**
 * @group Addresses
 */
export interface Balances {
  id: string;
  address: string;
  chain: Chain;
  balances: CurrencyBalance[];
}

/**
 * @group Orders
 */
export type PaymentStandard = 'iban' | 'scan' | 'chain' | 'account';

/**
 * @group Orders
 */
export interface Identifier {
  standard: PaymentStandard;
  bic?: string;
}

/**
 * @group Orders
 */
export type OrderKind = 'issue' | 'redeem';

/**
 * @group Orders
 */
export type OrderState = 'placed' | 'pending' | 'processed' | 'rejected';

/**
 * @group Orders
 */
export interface Fee {
  provider: 'satchel';
  currency: Currency;
  amount: string;
}

/**
 * @group Orders
 */
export interface IBANIdentifier extends Identifier {
  standard: 'iban';
  iban: string;
}

/**
 * @group Orders
 */
export interface CrossChainIdentifier extends Identifier {
  standard: 'chain';
  /** The receivers address */
  address: string;
  /** The receivers network  */
  chain: Chain | ChainId;
}

/**
 * @group Orders
 */
export interface BankAccountIdentifier extends Identifier {
  /** The standard of the bank account. This is used to identify generic bank account. */
  standard: 'account';
  /** The account number of the bank account. */
  accountNumber: number;
  /** The address of the bank account holder. */
  address: string;
}

/**
 * @group Orders
 */
export interface SCANIdentifier extends Identifier {
  standard: 'scan';
  sortCode: string;
  accountNumber: string;
}

/**
 * @group Orders
 */
export interface Individual extends CounterpartDetails {
  firstName?: string;
  lastName?: string;
  address?: string;
}

/**
 * @group Orders
 */
export interface Corporation extends CounterpartDetails {
  companyName: string;
}

/**
 * @group Orders
 */
export interface Issuer {
  /** The sender name. This can be a corporate or an individual. */
  name: string;
}

/**
 * @group Orders
 */
export interface Counterpart {
  identifier:
    | IBANIdentifier
    | SCANIdentifier
    | CrossChainIdentifier
    | BankAccountIdentifier;
  details: Individual | Corporation | Issuer;
}

/**
 * @group Orders
 */
export interface CounterpartDetails {
  name?: string;
  bank?: CounterpartBank;
  country?: string;
}

/**
 * @group Orders
 */
export interface CounterpartBank {
  name?: string;
  address?: string;
  bic?: string;
}

/**
 * @group Orders
 */
export interface OrderMetadata {
  placedAt: string;
  processedAt?: string;
  rejectedReason?: string;
  txHashes?: string[];
  supportingDocumentId?: string;
}

/**
 * @group Orders
 */
export interface OrderParams {
  address?: string;
  txHash?: string;
  profile?: string;
  memo?: string;
  accountId?: string;
  state?: OrderState;
}

/**
 * @group Orders
 */
export interface Order {
  id: string;
  profile: string;
  address: string;
  kind: OrderKind;
  chain: Chain;
  amount: string;
  currency: Currency;
  counterpart: Counterpart;
  memo: string;
  referenceNumber?: string; // see https://help.monerium.com/article/22-using-memos-and-references-in-sepa-payments
  meta: OrderMetadata;
  state: OrderState;
}

/**
 * @group Orders
 */
export interface OrdersResponse {
  orders: Order[];
}

/**
 * @group Orders
 */
export interface PlaceOrderInput {
  /** The unique identifier of the order */
  address: string;
  /** The senders network  */
  chain: Chain | ChainId;
  id?: string;
  amount: string;
  signature: string;
  currency: Currency;
  counterpart: Counterpart;
  message: string;
  memo?: string;
  supportingDocumentId?: string;
}

// -- uploadSupportingDocument
/**
 * @group Files
 */
export interface SupportingDocMetadata {
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * @group Files
 */
export interface FilesResponse {
  id: string;
  name: string;
  type: string;
  size: number;
  hash: string;
  meta: SupportingDocMetadata;
}

/**
 * @group Addresses
 */
export interface LinkAddressInput {
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

/**
 * @group Addresses
 */
export interface LinkAddressResponse {
  profile: string;
  address: string;
  state: string;
  meta: {
    linkedBy: string;
    linkedAt: string;
  };
}
/*
 * @ignore
 * @deprecated Use {@link LinkAddressResponse} instead.
 */
export type LinkAddress = LinkAddressResponse;

/**
 * @group IBANs
 */
export type IBANState =
  | 'requested'
  | 'approved'
  | 'pending'
  | 'rejected'
  | 'closed';

/**
 * @group IBANs
 */
export interface RequestIbanInput {
  /** the address to request the IBAN. */
  address: string;
  /** the chain to request the IBAN. */
  chain: Chain | ChainId;
  /** payment email notifications sent to customers, `true` by default. */
  emailNotifications?: boolean;
}

/**
 * @group IBANs
 */
export interface IbansParams {
  profile?: string;
  chain?: Chain | ChainId;
}

/**
 * @group IBANs
 */
export interface IBAN {
  /** The IBAN is a unique identifier for a bank account across different countries and includes a two-letter country code, two check digits, and a number of alphanumeric characters. It may include spaces for readability but should be stored without spaces. */
  iban: string;
  /** Bank Identifier Code (BIC) of the bank associated with this IBAN. */
  bic: string;
  /** The profile id that owns the IBAN */
  profile: string;
  /** The address that this IBAN is connected to */
  address: string;
  /** The chain that this IBAN is connected to */
  chain: Chain;
  /* The name of the IBAN owner. This can be a corporate or an individual. */
  name: string;
  state: IBANState;
  emailNotifications: boolean;
}

/**
 * @group IBANs
 */
export interface IBANsResponse {
  ibans: IBAN[];
}

/**
 * @group IBANs
 */
export interface MoveIbanInput {
  iban: string;
  /** the address to move iban to */
  address: string;
  /** the chain to move iban to */
  chain: Chain | ChainId;
}

/**
 * @group Primitives
 * @internal
 */
export type AcceptedResponse = {
  code: 202;
  status: 'Accepted';
};

/**
 * Type of pending signature
 * @group Signatures
 */
export type PendingSignatureKind = 'linkAddress' | 'order';

/**
 * Base interface for pending signatures
 * @group Signatures
 */
interface PendingSignatureBase {
  kind: PendingSignatureKind;
  chain: Chain;
  address: string;
  createdAt: string;
}

/**
 * Pending signature for an order
 * @group Signatures
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
 * @group Signatures
 */
export interface PendingLinkAddressSignature extends PendingSignatureBase {
  kind: 'linkAddress';
}

/**
 * Union type for all pending signature types
 * @group Signatures
 */
export type PendingSignature =
  | PendingOrderSignature
  | PendingLinkAddressSignature;

/**
 * Query parameters for fetching pending signatures
 * @group Signatures
 */
export interface SignaturesParams {
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
 * @group Signatures
 */
export interface SignaturesResponse {
  /** Array of pending signatures */
  pending: PendingSignature[];
  /** Total number of pending signatures */
  total: number;
}

/**
 * @group Webhooks
 */
export type WebhookSubscriptionState = 'active' | 'inactive';

/**
 * @group Webhooks
 */
export type WebhookEventType =
  | 'iban.updated'
  | 'order.created'
  | 'order.updated'
  | 'profile.updated';

/**
 * @group Webhooks
 */
export interface WebhookSubscription {
  id: string;
  url: string;
  types: WebhookEventType[];
  state: WebhookSubscriptionState;
}

/**
 * @group Webhooks
 */
export interface WebhookSubscriptionsResponse {
  subscriptions: WebhookSubscription[];
}

/**
 * @group Webhooks
 */
export interface CreateWebhookSubscriptionInput {
  url: string;
  secret: string;
  types?: WebhookEventType[];
}

/**
 * @group Webhooks
 */
export interface UpdateWebhookSubscriptionInput {
  subscription: string;
  state?: WebhookSubscriptionState;
  types?: WebhookEventType[];
}

/**
 * @group Auth
 * @category Types
 */
export interface BuildAuthorizationUrlOptions {
  clientId: string;
  redirectUri: string;
  codeChallenge: string;
  state?: string;
  email?: string;
  skipKyc?: boolean;
  authMode?: 'login' | 'signup';
}

/**
 * @group Auth
 * @category Types
 */
export interface BuildSiweAuthorizationUrlOptions {
  clientId: string;
  redirectUri: string;
  codeChallenge: string;
  message: string;
  signature: string;
  state?: string;
}

/**
 * @group Auth
 * @category Types
 */
export interface AuthorizationCodeGrantOptions {
  clientId: string;
  redirectUri: string;
  code: string;
  codeVerifier: string;
}

/**
 * @category Types
 */
export interface RefreshTokenGrantOptions {
  clientId: string;
  refreshToken: string;
}

/**
 * @category Types
 */
export interface ClientCredentialsGrantOptions {
  clientId: string;
  clientSecret: string;
}
