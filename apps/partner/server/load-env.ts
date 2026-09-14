import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export const loadPartnerEnv = (): Record<string, string> => {
  const file = existsSync(resolve(process.cwd(), '.env'))
    ? '.env'
    : '.env.example';
  const values: Record<string, string> = {};
  const contents = readFileSync(resolve(process.cwd(), file), 'utf8');

  for (const line of contents.split('\n')) {
    const match = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match?.[1] || match[2] === undefined) continue;
    const value = match[2].replace(/^['"]|['"]$/g, '');
    values[match[1]] = value;
    if (process.env[match[1]] === undefined) process.env[match[1]] = value;
  }

  return values;
};
