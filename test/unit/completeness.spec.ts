import { analyzeAstCompletion } from "../../src/completeness/analyzeAstCompletion";

describe("analyzeAstCompletion", () => {
  it("reports a missing top-level branch", () => {
    const analysis = analyzeAstCompletion({
      moduleName: "MathOps",
      exports: ["add"],
      docComment: null,
    });
    expect(analysis.complete).toBe(false);
    expect(analysis.missing.map((issue) => issue.path)).toContain("functions");
  });

  it("reports incomplete nested objects and missing nested paths", () => {
    const analysis = analyzeAstCompletion({
      moduleName: "MathOps",
      functions: [
        {
          name: "add",
          parameters: [],
          returnType: {
            kind: "builtin",
            name: "Int",
          },
        },
      ],
      exports: ["add"],
      docComment: null,
    });
    expect(analysis.incomplete.map((issue) => issue.path)).toContain("functions[0]");
    expect(analysis.missing.map((issue) => issue.path)).toContain("functions[0].body");
  });

  it("reports wrong scalar values as invalid", () => {
    const analysis = analyzeAstCompletion({
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
                  operator: "plus",
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
    expect(analysis.invalid.map((issue) => issue.path)).toContain(
      "functions[0].body.statements[0].expression.operator",
    );
  });
});
