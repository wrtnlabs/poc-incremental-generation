import type { IJsonParseResult, IValidation } from "typia";
import typia from "typia";

import type { AstPatch, IAstPatchApplication } from "../domain/patch";

interface ISubmitProps {
  ast: AstPatch;
}

const PATCH_APPLICATION = typia.llm.application<IAstPatchApplication>();
const PATCH_FUNCTION = PATCH_APPLICATION.functions.find(
  (func) => func.name === "submit",
);

if (PATCH_FUNCTION === undefined) {
  throw new Error("submit function schema could not be created.");
}

export type IngressResult =
  | {
      success: true;
      ast: AstPatch;
    }
  | {
      success: false;
      kind: "parse_error";
      errors: string[];
      partial: unknown;
    }
  | {
      success: false;
      kind: "patch_validation_error";
      errors: Array<{
        path: string;
        expected: string;
      }>;
      partial: unknown;
    };

export const parseAstPatch = (input: string): IngressResult => {
  const parsed: IJsonParseResult<ISubmitProps> =
    PATCH_FUNCTION.parse(input) as IJsonParseResult<ISubmitProps>;
  if (parsed.success === false) {
    return {
      success: false,
      kind: "parse_error",
      errors: parsed.errors.map((error) =>
        String(error.description ?? error.expected),
      ),
      partial: parsed.data,
    };
  }
  const validation: IValidation<ISubmitProps> = PATCH_FUNCTION.validate(
    parsed.data,
  ) as IValidation<ISubmitProps>;
  if (validation.success === false) {
    return {
      success: false,
      kind: "patch_validation_error",
      errors: validation.errors.map((error) => ({
        path: error.path,
        expected: error.expected,
      })),
      partial: validation.data,
    };
  }
  return {
    success: true,
    ast: validation.data.ast,
  };
};
