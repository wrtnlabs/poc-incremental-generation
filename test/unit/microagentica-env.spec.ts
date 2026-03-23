import { readMicroAgenticaRuntimeConfig } from "../../src/runtime/readMicroAgenticaRuntimeConfig";

describe("readMicroAgenticaRuntimeConfig", () => {
  it("throws when OPENAI_API_KEY is missing", () => {
    expect(() => readMicroAgenticaRuntimeConfig({})).toThrow(
      "OPENAI_API_KEY is required in .env.",
    );
  });

  it("reads config with defaults", () => {
    expect(
      readMicroAgenticaRuntimeConfig({
        OPENAI_API_KEY: "test-key",
      }),
    ).toEqual({
      apiKey: "test-key",
      model: "gpt-4o-mini",
      baseURL: undefined,
    });
  });
});
