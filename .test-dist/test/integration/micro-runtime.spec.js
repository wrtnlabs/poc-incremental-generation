"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const runRequestedOrderDraftLoop_1 = require("../../src/runtime/runRequestedOrderDraftLoop");
describe("runRequestedOrderDraftLoop", () => {
    it("converges with an injected patch requester", async () => {
        const patches = [
            {
                customer: {
                    name: "Alice",
                },
            },
            {
                customer: {
                    email: "alice@example.com",
                },
                shipping: {
                    address1: "123 Main St",
                    city: "Seoul",
                    postalCode: "04524",
                },
            },
            {
                items: [
                    {
                        sku: "SKU-001",
                        quantity: 2,
                    },
                ],
                note: null,
            },
        ];
        const result = await (0, runRequestedOrderDraftLoop_1.runRequestedOrderDraftLoop)({
            objective: "create the order draft",
            maxAttempts: patches.length,
            requestPatch: async ({ attempt }) => patches[attempt - 1] ?? {},
        });
        expect(result.terminal).toBe("success");
        if (result.terminal === "success") {
            expect(result.value.customer.email).toBe("alice@example.com");
        }
    });
    it("exhausts retries when patches stay incomplete", async () => {
        const result = await (0, runRequestedOrderDraftLoop_1.runRequestedOrderDraftLoop)({
            objective: "create the order draft",
            maxAttempts: 2,
            requestPatch: async ({ attempt }) => ({
                customer: {
                    name: `Alice ${attempt}`,
                },
            }),
        });
        expect(result.terminal).toBe("retry_exhausted");
        if (result.terminal === "retry_exhausted") {
            expect(result.candidate).toEqual({
                customer: {
                    name: "Alice 2",
                },
            });
        }
    });
});
