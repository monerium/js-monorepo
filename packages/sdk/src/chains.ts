/**
 * Single source of truth for all supported EVM chain pairs.
 *
 * Each entry is a { production, sandbox } pair sharing the same network family.
 *
 * ── Adding a new EVM chain ────────────────────────────────────────────────────
 * Add ONE entry to EVM_CHAIN_PAIRS below. All types (ProductionChain,
 * SandboxChain, EvmChainId) and all lookup maps (chainIdToName,
 * validEvmChainNames, productionToSandbox) are derived automatically.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const EVM_CHAIN_PAIRS = [
  {
    production: { id: 'ethereum', chainId: 1 },
    sandbox: { id: 'sepolia', chainId: 11155111 },
  },
  {
    production: { id: 'gnosis', chainId: 100 },
    sandbox: { id: 'chiado', chainId: 10200 },
  },
  {
    production: { id: 'polygon', chainId: 137 },
    sandbox: { id: 'amoy', chainId: 80002 },
  },
  {
    production: { id: 'arbitrum', chainId: 42161 },
    sandbox: { id: 'arbitrumsepolia', chainId: 421614 },
  },
  {
    production: { id: 'linea', chainId: 59144 },
    sandbox: { id: 'lineasepolia', chainId: 59141 },
  },
  {
    production: { id: 'scroll', chainId: 534352 },
    sandbox: { id: 'scrollsepolia', chainId: 534351 },
  },
  {
    production: { id: 'base', chainId: 8453 },
    sandbox: { id: 'basesepolia', chainId: 84532 },
  },
  {
    production: { id: 'camino', chainId: 500 },
    sandbox: { id: 'columbus', chainId: 501 },
  },
] as const;

// Cosmos chains don't have numeric chain IDs so they are tracked separately.
// noble→noble is intentional in sandbox (see chainNameBackwardsCompatibility in utils.ts).

// ── Derived types ─────────────────────────────────────────────────────────────

/**
 * @group Primitives
 */
export type ProductionChain =
  | (typeof EVM_CHAIN_PAIRS)[number]['production']['id']
  | 'noble';

/**
 * @group Primitives
 */
export type SandboxChain =
  | (typeof EVM_CHAIN_PAIRS)[number]['sandbox']['id']
  | 'grand';

/**
 * All known EVM chain IDs. The union extends `number` for backwards
 * compatibility — known values are listed in EVM_CHAIN_PAIRS above.
 * @group Primitives
 */
export type EvmChainId =
  | number
  | (typeof EVM_CHAIN_PAIRS)[number]['production' | 'sandbox']['chainId'];

// ── Derived lookup maps ───────────────────────────────────────────────────────

/** Maps numeric EVM chain ID → SDK chain name string (e.g. 8453 → 'base'). */
export const chainIdToName = new Map<number, string>(
  EVM_CHAIN_PAIRS.flatMap(({ production, sandbox }) => [
    [production.chainId, production.id],
    [sandbox.chainId, sandbox.id],
  ])
);

/** Set of all valid EVM chain name strings. */
export const validEvmChainNames = new Set<string>(
  EVM_CHAIN_PAIRS.flatMap(({ production, sandbox }) => [
    production.id,
    sandbox.id,
  ])
);

/**
 * Maps a production EVM chain name to its sandbox counterpart.
 * e.g. 'ethereum' → 'sepolia', 'base' → 'basesepolia'
 */
export const productionToSandbox = new Map<string, string>(
  EVM_CHAIN_PAIRS.map(({ production, sandbox }) => [production.id, sandbox.id])
);
