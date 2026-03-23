"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mergeAstPatch_1 = require("../../src/accumulation/mergeAstPatch");
describe("mergeAstPatch", () => {
    it("deep merges objects while overwriting scalars", () => {
        const merged = (0, mergeAstPatch_1.mergeAstPatch)({
            moduleName: "MathOps",
        }, {
            docComment: null,
        });
        expect(merged).toEqual({
            moduleName: "MathOps",
            docComment: null,
        });
    });
    it("replaces arrays as a whole", () => {
        const merged = (0, mergeAstPatch_1.mergeAstPatch)({
            exports: ["oldValue"],
        }, {
            exports: ["add"],
        });
        expect(merged).toEqual({
            exports: ["add"],
        });
    });
    it("ignores undefined and preserves null", () => {
        const merged = (0, mergeAstPatch_1.mergeAstPatch)({
            docComment: "keep me",
        }, {
            docComment: null,
            functions: undefined,
        });
        expect(merged).toEqual({
            docComment: null,
        });
    });
});
