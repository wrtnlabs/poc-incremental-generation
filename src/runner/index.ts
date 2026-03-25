import "dotenv/config";

import { formatTerminalCompletionLog } from "./formatTerminalCompletionLog";
import { createMicroAgenticaPatchRequester } from "../runtime/createMicroAgenticaPatchRequester";
import { readMicroAgenticaRuntimeConfig } from "../runtime/readMicroAgenticaRuntimeConfig";
import { runRequestedAstCompletionLoop } from "../runtime/runRequestedAstCompletionLoop";

const OBJECTIVE = `Create an AST for a fictional language module named AnalyticsOps.

- exports: ["add", "sumHistory", "computeScore", "buildReport"]
- docComment: null

- one function named add
  - parameters: left: Int, right: Int
  - returnType: Int
  - function body: return left + right

- one function named sumHistory
  - parameters: input: Input
  - returnType: Int
  - body requirements:
    - first create a let binding "total = 0"
    - then create a let binding "current = input.history.first"
    - then use a while statement with condition "current < input.history.limit"
    - inside the while body:
      - assign "total = add(total, current)"
      - assign "current = add(current, input.history.step)"
    - return total

- one function named computeScore
  - parameters: input: Input
  - returnType: Int
  - body requirements:
    - create a let binding "base = add(input.metrics.primary, input.metrics.secondary)"
    - then use an if statement
    - condition: "input.flags.vip > 0"
    - then branch: return add(base, sumHistory(input))
    - else branch: return base

- one function named buildReport
  - parameters: input: Input
  - returnType: Report
  - body requirements:
    - create a let binding "score = computeScore(input)"
    - return an object literal with exactly these properties:
      - "score: score"
      - "history: [input.history.first, input.history.step, score]"
      - "passed: score >= 50"

- generate AST nodes only, never source code text as the final artifact
- prefer the smallest correct patch for each attempt, but keep cross-function consistency
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
