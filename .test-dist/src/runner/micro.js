"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const createMicroAgenticaPatchRequester_1 = require("../runtime/createMicroAgenticaPatchRequester");
const readMicroAgenticaRuntimeConfig_1 = require("../runtime/readMicroAgenticaRuntimeConfig");
const runRequestedOrderDraftLoop_1 = require("../runtime/runRequestedOrderDraftLoop");
const OBJECTIVE = `Create an order draft for Alice.

- customer.name: Alice
- customer.email: alice@example.com
- shipping.address1: 123 Main St
- shipping.city: Seoul
- shipping.postalCode: 04524
- items: [{ sku: "SKU-001", quantity: 2 }]
- note: null
`;
const main = async () => {
    const config = (0, readMicroAgenticaRuntimeConfig_1.readMicroAgenticaRuntimeConfig)(process.env);
    const result = await (0, runRequestedOrderDraftLoop_1.runRequestedOrderDraftLoop)({
        objective: OBJECTIVE,
        maxAttempts: Number.parseInt(process.env.MAX_ATTEMPTS ?? "5", 10),
        requestPatch: (0, createMicroAgenticaPatchRequester_1.createMicroAgenticaPatchRequester)(config),
    });
    result.attempts.forEach((attempt, index) => {
        console.log(`Attempt ${index + 1}`);
        console.log(`Raw: ${attempt.raw}`);
        console.log(`Candidate: ${JSON.stringify(attempt.candidate)}`);
        console.log(`Feedback: ${typeof attempt.feedback === "string" ? attempt.feedback : JSON.stringify(attempt.feedback)}`);
        console.log("---");
    });
    if (result.terminal === "success") {
        console.log("Terminal: success");
        console.log(JSON.stringify(result.value, null, 2));
        return;
    }
    console.log("Terminal: retry_exhausted");
    console.log(JSON.stringify(result.candidate, null, 2));
};
main().catch((error) => {
    console.error(error);
    process.exit(1);
});
