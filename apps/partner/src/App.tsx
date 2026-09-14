import { useEffect, useState } from 'react';
import { type AppKit, createAppKit } from '@reown/appkit';
import { sepolia } from '@reown/appkit/networks';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';

import {
  type Address,
  type AddressesResponse,
  type Balances,
  Currency,
  type IBAN,
  type IBANsResponse,
  type Order,
  type OrdersResponse,
  placeOrderMessage,
  type Profile,
  type ProfilesResponse,
} from '@monerium/sdk';

const projectId = import.meta.env.VITE_REOWN_PROJECT_ID as string | undefined;
const appKit: AppKit | undefined = projectId
  ? createAppKit({
      adapters: [new EthersAdapter()],
      networks: [sepolia],
      defaultNetwork: sepolia,
      projectId,
      metadata: {
        name: 'Monerium Partner Tool',
        description: 'Monerium SDK partner test tool',
        url: window.location.origin,
        icons: [],
      },
      features: { analytics: false },
    })
  : undefined;
type Mode = 'admin' | 'customer';
type Eip1193Provider = {
  request: (request: { method: string; params: unknown[] }) => Promise<unknown>;
};

const occupationOptions = [
  'OCCUPATION_STUDENT',
  'OCCUPATION_EMPLOYED',
  'OCCUPATION_SELF_EMPLOYED',
  'OCCUPATION_UNEMPLOYED',
  'OCCUPATION_RETIRED',
] as const;
const professionOptions = [
  'PROFESSION_ACCOUNTANCY',
  'PROFESSION_ADMINISTRATIVE',
  'PROFESSION_AGRICULTURE',
  'PROFESSION_ARTS_ENTERTAINMENT_MEDIA',
  'PROFESSION_BROKER_DEALER',
  'PROFESSION_CATERING_HOSPITALITY_TOURISM',
  'PROFESSION_CHARITY',
  'PROFESSION_CONSTRUCTION_REAL_ESTATE',
  'PROFESSION_DEALER_HIGH_VALUE_GOODS',
  'PROFESSION_DEALER_PRECIOUS_METALS',
  'PROFESSION_EDUCATION',
  'PROFESSION_EMERGENCY_SERVICES',
  'PROFESSION_EXTRACTIVE_INDUSTRY',
  'PROFESSION_FINANCIAL_SERVICES_BANKING',
  'PROFESSION_FINANCIAL_SERVICES_INSURANCE',
  'PROFESSION_FINANCIAL_SERVICES_OTHER',
  'PROFESSION_FINANCIAL_SERVICES_PRIVATE_BANKING',
  'PROFESSION_GAMBLING',
  'PROFESSION_GOVERNMENT',
  'PROFESSION_HEALTH_CARE',
  'PROFESSION_INFORMATION_TECHNOLOGY',
  'PROFESSION_LEGAL',
  'PROFESSION_MANUFACTURING',
  'PROFESSION_MARKETING',
  'PROFESSION_MILITARY',
  'PROFESSION_MONEY_SERVICE_BUSINESS',
  'PROFESSION_PENSIONER',
  'PROFESSION_PUBLIC_PROCUREMENT',
  'PROFESSION_RETAIL_SALES',
] as const;
const personalFundOriginOptions = [
  'FUND_ORIGIN_SALARY',
  'FUND_ORIGIN_DIVIDENDS',
  'FUND_ORIGIN_INHERITANCE',
  'FUND_ORIGIN_SAVINGS',
  'FUND_ORIGIN_INVESTMENT',
  'FUND_ORIGIN_GIFT',
  'FUND_ORIGIN_MINING',
  'FUND_ORIGIN_REAL_ESTATE',
  'FUND_ORIGIN_LOAN',
] as const;
const annualIncomeOptions = [
  'ANNUAL_INCOME_UNDER_10K',
  'ANNUAL_INCOME_FROM_10K_TO_50K',
  'ANNUAL_INCOME_FROM_50K_TO_150K',
  'ANNUAL_INCOME_FROM_150K_TO_300K',
  'ANNUAL_INCOME_MORE_THAN_300K',
] as const;
const personalTurnoverOptions = [
  'TURNOVER_UNDER_10K',
  'TURNOVER_10K_TO_50K',
  'TURNOVER_50K_TO_150K',
  'TURNOVER_150K_TO_500K',
  'TURNOVER_MORE_THAN_500K',
] as const;
const personalTransactionOptions = [
  'TRANSACTION_COUNT_UNDER_5',
  'TRANSACTION_COUNT_5_TO_50',
  'TRANSACTION_COUNT_50_TO_100',
  'TRANSACTION_COUNT_100_TO_200',
  'TRANSACTION_COUNT_MORE_THAN_200',
] as const;
const personalActivityOptions = [
  'ACTIVITY_COMMERCE_SELLING',
  'ACTIVITY_COMMERCE_BUYING',
  'ACTIVITY_INVESTING_CRYPTO',
  'ACTIVITY_OTHER',
] as const;
const corporateLegalFormOptions = [
  'LEGAL_FORM_PUBLIC_LIMITED',
  'LEGAL_FORM_PRIVATE_LIMITED',
  'LEGAL_FORM_PARTNERSHIPS',
  'LEGAL_FORM_SOLE_TRADERS_PROPRIETORSHIPS',
  'LEGAL_FORM_PUBLIC_AUTHORITIES',
  'LEGAL_FORM_NON_PROFIT',
  'LEGAL_FORM_BRANCHES',
  'LEGAL_FORM_OTHER',
] as const;
const corporatePurposeOptions = [
  'PURPOSE_COLLECTING_PAYMENTS',
  'PURPOSE_PAYING_FOR_GOODS',
  'PURPOSE_BUY_SELL_CRYPTO_CURRENCIES',
  'PURPOSE_ENGAGE_IN_DEFI',
  'PURPOSE_OTHER',
] as const;
const corporateActivityOptions = [
  'ACTIVITY_ACCOMMODATION_FOOD_TRAVEL',
  'ACTIVITY_ACCOUNTING_LEGAL_CONSULTANCY',
  'ACTIVITY_ADULT_ENTERTAINMENT',
  'ACTIVITY_ADVERTISING',
  'ACTIVITY_AGRICULTURE',
  'ACTIVITY_ARTS_ENTERTAINMENT',
  'ACTIVITY_CHARITY',
  'ACTIVITY_CONSTRUCTION',
  'ACTIVITY_DEALER_HIGH_VALUE_GOODS',
  'ACTIVITY_ECOMMERCE',
  'ACTIVITY_EDUCATION',
  'ACTIVITY_EXTRACTIVE_INDUSTRY',
  'ACTIVITY_GAMBLING',
  'ACTIVITY_HEALTH_SERVICES',
  'ACTIVITY_MANUFACTURING',
  'ACTIVITY_MARKETPLACE',
  'ACTIVITY_MEDIA',
  'ACTIVITY_MULTI_LEVEL_MARKETING',
  'ACTIVITY_PERSONAL_INVESTMENT',
  'ACTIVITY_PUBLIC_SECTOR',
  'ACTIVITY_REAL_ESTATE',
  'ACTIVITY_RETAIL',
  'ACTIVITY_SOCIAL_WORK',
  'ACTIVITY_SOFTWARE_TECHNOLOGY',
  'ACTIVITY_TELECOM',
  'ACTIVITY_TRANSPORTATION',
  'ACTIVITY_UTILITIES',
  'ACTIVITY_CRYPTO_SERVICES',
  'ACTIVITY_FINANCIAL_INSTITUTION',
  'ACTIVITY_OTHER',
] as const;
const corporateFundOriginOptions = [
  'FUND_ORIGIN_REVENUE',
  'FUND_ORIGIN_PROFIT_DIVIDENDS',
  'FUND_ORIGIN_LOAN',
  'FUND_ORIGIN_INVESTMENTS',
  'FUND_ORIGIN_CUSTOMER_FUNDS',
  'FUND_ORIGIN_THIRD_PARTIES_FUNDS',
] as const;
const corporateTurnoverOptions = [
  'TURNOVER_UNDER_100K',
  'TURNOVER_100K_TO_250K',
  'TURNOVER_MORE_THAN_250K',
] as const;
const corporateTransactionOptions = [
  'TRANSACTION_COUNT_UNDER_100',
  'TRANSACTION_COUNT_100_TO_250',
  'TRANSACTION_COUNT_MORE_THAN_250',
] as const;

