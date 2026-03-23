# Unit 1 — Target Schema

## Purpose

The first prototype needs exactly one target type `T` that is small enough to reason about quickly and complex enough to exercise recursive completion.

This document locks that type and the examples that define complete, incomplete, and invalid states.

## Selection Criteria

The target type must satisfy all of the following:

- at least two required top-level branches
- at least one required nested object
- at least one array field
- scalar leaves with obvious type expectations
- at least one nullable field so `null` and missing can be distinguished
- no complex union logic in the first prototype

## Chosen Target Shape

The prototype target is an order draft.

```ts
type OrderDraft = {
  customer: {
    name: string;
    email: string;
  };
  shipping: {
    address1: string;
    city: string;
    postalCode: string;
  };
  items: Array<{
    sku: string;
    quantity: number;
  }>;
  note: string | null;
};
```

## Why This Shape

This shape is intentionally narrow.

- `customer` tests nested required scalars
- `shipping` tests a second required object branch
- `items` tests array handling and the rule that arrays are replaced as a whole
- `note` tests explicit nullable handling

It is rich enough to make `missing`, `incomplete`, and `invalid` meaningfully different without introducing union-related instability.

## LLM Contract

The LLM never sees `OrderDraft` directly as a strict completion target.

The LLM-facing contract is:

```ts
DeepPartial<OrderDraft>
```

This means any retry may legally return only a small patch such as:

```ts
{ customer: { email: "alice@example.com" } }
```

or:

```ts
{ items: [{ sku: "SKU-001", quantity: 2 }] }
```

## Complete Example

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
      "quantity": 2
    }
  ],
  "note": null
}
```

## Incomplete Examples

### Missing Top-Level Branch

```json
{
  "customer": {
    "name": "Alice",
    "email": "alice@example.com"
  },
  "items": [
    {
      "sku": "SKU-001",
      "quantity": 2
    }
  ],
  "note": null
}
```

Expected classification:

- missing: `shipping`

### Missing Nested Field

```json
{
  "customer": {
    "name": "Alice"
  },
  "shipping": {
    "address1": "123 Main St",
    "city": "Seoul",
    "postalCode": "04524"
  },
  "items": [
    {
      "sku": "SKU-001",
      "quantity": 2
    }
  ],
  "note": null
}
```

Expected classification:

- incomplete: `customer`
- missing: `customer.email`

### Missing Array Branch

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
  "note": null
}
```

Expected classification:

- missing: `items`

## Invalid Examples

### Wrong Scalar Type

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

Expected classification:

- invalid: `items[0].quantity`

### Null vs Missing

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
      "quantity": 2
    }
  ]
}
```

Expected classification:

- missing: none for `note` if omission is accepted only when `note` is optional
- invalid or missing for `note` if the chosen strict schema keeps it required even when nullable

For the first prototype, the simplest choice is:

- `note` is required
- `note` may be `null`

That means omission of `note` is still missing, while `note: null` is valid.

## Acceptance Decision

The object is accepted only when all required branches are present and strict validation against `OrderDraft` passes.

No amount of partial parsing or coercion can override this decision.

## Unit 1 QA

Tool:

- schema fixture review and unit tests

Command:

```bash
pnpm test -- --runInBand test/unit/target-schema.spec.ts
```

Expected result:

- the chosen target type supports unambiguous complete, incomplete, and invalid fixtures
- the nullable field rule is explicitly testable
