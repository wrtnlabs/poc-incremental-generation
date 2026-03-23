import { MicroAgentica } from "@agentica/core";
import OpenAI from "openai";
import typia from "typia";

import type { AstPatch } from "../domain/patch";
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

const buildPrompt = (props: {
  objective: string;
  attempt: number;
  maxAttempts: number;
  candidate: AstPatch;
  latestFeedback: unknown;
}): string => `You are building an AST for a fictional language over multiple attempts.

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
`;

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
    return latestPatch;
  };
};
