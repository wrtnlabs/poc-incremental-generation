import { MicroAgentica } from "@agentica/core";
import OpenAI from "openai";
import typia from "typia";

import type { AstPatch } from "../domain/patch";
import {
  formatMicroAgenticaRequestLog,
  formatMicroAgenticaResponseLog,
} from "../runner/formatProgressLog";
import type { MicroAgenticaRuntimeConfig } from "./readMicroAgenticaRuntimeConfig";
import type { RequestPatch } from "./runRequestedAstCompletionLoop";

class AstPatchSubmissionController {
  public constructor(
    private readonly submitter: (ast: AstPatch) => void,
  ) {}

  public submit(props: {
    ast: AstPatch;
  }): {
    accepted: true;
  } {
    this.submitter(props.ast);
    return {
      accepted: true,
    };
  }
}

const getRequiredMissingPaths = (latestFeedback: unknown): string[] => {
  if (
    typeof latestFeedback !== "object" ||
    latestFeedback === null ||
    Array.isArray(latestFeedback) === true
  ) {
    return [];
  }
  const missing: unknown = (latestFeedback as { missing?: unknown }).missing;
  return Array.isArray(missing)
    ? missing.filter((value): value is string => typeof value === "string")
    : [];
};

const buildPrompt = (props: {
  objective: string;
  attempt: number;
  maxAttempts: number;
  candidate: AstPatch;
  latestFeedback: unknown;
}): string => {
  const requiredMissingPaths = getRequiredMissingPaths(props.latestFeedback);
  return `You are building an AST for a fictional language over multiple attempts.

Call the submit tool exactly once.
Return only the delta patch that should be added or corrected now.
Do not return the full object unless the full object is still the smallest correct delta.

The final target is a module AST.
Every function body should be represented as AST nodes, not source code text.

Attempt: ${props.attempt}/${props.maxAttempts}
Objective:
${props.objective}

Current accepted candidate:
${JSON.stringify(props.candidate, null, 2)}

Latest feedback:
${JSON.stringify(props.latestFeedback, null, 2)}

Required missing paths to address now:
${requiredMissingPaths.length === 0 ? "none" : requiredMissingPaths.join(", ")}

If the remaining missing paths are top-level keys such as exports or docComment, prioritize including those top-level keys.
Return the smallest patch that moves the current candidate closer to a strict AST.
`;
};

export const createMicroAgenticaPatchRequester = (
  config: MicroAgenticaRuntimeConfig,
): RequestPatch => {
  let latestPatch: AstPatch | undefined;
  const controller = new AstPatchSubmissionController((ast) => {
    latestPatch = ast;
  });

  const agent = new MicroAgentica({
    vendor: {
      api: new OpenAI({
        apiKey: config.apiKey,
        baseURL: config.baseURL,
      }),
      model: config.model,
    },
    controllers: [
      typia.llm.controller<AstPatchSubmissionController>(
        "astPatch",
        controller,
      ),
    ],
    config: {
      executor: {
        describe: false,
      },
      locale: "en-US",
    },
  });

  return async (context) => {
    latestPatch = undefined;
    console.log(
      formatMicroAgenticaRequestLog({
        attempt: context.attempt,
        maxAttempts: context.maxAttempts,
        model: config.model,
        hasCustomBaseUrl: config.baseURL !== undefined,
      }),
    );
    await agent.conversate(
      buildPrompt({
        objective: context.objective,
        attempt: context.attempt,
        maxAttempts: context.maxAttempts,
        candidate: context.candidate,
        latestFeedback: context.latestFeedback,
      }),
    );
    if (latestPatch === undefined) {
      throw new Error("MicroAgentica did not submit a patch.");
    }
    console.log(
      formatMicroAgenticaResponseLog({
        attempt: context.attempt,
        patch: latestPatch,
      }),
    );
    return latestPatch;
  };
};
