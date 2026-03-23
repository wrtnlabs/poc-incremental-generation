"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const readMicroAgenticaRuntimeConfig_1 = require("../../src/runtime/readMicroAgenticaRuntimeConfig");
describe("readMicroAgenticaRuntimeConfig", () => {
    it("throws when OPENAI_API_KEY is missing", () => {
        expect(() => (0, readMicroAgenticaRuntimeConfig_1.readMicroAgenticaRuntimeConfig)({})).toThrow("OPENAI_API_KEY is required in .env.");
    });
    it("reads config with defaults", () => {
        expect((0, readMicroAgenticaRuntimeConfig_1.readMicroAgenticaRuntimeConfig)({
            OPENAI_API_KEY: "test-key",
        })).toEqual({
            apiKey: "test-key",
            model: "gpt-4o-mini",
            baseURL: undefined,
        });
    });
});
