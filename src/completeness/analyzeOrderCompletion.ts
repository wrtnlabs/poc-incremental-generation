import typia, { ILlmSchema } from "typia";

import type { OrderDraft } from "../domain/order";

export interface MissingCompletionIssue {
  kind: "missing";
  path: string;
  expected: string;
}

export interface IncompleteCompletionIssue {
  kind: "incomplete";
  path: string;
  expected: string;
}

export interface InvalidCompletionIssue {
  kind: "invalid";
  path: string;
  expected: string;
  actual: unknown;
}

export type CompletionIssue =
  | MissingCompletionIssue
  | IncompleteCompletionIssue
  | InvalidCompletionIssue;

export interface CompletionAnalysis {
  complete: boolean;
  missing: MissingCompletionIssue[];
  incomplete: IncompleteCompletionIssue[];
  invalid: InvalidCompletionIssue[];
}

interface TraversalResult {
  missing: MissingCompletionIssue[];
  incomplete: IncompleteCompletionIssue[];
  hasMissingDescendant: boolean;
}

const ORDER_SCHEMA: ILlmSchema.IParameters = typia.llm.parameters<OrderDraft>();

const toPath = (path: string): string =>
  path.startsWith("$input.")
    ? path.slice("$input.".length)
    : path === "$input"
      ? ""
      : path.replace(/^\$input/, "");

const isObjectSchema = (schema: ILlmSchema): schema is ILlmSchema.IObject =>
  "type" in schema && schema.type === "object";

const isArraySchema = (schema: ILlmSchema): schema is ILlmSchema.IArray =>
  "type" in schema && schema.type === "array";

const isReferenceSchema = (
  schema: ILlmSchema,
): schema is ILlmSchema.IReference => "$ref" in schema;

const isAnyOfSchema = (schema: ILlmSchema): schema is ILlmSchema.IAnyOf =>
  "anyOf" in schema;

const isNullSchema = (schema: ILlmSchema): schema is ILlmSchema.INull =>
  "type" in schema && schema.type === "null";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && Array.isArray(value) === false;

const describeSchema = (schema: ILlmSchema): string => {
  if (isReferenceSchema(schema)) {
    return schema.$ref.split("/").at(-1) ?? "reference";
  }
  if (isAnyOfSchema(schema)) {
    return schema.anyOf.map(describeSchema).join(" | ");
  }
  if ("type" in schema) {
    return schema.type ?? "unknown";
  }
  return "unknown";
};

const resolveSchema = (
  schema: ILlmSchema,
  defs: Record<string, ILlmSchema>,
): ILlmSchema => {
  if (isReferenceSchema(schema)) {
    const key: string | undefined = schema.$ref.split("/").at(-1);
    return key !== undefined && defs[key] !== undefined
      ? resolveSchema(defs[key], defs)
      : schema;
  }
  return schema;
};

const selectSchema = (
  schema: ILlmSchema,
  defs: Record<string, ILlmSchema>,
  value: unknown,
): ILlmSchema => {
  const resolved: ILlmSchema = resolveSchema(schema, defs);
  if (isAnyOfSchema(resolved)) {
    const nonNull: ILlmSchema[] = resolved.anyOf.filter((candidate) => {
      const item: ILlmSchema = resolveSchema(candidate, defs);
      return isNullSchema(item) === false;
    });
    if (value === null) {
      return resolved;
    }
    if (nonNull.length === 1) {
      return resolveSchema(nonNull[0], defs);
    }
  }
  return resolved;
};

const makeMissingIssue = (
  path: string,
  expected: string,
): MissingCompletionIssue => ({
  kind: "missing",
  path,
  expected,
});

const makeIncompleteIssue = (
  path: string,
  expected: string,
): IncompleteCompletionIssue => ({
  kind: "incomplete",
  path,
  expected,
});

const sortByPath = <T extends { path: string }>(items: readonly T[]): T[] =>
  [...items].sort((a, b) => a.path.localeCompare(b.path));

const dedupeByPath = <T extends { path: string }>(items: readonly T[]): T[] =>
  items.filter(
    (item, index, array) =>
      array.findIndex((candidate) => candidate.path === item.path) === index,
  );

export const analyzeOrderCompletion = (
  candidate: unknown,
): CompletionAnalysis => {
  const walkNode = (
    schema: ILlmSchema,
    value: unknown,
    path: string,
  ): TraversalResult => {
    const selected: ILlmSchema = selectSchema(schema, ORDER_SCHEMA.$defs, value);
    if (isObjectSchema(selected)) {
      if (isRecord(value) === false) {
        return {
          missing: [],
          incomplete: [],
          hasMissingDescendant: false,
        };
      }

      const childResults: TraversalResult[] = selected.required
        .map((key): TraversalResult | null => {
          const childSchema: ILlmSchema | undefined = selected.properties[key];
          if (childSchema === undefined) {
            return null;
          }
          const childPath: string = path.length === 0 ? key : `${path}.${key}`;
          const childValue: unknown = value[key];
          return childValue === undefined
            ? {
                missing: [makeMissingIssue(childPath, describeSchema(childSchema))],
                incomplete: [],
                hasMissingDescendant: true,
              }
            : walkNode(childSchema, childValue, childPath);
        })
        .filter((result): result is TraversalResult => result !== null);

      const hasMissingDescendant: boolean = childResults.some(
        (result) => result.hasMissingDescendant,
      );

      return {
        missing: childResults.flatMap((result) => result.missing),
        incomplete: [
          ...childResults.flatMap((result) => result.incomplete),
          ...(hasMissingDescendant && path.length > 0
            ? [makeIncompleteIssue(path, describeSchema(selected))]
            : []),
        ],
        hasMissingDescendant,
      };
    }

    if (isArraySchema(selected)) {
      if (Array.isArray(value) === false) {
        return {
          missing: [],
          incomplete: [],
          hasMissingDescendant: false,
        };
      }

      const childResults: TraversalResult[] = value.map((element, index) =>
        walkNode(selected.items, element, `${path}[${index}]`),
      );
      return {
        missing: childResults.flatMap((result) => result.missing),
        incomplete: childResults.flatMap((result) => result.incomplete),
        hasMissingDescendant: childResults.some(
          (result) => result.hasMissingDescendant,
        ),
      };
    }

    return {
      missing: [],
      incomplete: [],
      hasMissingDescendant: false,
    };
  };

  const traversal: TraversalResult = walkNode(ORDER_SCHEMA, candidate, "");
  const validation = typia.validate<OrderDraft>(candidate);

  const invalid: InvalidCompletionIssue[] = sortByPath(
    dedupeByPath(
      (validation.success === false
        ? validation.errors.filter(
            (error): error is typeof error & { value: unknown } =>
              error.value !== undefined,
          )
            .map((error) => ({
              kind: "invalid" as const,
              path: toPath(error.path),
              expected: error.expected,
              actual: error.value,
            }))
        : []),
    ),
  );

  const missing = sortByPath(dedupeByPath(traversal.missing));
  const incomplete = sortByPath(
    dedupeByPath(
      traversal.incomplete.filter((issue) => issue.path.length > 0),
    ),
  );

  return {
    complete:
      missing.length === 0 &&
      incomplete.length === 0 &&
      invalid.length === 0,
    missing,
    incomplete,
    invalid,
  };
};
