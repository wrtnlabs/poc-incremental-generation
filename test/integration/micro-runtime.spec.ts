import type { AstPatch } from "../../src/domain/patch";
import { runRequestedAstCompletionLoop } from "../../src/runtime/runRequestedAstCompletionLoop";

const signaturePatch: AstPatch = {
  functions: [
    {
      name: "add",
      parameters: [
        { name: "left", type: { kind: "builtin", name: "Int" } },
        { name: "right", type: { kind: "builtin", name: "Int" } },
      ],
      returnType: { kind: "builtin", name: "Int" },
    },
    {
      name: "sumHistory",
      parameters: [{ name: "input", type: { kind: "named", name: "Input" } }],
      returnType: { kind: "builtin", name: "Int" },
    },
    {
      name: "computeScore",
      parameters: [{ name: "input", type: { kind: "named", name: "Input" } }],
      returnType: { kind: "builtin", name: "Int" },
    },
    {
      name: "buildReport",
      parameters: [{ name: "input", type: { kind: "named", name: "Input" } }],
      returnType: { kind: "named", name: "Report" },
    },
  ],
};

const completePatch: AstPatch = {
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

describe("runRequestedAstCompletionLoop", () => {
  it("converges with an injected patch requester", async () => {
    const patches: AstPatch[] = [
      { moduleName: "AnalyticsOps" },
      { functions: signaturePatch.functions },
      completePatch,
    ];

    const result = await runRequestedAstCompletionLoop({
      objective: "create the AST",
      maxAttempts: patches.length,
      requestPatch: async ({ attempt }) => patches[attempt - 1] ?? {},
    });

    expect(result.terminal).toBe("success");
    if (result.terminal === "success") {
      expect(result.value.functions[1].body.statements[0].kind).toBe("let");
      expect(result.value.functions[1].body.statements[2].kind).toBe("while");
      expect(result.value.functions[3].body.statements[1].expression.kind).toBe("objectLiteral");
    }
  });

  it("exhausts retries when patches stay incomplete", async () => {
    const result = await runRequestedAstCompletionLoop({
      objective: "create the AST",
      maxAttempts: 2,
      requestPatch: async ({ attempt }) => ({
        moduleName: `AnalyticsOps${attempt}`,
      }),
    });

    expect(result.terminal).toBe("retry_exhausted");
    if (result.terminal === "retry_exhausted") {
      expect(result.candidate).toEqual({
        moduleName: "AnalyticsOps2",
      });
    }
  });
});
