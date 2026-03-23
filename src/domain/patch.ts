import type { DeepPartial } from "@typia/interface";

import type { ImaginaryModuleAst } from "./ast";

export type AstPatch = DeepPartial<ImaginaryModuleAst>;

export interface IAstPatchApplication {
  submit(props: {
    ast: AstPatch;
  }): void;
}
