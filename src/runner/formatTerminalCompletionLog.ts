import type { LoopResult } from "../loop/runAstCompletionLoop";

const summarizeTerminalStatus = (result: LoopResult): string[] => {
  if (result.terminal === "success") {
    return [
      "CompletionStatus: strict T satisfied",
      `CompletionState: complete after ${result.attempts.length} attempt(s)`,
      "CompletionReason: all required AST nodes are present and strict validation passed",
    ];
  }

  const latestAnalysis = [...result.attempts]
    .reverse()
    .find((attempt) => attempt.analysis !== null)?.analysis;

  return [
    "CompletionStatus: strict T not satisfied",
    `CompletionState: incomplete after ${result.attempts.length} attempt(s)`,
    `CompletionReason: missing=${latestAnalysis?.missing.length ?? 0}, incomplete=${latestAnalysis?.incomplete.length ?? 0}, invalid=${latestAnalysis?.invalid.length ?? 0}`,
  ];
};

export const formatTerminalCompletionLog = (result: LoopResult): string =>
  summarizeTerminalStatus(result).join("\n");