const api = async <T,>(method: string, input?: unknown): Promise<T> => {
  const response = await fetch('/api/sdk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ method, input }),
  });
  const value = (await response.json()) as unknown;
  if (!response.ok) {
    const apiError = value as {
      error?: unknown;
      errors?: unknown;
      details?: unknown;
    };
    const message =
      typeof apiError.error === 'string'
        ? apiError.error
        : JSON.stringify(apiError.error ?? value);
    const extra = Object.fromEntries(
      Object.entries({ errors: apiError.errors, details: apiError.details }).filter(
        ([, item]) => item !== undefined
      )
    );
    throw new Error(
      Object.keys(extra).length > 0
        ? `${message}\n${JSON.stringify(extra, null, 2)}`
        : message
    );
  }
  return value as T;
};

const errorMessage = (reason: unknown): string => {
  if (reason instanceof Error) return reason.message;
  if (typeof reason === 'string') return reason;
  if (reason && typeof reason === 'object') {
    const value = reason as {
      code?: unknown;
      shortMessage?: unknown;
      message?: unknown;
    };
    if (value.code === 4001 || value.code === '4001') {
      return 'Signature request was cancelled in the wallet';
    }
    if (typeof value.shortMessage === 'string') return value.shortMessage;
    if (typeof value.message === 'string') return value.message;
    try {
      const serialized = JSON.stringify(reason);
      return serialized && serialized !== '{}' ? serialized : 'An unknown error occurred';
    } catch {
      return 'An unknown error occurred';
    }
  }
  return reason ? String(reason) : 'An unknown error occurred';
};

