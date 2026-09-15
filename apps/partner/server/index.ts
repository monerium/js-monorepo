import {
  createServer,
  type IncomingMessage,
  type ServerResponse,
} from 'node:http';

import {
  type BearerProfile,
  type CorporateVerificationKind,
  type ENV,
  MoneriumApiError,
  MoneriumPrivateClient,
  type PersonalVerificationKind,
} from '@monerium/sdk';

import { loadPartnerEnv } from './load-env';

loadPartnerEnv();

const port = Number(process.env.PARTNER_PORT ?? 8787);
type PartnerEnvironment = 'localhost' | 'sandbox' | 'production';
const configuredEnvironment = process.env.ENV ?? 'sandbox';
if (!['localhost', 'sandbox', 'production'].includes(configuredEnvironment)) {
  throw new Error(`Unsupported ENV: ${configuredEnvironment}`);
}
const partnerEnvironment = configuredEnvironment as PartnerEnvironment;
const environment: ENV =
  partnerEnvironment === 'production' ? 'production' : 'sandbox';
const clientId = process.env.MONERIUM_CLIENT_ID;
const clientSecret = process.env.MONERIUM_CLIENT_SECRET;
const apiUrl =
  process.env.MONERIUM_API_URL ??
  (partnerEnvironment === 'localhost'
    ? 'http://localhost:4000/external-api'
    : environment === 'production'
      ? 'https://api.monerium.app'
      : 'https://api.monerium.dev');

if (!clientId || !clientSecret) {
  throw new Error(
    'MONERIUM_CLIENT_ID and MONERIUM_CLIENT_SECRET must be set before starting the partner app'
  );
}

let tokens: BearerProfile | undefined;
let expiresAt = 0;

const getAccessToken = async (): Promise<string | undefined> => {
  if (tokens && Date.now() < expiresAt) return tokens.access_token;
  tokens = await client.clientCredentialsGrant(clientId, clientSecret);
  expiresAt = Date.now() + Math.max(tokens.expires_in - 60, 0) * 1000;
  return tokens.access_token;
};

const client = new MoneriumPrivateClient({
  environment,
  apiUrl,
  getAccessToken,
});

const personalVerificationKinds: PersonalVerificationKind[] = [
  'idDocument',
  'facialSimilarity',
  'proofOfResidency',
  'sourceOfFunds',
];
const corporateVerificationKinds: CorporateVerificationKind[] = [
  'sourceOfFunds',
  'corporateName',
  'corporateAddress',
  'registrationNumber',
  'dateOfRegistration',
  'beneficialOwnership',
  'powerOfAttorney',
  'idDocument',
  'proofOfResidency',
];
const isPersonalVerificationKind = (
  kind: string
): kind is PersonalVerificationKind =>
  personalVerificationKinds.includes(kind as PersonalVerificationKind);
const isCorporateVerificationKind = (
  kind: string
): kind is CorporateVerificationKind =>
  corporateVerificationKinds.includes(kind as CorporateVerificationKind);

const json = (
  response: ServerResponse,
  status: number,
  body: unknown
): void => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(body));
};

const readBody = async (
  request: IncomingMessage
): Promise<Record<string, unknown>> => {
  const chunks: Buffer[] = [];
  for await (const chunk of request) chunks.push(Buffer.from(chunk));
  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as Record<
    string,
    unknown
  >;
};

const simulateProfileVerifications = async (
  profileId: string
): Promise<unknown> => {
  const profile = await client.getProfile(profileId);
  const pdf = Buffer.alloc(1024, 0x20);
  pdf.write('%PDF-1.4\n');
  pdf.write('%%EOF', 1019);
  const file = await client.uploadSupportingDocument(
    new Blob([pdf], { type: 'application/pdf' }),
    'partner-simulated-verification.pdf'
  );
  const documents = [{ kind: 'other', fileId: file.id }];
  if (profile.kind === 'corporate') {
    const availableKinds = profile.verifications
      ?.map((verification) => verification.kind)
      .filter(isCorporateVerificationKind);
    const input = {
      profile: profile.id,
      corporate: (availableKinds?.length
        ? availableKinds
        : corporateVerificationKinds
      ).map((kind) => ({
        kind,
        documents,
      })),
    };
    const result = await client.updateProfileVerifications(input);
    return { file, result, input };
  }
  const availableKinds = profile.verifications
    ?.map((verification) => verification.kind)
    .filter(isPersonalVerificationKind);
  const input = {
    profile: profile.id,
    personal: (availableKinds?.length
      ? availableKinds
      : personalVerificationKinds
    ).map((kind) => ({ kind, documents })),
  };
  const result = await client.updateProfileVerifications(input);
  return { file, result, input };
};

const allowedActions = new Set([
  'getAuthContext',
  'getProfile',
  'getProfiles',
  'createProfile',
  'getAddress',
  'getAddresses',
  'linkAddress',
  'getBalances',
  'getIban',
  'getIbans',
  'requestIban',
  'moveIban',
  'getOrder',
  'getOrders',
  'placeOrder',
  'getTokens',
  'getSignatures',
  'getSubscriptions',
  'createSubscription',
  'updateSubscription',
  'shareProfileKYC',
  'updateProfileDetails',
  'updateProfileForm',
  'updateProfileVerifications',
]);

const server = createServer(async (request, response) => {
  const url = new URL(
    request.url ?? '/',
    `http://${request.headers.host ?? 'localhost'}`
  );

  try {
    if (url.pathname === '/api/session' && request.method === 'GET') {
      // console.log('[partner] Session request', { apiUrl });
      await getAccessToken();
      return json(response, 200, {
        authenticated: true,
        environment: partnerEnvironment,
      });
    }

    if (
      url.pathname === '/api/simulate-profile-verifications' &&
      request.method === 'POST'
    ) {
      const body = await readBody(request);
      const input = body as { profile?: unknown };
      if (typeof input.profile !== 'string')
        return json(response, 400, {
          error: 'A profile ID is required to simulate verifications',
        });
      return json(
        response,
        200,
        await simulateProfileVerifications(input.profile)
      );
    }

    if (url.pathname === '/api/sdk' && request.method === 'POST') {
      const body = await readBody(request);
      const method = String(body.method ?? '');
      // console.log('[partner] SDK action', { method, apiUrl });
      if (!allowedActions.has(method))
        return json(response, 400, {
          error: `Unsupported SDK action: ${method}`,
        });
      const action = client[method as keyof MoneriumPrivateClient];
      if (typeof action !== 'function')
        return json(response, 400, {
          error: `SDK action unavailable: ${method}`,
        });
      const result = await (
        action as (input?: unknown) => Promise<unknown>
      ).call(client, body.input);
      return json(response, 200, result);
    }

    return json(response, 404, { error: 'Not found' });
  } catch (error) {
    console.error('[partner] Request failed', {
      method: request.method,
      path: url.pathname,
      error:
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              ...(error instanceof MoneriumApiError && {
                code: error.code,
                status: error.status,
                errors: error.errors,
                details: error.details,
              }),
              stack: error.stack,
            }
          : error,
    });
    if (error instanceof MoneriumApiError) {
      return json(response, 500, {
        error: error.message,
        code: error.code,
        status: error.status,
        ...(error.errors !== undefined && { errors: error.errors }),
        ...(error.details !== undefined && { details: error.details }),
      });
    }
    return json(response, 500, {
      error:
        error instanceof Error && error.message
          ? error.message
          : 'An unknown server error occurred',
    });
  }
});

server.listen(port, () =>
  console.log(`Partner API listening on http://localhost:${port}`)
);
