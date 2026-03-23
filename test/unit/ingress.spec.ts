import { parseAstPatch } from "../../src/ingress/parseAstPatch";

describe("parseAstPatch", () => {
  it("parses a valid patch", () => {
    const result = parseAstPatch('{"ast":{"moduleName":"MathOps"}}');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.ast).toEqual({
        moduleName: "MathOps",
      });
    }
  });

  it("recovers malformed but recoverable JSON", () => {
    const result = parseAstPatch('{ast:{moduleName:"MathOps"}}');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.ast).toEqual({
        moduleName: "MathOps",
      });
    }
  });

  it("fails on unrecoverable input", () => {
    const result = parseAstPatch('this is not json');
    expect(result.success).toBe(false);
    if (result.success === false) {
      expect(result.kind).toBe("parse_error");
    }
  });
});
