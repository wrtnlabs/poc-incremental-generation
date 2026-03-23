import type { AstPatch } from "../../src/domain/patch";
import { runRequestedAstCompletionLoop } from "../../src/runtime/runRequestedAstCompletionLoop";

describe("runRequestedAstCompletionLoop", () => {
  it("converges with an injected patch requester", async () => {
    const patches: AstPatch[] = [
      {
        moduleName: "MathOps",
      },
      {
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
          },
        ],
      },
      {
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
      },
    ];

    const result = await runRequestedAstCompletionLoop({
      objective: "create the AST",
      maxAttempts: patches.length,
      requestPatch: async ({ attempt }) => patches[attempt - 1] ?? {},
    });

    expect(result.terminal).toBe("success");
    if (result.terminal === "success") {
      expect(result.value.functions[0].name).toBe("add");
    }
  });

  it("exhausts retries when patches stay incomplete", async () => {
    const result = await runRequestedAstCompletionLoop({
      objective: "create the AST",
      maxAttempts: 2,
      requestPatch: async ({ attempt }) => ({
        moduleName: `MathOps${attempt}`,
      }),
    });

    expect(result.terminal).toBe("retry_exhausted");
    if (result.terminal === "retry_exhausted") {
      expect(result.candidate).toEqual({
        moduleName: "MathOps2",
      });
    }
  });
});
