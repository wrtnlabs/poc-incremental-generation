import { formatTerminalCompletionLog } from "../../src/runner/formatTerminalCompletionLog";

describe("formatTerminalCompletionLog", () => {
  it("reports strict completion when T is satisfied", () => {
    expect(
      formatTerminalCompletionLog({
        terminal: "success",
        attempts: [],
        value: {
          moduleName: "MathOps",
          functions: [],
          exports: [],
          docComment: null,
        },
      }),
    ).toContain("CompletionStatus: strict T satisfied");
  });

  it("reports why strict completion was not satisfied", () => {
    expect(
      formatTerminalCompletionLog({
        terminal: "retry_exhausted",
        candidate: {
          moduleName: "MathOps",
        },
        attempts: [
          {
            raw: '{"ast":{"moduleName":"MathOps"}}',
            ingress: {
              success: true,
              ast: {
                moduleName: "MathOps",
              },
            },
            candidate: {
              moduleName: "MathOps",
            },
            analysis: {
              complete: false,
              missing: [
                {
                  kind: "missing",
                  path: "functions",
                  expected: "array",
                },
              ],
              incomplete: [],
              invalid: [],
            },
            feedback: "incomplete",
          },
        ],
      }),
    ).toContain("CompletionReason: missing=1, incomplete=0, invalid=0");
  });
});
