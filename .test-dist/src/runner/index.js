"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const runOrderDraftLoop_1 = require("../loop/runOrderDraftLoop");
const sequence = [
    '{"draft":{"customer":{"name":"Alice"}}}',
    '{"draft":{"customer":{"email":"alice@example.com"},"shipping":{"address1":"123 Main St","city":"Seoul","postalCode":"04524"}}}',
    '{"draft":{"items":[{"sku":"SKU-001","quantity":"2"}],"note":null}}',
    '{"draft":{"items":[{"sku":"SKU-001","quantity":2}]}}',
];
const result = (0, runOrderDraftLoop_1.runOrderDraftLoop)(sequence);
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
}
else {
    console.log("Terminal: retry_exhausted");
    console.log(JSON.stringify(result.candidate, null, 2));
}
