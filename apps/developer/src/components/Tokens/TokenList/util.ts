export function findMatchingUrlAndVersion(token) {
  if (!token || !Array.isArray(token.tags)) return null;
  const tags = token.tags;
  // Define a regular expression pattern to match the URL and capture the version number.
  // The pattern captures 'v' followed by a sequence of numbers separated by dots.
  const pattern =
    /https:\/\/github\.com\/monerium\/smart-contracts\/tree\/v(\d+\.\d+\.\d+)/;

  // Iterate over each string in the provided array.
  for (const str of tags) {
    // Use the exec method to test the string against the pattern.
    // This returns an array if there's a match, or null if there isn't.
    const match = pattern.exec(str);

    // If a match is found, extract the full URL and the version number.
    if (match) {
      return {
        url: match[0], // The full matching URL.
        version: match[1], // The captured version number.
      };
    }
  }
  // Return null if no matching URL is found in the array.
  return null;
}
