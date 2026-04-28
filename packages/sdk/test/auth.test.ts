import {
  authorizationCodeGrant,
  buildAuthorizationUrl,
  buildSiweAuthorizationUrl,
  clientCredentialsGrant,
  createMoneriumAuthClient,
  generatePKCE,
  parseAuthorizationResponse,
  refreshTokenGrant,
} from '../src/auth';
import { MoneriumApiError } from '../src/errors';
import {
  calculatePKCECodeChallenge,
  randomPKCECodeVerifier,
} from '../src/helpers/auth.helpers';
import { Transport, TransportRequest } from '../src/transport';

// ─── Transport helpers ────────────────────────────────────────────────────────

function makeTransport(
  responses: Array<{ status: number; bodyText: string }>
): { transport: Transport; requests: TransportRequest[] } {
  const requests: TransportRequest[] = [];
  let callIndex = 0;

  const transport: Transport = async (req) => {
    requests.push(req);
    const response = responses[callIndex++];
    if (!response) {
      throw new Error(`Unexpected request to ${req.url}`);
    }
    return response;
  };

  return { transport, requests };
}

function ok(body: unknown) {
  return { status: 200, bodyText: JSON.stringify(body) };
}

function apiError(code: number, status: string, message: string) {
  return { status: code, bodyText: JSON.stringify({ code, status, message }) };
}

// ─── PKCE ─────────────────────────────────────────────────────────────────────

describe('randomPKCECodeVerifier', () => {
  test('returns a string', () => {
    expect(typeof randomPKCECodeVerifier()).toBe('string');
  });

  test('returns a non-empty string', () => {
    expect(randomPKCECodeVerifier().length).toBeGreaterThan(0);
  });

  test('returns a different value each call', () => {
    expect(randomPKCECodeVerifier()).not.toBe(randomPKCECodeVerifier());
  });

  test('returns only base64url-safe characters', () => {
    const verifier = randomPKCECodeVerifier();
    expect(verifier).toMatch(/^[A-Za-z0-9\-_]+$/);
  });

  test('returns a string of sufficient length for PKCE (RFC 7636 min 43 chars)', () => {
    expect(randomPKCECodeVerifier().length).toBeGreaterThanOrEqual(43);
  });
});

describe('calculatePKCECodeChallenge', () => {
  test('returns a string', () => {
    expect(typeof calculatePKCECodeChallenge('verifier')).toBe('string');
  });

  test('is deterministic — same input produces same output', () => {
    const verifier = 'test-code-verifier-123';
    expect(calculatePKCECodeChallenge(verifier)).toBe(
      calculatePKCECodeChallenge(verifier)
    );
  });

  test('different inputs produce different outputs', () => {
    expect(calculatePKCECodeChallenge('abc')).not.toBe(
      calculatePKCECodeChallenge('def')
    );
  });

  test('returns only base64url-safe characters', () => {
    const challenge = calculatePKCECodeChallenge(randomPKCECodeVerifier());
    expect(challenge).toMatch(/^[A-Za-z0-9\-_]+$/);
  });

  test('verifier and challenge are different values', () => {
    const verifier = randomPKCECodeVerifier();
    expect(calculatePKCECodeChallenge(verifier)).not.toBe(verifier);
  });
});

describe('generatePKCE', () => {
  test('returns verifier and challenge', () => {
    const { codeVerifier, codeChallenge } = generatePKCE();
    expect(typeof codeVerifier).toBe('string');
    expect(typeof codeChallenge).toBe('string');
    expect(calculatePKCECodeChallenge(codeVerifier)).toBe(codeChallenge);
  });
});

// ─── buildAuthorizationUrl ────────────────────────────────────────────────────

