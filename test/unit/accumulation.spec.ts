import { mergeAstPatch } from "../../src/accumulation/mergeAstPatch";

describe("mergeAstPatch", () => {
  it("deep merges objects while overwriting scalars", () => {
    const merged = mergeAstPatch(
      {
        moduleName: "MathOps",
      },
      {
        docComment: null,
      },
    );
    expect(merged).toEqual({
      moduleName: "MathOps",
      docComment: null,
    });
  });

  it("replaces arrays as a whole", () => {
    const merged = mergeAstPatch(
      {
        exports: ["oldValue"],
      },
      {
        exports: ["add"],
      },
    );
    expect(merged).toEqual({
      exports: ["add"],
    });
  });

  it("ignores undefined and preserves null", () => {
    const merged = mergeAstPatch(
      {
        docComment: "keep me",
      },
      {
        docComment: null,
        functions: undefined,
      },
    );
    expect(merged).toEqual({
      docComment: null,
    });
  });
});