function AdminView({
  profiles,
  selectProfile,
  refresh,
}: {
  profiles: Profile[];
  selectProfile: (profile: Profile) => void;
  refresh: () => Promise<void>;
}): JSX.Element {
  const [kind, setKind] = useState<'personal' | 'corporate'>('personal');
  const [profileId, setProfileId] = useState('');
  const [error, setError] = useState('');
  const createProfile = async (): Promise<void> => {
    try {
      await api<Profile>('createProfile', {
        kind,
        ...(profileId && { id: profileId }),
      });
      await refresh();
    } catch (reason) {
      setError(errorMessage(reason));
    }
  };
  return (
    <section className="panel">
      <div className="panel-heading">
        <h2>Partner admin</h2>
        <button onClick={refresh}>Refresh profiles</button>
      </div>
      <p>Manage the profiles owned by the whitelabel application.</p>
      <h3>Create profile</h3>
      <div className="inline">
        <label>
          Kind
          <select
            value={kind}
            onChange={(event) =>
              setKind(event.target.value as 'personal' | 'corporate')
            }
          >
            <option value="personal">Personal</option>
            <option value="corporate">Corporate</option>
          </select>
        </label>
        <label>
          Optional profile ID
          <input
            value={profileId}
            onChange={(event) => setProfileId(event.target.value)}
          />
        </label>
        <button onClick={createProfile}>Create profile</button>
      </div>
      <h3>Profiles</h3>
      {profiles.length === 0 ? (
        <p>No profiles loaded.</p>
      ) : (
        <div className="profile-list">
          {profiles.map((profile) => (
            <button
              className="profile"
              key={profile.id}
              onClick={() => selectProfile(profile)}
            >
              <strong>{profile.id}</strong>
              <span>
                {profile.kind} · {profile.state}
              </span>
            </button>
          ))}
        </div>
      )}
      {error && <pre className="error">{error}</pre>}
    </section>
  );
}

