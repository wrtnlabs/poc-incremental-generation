"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const analyzeOrderCompletion_1 = require("../../src/completeness/analyzeOrderCompletion");
describe("analyzeOrderCompletion", () => {
    it("reports a missing top-level branch", () => {
        const analysis = (0, analyzeOrderCompletion_1.analyzeOrderCompletion)({
            customer: {
                name: "Alice",
                email: "alice@example.com",
            },
            items: [
                {
                    sku: "SKU-001",
                    quantity: 2,
                },
            ],
            note: null,
        });
        expect(analysis.complete).toBe(false);
        expect(analysis.missing.map((issue) => issue.path)).toContain("shipping");
    });
    it("reports incomplete nested objects and missing nested paths", () => {
        const analysis = (0, analyzeOrderCompletion_1.analyzeOrderCompletion)({
            customer: {
                name: "Alice",
            },
            shipping: {
                address1: "123 Main St",
                city: "Seoul",
                postalCode: "04524",
            },
            items: [
                {
                    sku: "SKU-001",
                    quantity: 2,
                },
            ],
            note: null,
        });
        expect(analysis.incomplete.map((issue) => issue.path)).toContain("customer");
        expect(analysis.missing.map((issue) => issue.path)).toContain("customer.email");
    });
    it("reports wrong scalar values as invalid", () => {
        const analysis = (0, analyzeOrderCompletion_1.analyzeOrderCompletion)({
            customer: {
                name: "Alice",
                email: "alice@example.com",
            },
            shipping: {
                address1: "123 Main St",
                city: "Seoul",
                postalCode: "04524",
            },
            items: [
                {
                    sku: "SKU-001",
                    quantity: "2",
                },
            ],
            note: null,
        });
        expect(analysis.invalid.map((issue) => issue.path)).toContain("items[0].quantity");
    });
});
