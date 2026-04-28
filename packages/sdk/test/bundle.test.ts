/**
 * @jest-environment node
 */

const {
  createMoneriumApiClient,
  clientCredentialsGrant,
} = require('../dist/index.js');

import * as constants from './constants';

const {
  APP_ONE_CREDENTIALS_SECRET,
  APP_ONE_CREDENTIALS_CLIENT_ID,
  DEFAULT_PROFILE,
} = constants;

test('should import without throwing', () => {
  expect(createMoneriumApiClient).toBeDefined();
  expect(clientCredentialsGrant).toBeDefined();
});

process.env.CI !== 'true' &&
  test('CommonJs bundle smoke test', async () => {
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
