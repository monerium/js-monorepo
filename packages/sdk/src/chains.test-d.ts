import type { EVM_CHAIN_PAIRS, ProductionChain, SandboxChain } from './chains';

// ── Compile-time sync checks ──────────────────────────────────────────────────
// These assertions will produce a TypeScript error if EVM_CHAIN_PAIRS gains a
// chain that isn't reflected in the explicit unions in types.ts, or vice versa.
//
// Cosmos chains (noble, grand) don't have numeric chain IDs and are tracked
// separately — they are excluded from the checks below.

type _DerivedProduction = (typeof EVM_CHAIN_PAIRS)[number]['production']['id'];
type _DerivedSandbox = (typeof EVM_CHAIN_PAIRS)[number]['sandbox']['id'];

// Every chain in EVM_CHAIN_PAIRS must appear in the explicit union
type _CheckProductionComplete =
  _DerivedProduction extends Exclude<ProductionChain, 'noble'> ? true : never;
type _CheckSandboxComplete =
  _DerivedSandbox extends Exclude<SandboxChain, 'grand'> ? true : never;

// Every name in the explicit union must appear in EVM_CHAIN_PAIRS (no phantom entries)
type _CheckProductionNoExtras =
  Exclude<ProductionChain, 'noble'> extends _DerivedProduction ? true : never;
type _CheckSandboxNoExtras =
  Exclude<SandboxChain, 'grand'> extends _DerivedSandbox ? true : never;

const _assertProduction: _CheckProductionComplete & _CheckProductionNoExtras =
  true;
const _assertSandbox: _CheckSandboxComplete & _CheckSandboxNoExtras = true;
