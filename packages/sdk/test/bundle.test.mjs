import { MoneriumClient } from '../dist/index.mjs';
import {
  APP_ONE_CREDENTIALS_CLIENT_ID,
  APP_ONE_CREDENTIALS_SECRET,
  APP_ONE_OWNER_USER_ID,
} from './constants.js';

test('should import without throwing', () => {
  expect(MoneriumClient).toBeDefined();
});
test('ES Module bundle smoke test', async () => {
  const client = new MoneriumClient({
    clientId: APP_ONE_CREDENTIALS_CLIENT_ID,
    clientSecret: APP_ONE_CREDENTIALS_SECRET,
  });

  await client.getAccess();

  const authContext = await client.getAuthContext();

  expect(authContext.userId).toBe(APP_ONE_OWNER_USER_ID);
});
