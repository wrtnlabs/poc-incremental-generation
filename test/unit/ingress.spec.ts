import { parseOrderPatch } from "../../src/ingress/parseOrderPatch";

describe("parseOrderPatch", () => {
  it("parses a valid patch", () => {
    const result = parseOrderPatch('{"draft":{"customer":{"name":"Alice"}}}');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.draft).toEqual({
        customer: {
          name: "Alice",
        },
      });
    }
  });

  it("recovers malformed but recoverable JSON", () => {
    const result = parseOrderPatch('{draft:{customer:{name:"Alice"}}}');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.draft).toEqual({
        customer: {
          name: "Alice",
        },
      });
    }
  });

  it("fails on unrecoverable input", () => {
    const result = parseOrderPatch('this is not json');
    expect(result.success).toBe(false);
    if (result.success === false) {
      expect(result.kind).toBe("parse_error");
    }
  });
});
