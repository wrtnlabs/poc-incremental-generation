import type {
  CompletionAnalysis,
  InvalidCompletionIssue,
} from "../completeness/analyzeOrderCompletion";

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
      summary: "The order draft is complete.",
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
      ? "The order draft is not complete yet. Add the missing branches first, then fill the remaining missing fields."
      : "The order draft structure is complete, but one or more fields still need correction.";

  return {
    summary,
    missing,
    incomplete,
    invalid,
  };
};
