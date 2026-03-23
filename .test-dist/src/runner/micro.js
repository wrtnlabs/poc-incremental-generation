"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const formatTerminalCompletionLog_1 = require("./formatTerminalCompletionLog");
const createMicroAgenticaPatchRequester_1 = require("../runtime/createMicroAgenticaPatchRequester");
const readMicroAgenticaRuntimeConfig_1 = require("../runtime/readMicroAgenticaRuntimeConfig");
const runRequestedAstCompletionLoop_1 = require("../runtime/runRequestedAstCompletionLoop");
const OBJECTIVE = `Create an AST for a fictional language module named MathOps.

- exports: ["add"]
- docComment: null
- one function named add
- parameters: left: Int, right: Int
- returnType: Int
- function body: return left + right
- generate AST nodes only, never source code text as the final artifact
`;
const main = async () => {
    const config = (0, readMicroAgenticaRuntimeConfig_1.readMicroAgenticaRuntimeConfig)(process.env);
    const result = await (0, runRequestedAstCompletionLoop_1.runRequestedAstCompletionLoop)({
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
        console.log((0, formatTerminalCompletionLog_1.formatTerminalCompletionLog)(result));
        console.log(JSON.stringify(result.value, null, 2));
        return;
    }
    console.log("Terminal: retry_exhausted");
    console.log((0, formatTerminalCompletionLog_1.formatTerminalCompletionLog)(result));
    console.log(JSON.stringify(result.candidate, null, 2));
};
main().catch((error) => {
    console.error(error);
    process.exit(1);
});
