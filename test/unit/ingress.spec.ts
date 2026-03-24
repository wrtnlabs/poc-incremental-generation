import { parseAstPatch } from "../../src/ingress/parseAstPatch";

describe("parseAstPatch", () => {
  it("parses a valid patch", () => {
    const result = parseAstPatch('{"ast":{"functions":[{"name":"compute","body":{"statements":[{"kind":"return","expression":{"kind":"call","callee":"add","arguments":[{"kind":"literal","value":1},{"kind":"literal","value":2}]}}]}}]}}');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.ast).toEqual({
        functions: [
          {
            name: "compute",
            body: {
              statements: [
                {
                  kind: "return",
                  expression: {
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
                },
              ],
            },
          },
        ],
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
    const result = parseAstPatch("this is not json");
    expect(result.success).toBe(false);
    if (result.success === false) {
      expect(result.kind).toBe("parse_error");
    }
  });
});
