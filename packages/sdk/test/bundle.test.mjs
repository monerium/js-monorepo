import { MoneriumPrivateClient } from '../dist/index.mjs';
import {
  APP_ONE_CREDENTIALS_CLIENT_ID,
  APP_ONE_CREDENTIALS_SECRET,
  DEFAULT_PROFILE,
} from './constants.ts';

test('should import without throwing', () => {
  expect(MoneriumPrivateClient).toBeDefined();
});

process.env.CI !== 'true' &&
  test('ES Module bundle smoke test', async () => {
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
