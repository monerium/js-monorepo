import {
  clientCredentialsGrant,
  createMoneriumApiClient,
} from '../dist/index.mjs';
import {
  APP_ONE_CREDENTIALS_CLIENT_ID,
  APP_ONE_CREDENTIALS_SECRET,
  DEFAULT_PROFILE,
} from './constants.ts';

test('should import without throwing', () => {
  expect(createMoneriumApiClient).toBeDefined();
  expect(clientCredentialsGrant).toBeDefined();
});

process.env.CI !== 'true' &&
  test('ES Module bundle smoke test', async () => {
    const { access_token } = await clientCredentialsGrant({
      environment: 'sandbox',
      clientId: APP_ONE_CREDENTIALS_CLIENT_ID,
      clientSecret: APP_ONE_CREDENTIALS_SECRET,
    });

    const client = createMoneriumApiClient({
      environment: 'sandbox',
      accessToken: access_token,
    });

    const { profiles } = await client.getProfiles();

    expect(profiles?.[0]?.id).toBe(DEFAULT_PROFILE);
  });
