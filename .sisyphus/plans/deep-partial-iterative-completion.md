# DeepPartial Iterative Completion Prototype

## Overview

This document defines a design-first experiment for proving that an LLM can fill a `DeepPartial<T>` over multiple completions until the system accepts a strict `T`.

The primary objective is to keep the LLM contract lenient while keeping the system contract strict:

- LLM-facing schema: `DeepPartial<T>`
- System acceptance: strict `T`
- Feedback style: completion-oriented guidance about what is still missing or invalid
- `ILlmFunction.parse()` role: ingress normalization only, not the final completeness decision

This is a prototype, not a framework. The experiment should remain narrow until one schema reliably converges.

## Goals

- Prove that iterative tool-call completion can converge from partial structured output to a valid strict object.
- Separate parsing, accumulation, completeness analysis, and retry feedback into distinct layers.
- Phrase retry guidance as missing or incomplete fields instead of exposing raw validation failures as the primary user-facing contract.
- Preserve final correctness by validating only against strict `T` before success.

## Non-Goals

- Multi-schema registry
- Persistence layer
- Production API surface
- UI
- Concurrency support
- Broad prompt tuning
- Reusable general-purpose framework abstractions before the core loop works once

## Core Constraints

- The LLM must only be asked to produce `DeepPartial<T>` patches.
- The system must only accept completion when strict `T` validation passes.
- Parsing success must never be treated as completion success.
- Coercion success must never be treated as completion success.
- Missing-field feedback should be completion-oriented and deterministic.
- Arrays and unions require explicit rules to avoid unstable retries.

## Dependency Anchors

The prototype must anchor its ingress and validation APIs to concrete packages before implementation starts.

### Required Packages

- `typia`
  - source: `https://github.com/samchon/typia`
  - purpose: strict validation, DeepPartial-related typing, and generated LLM application schemas
  - relevant APIs:
    - `typia.validate<T>()`
    - `typia.llm.application<App>()`
    - `typia.llm.parameters<T>()`

### API Origin Clarification

`ILlmFunction.parse()` is not a hand-written local utility.

For this experiment, its origin is:

1. generate an LLM application through `typia.llm.application<App>()`
2. select a generated function from `application.functions`
3. use that function's `parse()` method as the ingress normalizer

This means Unit 5 depends directly on `typia` for generated parsing and validation behavior.

### Versioning Rule

At scaffold time, the package manifest must pin a concrete `typia` version rather than using a floating range. The exact pinned version should be recorded in `package.json` and repeated in implementation notes so the prototype is reproducible.

## Success Criteria

The prototype succeeds when all of the following are true:

1. A partial completion can be merged into an accumulated candidate object.
2. The system can distinguish `missing`, `incomplete`, and `invalid` states.
3. The system can generate stable retry feedback from those states.
4. A later completion can supply only the missing delta instead of rebuilding the full object.
5. The accumulated candidate eventually passes strict `typia.validate<T>()`.
6. The retry loop stops with a deterministic terminal reason when the retry budget is exhausted.

## Prototype Scope

The first prototype should use exactly one nested target type `T`.

The target type should be small enough for fast iteration but rich enough to test recursion:

- required top-level object fields
- at least one nested required object
- at least one array field
- scalar leaf fields with obvious type expectations
- minimal optional fields so `missing` vs optional remains easy to reason about

## Architecture

### 1. Ingress Layer

The ingress layer accepts raw model output and normalizes it into a candidate patch.

Responsibilities:

- accept raw JSON-like function arguments
- use `ILlmFunction.parse()` for lenient parsing and recovery
- optionally use schema-based coercion for obvious scalar normalization
- produce a candidate patch shaped as `DeepPartial<T>`

Non-responsibilities:

- deciding completeness
- deciding final correctness
- deciding success

### 2. Accumulation Layer

The accumulation layer merges the newly parsed patch into the current candidate object.

Merge rules for the prototype:

- objects: deep merge
- scalars: last write wins
- arrays: full replacement only
- `undefined`: ignore
- `null`: preserve if allowed by schema

This layer must be deterministic. The same series of patches must always produce the same accumulated value.

### 3. Completeness Layer

The completeness layer evaluates the accumulated candidate against strict `T`.

This layer is responsible for classifying issues into:

- `missing`: required path does not exist yet
- `incomplete`: required nested structure exists but is not fully populated
- `invalid`: a value exists but fails strict type validation
- `extra`: unsupported field exists, if strict mode chooses to report it

Strict `T` is the only acceptance authority.

### 4. Feedback Normalization Layer

The feedback normalizer converts strict completeness analysis into retry-safe guidance.

Preferred message style:

- `Missing required field customer.name`
- `Missing required object payment.billingAddress`
- `Field items[0].quantity must be a number`

Rules:

- prioritize missing and incomplete structure over low-level validator noise
- avoid leaking raw validator internals as the primary contract
- preserve enough specificity that the next completion can act on the feedback

### 5. Loop Orchestrator

The loop orchestrator runs the experiment.

Flow:

1. ask for a `DeepPartial<T>` patch
2. parse and normalize the patch
3. merge into the accumulator
4. analyze completeness against strict `T`
5. if complete, stop successfully
6. if incomplete or invalid, generate feedback and retry
7. stop with failure if retry budget is exhausted

## Validation Strategy

### Parsing vs Validation

`ILlmFunction.parse()` belongs to input recovery.

It is useful because it can recover partial structured data from malformed or incomplete JSON-like output, but it must not decide whether the object is done.

### Final Acceptance

Final acceptance belongs to strict validation of `T`, using `typia.validate<T>()`.

This means the design keeps two contracts active at the same time:

- generation contract: `DeepPartial<T>`
- correctness contract: `T`

That split is the center of the experiment.

### Missing-Field Derivation

The system should derive feedback from strict evaluation, not from the lenient `DeepPartial<T>` generation contract.

The clean split is:

- missing or incomplete structure: schema-derived from strict `T`
- wrong values already supplied: validation-derived from strict `T`

## Retry Semantics

The retry loop should ask for delta patches, not full object reconstruction.

Prompting rules for the prototype:

- never ask the LLM to rebuild already accepted fields
- ask only for missing or corrected paths
- include the current accepted partial object for context only if needed
- stop retrying after a fixed budget

Terminal states:

- `success`: strict `T` validation passed
- `retry_exhausted`: retry budget consumed without strict success
- `parse_unrecoverable`: repeated parse failures with no usable patch

## Risks and Trade-Offs

### Arrays

Partial array merging is error-prone. The prototype should use whole-array replacement.

### Unions

Unions are likely unstable unless a discriminator is available early. The first prototype should avoid complex unions or require discriminator-first completion.

### Null vs Missing

`null` must not be confused with absence. The completeness checker must account for nullable fields explicitly.

### Over-Generalization

It is tempting to build a reusable engine immediately. The prototype should stay single-schema until the loop is proven.

## Recommended Greenfield File Structure

```text
.sisyphus/
  plans/
    deep-partial-iterative-completion.md
src/
  domain/
  ingress/
  accumulation/
  completeness/
  feedback/
  loop/
  runner/
test/
  unit/
  integration/
```

The project scaffold should not be created until the design review is complete.

## Phased Execution Plan

All phases below include an executable QA target. The exact commands become runnable after scaffold, but they are fixed here so implementation can proceed deterministically.

### Phase 0 — Design Lock

Objectives:

- save this plan in the repository
- review the plan for clarity and completeness
- choose one concrete target type `T`
- define retry budget and terminal states

Exit criteria:

- plan reviewed
- unresolved design ambiguities called out explicitly

QA:

- tool: markdown review plus follow-up design diff
- command: `test -f .sisyphus/plans/deep-partial-iterative-completion.md`
- expected result: the plan file exists and includes dependency anchors, unit breakdown, and per-phase QA blocks