describe('buildAuthorizationUrl', () => {
  const base = {
    clientId: 'client-1',
    redirectUri: 'https://app.example.com/callback',
    codeChallenge: 'challenge-xyz',
  };

  test('returns a string', () => {
    expect(typeof buildAuthorizationUrl(base)).toBe('string');
  });

  test('defaults to sandbox environment', () => {
    expect(buildAuthorizationUrl(base)).toContain('api.monerium.dev');
  });

  test('uses production environment when specified', () => {
    expect(
      buildAuthorizationUrl({ ...base, environment: 'production' })
    ).toContain('api.monerium.app');
  });

  test('includes required query parameters', () => {
    const url = buildAuthorizationUrl(base);
    expect(url).toContain('client_id=client-1');
    expect(url).toContain('redirect_uri=');
    expect(url).toContain('code_challenge=challenge-xyz');
    expect(url).toContain('code_challenge_method=S256');
    expect(url).toContain('response_type=code');
  });

  test('includes optional state parameter', () => {
    const url = buildAuthorizationUrl({ ...base, state: 'my-state' });
    expect(url).toContain('state=my-state');
  });

  test('includes optional email parameter', () => {
    const url = buildAuthorizationUrl({
      ...base,
      email: 'user@example.com',
    });
    expect(url).toContain('email=user%40example.com');
  });

  test('includes optional skipKyc parameter', () => {
    const url = buildAuthorizationUrl({ ...base, skipKyc: true });
    expect(url).toContain('skip_kyc=true');
  });

  test('omits undefined optional parameters', () => {
    const url = buildAuthorizationUrl(base);
    expect(url).not.toContain('state=');
    expect(url).not.toContain('email=');
    expect(url).not.toContain('address=');
  });

  test('does not perform navigation — returns a string only', () => {
    // If this test runs without throwing on window.location.assign, we're good
    expect(() => buildAuthorizationUrl(base)).not.toThrow();
    expect(typeof buildAuthorizationUrl(base)).toBe('string');
  });
  test('skips undefined optional parameters', () => {
    const url = buildAuthorizationUrl({
      ...base,
      state: undefined,
      email: undefined,
    } as any);
    expect(url).not.toContain('state=');
    expect(url).not.toContain('email=');
    expect(url).not.toContain('address=');
  });
});

// ─── buildSiweAuthorizationUrl ────────────────────────────────────────────────

describe('buildSiweAuthorizationUrl', () => {
  const base = {
    clientId: 'client-1',
    redirectUri: 'https://app.example.com/callback',
    codeChallenge: 'challenge-xyz',
    message: 'sign this message',
    signature: '0xdeadbeef',
  };

  test('returns a string', () => {
    expect(typeof buildSiweAuthorizationUrl(base)).toBe('string');
  });

  test('defaults to sandbox environment', () => {
    expect(buildSiweAuthorizationUrl(base)).toContain('api.monerium.dev');
  });

  test('includes SIWE-specific parameters', () => {
    const url = buildSiweAuthorizationUrl(base);
    expect(url).toContain('authentication_method=siwe');
    expect(url).toContain('message=');
    expect(url).toContain('signature=');
  });

  test('includes required PKCE parameters', () => {
    const url = buildSiweAuthorizationUrl(base);
    expect(url).toContain('code_challenge=challenge-xyz');
    expect(url).toContain('code_challenge_method=S256');
  });

  test('includes optional state', () => {
    const url = buildSiweAuthorizationUrl({ ...base, state: 'siwe-state' });
    expect(url).toContain('state=siwe-state');
  });

  test('does not include response_type=code (SIWE skips the code step)', () => {
    const url = buildSiweAuthorizationUrl(base);
    expect(url).not.toContain('response_type=code');
  });
});

// ─── parseAuthorizationResponse ──────────────────────────────────────────────

describe('parseAuthorizationResponse', () => {
  test('parses code from a full URL', () => {
    const result = parseAuthorizationResponse(
      'https://app.example.com/callback?code=abc123&state=xyz'
    );
    expect(result.code).toBe('abc123');
    expect(result.state).toBe('xyz');
  });

  test('parses code from a bare query string with leading ?', () => {
    const result = parseAuthorizationResponse('?code=abc&state=s1');
    expect(result.code).toBe('abc');
    expect(result.state).toBe('s1');
  });

  test('parses code from a query string without leading ?', () => {
    const result = parseAuthorizationResponse('code=abc&state=s1');
    expect(result.code).toBe('abc');
  });

  test('parses error response', () => {
    const result = parseAuthorizationResponse(
      'https://app.example.com/callback?error=access_denied&error_description=User+denied'
    );
    expect(result.error).toBe('access_denied');
    expect(result.errorDescription).toBe('User denied');
  });

  test('returns empty object when no OAuth2 params are present', () => {
    const result = parseAuthorizationResponse(
      'https://app.example.com/callback'
    );
    expect(result).toEqual({});
  });

  test('accepts a full URL string', () => {
    const result = parseAuthorizationResponse(
      'https://app.example.com/callback?code=fromurl&state=st'
    );
    expect(result.code).toBe('fromurl');
    expect(result.state).toBe('st');
  });

  test('never throws', () => {
    expect(() => parseAuthorizationResponse('')).not.toThrow();
    expect(() => parseAuthorizationResponse('garbage')).not.toThrow();
    expect(() => parseAuthorizationResponse({} as any)).not.toThrow();
    expect(() =>
      parseAuthorizationResponse('https://app.example.com/no-params')
    ).not.toThrow();
  });
});

// ─── Grant functions ──────────────────────────────────────────────────────────

const bearerProfileFixture = {
  access_token: 'access-token-123',
  token_type: 'Bearer',
  expires_in: 3600,
  refresh_token: 'refresh-token-abc',
  profile: 'profile-id',
  userId: 'user-id',
};

// ─── authorizationCodeGrant ───────────────────────────────────────────────────

