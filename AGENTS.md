Always notify me that you've read this file.

This is a monorepo.

Always follow `AGENTS.md` for context in packages and apps.

@packages/sdk/AGENTS.md

# Pipeline

NPM packages use OIDC Trusted Publisher.

## Rules:

- Prefer explicit types over inference
- Never introduce new libraries without asking
- Follow existing patterns in the codebase
- Never change text directed towards the user without asking
- Keep components small and composable
- No obvious explanations unless asked — output code first

### Code changes and refactors.

- Review first and ask questions, wait for approval to start implementing.

### Text Changes

- Never change user-facing text without asking
- This includes error messages, UI copy, notifications, typedoc comments.

## 💬 Communication Style

- Be direct and technical
- Summarize changes clearly before requesting approval
- If multiple commands needed, show them all at once

## Monorepo Execution

When running build or test scripts, execute them from the monorepo root using `pnpm --filter @monerium/sdk <command>` instead of changing directories into the package.
