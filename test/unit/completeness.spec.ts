import { analyzeAstCompletion } from "../../src/completeness/analyzeAstCompletion";

describe("analyzeAstCompletion", () => {
  it("reports a missing top-level branch", () => {
    const analysis = analyzeAstCompletion({
      moduleName: "MathOps",
      exports: ["add", "scaleAndShift", "compute"],
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
          name: "compute",
          parameters: [],
          returnType: {
            kind: "builtin",
            name: "Int",
          },
        },
      ],
      exports: ["compute"],
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
                  operator: "plus",
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
      ],
      exports: ["scaleAndShift"],
      docComment: null,
    });
    expect(analysis.invalid.map((issue) => issue.path)).toContain(
      "functions[0].body.statements[0].expression.operator",
    );
  });

  it("reports exports that do not match defined functions", () => {
    const analysis = analyzeAstCompletion({
      moduleName: "AnalyticsOps",
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
      exports: ["add", "buildReport"],
      docComment: null,
    });

    expect(analysis.invalid).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: "exports[1]",
          expected: "a function name defined in functions[]",
          actual: "buildReport",
        }),
      ]),
    );
  });

  it("reports duplicate function and export names", () => {
    const analysis = analyzeAstCompletion({
      moduleName: "AnalyticsOps",
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
      exports: ["add", "add"],
      docComment: null,
    });

    expect(analysis.invalid).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: "functions[1].name",
          expected: "a unique function name",
          actual: "add",
        }),
        expect.objectContaining({
          path: "exports[1]",
          expected: "a unique export name",
          actual: "add",
        }),
      ]),
    );
  });
});