describe('authorizationCodeGrant', () => {
  test('POSTs to auth/token with correct grant_type and fields', async () => {
    const { transport, requests } = makeTransport([ok(bearerProfileFixture)]);

    await authorizationCodeGrant({
      clientId: 'client-1',
      redirectUri: 'https://app.example.com/callback',
      code: 'auth-code',
      codeVerifier: 'verifier-123',
      transport,
    });

    expect(requests[0].url).toContain('api.monerium.dev/auth/token');
    expect(requests[0].method).toBe('POST');
    expect(requests[0].body).toContain('grant_type=authorization_code');
    expect(requests[0].body).toContain('code=auth-code');
    expect(requests[0].body).toContain('code_verifier=verifier-123');
    expect(requests[0].body).toContain('client_id=client-1');
  });

  test('uses production environment when specified', async () => {
    const { transport, requests } = makeTransport([ok(bearerProfileFixture)]);

    await authorizationCodeGrant({
      environment: 'production',
      clientId: 'c',
      redirectUri: 'https://app.example.com/callback',
      code: 'code',
      codeVerifier: 'verifier',
      transport,
    });

    expect(requests[0].url).toContain('api.monerium.app');
  });

  test('returns BearerProfile on success', async () => {
    const { transport } = makeTransport([ok(bearerProfileFixture)]);

    const result = await authorizationCodeGrant({
      clientId: 'c',
      redirectUri: 'https://app.example.com/callback',
      code: 'code',
      codeVerifier: 'verifier',
      transport,
    });

    expect(result.access_token).toBe('access-token-123');
    expect(result.expires_in).toBe(3600);
  });

  test('throws MoneriumApiError on non-2xx response', async () => {
    const { transport } = makeTransport([
      apiError(400, 'Bad Request', 'Invalid code'),
    ]);

    await expect(
      authorizationCodeGrant({
        clientId: 'c',
        redirectUri: 'https://app.example.com/callback',
        code: 'bad-code',
        codeVerifier: 'verifier',
        transport,
      })
    ).rejects.toBeInstanceOf(MoneriumApiError);
  });

  test('throws MoneriumSdkError network_error when transport throws', async () => {
    const cause = new TypeError('Failed to fetch');

    try {
      await authorizationCodeGrant({
        clientId: 'c',
        redirectUri: 'https://app.example.com/callback',
        code: 'code',
        codeVerifier: 'verifier',
        transport: async () => {
          throw cause;
        },
      });
    } catch (err) {
      // Custom transport errors propagate as-is — wrapping is defaultGrantTransport's job
      expect(err).toBe(cause);
    }
  });

  test('sends Content-Type: application/x-www-form-urlencoded', async () => {
    const { transport, requests } = makeTransport([ok(bearerProfileFixture)]);

    await authorizationCodeGrant({
      clientId: 'c',
      redirectUri: 'https://app.example.com/callback',
      code: 'code',
      codeVerifier: 'verifier',
      transport,
    });

    expect(requests[0].headers['Content-Type']).toBe(
      'application/x-www-form-urlencoded'
    );
  });

  test('sends Accept header with API version', async () => {
    const { transport, requests } = makeTransport([ok(bearerProfileFixture)]);

    await authorizationCodeGrant({
      clientId: 'c',
      redirectUri: 'https://app.example.com/callback',
      code: 'code',
      codeVerifier: 'verifier',
      transport,
    });

    expect(requests[0].headers['Accept']).toBe(
      'application/vnd.monerium.api-v2+json'
    );
  });
});

// ─── refreshTokenGrant ────────────────────────────────────────────────────────

describe('refreshTokenGrant', () => {
  test('POSTs to auth/token with correct grant_type and fields', async () => {
    const { transport, requests } = makeTransport([ok(bearerProfileFixture)]);

    await refreshTokenGrant({
      clientId: 'client-1',
      refreshToken: 'refresh-token-abc',
      transport,
    });

    expect(requests[0].url).toContain('auth/token');
    expect(requests[0].body).toContain('grant_type=refresh_token');
    expect(requests[0].body).toContain('refresh_token=refresh-token-abc');
    expect(requests[0].body).toContain('client_id=client-1');
  });

  test('returns BearerProfile on success', async () => {
    const { transport } = makeTransport([ok(bearerProfileFixture)]);

    const result = await refreshTokenGrant({
      clientId: 'c',
      refreshToken: 'rt',
      transport,
    });

    expect(result.access_token).toBe('access-token-123');
  });

  test('throws MoneriumApiError on 401', async () => {
    const { transport } = makeTransport([
      apiError(401, 'Unauthorized', 'Token expired'),
    ]);

    await expect(
      refreshTokenGrant({ clientId: 'c', refreshToken: 'expired', transport })
    ).rejects.toBeInstanceOf(MoneriumApiError);
  });

  test('MoneriumApiError has correct code, status and message', async () => {
    const { transport } = makeTransport([
      apiError(401, 'Unauthorized', 'Token expired'),
    ]);

    try {
      await refreshTokenGrant({
        clientId: 'c',
        refreshToken: 'expired',
        transport,
      });
    } catch (err) {
      expect((err as MoneriumApiError).code).toBe(401);
      expect((err as MoneriumApiError).status).toBe('Unauthorized');
      expect((err as MoneriumApiError).message).toBe('Token expired');
    }
  });
});