function ProfileDetailsForm({
  profile,
  onResult,
  onError,
}: {
  profile?: Profile;
  onResult: (value: unknown) => void;
  onError?: (message: string) => void;
}): JSX.Element {
  const submitted = profile?.state !== 'incomplete';
  const [firstName, setFirstName] = useState('Jane');
  const [lastName, setLastName] = useState('Doe');
  const [email, setEmail] = useState('jane.doe@example.com');
  const [address, setAddress] = useState('Pennylane 123');
  const [postalCode, setPostalCode] = useState('7890');
  const [city, setCity] = useState('London');
  const [country, setCountry] = useState('GB');
  const [countryState, setCountryState] = useState('England');
  const [nationality, setNationality] = useState('GB');
  const [birthday, setBirthday] = useState('1990-05-15');
  const [phone, setPhone] = useState('+441234567890');
  const [documentNumber, setDocumentNumber] = useState('A1234567');
  const [documentKind, setDocumentKind] = useState('passport');
  const [companyName, setCompanyName] = useState('Monerium Test Company Ltd');
  const [registrationNumber, setRegistrationNumber] = useState('TEST-123456');
  const [registrationDate, setRegistrationDate] = useState('2020-01-15');
  const [vatNumber, setVatNumber] = useState('GB123456789');
  const [website, setWebsite] = useState('https://example.com');
  const [people, setPeople] = useState(
    '[{"firstName":"Jane","lastName":"Doe","address":"Pennylane 123","postalCode":"7890","city":"London","country":"GB","nationality":"GB","birthday":"1990-05-15","phone":"+441234567890","email":"jane.doe@example.com","idDocument":{"number":"A1234567","kind":"passport"}}]'
  );
  const [onboardingPath, setOnboardingPath] = useState<'reliance' | 'sharing'>(
    profile?.kind === 'corporate' ? 'reliance' : 'sharing'
  );
  const [occupation, setOccupation] = useState('OCCUPATION_EMPLOYED');
  const [profession, setProfession] = useState('PROFESSION_INFORMATION_TECHNOLOGY');
  const [fundOrigin, setFundOrigin] = useState('FUND_ORIGIN_SALARY');
  const [annualIncome, setAnnualIncome] = useState('ANNUAL_INCOME_FROM_50K_TO_150K');
  const [monthlyTurnover, setMonthlyTurnover] = useState('TURNOVER_UNDER_10K');
  const [monthlyTransactionCount, setMonthlyTransactionCount] = useState(
    'TRANSACTION_COUNT_UNDER_5'
  );
  const [activities, setActivities] = useState('ACTIVITY_COMMERCE_SELLING');
  const [activityOther, setActivityOther] = useState('');
  const [publicFunction, setPublicFunction] = useState(false);
  const [fundOwner, setFundOwner] = useState(true);
  const [usCitizen, setUsCitizen] = useState(false);
  const [usTaxPerson, setUsTaxPerson] = useState(false);
  const [tin, setTin] = useState('GB123456789');
  const [taxResidenceCountry, setTaxResidenceCountry] = useState('GB');
  const [service, setService] = useState('Software development services');
  const [legalForm, setLegalForm] = useState('LEGAL_FORM_PRIVATE_LIMITED');
  const [purpose, setPurpose] = useState('PURPOSE_COLLECTING_PAYMENTS');
  const [corporateActivity, setCorporateActivity] = useState('ACTIVITY_SOFTWARE_TECHNOLOGY');
  const [corporateFundOrigin, setCorporateFundOrigin] = useState('FUND_ORIGIN_REVENUE');
  const [corporateTurnover, setCorporateTurnover] = useState('TURNOVER_UNDER_100K');
  const [corporateTransactionCount, setCorporateTransactionCount] = useState('TRANSACTION_COUNT_UNDER_100');
  const [shareToken, setShareToken] = useState('sandbox-test-sumsub-token');
  const [error, setError] = useState('');
  const runProfileAction = async (
    action: () => Promise<void>
  ): Promise<void> => {
    try {
      setError('');
      onError?.('');
      await action();
    } catch (reason) {
      const message = errorMessage(reason);
      setError(message);
      onError?.(message);
    }
  };
  const submit = async (): Promise<void> => {
    if (!profile) return;
    const result =
      profile.kind === 'corporate'
        ? {
            profile: profile.id,
            corporate: {
              name: companyName,
              registrationNumber,
              registrationDate,
              vatNumber,
              website,
              address,
              postalCode,
              city,
              country,
              countryState,
              representatives: JSON.parse(people),
              finalBeneficiaries: JSON.parse(people).map((person: object) => ({
                ...person,
                ownershipPercentage: 100,
              })),
              directors: JSON.parse(people),
            },
          }
        : {
            profile: profile.id,
            personal: {
              idDocument: { number: documentNumber, kind: documentKind },
              firstName,
              lastName,
              address,
              postalCode,
              city,
              country,
              countryState,
              nationality,
              birthday,
              phone,
              email,
            },
          };
    onResult(await api('updateProfileDetails', result));
  };
  const submitProfileForm = async (): Promise<void> => {
    if (!profile) return;
    const result =
      profile.kind === 'corporate'
        ? {
            profile: profile.id,
            corporate: {
              service,
              legalForm,
              purpose,
              activity: corporateActivity,
              fundOrigin: corporateFundOrigin,
              monthlyTurnover: corporateTurnover,
              monthlyTransactionCount: corporateTransactionCount,
            },
          }
        : {
            profile: profile.id,
            personal: {
              occupation,
              profession,
              fundOrigin,
              annualIncome,
              monthlyTurnover,
              monthlyTransactionCount,
              activities: activities.split(',').map((item) => item.trim()),
              ...(activityOther && { activityOther }),
              publicFunction,
              fundOwner,
              usCitizen,
              usTaxPerson,
              tin,
              taxResidenceCountry,
            },
          };
    onResult(await api('updateProfileForm', result));
  };
  const simulateProfileVerifications = async (): Promise<void> => {
    if (!profile) return;
    const response = await fetch('/api/simulate-profile-verifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile: profile.id }),
    });
    const value = (await response.json()) as unknown;
    if (!response.ok)
      throw new Error(
        (value as { error?: string }).error ?? JSON.stringify(value)
      );
    onResult(value);
  };
  const shareKycData = async (): Promise<void> => {
    if (!profile || profile.kind === 'corporate') return;
    onResult(
      await api('shareProfileKYC', {
        profile: profile.id,
        provider: 'sumsub',
        personal: { token: shareToken },
      })
    );
  };
  useEffect(() => {
    setOnboardingPath(profile?.kind === 'corporate' ? 'reliance' : 'sharing');
  }, [profile?.id, profile?.kind]);
  return (
    <>
      <details open={!submitted}>
      <summary>
        Profile details {submitted ? '(already submitted)' : '(required)'}
      </summary>
      {profile?.kind === 'corporate' ? (
        <>
          <div className="grid">
            <label>
              Company name
              <input
                value={companyName}
                onChange={(event) => setCompanyName(event.target.value)}
              />
            </label>
            <label>
              Registration number
              <input
                value={registrationNumber}
                onChange={(event) => setRegistrationNumber(event.target.value)}
              />
            </label>
            <label>
              Registration date
              <input
                value={registrationDate}
                onChange={(event) => setRegistrationDate(event.target.value)}
              />
            </label>
            <label>
              VAT number
              <input
                value={vatNumber}
                onChange={(event) => setVatNumber(event.target.value)}
              />
            </label>
            <label>
              Website
              <input
                value={website}
                onChange={(event) => setWebsite(event.target.value)}
              />
            </label>
            <label>
              Address
              <input
                value={address}
                onChange={(event) => setAddress(event.target.value)}
              />
            </label>
            <label>
              Postal code
              <input
                value={postalCode}
                onChange={(event) => setPostalCode(event.target.value)}
              />
            </label>
            <label>
              City
              <input
                value={city}
                onChange={(event) => setCity(event.target.value)}
              />
            </label>
            <label>
              Country
              <input
                value={country}
                onChange={(event) => setCountry(event.target.value)}
              />
            </label>
            <label>
              State/county
              <input
                value={countryState}
                onChange={(event) => setCountryState(event.target.value)}
              />
            </label>
          </div>
          <label>
            Representatives, beneficiaries and directors JSON
            <textarea
              value={people}
              onChange={(event) => setPeople(event.target.value)}
            />
          </label>
        </>
      ) : (
        <div className="grid">
          <label>
            First name
            <input
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
          </label>
          <label>
            Last name
            <input
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
            />
          </label>
          <label>
            Address
            <input
              value={address}
              onChange={(event) => setAddress(event.target.value)}
            />
          </label>
          <label>
            Postal code
            <input
              value={postalCode}
              onChange={(event) => setPostalCode(event.target.value)}
            />
          </label>
          <label>
            City
            <input
              value={city}
              onChange={(event) => setCity(event.target.value)}
            />
          </label>
          <label>
            Country
            <input
              value={country}
              onChange={(event) => setCountry(event.target.value)}
            />
          </label>
          <label>
            State/county
            <input
              value={countryState}
              onChange={(event) => setCountryState(event.target.value)}
            />
          </label>
          <label>
            Nationality
            <input
              value={nationality}
              onChange={(event) => setNationality(event.target.value)}
            />
          </label>
          <label>
            Birthday
            <input
              value={birthday}
              onChange={(event) => setBirthday(event.target.value)}
            />
          </label>
          <label>
            Phone
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          </label>
          <label>
            Email
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label>
            ID document number
            <input
              value={documentNumber}
              onChange={(event) => setDocumentNumber(event.target.value)}
            />
          </label>
          <label>
            ID document kind
            <select
              value={documentKind}
              onChange={(event) => setDocumentKind(event.target.value)}
            >
              <option value="passport">Passport</option>
              <option value="nationalId">National ID</option>
            </select>
          </label>
        </div>
      )}
      <button onClick={() => runProfileAction(submit)} disabled={!profile}>
        Submit profile details
      </button>
      </details>
      <h3>Onboarding path</h3>
      <div className="inline">
        <label>
          Path
          <select
            value={onboardingPath}
            onChange={(event) =>
              setOnboardingPath(event.target.value as 'reliance' | 'sharing')
            }
            disabled={profile?.kind === 'corporate'}
          >
            <option value="reliance">Form + verification</option>
            <option value="sharing">Share KYC data</option>
          </select>
        </label>
        {profile?.kind === 'corporate' && <span>Corporate profiles use Form + verification.</span>}
      </div>
      {onboardingPath === 'sharing' && profile?.kind === 'personal' ? (
        <details open>
          <summary>Share KYC data</summary>
          <p>Share a verified Sumsub applicant with Monerium.</p>
          <label>
            Sumsub applicant token
            <input value={shareToken} onChange={(event) => setShareToken(event.target.value)} />
          </label>
          <button
            onClick={() => runProfileAction(shareKycData)}
            disabled={!profile || !shareToken}
          >
            Share KYC data
          </button>
        </details>
      ) : (
        <>
          <details open>
            <summary>Profile form</summary>
            {profile?.kind === 'corporate' ? (
              <div className="grid">
                <label>Service description<input value={service} onChange={(event) => setService(event.target.value)} /></label>
                <label>Legal form<select value={legalForm} onChange={(event) => setLegalForm(event.target.value)}>{corporateLegalFormOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
                <label>Purpose<select value={purpose} onChange={(event) => setPurpose(event.target.value)}>{corporatePurposeOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
                <label>Activity<select value={corporateActivity} onChange={(event) => setCorporateActivity(event.target.value)}>{corporateActivityOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
                <label>Fund origin<select value={corporateFundOrigin} onChange={(event) => setCorporateFundOrigin(event.target.value)}>{corporateFundOriginOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
                <label>Monthly turnover<select value={corporateTurnover} onChange={(event) => setCorporateTurnover(event.target.value)}>{corporateTurnoverOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
                <label>Monthly transactions<select value={corporateTransactionCount} onChange={(event) => setCorporateTransactionCount(event.target.value)}>{corporateTransactionOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
              </div>
            ) : (
              <div className="grid">
                <label>Occupation<select value={occupation} onChange={(event) => setOccupation(event.target.value)}>{occupationOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
                <label>Profession<select value={profession} onChange={(event) => setProfession(event.target.value)}>{professionOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
                <label>Fund origin<select value={fundOrigin} onChange={(event) => setFundOrigin(event.target.value)}>{personalFundOriginOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
                <label>Annual income<select value={annualIncome} onChange={(event) => setAnnualIncome(event.target.value)}>{annualIncomeOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
                <label>Monthly turnover<select value={monthlyTurnover} onChange={(event) => setMonthlyTurnover(event.target.value)}>{personalTurnoverOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
                <label>Monthly transactions<select value={monthlyTransactionCount} onChange={(event) => setMonthlyTransactionCount(event.target.value)}>{personalTransactionOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
                <label>Activities<select value={activities} onChange={(event) => setActivities(event.target.value)}>{personalActivityOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
                <label>Other activity<input value={activityOther} onChange={(event) => setActivityOther(event.target.value)} /></label>
                <label>TIN<input value={tin} onChange={(event) => setTin(event.target.value)} /></label>
                <label>Tax residence country<input value={taxResidenceCountry} onChange={(event) => setTaxResidenceCountry(event.target.value)} /></label>
                <label><input type="checkbox" checked={publicFunction} onChange={(event) => setPublicFunction(event.target.checked)} /> Public function / PEP</label>
                <label><input type="checkbox" checked={fundOwner} onChange={(event) => setFundOwner(event.target.checked)} /> Fund owner</label>
                <label><input type="checkbox" checked={usCitizen} onChange={(event) => setUsCitizen(event.target.checked)} /> US citizen</label>
                <label><input type="checkbox" checked={usTaxPerson} onChange={(event) => setUsTaxPerson(event.target.checked)} /> US tax person</label>
              </div>
            )}
            <button
              onClick={() => runProfileAction(submitProfileForm)}
              disabled={!profile}
            >
              Submit profile form
            </button>
          </details>
          <details open>
            <summary>Profile verification</summary>
            <p>Uploads a 1 KB test document and attaches it to every available verification.</p>
            <button
              onClick={() => runProfileAction(simulateProfileVerifications)}
              disabled={!profile}
            >
              Simulate profile verifications
            </button>
          </details>
        </>
      )}
      {error && <pre className="error">{error}</pre>}
    </>
  );
}

function CustomerView({
  profile,
  walletAddress,
}: {
  profile?: Profile;
  walletAddress?: string;
}): JSX.Element {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [balances, setBalances] = useState<Record<string, Balances>>({});
  const [ibans, setIbans] = useState<IBAN[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [profileResponse, setProfileResponse] = useState<Profile>();
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedChain, setSelectedChain] = useState('sepolia');
  const [iban, setIban] = useState('FR7630006000011234567890189');
  const [amount, setAmount] = useState('1');
  const [output, setOutput] = useState<unknown>();
  const [error, setError] = useState('');
  const refreshProfile = async (): Promise<void> => {
    if (!profile) return;
    try {
      setProfileResponse(await api<Profile>('getProfile', profile.id));
    } catch (reason) {
      setError(errorMessage(reason));
    }
  };
  const handleProfileResult = async (value: unknown): Promise<void> => {
    setOutput(value);
    await refreshProfile();
  };
  const refreshResources = async (): Promise<void> => {
    if (!profile) return;
    try {
      const [addressResult, ibanResult, orderResult] = await Promise.all([
        api<AddressesResponse>('getAddresses', {
          profile: profile.id,
          chain: 'sepolia',
        }),
        api<IBANsResponse>('getIbans', {
          profile: profile.id,
          chain: 'sepolia',
        }),
        api<OrdersResponse>('getOrders', { profile: profile.id }),
      ]);
      setAddresses(addressResult.addresses);
      setIbans(ibanResult.ibans);
      setOrders(orderResult.orders);
      const balanceResults = await Promise.allSettled(
        addressResult.addresses.flatMap((item) =>
          item.chains.map(async (chain) => ({
            key: `${item.address}:${chain}`,
            value: await api<Balances>('getBalances', {
              address: item.address,
              chain,
            }),
          }))
        )
      );
      const nextBalances: Record<string, Balances> = {};
      balanceResults.forEach((result) => {
        if (result.status === 'fulfilled') {
          nextBalances[result.value.key] = result.value.value;
        }
      });
      setBalances(nextBalances);
      if (!selectedAddress) {
        const currentIban = ibanResult.ibans[0];
        if (currentIban) {
          setSelectedAddress(currentIban.address);
          setSelectedChain(currentIban.chain);
        } else if (addressResult.addresses[0]) {
          setSelectedAddress(addressResult.addresses[0].address);
        }
      }
    } catch (reason) {
      setError(errorMessage(reason));
    }
  };
  useEffect(() => {
    setProfileResponse(undefined);
    void refreshProfile();
  }, [profile?.id]);
  useEffect(() => {
    setAddresses([]);
    setBalances({});
    setIbans([]);
    setOrders([]);
    setSelectedAddress('');
    void refreshResources();
  }, [profile?.id]);
  const run = async (method: string, input: unknown): Promise<void> => {
    try {
      setError('');
      setOutput(await api(method, input));
      await refreshResources();
    } catch (reason) {
      setError(errorMessage(reason));
    }
  };
  const sign = async (message: string): Promise<unknown> => {
    if (!appKit) throw new Error('Wallet is not configured');
    const provider = appKit.getWalletProvider() as Eip1193Provider | undefined;
    if (!provider || !walletAddress) throw new Error('Connect a wallet first');
    return provider.request({
      method: 'personal_sign',
      params: [message, walletAddress],
    });
  };
  const linkWallet = async (): Promise<void> => {
    try {
      const message = 'I hereby declare that I am the address owner.';
      await run('linkAddress', {
        profile: profile?.id,
        address: walletAddress,
        chain: 'sepolia',
        message,
        signature: await sign(message),
      });
    } catch (reason) {
      setError(errorMessage(reason));
    }
  };
  const placeOrder = async (): Promise<void> => {
    try {
      const message = placeOrderMessage(amount, Currency.eur, iban);
      await run('placeOrder', {
        profile: profile?.id,
        address: walletAddress,
        chain: 'sepolia',
        amount,
        currency: Currency.eur,
        counterpart: {
          identifier: { standard: 'iban', iban },
          details: { firstName: 'Sathoshi', lastName: 'Nakamoto' },
        },
        message,
        signature: await sign(message),
      });
    } catch (reason) {
      setError(errorMessage(reason));
    }
  };
  const walletAlreadyLinked = Boolean(
    walletAddress &&
    addresses.some(
      (item) => item.address.toLowerCase() === walletAddress.toLowerCase()
    )
  );
  const addressChainOptions = addresses.flatMap((item) =>
    item.chains.map((chain) => ({ address: item.address, chain }))
  );
  const selectedIban = ibans[0];
  const ibanAlreadyAtSelectedAddress = Boolean(
    selectedIban &&
    selectedIban.address.toLowerCase() === selectedAddress.toLowerCase() &&
    selectedIban.chain === selectedChain
  );
  return (
    <section className="panel customer-panel">
      <h2>Simulated customer</h2>
      <p>
        {profile
          ? `Acting as ${profile.id} (${profile.kind})`
          : 'Select a profile from the admin view first.'}
      </p>
      <div className="customer-layout">
        <div className="customer-actions">
          <ProfileDetailsForm
            profile={profileResponse ?? profile}
            onResult={handleProfileResult}
            onError={setError}
          />
          <section className="wallet-panel">
        <h3>Wallet</h3>
        <button onClick={() => appKit?.open()} disabled={!appKit}>
          {walletAddress ? 'Wallet connected' : 'Connect wallet'}
        </button>
        <p>Connected wallet: {walletAddress ?? 'none'}</p>
        <button
          onClick={linkWallet}
          disabled={!walletAddress || !profile || walletAlreadyLinked}
        >
          Sign and link wallet
        </button>
        <h3>Linked Sepolia addresses</h3>
        {addresses.length === 0 ? (
          <p>No linked addresses.</p>
        ) : (
          <div className="resource-list">
            {addresses.flatMap((item) =>
              item.chains.map((chain) => (
                <article className="resource" key={`${item.address}:${chain}`}>
                  <strong>{item.address}</strong>
                  <span>{chain}</span>
                  <span>
                    Balance:{' '}
                    {balances[`${item.address}:${chain}`]?.balances
                      .map((item) => `${item.amount} ${item.currency}`)
                      .join(', ') ?? 'unavailable'}
                  </span>
                </article>
              ))
            )}
          </div>
        )}
        <h3>IBAN</h3>
        {!selectedIban ? (
          <>
            <p>No IBANs.</p>
            <div className="inline">
              <select
                value={`${selectedAddress}:${selectedChain}`}
                onChange={(event) => {
                  const [nextAddress, nextChain] =
                    event.target.value.split(':');
                  setSelectedAddress(nextAddress ?? '');
                  setSelectedChain(nextChain ?? 'sepolia');
                }}
              >
                {addressChainOptions.map((option) => (
                  <option
                    key={`${option.address}:${option.chain}`}
                    value={`${option.address}:${option.chain}`}
                  >
                    {option.address} · {option.chain}
                  </option>
                ))}
              </select>
              <button
                onClick={() =>
                  run('requestIban', {
                    profile: profile?.id,
                    address: selectedAddress,
                    chain: selectedChain,
                  })
                }
                disabled={!profile || !selectedAddress}
              >
                Request IBAN
              </button>
            </div>
          </>
        ) : (
          <article className="resource">
            <strong>{selectedIban.iban}</strong>
            <span>
              {selectedIban.bic} · {selectedIban.state}
            </span>
            <small>
              Address: {selectedIban.address} · {selectedIban.chain}
            </small>
            <div className="inline">
              <select
                value={`${selectedAddress}:${selectedChain}`}
                onChange={(event) => {
                  const [nextAddress, nextChain] =
                    event.target.value.split(':');
                  setSelectedAddress(nextAddress ?? '');
                  setSelectedChain(nextChain ?? 'sepolia');
                }}
              >
                {addressChainOptions.map((option) => (
                  <option
                    key={`${option.address}:${option.chain}`}
                    value={`${option.address}:${option.chain}`}
                  >
                    {option.address} · {option.chain}
                  </option>
                ))}
              </select>
              <button
                onClick={() =>
                  run('moveIban', {
                    iban: selectedIban.iban,
                    address: selectedAddress,
                    chain: selectedChain,
                  })
                }
                disabled={
                  !profile || !selectedAddress || ibanAlreadyAtSelectedAddress
                }
              >
                Move IBAN
              </button>
            </div>
          </article>
        )}
          </section>
          <h3>Initiate transfer</h3>
          <div className="inline">
        <input
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="Amount"
        />
        <input
          value={iban}
          onChange={(event) => setIban(event.target.value)}
          placeholder="Recipient IBAN"
        />
        <button
          onClick={placeOrder}
          disabled={!walletAddress || !profile || !amount || !iban}
        >
          Sign and place redeem order
        </button>
          </div>
          <h3>Orders</h3>
          {orders.length === 0 ? (
            <p>No orders.</p>
          ) : (
            <div className="resource-list">
          {orders.map((order) => (
            <article className="resource" key={order.id}>
              <strong>
                {order.kind} · {order.amount} {order.currency}
              </strong>
              <span>
                {order.state} · {order.chain}
              </span>
              <small>
                Recipient:{' '}
                {order.counterpart.identifier.standard === 'iban'
                  ? order.counterpart.identifier.iban
                  : JSON.stringify(order.counterpart.identifier)}
              </small>
              <small>Wallet: {order.address}</small>
              {order.meta.rejectedReason && (
                <small>Rejected: {order.meta.rejectedReason}</small>
              )}
              {order.meta.txHashes && order.meta.txHashes.length > 0 && (
                <small>Transactions: {order.meta.txHashes.join(', ')}</small>
              )}
            </article>
          ))}
            </div>
          )}
        </div>
        <aside className="response-panel">
          <h3>Profile response</h3>
          {profile ? (
            <pre>{JSON.stringify(profileResponse ?? profile, null, 2)}</pre>
          ) : (
            <p>No profile selected.</p>
          )}
          {error && <pre className="error">{error}</pre>}
          {output !== undefined && (
            <>
              <h3>Endpoint response:</h3>
              <pre>{JSON.stringify(output, null, 2)}</pre>
            </>
          )}
        </aside>
      </div>
    </section>
  );
}

export default function App(): JSX.Element {
  const [mode, setMode] = useState<Mode>('admin');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selected, setSelected] = useState<Profile>();
  const [walletAddress, setWalletAddress] = useState<string>();
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const refresh = async (): Promise<void> => {
    try {
      const result = await api<ProfilesResponse>('getProfiles');
      setProfiles(result.profiles);
    } catch (reason) {
      setError(errorMessage(reason));
    }
  };
  useEffect(() => {
    if (!appKit) {
      setError(
        'VITE_REOWN_PROJECT_ID must be set before building the partner app'
      );
      return;
    }
    const unsubscribe = appKit.subscribeAccount((account) =>
      setWalletAddress(account.address)
    );
    fetch('/api/session')
      .then((response) => response.json())
      .then((value: { authenticated: boolean }) =>
        setAuthenticated(value.authenticated)
      )
      .then(refresh)
      .catch((reason: unknown) =>
        setError(errorMessage(reason))
      );
    return unsubscribe;
  }, []);
  return (
    <main>
      <header>
        <div>
          <h1>Monerium Partner Tool</h1>
          <p>Whitelabel · Sandbox · Sepolia (11155111)</p>
        </div>
        <span className="config">
          Reown: {projectId ? 'configured' : 'missing'}
        </span>
      </header>
      <nav className="tabs">
        <button
          className={mode === 'admin' ? 'active' : ''}
          onClick={() => setMode('admin')}
        >
          Partner admin
        </button>
        <button
          className={mode === 'customer' ? 'active' : ''}
          onClick={() => setMode('customer')}
        >
          Simulated customer
        </button>
      </nav>
      <section className="toolbar">
        <span>
          {authenticated
            ? 'Monerium client credentials authenticated'
            : 'Authenticating with Monerium…'}
        </span>
      </section>
      {error && <pre className="error">{error}</pre>}
      {mode === 'admin' ? (
        <AdminView
          profiles={profiles}
          selectProfile={(profile) => {
            setSelected(profile);
            setMode('customer');
          }}
          refresh={refresh}
        />
      ) : (
        <CustomerView profile={selected} walletAddress={walletAddress} />
      )}
    </main>
  );
}
