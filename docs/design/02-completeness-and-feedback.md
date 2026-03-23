# Unit 2–3 — Completeness and Feedback Model

## Purpose

This document locks the core semantic layer of the prototype.

It defines:

- how the system classifies the accumulated candidate object
- how that classification becomes retry feedback
- what information belongs to parsing versus completeness versus user-facing feedback

## Boundaries

### Parsing Boundary

Parsing answers only this question:

`Can we recover a candidate patch from the latest model output?`

It does not answer:

- whether the candidate is complete
- whether the candidate is valid as strict `T`
- whether the loop should terminate successfully

### Completeness Boundary

Completeness answers this question:

`Given the accumulated candidate, what still prevents strict acceptance?`

This is the layer that separates `missing`, `incomplete`, and `invalid`.

### Feedback Boundary

Feedback answers this question:

`What should the next completion attempt be told to add or fix?`

This layer should be optimized for retry usefulness, not validator fidelity.

## Issue Model

The prototype should normalize strict evaluation into the following issue shape.

```ts
type CompletionIssue =
  | { kind: "missing"; path: string; expected: string }
  | { kind: "incomplete"; path: string; expected: string }
  | { kind: "invalid"; path: string; expected: string; actual: unknown }
  | { kind: "extra"; path: string; actual: unknown };
```

## Classification Rules

### Missing

Use `missing` when a required path does not exist at all.

Examples:

- `shipping`
- `customer.email`
- `items`

### Incomplete

Use `incomplete` when a required object branch exists, but one or more required descendants are still missing.

Examples:

- `customer` exists but `customer.email` is absent
- `shipping` exists but `shipping.postalCode` is absent

The key reason to keep `incomplete` separate is retry guidance quality. It lets the loop say both:

- the branch is already started
- the branch still needs more fields

### Invalid

Use `invalid` when a path is present but the value does not satisfy strict validation.

Examples:

- `items[0].quantity` is a string instead of a number
- `customer.email` is structurally present but fails a stricter email constraint, if email constraints are later added

### Extra

Use `extra` only if the first prototype decides to surface unsupported fields.

This category is lower priority than `missing`, `incomplete`, and `invalid`.

For the first prototype, `extra` should be observed but not prioritized in retry guidance.

## Priority Rules

When multiple issues exist at once, feedback should prioritize them in this order:

1. `missing`
2. `incomplete`
3. `invalid`
4. `extra`

This order keeps the loop focused on building the required structure before fine-tuning values.

## Retry Feedback Shape

The feedback contract should be deterministic and compact.

Preferred structure:

```ts
type RetryFeedback = {
  summary: string;
  missing: string[];
  incomplete: string[];
  invalid: Array<{
    path: string;
    expected: string;
    actual: unknown;
  }>;
};
```

## Message Style

The loop should generate retry guidance in plain English.

Examples:

- `Add the missing object shipping.`
- `Fill the missing field customer.email.`
- `Complete the partially filled object customer.`
- `Correct items[0].quantity so it is a number.`

## Delta-Only Retry Rule

The retry prompt should ask for a patch containing only the fields that must be added or corrected.

The loop should not ask the model to regenerate already accepted content unless a conflicting overwrite is required.

## Mapping from Strict Validation

The first prototype should use strict validation only as the source of truth, then derive a cleaner issue model from it.

That means the implementation should:

1. run strict validation against the accumulated candidate
2. inspect strict validation errors and required-schema knowledge
3. normalize those results into `CompletionIssue[]`
4. derive `RetryFeedback` from that normalized issue list

## Examples

### Example A

Accumulated candidate:

```json
{
  "customer": {
    "name": "Alice"
  }
}
```

Expected issues:

- missing: `shipping`
- missing: `items`
- missing: `note`
- incomplete: `customer`
- missing: `customer.email`

Expected feedback summary:

`The order draft is not complete yet. Add the missing branches first, then fill the remaining missing fields inside customer.`

### Example B

Accumulated candidate:

```json
{
  "customer": {
    "name": "Alice",
    "email": "alice@example.com"
  },
  "shipping": {
    "address1": "123 Main St",
    "city": "Seoul",
    "postalCode": "04524"
  },
  "items": [
    {
      "sku": "SKU-001",
      "quantity": "2"
    }
  ],
  "note": null
}
```

Expected issues:

- invalid: `items[0].quantity`

Expected feedback summary:

`The order draft structure is complete, but one field still needs correction.`

## Unit 2–3 QA

Tool:

- unit tests

Commands:

```bash
pnpm test -- --runInBand test/unit/completeness.spec.ts
pnpm test -- --runInBand test/unit/feedback.spec.ts
```

Expected result:

- issue classification is deterministic
- feedback ordering is stable
- feedback language stays completion-oriented instead of dumping raw validator output
