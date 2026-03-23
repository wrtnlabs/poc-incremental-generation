"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeCompletionFeedback = void 0;
const normalizeCompletionFeedback = (analysis) => {
    if (analysis.complete) {
        return {
            summary: "The order draft is complete.",
            missing: [],
            incomplete: [],
            invalid: [],
        };
    }
    const missing = analysis.missing.map((issue) => issue.path);
    const incomplete = analysis.incomplete.map((issue) => issue.path);
    const invalid = analysis.invalid.map((issue) => ({
        path: issue.path,
        expected: issue.expected,
        actual: issue.actual,
    }));
    const summary = missing.length > 0 || incomplete.length > 0
        ? "The order draft is not complete yet. Add the missing branches first, then fill the remaining missing fields."
        : "The order draft structure is complete, but one or more fields still need correction.";
    return {
        summary,
        missing,
        incomplete,
        invalid,
    };
};
exports.normalizeCompletionFeedback = normalizeCompletionFeedback;
