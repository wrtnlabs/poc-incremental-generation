import "dotenv/config";

import { formatTerminalCompletionLog } from "./formatTerminalCompletionLog";
import { createMicroAgenticaPatchRequester } from "../runtime/createMicroAgenticaPatchRequester";
import { readMicroAgenticaRuntimeConfig } from "../runtime/readMicroAgenticaRuntimeConfig";
import { runRequestedAstCompletionLoop } from "../runtime/runRequestedAstCompletionLoop";

const OBJECTIVE = `Create an AST for a fictional language module named MathOps.

- exports: ["add", "scaleAndShift", "compute"]
- docComment: null
- one function named add
- parameters: left: Int, right: Int
- returnType: Int
- function body: return left + right
- one function named scaleAndShift
- parameters: value: Int, factor: Int, offset: Int
- returnType: Int
- function body: return value * factor + offset
- one function named compute
- parameters: none
- returnType: Int
- function body: return scaleAndShift(add(1, 2), 3, 4)
- generate AST nodes only, never source code text as the final artifact
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
