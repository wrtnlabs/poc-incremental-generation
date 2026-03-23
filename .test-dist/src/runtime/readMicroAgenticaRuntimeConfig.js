"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readMicroAgenticaRuntimeConfig = void 0;
const DEFAULT_MODEL = "gpt-4o-mini";
const readMicroAgenticaRuntimeConfig = (env) => {
    const apiKey = env.OPENAI_API_KEY ?? "";
    if (apiKey.length === 0) {
        throw new Error("OPENAI_API_KEY is required in .env.");
    }
    return {
        apiKey,
        model: env.OPENAI_MODEL ?? DEFAULT_MODEL,
        baseURL: env.OPENAI_BASE_URL || undefined,
    };
};
exports.readMicroAgenticaRuntimeConfig = readMicroAgenticaRuntimeConfig;
