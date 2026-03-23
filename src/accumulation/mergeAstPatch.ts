import type { AstPatch } from "../domain/patch";

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && Array.isArray(value) === false;

const mergeUnknown = (base: unknown, patch: unknown): unknown => {
  if (patch === undefined) {
    return base;
  }
  if (Array.isArray(patch)) {
    return patch.map((element) => mergeUnknown(undefined, element));
  }
  if (isPlainObject(patch)) {
    const baseRecord: Record<string, unknown> = isPlainObject(base) ? base : {};
    const patchRecord: Record<string, unknown> = Object.fromEntries(
      Object.entries(patch).flatMap(([key, value]) => {
        const merged: unknown = mergeUnknown(baseRecord[key], value);
        return merged === undefined ? [] : [[key, merged]];
      }),
    );
    return {
      ...baseRecord,
      ...patchRecord,
    };
  }
  return patch;
};

export const mergeAstPatch = (
  current: AstPatch,
  incoming: AstPatch,
): AstPatch => mergeUnknown(current, incoming) as AstPatch;
