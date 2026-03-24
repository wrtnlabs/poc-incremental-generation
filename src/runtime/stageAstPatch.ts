import type { AstPatch } from "../domain/patch";

export const describeAstStageRule = (attempt: number): string => {
  if (attempt === 1) {
    return "Submit only moduleName and function signatures. Do not include any function body, exports, or docComment yet.";
  }
  if (attempt === 2) {
    return "Submit function bodies now. Do not include exports or docComment yet.";
  }
  return "Submit the remaining top-level metadata and any corrections needed to satisfy strict T.";
};

const keepFunctionSignature = (value: unknown): unknown => {
  if (typeof value !== "object" || value === null || Array.isArray(value) === true) {
    return value;
  }
  const record = value as Record<string, unknown>;
  return {
    ...(record.name !== undefined ? { name: record.name } : {}),
    ...(record.parameters !== undefined ? { parameters: record.parameters } : {}),
    ...(record.returnType !== undefined ? { returnType: record.returnType } : {}),
  };
};

export const stageAstPatch = (props: {
  attempt: number;
  patch: AstPatch;
}): AstPatch => {
  if (props.attempt === 1) {
    return {
      ...(props.patch.moduleName !== undefined
        ? { moduleName: props.patch.moduleName }
        : {}),
      ...(props.patch.functions !== undefined
        ? {
            functions: props.patch.functions.map((functionPatch) =>
              keepFunctionSignature(functionPatch),
            ) as AstPatch["functions"],
          }
        : {}),
    };
  }
  if (props.attempt === 2) {
    return {
      ...(props.patch.moduleName !== undefined
        ? { moduleName: props.patch.moduleName }
        : {}),
      ...(props.patch.functions !== undefined
        ? { functions: props.patch.functions }
        : {}),
    };
  }
  return props.patch;
};

export const wasAstPatchStaged = (props: {
  attempt: number;
  original: AstPatch;
  staged: AstPatch;
}): boolean => JSON.stringify(props.original) !== JSON.stringify(props.staged);
