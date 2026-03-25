import {
  formatAttemptResultLog,
  formatAttemptStartLog,
  formatMicroAgenticaRequestLog,
  formatMicroAgenticaResponseLog,
  formatPatchReceivedLog,
} from "../../src/runner/formatProgressLog";

describe("formatProgressLog", () => {
  it("formats attempt start log", () => {
    expect(
      formatAttemptStartLog({
        attempt: 2,
        maxAttempts: 5,
        candidate: {
          moduleName: "MathOps",
        },
        latestFeedback: null,
      }),
    ).toContain("Attempt 2/5 started");
  });

  it("formats patch received log", () => {
    expect(
      formatPatchReceivedLog({
        attempt: 3,
        patch: {
          functions: [],
        },
      }),
    ).toContain("produced patch keys: functions");
  });

  it("formats pending attempt result log", () => {
    expect(
      formatAttemptResultLog({
        attempt: 1,
        terminal: false,
        missing: 2,
        incomplete: 1,
        invalid: 0,
      }),
    ).toContain("pending strict AST");
  });

  it("formats MicroAgentica request and response logs", () => {
    expect(
      formatMicroAgenticaRequestLog({
        attempt: 1,
        maxAttempts: 4,
        model: "gpt-4o-mini",
        hasCustomBaseUrl: false,
      }),
    ).toContain("Model: gpt-4o-mini");
    expect(
      formatMicroAgenticaResponseLog({
        attempt: 1,
        patch: {
          exports: ["add"],
        },
      }),
    ).toContain("Received patch for attempt 1");
  });
});
