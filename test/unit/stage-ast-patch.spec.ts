import { describeAstStageRule, stageAstPatch, wasAstPatchStaged } from "../../src/runtime/stageAstPatch";

describe("stageAstPatch", () => {
  it("keeps only moduleName and function signatures on attempt one", () => {
    const staged = stageAstPatch({
      attempt: 1,
      patch: {
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
        docComment: null,
      },
    });

    expect(staged).toEqual({
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
    });
  });

  it("keeps functions but strips top-level metadata on attempt two", () => {
    const staged = stageAstPatch({
      attempt: 2,
      patch: {
        moduleName: "MathOps",
        functions: [
          {
            name: "add",
            body: {
              statements: [],
            },
          },
        ],
        exports: ["add"],
        docComment: null,
      },
    });

    expect(staged).toEqual({
      moduleName: "MathOps",
      functions: [
        {
          name: "add",
          body: {
            statements: [],
          },
        },
      ],
    });
  });

  it("describes the attempt-specific stage rule", () => {
    expect(describeAstStageRule(1)).toContain("function signatures");
    expect(describeAstStageRule(2)).toContain("function bodies");
    expect(describeAstStageRule(3)).toContain("remaining top-level metadata");
  });

  it("detects when a patch was trimmed by the stage gate", () => {
    expect(
      wasAstPatchStaged({
        attempt: 1,
        original: {
          moduleName: "MathOps",
          exports: ["add"],
        },
        staged: {
          moduleName: "MathOps",
        },
      }),
    ).toBe(true);
  });
});
