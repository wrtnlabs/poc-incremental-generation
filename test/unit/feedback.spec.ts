import { normalizeCompletionFeedback } from "../../src/feedback/normalizeCompletionFeedback";

describe("normalizeCompletionFeedback", () => {
  it("prioritizes missing and incomplete issues in the summary", () => {
    const feedback = normalizeCompletionFeedback({
      complete: false,
      missing: [
        {
          kind: "missing",
          path: "shipping",
          expected: "object",
        },
      ],
      incomplete: [
        {
          kind: "incomplete",
          path: "customer",
          expected: "object",
        },
      ],
      invalid: [
        {
          kind: "invalid",
          path: "items[0].quantity",
          expected: "number",
          actual: "2",
        },
      ],
    });
    expect(feedback.summary).toContain("not complete yet");
    expect(feedback.missing).toEqual(["shipping"]);
    expect(feedback.incomplete).toEqual(["customer"]);
    expect(feedback.invalid).toEqual([
      {
        path: "items[0].quantity",
        expected: "number",
        actual: "2",
      },
    ]);
  });

  it("switches to correction-oriented summary when only invalid issues remain", () => {
    const feedback = normalizeCompletionFeedback({
      complete: false,
      missing: [],
      incomplete: [],
      invalid: [
        {
          kind: "invalid",
          path: "items[0].quantity",
          expected: "number",
          actual: "2",
        },
      ],
    });
    expect(feedback.summary).toContain("still need correction");
  });
});
