# Unit 2–3 — Completeness and Feedback Model

## Purpose

The project separates three concerns:

- parsing a partial AST patch
- analyzing whether the accumulated AST is structurally complete
- turning that analysis into retry feedback

## Completeness Categories

The analyzer reports three issue kinds:

- `missing`: a required path does not exist yet
- `incomplete`: a parent branch exists, but required descendants are still missing
- `invalid`: a value exists, but fails strict validation

## Examples

### Missing top-level branch

```ts
{ moduleName: "AnalyticsOps" }
```

Expected:

- missing: `functions`
- missing: `exports`
- missing: `docComment`

### Incomplete function node

```ts
{
  moduleName: "AnalyticsOps",
  functions: [
    {
      name: "computeScore",
      parameters: [],
      returnType: { kind: "builtin", name: "Int" },
    },
  ],
  exports: ["computeScore"],
  docComment: null,
}
```

Expected:

- incomplete: `functions[0]`
- missing: `functions[0].body`

### Invalid expression node

If a binary expression uses an unsupported operator such as `"plus"`, the analyzer should report:

- invalid: `functions[0].body.statements[0].expression.operator`

## Feedback Contract

Retry feedback should remain completion-oriented.

Examples:

- `The AST is not complete yet. Add the missing branches first, then fill the remaining missing nodes.`
- `The AST structure is complete, but one or more nodes still need correction.`

## Acceptance Authority

Only the strict AST validator decides final success.

Parsing success does not imply completion.

## QA

```bash
pnpm test -- --runInBand test/unit/completeness.spec.ts
pnpm test -- --runInBand test/unit/feedback.spec.ts
```
