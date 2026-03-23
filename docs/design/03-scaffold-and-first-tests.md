# Implementation Prep — Scaffold and First Tests

## Purpose

This document marks the point where the design becomes implementation-ready.

The decisions here are intentionally narrow:

- package manager: `pnpm`
- compiler path: `tsc` with `typia` transform via `ts-patch`
- test runner: `jest` with `ts-jest`
- manual runner path: build first, then execute compiled JavaScript with `node`

## Pinned Packages

- `typia@12.0.1`
- `@typia/interface@12.0.1`
- `@agentica/core@0.44.1`
- `@samchon/openapi@6.0.1`
- `typescript@5.9.3`
- `ts-patch@3.3.0`
- `jest@30.3.0`
- `@types/jest@30.0.0`
- `@types/node@25.5.0`

## First Files To Create

- `package.json`
- `tsconfig.json`
- `tsconfig.test.json`
- `jest.dist.cjs`
- `src/domain/order.ts`
- `src/domain/patch.ts`
- `src/accumulation/mergeOrderPatch.ts`
- `src/completeness/analyzeOrderCompletion.ts`
- `src/feedback/normalizeCompletionFeedback.ts`
- `src/ingress/parseOrderPatch.ts`
- `src/loop/runOrderDraftLoop.ts`
- `src/runner/index.ts`
- `test/unit/*.spec.ts`
- `test/integration/loop.spec.ts`

## First Commands

Install and patch TypeScript:

```bash
pnpm install
pnpm prepare
```

Run tests:

```bash
pnpm test -- --runInBand
```

Run the manual runner:

```bash
pnpm build
node dist/runner/index.js
```

## Implementation Gate

Implementation may begin immediately after this document because:

- the target schema is fixed
- completeness and feedback semantics are fixed
- the toolchain and dependency path are fixed
- the first file list is fixed
