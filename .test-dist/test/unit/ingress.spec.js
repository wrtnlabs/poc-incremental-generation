"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parseAstPatch_1 = require("../../src/ingress/parseAstPatch");
describe("parseAstPatch", () => {
    it("parses a valid patch", () => {
        const result = (0, parseAstPatch_1.parseAstPatch)('{"ast":{"moduleName":"MathOps"}}');
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.ast).toEqual({
                moduleName: "MathOps",
            });
        }
    });
    it("recovers malformed but recoverable JSON", () => {
        const result = (0, parseAstPatch_1.parseAstPatch)('{ast:{moduleName:"MathOps"}}');
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.ast).toEqual({
                moduleName: "MathOps",
            });
        }
    });
    it("fails on unrecoverable input", () => {
        const result = (0, parseAstPatch_1.parseAstPatch)('this is not json');
        expect(result.success).toBe(false);
        if (result.success === false) {
            expect(result.kind).toBe("parse_error");
        }
    });
});
