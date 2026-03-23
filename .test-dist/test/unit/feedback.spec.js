"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const normalizeCompletionFeedback_1 = require("../../src/feedback/normalizeCompletionFeedback");
describe("normalizeCompletionFeedback", () => {
    it("prioritizes missing and incomplete issues in the summary", () => {
        const feedback = (0, normalizeCompletionFeedback_1.normalizeCompletionFeedback)({
            complete: false,
            missing: [
                {
                    kind: "missing",
                    path: "functions",
                    expected: "object",
                },
            ],
            incomplete: [
                {
                    kind: "incomplete",
                    path: "functions[0]",
                    expected: "object",
                },
            ],
            invalid: [
                {
                    kind: "invalid",
                    path: "functions[0].body.statements[0].expression.operator",
                    expected: '"+" | "-" | "*" | "/"',
                    actual: "plus",
                },
            ],
        });
        expect(feedback.summary).toContain("AST is not complete yet");
        expect(feedback.missing).toEqual(["functions"]);
        expect(feedback.incomplete).toEqual(["functions[0]"]);
        expect(feedback.invalid).toEqual([
            {
                path: "functions[0].body.statements[0].expression.operator",
                expected: '"+" | "-" | "*" | "/"',
                actual: "plus",
            },
        ]);
    });
    it("switches to correction-oriented summary when only invalid issues remain", () => {
        const feedback = (0, normalizeCompletionFeedback_1.normalizeCompletionFeedback)({
            complete: false,
            missing: [],
            incomplete: [],
            invalid: [
                {
                    kind: "invalid",
                    path: "functions[0].body.statements[0].expression.operator",
                    expected: '"+" | "-" | "*" | "/"',
                    actual: "plus",
                },
            ],
        });
        expect(feedback.summary).toContain("still need correction");
    });
});
