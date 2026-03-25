# MicroAgentica Runner

The canonical runner now uses `MicroAgentica`.

## Environment

Copy `.env.example` to `.env` and fill in:

```env
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
OPENAI_BASE_URL=
MAX_ATTEMPTS=5
```

## Run

```bash
pnpm install
pnpm runner
```

## Optional deterministic comparison

```bash
pnpm runner:deterministic
```

## Workflow

- each attempt may submit any partial AST patch
- the patch is merged as-is into the current candidate
- strict AST validation decides whether more attempts are needed

## Current Canonical Example

The current example target is an `AnalyticsOps` module with:

- `add(left, right)`
- `computeBaseScore(input)`
- `applyBonus(input, score)`
- `clampScore(score)`
- `computeFinalScore(input)`

The example now uses:

- multiple helper functions with cross-function calls
- multiple assignment statements
- assignment statements
- if statements
- nested if statements
- property access expressions
- comparison operators in binary expressions

The final acceptance check still comes from the local strict AST validator.
