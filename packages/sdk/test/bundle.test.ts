/**
 * @jest-environment node
 */

const MoneriumClient =
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('../dist/index.js').MoneriumClient;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const constants = require('./constants');

const {
  APP_ONE_CREDENTIALS_SECRET,
  APP_ONE_CREDENTIALS_CLIENT_ID,
  DEFAULT_PROFILE,
} = constants;

test('should import without throwing', () => {
  expect(MoneriumClient).toBeDefined();
});
process.env.CI !== 'true' &&
  test('CommonJs bundle smoke test', async () => {
    const client = new MoneriumClient({
      clientId: APP_ONE_CREDENTIALS_CLIENT_ID,
      clientSecret: APP_ONE_CREDENTIALS_SECRET,
    });

    await client.getAccess();
    const { profiles } = await client.getProfiles();

    expect(profiles?.[0]?.id).toBe(DEFAULT_PROFILE);
  });
