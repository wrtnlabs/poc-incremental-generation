import { formatTerminalCompletionLog } from "./formatTerminalCompletionLog";
import { runAstCompletionLoop } from "../loop/runAstCompletionLoop";

const sequence: string[] = [
  '{"ast":{"moduleName":"MathOps"}}',
  '{"ast":{"functions":[{"name":"add","parameters":[{"name":"left","type":{"kind":"builtin","name":"Int"}},{"name":"right","type":{"kind":"builtin","name":"Int"}}],"returnType":{"kind":"builtin","name":"Int"}},{"name":"scaleAndShift","parameters":[{"name":"value","type":{"kind":"builtin","name":"Int"}},{"name":"factor","type":{"kind":"builtin","name":"Int"}},{"name":"offset","type":{"kind":"builtin","name":"Int"}}],"returnType":{"kind":"builtin","name":"Int"}},{"name":"compute","parameters":[],"returnType":{"kind":"builtin","name":"Int"}}]}}',
  '{"ast":{"functions":[{"name":"add","parameters":[{"name":"left","type":{"kind":"builtin","name":"Int"}},{"name":"right","type":{"kind":"builtin","name":"Int"}}],"returnType":{"kind":"builtin","name":"Int"},"body":{"statements":[{"kind":"return","expression":{"kind":"binary","operator":"plus","left":{"kind":"identifier","name":"left"},"right":{"kind":"identifier","name":"right"}}}]}},{"name":"scaleAndShift","parameters":[{"name":"value","type":{"kind":"builtin","name":"Int"}},{"name":"factor","type":{"kind":"builtin","name":"Int"}},{"name":"offset","type":{"kind":"builtin","name":"Int"}}],"returnType":{"kind":"builtin","name":"Int"},"body":{"statements":[{"kind":"return","expression":{"kind":"binary","operator":"+","left":{"kind":"binary","operator":"*","left":{"kind":"identifier","name":"value"},"right":{"kind":"identifier","name":"factor"}},"right":{"kind":"identifier","name":"offset"}}}]}},{"name":"compute","parameters":[],"returnType":{"kind":"builtin","name":"Int"},"body":{"statements":[{"kind":"return","expression":{"kind":"call","callee":"scaleAndShift","arguments":[{"kind":"call","callee":"add","arguments":[{"kind":"literal","value":1},{"kind":"literal","value":2}]},{"kind":"literal","value":3},{"kind":"literal","value":4}]}}]}}],"exports":["add","scaleAndShift","compute"],"docComment":null}}',
  '{"ast":{"functions":[{"name":"add","parameters":[{"name":"left","type":{"kind":"builtin","name":"Int"}},{"name":"right","type":{"kind":"builtin","name":"Int"}}],"returnType":{"kind":"builtin","name":"Int"},"body":{"statements":[{"kind":"return","expression":{"kind":"binary","operator":"+","left":{"kind":"identifier","name":"left"},"right":{"kind":"identifier","name":"right"}}}]}},{"name":"scaleAndShift","parameters":[{"name":"value","type":{"kind":"builtin","name":"Int"}},{"name":"factor","type":{"kind":"builtin","name":"Int"}},{"name":"offset","type":{"kind":"builtin","name":"Int"}}],"returnType":{"kind":"builtin","name":"Int"},"body":{"statements":[{"kind":"return","expression":{"kind":"binary","operator":"+","left":{"kind":"binary","operator":"*","left":{"kind":"identifier","name":"value"},"right":{"kind":"identifier","name":"factor"}},"right":{"kind":"identifier","name":"offset"}}}]}},{"name":"compute","parameters":[],"returnType":{"kind":"builtin","name":"Int"},"body":{"statements":[{"kind":"return","expression":{"kind":"call","callee":"scaleAndShift","arguments":[{"kind":"call","callee":"add","arguments":[{"kind":"literal","value":1},{"kind":"literal","value":2}]},{"kind":"literal","value":3},{"kind":"literal","value":4}]}}]}}],"exports":["add","scaleAndShift","compute"],"docComment":null}}',
];

const result = runAstCompletionLoop(sequence);

result.attempts.forEach((attempt, index) => {
  console.log(`Attempt ${index + 1}`);
  console.log(`Raw: ${attempt.raw}`);
  console.log(`Candidate: ${JSON.stringify(attempt.candidate)}`);
  console.log(
    `Feedback: ${typeof attempt.feedback === "string" ? attempt.feedback : JSON.stringify(attempt.feedback)}`,
  );
  console.log("---");
});

if (result.terminal === "success") {
  console.log("Terminal: success");
  console.log(formatTerminalCompletionLog(result));
  console.log(JSON.stringify(result.value, null, 2));
} else {
  console.log("Terminal: retry_exhausted");
  console.log(formatTerminalCompletionLog(result));
  console.log(JSON.stringify(result.candidate, null, 2));
}
