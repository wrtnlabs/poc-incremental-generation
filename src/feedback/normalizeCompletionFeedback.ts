import type {
  CompletionAnalysis,
  InvalidCompletionIssue,
} from "../completeness/analyzeAstCompletion";

export interface RetryFeedback {
  summary: string;
  missing: string[];
  incomplete: string[];
  invalid: Array<{
    path: string;
    expected: string;
    actual: unknown;
  }>;
}

export const normalizeCompletionFeedback = (
  analysis: CompletionAnalysis,
): RetryFeedback => {
  if (analysis.complete) {
    return {
      summary: "The AST is complete.",
      missing: [],
      incomplete: [],
      invalid: [],
    };
  }

  const missing: string[] = analysis.missing.map((issue) => issue.path);
  const incomplete: string[] = analysis.incomplete.map((issue) => issue.path);
  const invalid = analysis.invalid.map((issue: InvalidCompletionIssue) => ({
    path: issue.path,
    expected: issue.expected,
    actual: issue.actual,
  }));

  const summary: string =
    missing.length > 0 || incomplete.length > 0
      ? "The AST is not complete yet. Add the missing branches first, then fill the remaining missing nodes."
      : "The AST structure is complete, but one or more nodes still need correction.";

  return {
    summary,
    missing,
    incomplete,
    invalid,
  };
};