### Phase 1 — Strict Completeness Semantics

Objectives:

- define what it means for the target `T` to be complete
- write tests for valid, missing, incomplete, and invalid examples

Exit criteria:

- strict completeness behavior is unambiguous in tests

QA:

- tool: unit tests
- command: `pnpm test -- --runInBand test/unit/completeness.spec.ts`
- fixture inputs:
  - one valid complete object
  - one object missing a top-level required field
  - one object missing a nested required field
  - one object with a wrong scalar type
- expected result:
  - valid object classified as complete
  - missing objects classified with explicit missing paths
  - wrong scalar object classified as invalid, not missing

### Phase 2 — Feedback Semantics

Objectives:

- define normalized feedback output from completeness analysis
- keep messages stable and completion-oriented

Exit criteria:

- unit tests prove stable `missing` and `invalid` feedback formatting

QA:

- tool: unit tests
- command: `pnpm test -- --runInBand test/unit/feedback.spec.ts`
- fixture inputs:
  - structured issue set containing `missing`, `incomplete`, and `invalid`
- expected result:
  - feedback messages use stable path formatting
  - missing and incomplete messages appear before invalid type-detail messages
  - no raw validator dump is required for the happy-path retry contract

### Phase 3 — Ingress Semantics

Objectives:

- define parse and optional coercion behavior
- prove that parse success does not imply completion success

Exit criteria:

- ingress tests show recovered patches enter the pipeline safely

QA:

- tool: unit tests
- command: `pnpm test -- --runInBand test/unit/ingress.spec.ts`
- fixture inputs:
  - valid JSON patch
  - malformed-but-recoverable JSON patch
  - unrecoverable garbage input
- expected result:
  - valid and recoverable inputs produce candidate patches
  - unrecoverable input produces parse failure
  - parse success alone does not classify the candidate as complete

### Phase 4 — Loop Orchestration

Objectives:

- connect ingress, accumulation, completeness, and feedback
- verify retry success and retry exhaustion scenarios

Exit criteria:

- integration tests cover at least one converging sequence and one non-converging sequence

QA:

- tool: integration tests
- command: `pnpm test -- --runInBand test/integration/loop.spec.ts`
- fixture inputs:
  - sequence of two or more partial patches that should converge
  - sequence of patches that should never satisfy strict `T`
- expected result:
  - converging sequence ends in strict success
  - non-converging sequence ends in `retry_exhausted`
  - each retry emits deterministic feedback

### Phase 5 — Minimal Runner

Objectives:

- add a minimal experiment entrypoint for manual execution
- document how to run the prototype

Exit criteria:

- manual experiment path exists and matches tested behavior

QA:

- tool: manual runner plus smoke check
- command: `pnpm tsx src/runner/index.ts`
- fixture input:
  - canned patch sequence or stubbed model responses
- expected result:
  - the runner prints each attempt, normalized feedback, and the terminal state

## Unit-by-Unit Breakdown

### Unit 1 — Target Type Definition

Deliverables:

- one concrete nested target type `T`
- one accepted `DeepPartial<T>` interaction contract statement
- examples of complete, incomplete, and invalid objects

Dependency: none

QA:

- tool: file inspection and schema fixture review
- command: `pnpm test -- --runInBand test/unit/target-schema.spec.ts`
- expected result: the chosen target type can express complete, incomplete, and invalid examples without ambiguity

### Unit 2 — Completeness Classification

Deliverables:

- structured issue model for `missing`, `incomplete`, `invalid`, and optional `extra`
- tests for classification of the target type

Dependency: Unit 1

QA:

- tool: unit tests
- command: `pnpm test -- --runInBand test/unit/completeness.spec.ts`
- expected result: classifier returns stable issue categories and exact paths for the target fixtures

### Unit 3 — Feedback Normalization

