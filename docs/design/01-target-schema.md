# Unit 1 — Target Schema

## Purpose

The project target is now a fictional-language module AST.

The generator does not produce source code directly. It produces `DeepPartial<ImaginaryModuleAst>` patches that are merged and validated until the system accepts a strict `ImaginaryModuleAst`.

## Target Type

```ts
type ImaginaryModuleAst = {
  moduleName: string;
  functions: ImaginaryFunctionAst[];
  exports: string[];
  docComment: string | null;
};
```

The current AST supports:

- multiple functions
- typed parameters
- recursive expressions
- binary expressions
- call expressions
- assignment statements
- if statements
- property access expressions
- numeric literals
- identifier references

## Current Canonical Objective

The current runner family demonstrates a module named `AnalyticsOps` with three functions:

- `add(left, right): Int => left + right`
- `computeScore(input: Input): Int` using assignment, property access, and an `if` branch
- `normalizeScore(score: Int): Int` using an `if` branch with a comparison operator

This target is intentionally complex enough to exercise:

- nested arrays
- recursive expression trees
- multi-function consistency
- top-level metadata completion

## Patch Contract

The accepted patch shape is:

```ts
DeepPartial<ImaginaryModuleAst>
```

Examples of valid partial patches:

```ts
{ moduleName: "AnalyticsOps" }
```

```ts
{
  functions: [
    {
      name: "computeScore",
      parameters: [
        { name: "input", type: { kind: "named", name: "Input" } },
      ],
      returnType: { kind: "builtin", name: "Int" },
    },
  ],
}
```

## Acceptance Rule

The object is accepted only when:

- all required top-level fields exist
- all required nested AST nodes exist
- `typia.validate<ImaginaryModuleAst>()` passes

## QA

```bash
pnpm test -- --runInBand test/unit/target-schema.spec.ts
```
