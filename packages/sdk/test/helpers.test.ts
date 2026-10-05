import {
  calculatePKCECodeChallenge,
  randomPKCECodeVerifier,
} from '../src/helpers/auth.helpers';

describe('code verifier -> code challenge', () => {
  test('should generate a code verifier and derive a matching code challenge', () => {
    const codeVerifier = randomPKCECodeVerifier();
    const codeChallenge = calculatePKCECodeChallenge(codeVerifier);

    // Re-deriving from the same verifier must produce the same challenge
    expect(calculatePKCECodeChallenge(codeVerifier)).toEqual(codeChallenge);
  });

  test('randomPKCECodeVerifier produces a non-empty base64url string', () => {
    const verifier = randomPKCECodeVerifier();
    expect(typeof verifier).toBe('string');
    expect(verifier.length).toBeGreaterThan(0);
    // base64url characters only
    expect(verifier).toMatch(/^[A-Za-z0-9\-_]+$/);
  });

  test('two calls to randomPKCECodeVerifier produce distinct values', () => {
    const a = randomPKCECodeVerifier();
    const b = randomPKCECodeVerifier();
    expect(a).not.toEqual(b);
  });
});

// Pinned outputs captured from the previous crypto-js-based implementation,
// to guarantee the pure-JS replacement is byte-for-byte compatible.
describe('calculatePKCECodeChallenge (parity with crypto-js baseline)', () => {
  // Fixtures captured by running the *previous* crypto-js-based implementation
  // against a wide range of inputs (ASCII, unicode, emoji/surrogate pairs,
  // combining marks, control characters, long strings, real PKCE verifiers).
  // If these still pass, the noble/hashes-based rewrite is byte-for-byte
  // compatible with what shipped before.
  const cases: Array<{ input: string; challenge: string }> = [
    { input: '', challenge: '47DEQpj8HBSa-_TImW-5JCeuQeRkm5NMpJWZG3hSuFU' },
    { input: 'a', challenge: 'ypeBEsobvcr6wjGzmiPcTaeG7_gUfE5yuYB3ha_uSLs' },
    { input: 'abc', challenge: 'ungWv48Bz-pBQUDeXa4iI7ADYaOWF3qctBD_YfIAFa0' },
    { input: ' ', challenge: 'Nqnn8clbgv-5l0PgxcTOldg8mkMKrFn4TvPL-rYUUGg' },
    {
      input: '  leading and trailing spaces  ',
      challenge: 'ZvansMeI3RygnMOewqLmHddp2lFxoOyAxcKZvF46HUI',
    },
    {
      input: 'línea con acentos áéíóú ñ',
      challenge: 'F09HnuxRT5wNjnmIJ2piHusPmP8QgrQIxnJ5GUSvGPQ',
    },
    {
      input: '日本語のテスト',
      challenge: '7oJULrSQOwv6CmDj7YqaYFUEdar5_-4j1flAYPkBeGE',
    },
    {
      input: '中文测试字符串',
      challenge: 'mhFwQG0aSNoi2bSWfBvKEAsD8UWArIG8GSNEk3LyAbE',
    },
    {
      input: '😀😃😄 emoji test 🚀🔥',
      challenge: 'LaeMacmq0SsYoLNbLIkGK7pnkXGU-cQnql5mihmAbks',
    },
    {
      input: '𝔘𝔫𝔦𝔠𝔬𝔡𝔢 𝔪𝔞𝔱𝔥 𝔟𝔬𝔩𝔡',
      challenge: 'uUIYTviByLBadfu66Ge0VLxtFZfrHDnrAxo6DGcsl_E',
    },
    {
      input: 'tab\tand\nnewline\r\ncontrol\u0000chars',
      challenge: 'PtQCpxB4D7dD1tfsaCUjaS8Zs2oDyr-QrH7BZdpu1N4',
    },
    {
      input: 'special!@#$%^&*()_+-=[]{}|;:,.<>?/~`',
      challenge: 'I4PznO5UZE61ab64TCN_rqU6yuN-_VGKh7yqqAC7XiA',
    },
    {
      input:
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      challenge: 'Qe3s5C1j6Nm_UVqbppMuHCDLyfWl0TRkWttdsblzfqM',
    },
    {
      input: 'the quick brown fox jumps over the lazy dog',
      challenge: 'Bcbgjx2f2voDFH_Lj4LxJMdtL3Dj2Ynciq2159dFC-w',
    },
    {
      input: 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk',
      challenge: 'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM',
    },
    {
      input: '́́combining markś',
      challenge: 'h112PzxMhtfTBH1WPZTwDQ9KMVWjuSyJwo6YvM2F96g',
    },
    {
      input: 'zalgo t̸̡̢̛̗̘̙̜̝̞̟̠̀́e̶̢̛̗̘s̷̢̛̗t̸̢̛̗',
      challenge: 'b0NgU3had0LH3xezdaFvyIgo18krstURoumk5SmZUpw',
    },
    { input: '😀', challenge: '8EQ6NCxe9UeDoRG1G6Vsk45HTDIyTZDDpgycjjo34tk' },
  ];

  test.each(cases)(
    'matches crypto-js output for input: $input',
    ({ input, challenge }) => {
      expect(calculatePKCECodeChallenge(input)).toBe(challenge);
    }
  );
});