Deliverables:

- deterministic formatting from structured issues to retry guidance
- tests for stable path formatting and prioritization

Dependency: Unit 2

QA:

- tool: unit snapshot or exact-string tests
- command: `pnpm test -- --runInBand test/unit/feedback.spec.ts`
- expected result: normalized feedback text is deterministic and prioritizes missing structure correctly

### Unit 4 — Patch Accumulation

Deliverables:

- deterministic merge rules for patches into the accumulator
- tests for object merge, scalar overwrite, array replacement, and null handling

Dependency: Unit 1

QA:

- tool: unit tests
- command: `pnpm test -- --runInBand test/unit/accumulation.spec.ts`
- expected result: merge behavior matches object-merge, scalar-overwrite, array-replace, undefined-ignore, and null-preserve rules

### Unit 5 — Ingress Wrapper

Deliverables:

- wrapper around `ILlmFunction.parse()` and optional coercion
- tests for malformed-but-recoverable inputs

Dependency: Unit 1

Implementation anchor:

- create a generated function via `typia.llm.application<App>()`
- read the target function from `application.functions`
- call that generated function's `parse()` in the wrapper

QA:

- tool: unit tests
- command: `pnpm test -- --runInBand test/unit/ingress.spec.ts`
- expected result: the wrapper returns a candidate patch plus parse status, and it never marks completion on its own

### Unit 6 — Orchestrator

Deliverables:

- iterative loop that combines ingress, accumulation, completeness, and feedback
- integration tests for success and retry exhaustion

Dependencies: Units 2 through 5

QA:

- tool: integration tests
- command: `pnpm test -- --runInBand test/integration/loop.spec.ts`
- expected result: orchestrator can converge with valid deltas and halt deterministically on exhaustion

### Unit 7 — Manual Runner

Deliverables:

- minimal CLI or scriptable entrypoint
- sample run documentation

Dependency: Unit 6

QA:

- tool: manual smoke check
- command: `pnpm tsx src/runner/index.ts`
- expected result: runner output matches one tested success path and one tested exhausted path

## Verification Strategy

The implementation phase should verify at three levels:

### Unit Verification

- completeness classification tests
- feedback normalization tests
- merge behavior tests
- ingress parsing tests

Representative commands:

- `pnpm test -- --runInBand test/unit/target-schema.spec.ts`
- `pnpm test -- --runInBand test/unit/completeness.spec.ts`
- `pnpm test -- --runInBand test/unit/feedback.spec.ts`
- `pnpm test -- --runInBand test/unit/accumulation.spec.ts`
- `pnpm test -- --runInBand test/unit/ingress.spec.ts`

### Integration Verification

- one success case across multiple partial completions
- one failure case that exhausts retries

Representative command:

- `pnpm test -- --runInBand test/integration/loop.spec.ts`

### Manual Verification

- one runner invocation using canned model outputs to confirm end-to-end behavior

Representative command:

- `pnpm tsx src/runner/index.ts`

## Atomic Commit Strategy

Each commit should represent one coherent vertical slice and leave the project passing.

Recommended commit slices:

1. project scaffold and test wiring
2. target schema and strict completeness tests
3. completeness classifier
4. feedback normalization
5. accumulation rules
6. ingress wrapper
7. loop orchestration and integration tests
8. manual runner and documentation cleanup

No commit should mix unrelated abstractions.

## Open Questions for Review

- Is the boundary between ingress and completeness crisp enough?
- Is the prototype target type small enough while still testing recursion?
- Should extra fields be rejected in the first prototype or only observed?
- Is whole-array replacement sufficient for the first proof?
- Is the retry feedback specific enough without leaking too much validator noise?

## Immediate Next Steps

1. Review this design document.
2. Resolve design gaps before scaffolding the project.
3. Expand Unit 1 into a concrete schema proposal.
4. Only after the design becomes implementation-ready, scaffold the TypeScript prototype and start with tests.
