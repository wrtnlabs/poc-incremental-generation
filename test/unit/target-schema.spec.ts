import typia from "typia";

import type { ImaginaryModuleAst } from "../../src/domain/ast";

describe("ImaginaryModuleAst schema fixtures", () => {
  it("accepts a fully complete object", () => {
    const result = typia.validate<ImaginaryModuleAst>({
      moduleName: "MathOps",
      functions: [
        {
          name: "add",
          parameters: [
            {
              name: "left",
              type: {
                kind: "builtin",
                name: "Int",
              },
            },
            {
              name: "right",
              type: {
                kind: "builtin",
                name: "Int",
              },
            },
          ],
          returnType: {
            kind: "builtin",
            name: "Int",
          },
          body: {
            statements: [
              {
                kind: "return",
                expression: {
                  kind: "binary",
                  operator: "+",
                  left: {
                    kind: "identifier",
                    name: "left",
                  },
                  right: {
                    kind: "identifier",
                    name: "right",
                  },
                },
              },
            ],
          },
        },
      ],
      exports: ["add"],
      docComment: null,
    });
    expect(result.success).toBe(true);
  });

  it("treats omitted required nullable docComment as missing", () => {
    const result = typia.validate<ImaginaryModuleAst>({
      moduleName: "MathOps",
      functions: [
        {
          name: "add",
          parameters: [],
          returnType: {
            kind: "builtin",
            name: "Int",
          },
          body: {
            statements: [],
          },
        },
      ],
      exports: ["add"],
    });
    expect(result.success).toBe(false);
    if (result.success === false) {
      expect(result.errors.some((error) => error.path === "$input.docComment")).toBe(true);
    }
  });
});
