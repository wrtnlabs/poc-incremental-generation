import typia from "typia";

import type { ImaginaryModuleAst } from "../../src/domain/ast";

const completeAst: ImaginaryModuleAst = {
  moduleName: "AnalyticsOps",
  functions: [
    {
      name: "add",
      parameters: [
        { name: "left", type: { kind: "builtin", name: "Int" } },
        { name: "right", type: { kind: "builtin", name: "Int" } },
      ],
      returnType: { kind: "builtin", name: "Int" },
      body: {
        statements: [
          {
            kind: "return",
            expression: {
              kind: "binary",
              operator: "+",
              left: { kind: "identifier", name: "left" },
              right: { kind: "identifier", name: "right" },
            },
          },
        ],
      },
    },
    {
      name: "sumHistory",
      parameters: [{ name: "input", type: { kind: "named", name: "Input" } }],
      returnType: { kind: "builtin", name: "Int" },
      body: {
        statements: [
          { kind: "let", name: "total", expression: { kind: "literal", value: 0 } },
          {
            kind: "let",
            name: "current",
            expression: {
              kind: "propertyAccess",
              target: {
                kind: "propertyAccess",
                target: { kind: "identifier", name: "input" },
                property: "history",
              },
              property: "first",
            },
          },
          {
            kind: "while",
            condition: {
              kind: "binary",
              operator: "<",
              left: { kind: "identifier", name: "current" },
              right: {
                kind: "propertyAccess",
                target: {
                  kind: "propertyAccess",
                  target: { kind: "identifier", name: "input" },
                  property: "history",
                },
                property: "limit",
              },
            },
            body: {
              statements: [
                {
                  kind: "assignment",
                  target: { kind: "identifier", name: "total" },
                  expression: {
                    kind: "call",
                    callee: "add",
                    arguments: [
                      { kind: "identifier", name: "total" },
                      { kind: "identifier", name: "current" },
                    ],
                  },
                },
                {
                  kind: "assignment",
                  target: { kind: "identifier", name: "current" },
                  expression: {
                    kind: "call",
                    callee: "add",
                    arguments: [
                      { kind: "identifier", name: "current" },
                      {
                        kind: "propertyAccess",
                        target: {
                          kind: "propertyAccess",
                          target: { kind: "identifier", name: "input" },
                          property: "history",
                        },
                        property: "step",
                      },
                    ],
                  },
                },
              ],
            },
          },
          { kind: "return", expression: { kind: "identifier", name: "total" } },
        ],
      },
    },
    {
      name: "computeScore",
      parameters: [{ name: "input", type: { kind: "named", name: "Input" } }],
      returnType: { kind: "builtin", name: "Int" },
      body: {
        statements: [
          {
            kind: "let",
            name: "base",
            expression: {
              kind: "call",
              callee: "add",
              arguments: [
                {
                  kind: "propertyAccess",
                  target: {
                    kind: "propertyAccess",
                    target: { kind: "identifier", name: "input" },
                    property: "metrics",
                  },
                  property: "primary",
                },
                {
                  kind: "propertyAccess",
                  target: {
                    kind: "propertyAccess",
                    target: { kind: "identifier", name: "input" },
                    property: "metrics",
                  },
                  property: "secondary",
                },
              ],
            },
          },
          {
            kind: "if",
            condition: {
              kind: "binary",
              operator: ">",
              left: {
                kind: "propertyAccess",
                target: {
                  kind: "propertyAccess",
                  target: { kind: "identifier", name: "input" },
                  property: "flags",
                },
                property: "vip",
              },
              right: { kind: "literal", value: 0 },
            },
            then: {
              statements: [
                {
                  kind: "return",
                  expression: {
                    kind: "call",
                    callee: "add",
                    arguments: [
                      { kind: "identifier", name: "base" },
                      {
                        kind: "call",
                        callee: "sumHistory",
                        arguments: [{ kind: "identifier", name: "input" }],
                      },
                    ],
                  },
                },
              ],
            },
            else: {
              statements: [
                { kind: "return", expression: { kind: "identifier", name: "base" } },
              ],
            },
          },
        ],
      },
    },
    {
      name: "buildReport",
      parameters: [{ name: "input", type: { kind: "named", name: "Input" } }],
      returnType: { kind: "named", name: "Report" },
      body: {
        statements: [
          {
            kind: "let",
            name: "score",
            expression: {
              kind: "call",
              callee: "computeScore",
              arguments: [{ kind: "identifier", name: "input" }],
            },
          },
          {
            kind: "return",
            expression: {
              kind: "objectLiteral",
              properties: [
                { key: "score", value: { kind: "identifier", name: "score" } },
                {
                  key: "history",
                  value: {
                    kind: "arrayLiteral",
                    elements: [
                      {
                        kind: "propertyAccess",
                        target: {
                          kind: "propertyAccess",
                          target: { kind: "identifier", name: "input" },
                          property: "history",
                        },
                        property: "first",
                      },
                      {
                        kind: "propertyAccess",
                        target: {
                          kind: "propertyAccess",
                          target: { kind: "identifier", name: "input" },
                          property: "history",
                        },
                        property: "step",
                      },
                      { kind: "identifier", name: "score" },
                    ],
                  },
                },
                {
                  key: "passed",
                  value: {
                    kind: "binary",
                    operator: ">=",
                    left: { kind: "identifier", name: "score" },
                    right: { kind: "literal", value: 50 },
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
  exports: ["add", "sumHistory", "computeScore", "buildReport"],
  docComment: null,
};

describe("ImaginaryModuleAst schema fixtures", () => {
  it("accepts a fully complete object", () => {
    const result = typia.validate<ImaginaryModuleAst>(completeAst);
    expect(result.success).toBe(true);
  });

  it("treats omitted required nullable docComment as missing", () => {
    const result = typia.validate<ImaginaryModuleAst>({
      moduleName: "AnalyticsOps",
      functions: [
        {
          name: "add",
          parameters: [],
          returnType: { kind: "builtin", name: "Int" },
          body: { statements: [] },
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
