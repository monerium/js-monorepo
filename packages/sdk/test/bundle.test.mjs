import { MoneriumClient } from '../dist/index.mjs';
import {
  APP_ONE_CREDENTIALS_CLIENT_ID,
  APP_ONE_CREDENTIALS_SECRET,
  DEFAULT_PROFILE,
} from './constants.js';

test('should import without throwing', () => {
  expect(MoneriumClient).toBeDefined();
});
process.env.CI !== 'true' &&
  test('ES Module bundle smoke test', async () => {
    const client = new MoneriumClient({
      clientId: APP_ONE_CREDENTIALS_CLIENT_ID,
      clientSecret: APP_ONE_CREDENTIALS_SECRET,
    });

    try {
      await client.getAccess();
    } catch (error) {
      console.log(error);
    }

    const { profiles } = await client.getProfiles();

    expect(profiles?.[0]?.id).toBe(DEFAULT_PROFILE);
  });
