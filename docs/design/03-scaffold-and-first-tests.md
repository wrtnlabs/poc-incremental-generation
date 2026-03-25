# Implementation Prep — Current Project Shape

## Purpose

The project is now an AST incremental completion PoC with a canonical MicroAgentica runner and a deterministic comparison runner.

The canonical execution path is the MicroAgentica runner plus the unit and integration tests.

## Current Tooling

- package manager: `pnpm`
- compiler: `tsc` with `typia` transform via `ts-patch`
- test runner: `jest`

## Core Files

- `src/domain/ast.ts`
- `src/domain/patch.ts`
- `src/ingress/parseAstPatch.ts`
- `src/accumulation/mergeAstPatch.ts`
- `src/completeness/analyzeAstCompletion.ts`
- `src/feedback/normalizeCompletionFeedback.ts`
- `src/loop/runAstCompletionLoop.ts`
- `src/runner/index.ts`
- `src/runner/deterministic.ts`
- `src/runner/formatTerminalCompletionLog.ts`

## Verification Commands

```bash
pnpm test
pnpm build
pnpm runner
pnpm runner:deterministic
```

## Result

The project demonstrates:

- incremental `DeepPartial<T>` patch submission
- deterministic merge behavior
- strict final acceptance against `ImaginaryModuleAst`
- clear terminal logging for complete vs incomplete outcomes
- canonical live runner behavior plus deterministic comparison behavior
