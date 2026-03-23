"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const runOrderDraftLoop_1 = require("../../src/loop/runOrderDraftLoop");
describe("runOrderDraftLoop", () => {
    it("converges across multiple partial patches", () => {
        const result = (0, runOrderDraftLoop_1.runOrderDraftLoop)([
            '{"draft":{"customer":{"name":"Alice"}}}',
            '{"draft":{"customer":{"email":"alice@example.com"},"shipping":{"address1":"123 Main St","city":"Seoul","postalCode":"04524"}}}',
            '{"draft":{"items":[{"sku":"SKU-001","quantity":2}],"note":null}}',
        ]);
        expect(result.terminal).toBe("success");
        if (result.terminal === "success") {
            expect(result.value.customer.email).toBe("alice@example.com");
            expect(result.value.items[0].quantity).toBe(2);
        }
    });
    it("stops with retry_exhausted when the sequence never completes", () => {
        const result = (0, runOrderDraftLoop_1.runOrderDraftLoop)([
            '{"draft":{"customer":{"name":"Alice"}}}',
            '{"draft":{"customer":{"name":"Alice Again"}}}',
        ]);
        expect(result.terminal).toBe("retry_exhausted");
        if (result.terminal === "retry_exhausted") {
            expect(result.candidate).toEqual({
                customer: {
                    name: "Alice Again",
                },
            });
        }
    });
});
