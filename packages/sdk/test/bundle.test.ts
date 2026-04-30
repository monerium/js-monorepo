/**
 * @jest-environment node
 */

const { MoneriumPrivateClient } = require('../dist/index.js');

import * as constants from './constants';

const {
  APP_ONE_CREDENTIALS_SECRET,
  APP_ONE_CREDENTIALS_CLIENT_ID,
  DEFAULT_PROFILE,
} = constants;

test('should import without throwing', () => {
  expect(MoneriumPrivateClient).toBeDefined();
});

process.env.CI !== 'true' &&
  test('CommonJs bundle smoke test', async () => {
    let client = new MoneriumPrivateClient({
      environment: 'sandbox',
      getAccessToken: async () => undefined,
    });

    const { access_token } = await client.clientCredentialsGrant(
      APP_ONE_CREDENTIALS_CLIENT_ID,
      APP_ONE_CREDENTIALS_SECRET
    );

    client = new MoneriumPrivateClient({
      environment: 'sandbox',
      getAccessToken: async () => access_token,
    });

    const { profiles } = await client.getProfiles();

    expect(profiles?.[0]?.id).toBe(DEFAULT_PROFILE);
  });
