"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const formatTerminalCompletionLog_1 = require("./formatTerminalCompletionLog");
const runAstCompletionLoop_1 = require("../loop/runAstCompletionLoop");
const sequence = [
    '{"ast":{"moduleName":"MathOps"}}',
    '{"ast":{"functions":[{"name":"add","parameters":[{"name":"left","type":{"kind":"builtin","name":"Int"}},{"name":"right","type":{"kind":"builtin","name":"Int"}}],"returnType":{"kind":"builtin","name":"Int"}}]}}',
    '{"ast":{"functions":[{"name":"add","parameters":[{"name":"left","type":{"kind":"builtin","name":"Int"}},{"name":"right","type":{"kind":"builtin","name":"Int"}}],"returnType":{"kind":"builtin","name":"Int"},"body":{"statements":[{"kind":"return","expression":{"kind":"binary","operator":"plus","left":{"kind":"identifier","name":"left"},"right":{"kind":"identifier","name":"right"}}}]}}],"exports":["add"],"docComment":null}}',
    '{"ast":{"functions":[{"name":"add","parameters":[{"name":"left","type":{"kind":"builtin","name":"Int"}},{"name":"right","type":{"kind":"builtin","name":"Int"}}],"returnType":{"kind":"builtin","name":"Int"},"body":{"statements":[{"kind":"return","expression":{"kind":"binary","operator":"+","left":{"kind":"identifier","name":"left"},"right":{"kind":"identifier","name":"right"}}}]}}],"exports":["add"],"docComment":null}}',
];
const result = (0, runAstCompletionLoop_1.runAstCompletionLoop)(sequence);
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
}
else {
    console.log("Terminal: retry_exhausted");
    console.log((0, formatTerminalCompletionLog_1.formatTerminalCompletionLog)(result));
    console.log(JSON.stringify(result.candidate, null, 2));
}
