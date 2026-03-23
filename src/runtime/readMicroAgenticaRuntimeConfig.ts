export interface MicroAgenticaRuntimeConfig {
  apiKey: string;
  model: string;
  baseURL?: string;
}

const DEFAULT_MODEL = "gpt-4o-mini";

export const readMicroAgenticaRuntimeConfig = (
  env: NodeJS.ProcessEnv,
): MicroAgenticaRuntimeConfig => {
  const apiKey: string = env.OPENAI_API_KEY ?? "";
  if (apiKey.length === 0) {
    throw new Error("OPENAI_API_KEY is required in .env.");
  }
  return {
    apiKey,
    model: env.OPENAI_MODEL ?? DEFAULT_MODEL,
    baseURL: env.OPENAI_BASE_URL || undefined,
  };
};