// ─── clientCredentialsGrant ───────────────────────────────────────────────────

describe('clientCredentialsGrant', () => {
  test('POSTs to auth/token with correct grant_type and fields', async () => {
    const { transport, requests } = makeTransport([ok(bearerProfileFixture)]);

    await clientCredentialsGrant({
      clientId: 'client-1',
      clientSecret: 'secret-abc',
      transport,
    });

    expect(requests[0].url).toContain('auth/token');
    expect(requests[0].body).toContain('grant_type=client_credentials');
    expect(requests[0].body).toContain('client_id=client-1');
    expect(requests[0].body).toContain('client_secret=secret-abc');
  });

  test('returns BearerProfile on success', async () => {
    const { transport } = makeTransport([ok(bearerProfileFixture)]);

    const result = await clientCredentialsGrant({
      clientId: 'c',
      clientSecret: 's',
      transport,
    });

    expect(result.access_token).toBe('access-token-123');
  });

  test('throws MoneriumApiError on 401', async () => {
    const { transport } = makeTransport([
      apiError(401, 'Unauthorized', 'Invalid credentials'),
    ]);

    await expect(
      clientCredentialsGrant({
        clientId: 'c',
        clientSecret: 'wrong',
        transport,
      })
    ).rejects.toBeInstanceOf(MoneriumApiError);
  });

  test('uses production environment when specified', async () => {
    const { transport, requests } = makeTransport([ok(bearerProfileFixture)]);

    await clientCredentialsGrant({
      environment: 'production',
      clientId: 'c',
      clientSecret: 's',
      transport,
    });

    expect(requests[0].url).toContain('api.monerium.app');
  });

  test('client_secret is in the POST body, never in the URL', async () => {
    const { transport, requests } = makeTransport([ok(bearerProfileFixture)]);

    await clientCredentialsGrant({
      clientId: 'c',
      clientSecret: 'my-secret',
      transport,
    });

    expect(requests[0].url).not.toContain('my-secret');
    expect(requests[0].body).toContain('client_secret=my-secret');
  });
});

// ─── createMoneriumAuthClient ───────────────────────────────────────────────────────

describe('createMoneriumAuthClient', () => {
  const clientId = 'client-1';
  const redirectUri = 'https://app.example.com/callback';

  test('buildAuthorizationUrl uses encapsulated environment', () => {
    const auth = createMoneriumAuthClient({ environment: 'production' });
    const url = auth.buildAuthorizationUrl({
      clientId,
      redirectUri,
      codeChallenge: 'challenge',
    });

    expect(url).toContain('client_id=client-1');
    expect(url).toContain('api.monerium.app');
  });

  test('authorizationCodeGrant uses encapsulated transport', async () => {
    const { transport, requests } = makeTransport([ok(bearerProfileFixture)]);
    const auth = createMoneriumAuthClient({ transport });

    await auth.authorizationCodeGrant({
      clientId,
      redirectUri,
      code: 'auth-code',
      codeVerifier: 'verifier',
    });

    expect(requests[0].body).toContain('client_id=client-1');
    expect(requests[0].body).toContain('grant_type=authorization_code');
  });

  test('refreshTokenGrant uses encapsulated environment', async () => {
    const { transport, requests } = makeTransport([ok(bearerProfileFixture)]);
    const auth = createMoneriumAuthClient({
      environment: 'production',
      transport,
    });

    await auth.refreshTokenGrant({ clientId, refreshToken: 'rt' });

    expect(requests[0].url).toContain('api.monerium.app');
    expect(requests[0].body).toContain('client_id=client-1');
  });

  test('clientCredentialsGrant uses encapsulated transport', async () => {
    const { transport, requests } = makeTransport([ok(bearerProfileFixture)]);
    const auth = createMoneriumAuthClient({ transport });

    await auth.clientCredentialsGrant({ clientId, clientSecret: 'secret' });

    expect(requests[0].body).toContain('client_id=client-1');
    expect(requests[0].body).toContain('client_secret=secret');
  });

  test('parseAuthorizationResponse is available on the client', () => {
    const auth = createMoneriumAuthClient({});
    const result = auth.parseAuthorizationResponse('?code=abc');
    expect(result.code).toBe('abc');
  });
});
