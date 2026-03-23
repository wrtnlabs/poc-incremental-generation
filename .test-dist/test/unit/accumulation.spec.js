"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mergeOrderPatch_1 = require("../../src/accumulation/mergeOrderPatch");
describe("mergeOrderPatch", () => {
    it("deep merges objects while overwriting scalars", () => {
        const merged = (0, mergeOrderPatch_1.mergeOrderPatch)({
            customer: {
                name: "Alice",
            },
        }, {
            customer: {
                email: "alice@example.com",
            },
        });
        expect(merged).toEqual({
            customer: {
                name: "Alice",
                email: "alice@example.com",
            },
        });
    });
    it("replaces arrays as a whole", () => {
        const merged = (0, mergeOrderPatch_1.mergeOrderPatch)({
            items: [
                {
                    sku: "OLD",
                    quantity: 1,
                },
            ],
        }, {
            items: [
                {
                    sku: "NEW",
                    quantity: 2,
                },
            ],
        });
        expect(merged).toEqual({
            items: [
                {
                    sku: "NEW",
                    quantity: 2,
                },
            ],
        });
    });
    it("ignores undefined and preserves null", () => {
        const merged = (0, mergeOrderPatch_1.mergeOrderPatch)({
            note: "keep me",
        }, {
            note: null,
            shipping: undefined,
        });
        expect(merged).toEqual({
            note: null,
        });
    });
});
