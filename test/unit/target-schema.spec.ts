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
        {
          name: "scaleAndShift",
          parameters: [
            {
              name: "value",
              type: {
                kind: "builtin",
                name: "Int",
              },
            },
            {
              name: "factor",
              type: {
                kind: "builtin",
                name: "Int",
              },
            },
            {
              name: "offset",
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
                    kind: "binary",
                    operator: "*",
                    left: {
                      kind: "identifier",
                      name: "value",
                    },
                    right: {
                      kind: "identifier",
                      name: "factor",
                    },
                  },
                  right: {
                    kind: "identifier",
                    name: "offset",
                  },
                },
              },
            ],
          },
        },
        {
          name: "compute",
          parameters: [],
          returnType: {
            kind: "builtin",
            name: "Int",
          },
          body: {
            statements: [
              {
                kind: "return",
                expression: {
                  kind: "call",
                  callee: "scaleAndShift",
                  arguments: [
                    {
                      kind: "call",
                      callee: "add",
                      arguments: [
                        {
                          kind: "literal",
                          value: 1,
                        },
                        {
                          kind: "literal",
                          value: 2,
                        },
                      ],
                    },
                    {
                      kind: "literal",
                      value: 3,
                    },
                    {
                      kind: "literal",
                      value: 4,
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
      exports: ["add", "scaleAndShift", "compute"],
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
