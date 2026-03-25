import "dotenv/config";

import { formatTerminalCompletionLog } from "./formatTerminalCompletionLog";
import { createMicroAgenticaPatchRequester } from "../runtime/createMicroAgenticaPatchRequester";
import { readMicroAgenticaRuntimeConfig } from "../runtime/readMicroAgenticaRuntimeConfig";
import { runRequestedAstCompletionLoop } from "../runtime/runRequestedAstCompletionLoop";

const OBJECTIVE = `Create an AST for a fictional language module named AnalyticsOps.

Required exports: add, sumHistory, computeScore, buildReport.
docComment must be null.

Function add:
- returns left plus right

Function sumHistory:
- input is Input
- total starts at zero
- current starts at input history first
- while current is less than input history limit
- update total with add of total and current
- update current with add of current and input history step
- return total

Function computeScore:
- input is Input
- base is add of input metrics primary and input metrics secondary
- if input flags vip is greater than zero, return add of base and sumHistory input
- otherwise return base

Function buildReport:
- input is Input
- score is computeScore input
- return an object literal with properties score, history, and passed
- history is an array literal with input history first, input history step, and score
- passed is score greater than or equal to fifty

Use AST nodes only. No source code text. Keep patches small but consistent.
`;

const main = async (): Promise<void> => {
  const config = readMicroAgenticaRuntimeConfig(process.env);
  const result = await runRequestedAstCompletionLoop({
    objective: OBJECTIVE,
    maxAttempts: Number.parseInt(process.env.MAX_ATTEMPTS ?? "5", 10),
    requestPatch: createMicroAgenticaPatchRequester(config),
  });

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
    return;
  }

  console.log("Terminal: retry_exhausted");
  console.log(formatTerminalCompletionLog(result));
  console.log(JSON.stringify(result.candidate, null, 2));
};

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
