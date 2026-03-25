# AST Incremental Completion PoC Summary

## What This PoC Is

This PoC tests whether a model can build a strict AST through multiple partial patches instead of producing a complete result in one shot.

The target is a fictional-language AST, and the system merges partial patches until the accumulated result satisfies the strict AST type.

## Core Idea

- Generation contract: `DeepPartial<ImaginaryModuleAst>`
- Acceptance contract: strict `ImaginaryModuleAst`
- The model may return incomplete patches
- The system merges patches and decides whether the AST is complete

This means parsing success is not completion success.

## Main Flow

1. The runner asks for an AST patch.
2. The patch is parsed through the generated typia LLM function schema.
3. The patch is merged into the current AST candidate.
4. The candidate is checked against strict AST validation.
5. Extra semantic checks run on top of structural validation.
6. If still incomplete or invalid, feedback is generated and the next attempt runs.

## Validation Layers

### 1. Structural Validation

The system uses strict AST validation to ensure the final candidate matches the AST schema.

This catches:

- missing required fields
- incomplete nested structures
- invalid node shapes or scalar values

### 2. Semantic Validation

The system also checks lightweight module-level consistency.

Current semantic checks:

- every exported name must exist in `functions[].name`
- export names must be unique
- function names must be unique

This is important because a structurally valid AST can still be semantically wrong for the intended module surface.

## Current AST Capabilities

The AST currently supports:

- functions and typed parameters
- return statements
- let statements
- assignment statements
- if statements
- while statements
- binary expressions
- call expressions
- identifier expressions
- property access expressions
- object literals
- array literals
- numeric literals

## Why This PoC Matters

This PoC demonstrates a useful separation:

- the model is allowed to be partial
- the system remains strict

That makes it possible to build complex structured outputs incrementally instead of forcing one-shot perfection.

## Important Constraints

- Array merging is still whole-array replacement, not fine-grained element patching.
- Final success is still mostly structural plus a few semantic checks, not full program semantics.
- A structurally complete AST may still be a bad program.

## Important Operational Caveats

### Provider instability

The canonical live runner uses `MicroAgentica`, and provider-side failures still happen.

Observed issues include:

- provider 400 parse errors
- upstream provider instability

The current code mitigates this by:

- creating a fresh `MicroAgentica` instance per request
- retrying some provider errors

This improves stability, but does not eliminate upstream failures.

### Natural merging

The current loop no longer trims patches by attempt stage.

That means patches are merged as the model returns them, which is closer to the intended natural incremental-completion behavior.

## What This PoC Does Not Yet Prove

This PoC does **not** yet prove:

- full semantic correctness of generated programs
- function-call target correctness
- variable binding correctness
- type-flow correctness inside the AST
- minimal or optimal patch generation

## Recommended Reading Order

If you want to understand the implementation quickly, read in this order:

1. `src/domain/ast.ts`
2. `src/ingress/parseAstPatch.ts`
3. `src/accumulation/mergeAstPatch.ts`
4. `src/completeness/analyzeAstCompletion.ts`
5. `src/loop/runAstCompletionLoop.ts`
6. `src/runtime/createMicroAgenticaPatchRequester.ts`
7. `src/runner/index.ts`

## Practical Summary

This PoC is best understood as:

> a system that lets a model submit partial AST patches, merges them incrementally, and accepts the result only when the accumulated AST is structurally and semantically consistent enough to satisfy the current strict checks.
