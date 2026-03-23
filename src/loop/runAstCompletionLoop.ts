import { mergeAstPatch } from "../accumulation/mergeAstPatch";
import {
  analyzeAstCompletion,
  type CompletionAnalysis,
} from "../completeness/analyzeAstCompletion";
import type { ImaginaryModuleAst } from "../domain/ast";
import type { AstPatch } from "../domain/patch";
import {
  normalizeCompletionFeedback,
  type RetryFeedback,
} from "../feedback/normalizeCompletionFeedback";
import { parseAstPatch, type IngressResult } from "../ingress/parseAstPatch";

export interface LoopAttempt {
  raw: string;
  ingress: IngressResult;
  candidate: AstPatch;
  analysis: CompletionAnalysis | null;
  feedback: RetryFeedback | string;
}

export type LoopResult =
  | {
      terminal: "success";
      value: ImaginaryModuleAst;
      attempts: LoopAttempt[];
    }
  | {
      terminal: "retry_exhausted";
      candidate: AstPatch;
      attempts: LoopAttempt[];
    };

const describeIngressFailure = (result: Exclude<IngressResult, { success: true }>): string =>
  result.kind === "parse_error"
    ? `Unable to parse the latest AST patch: ${result.errors.join("; ")}`
    : `The latest patch shape is invalid for DeepPartial<ImaginaryModuleAst>: ${result.errors.map((error) => `${error.path} -> ${error.expected}`).join("; ")}`;

export const runAstCompletionLoop = (
  inputs: readonly string[],
  maxAttempts: number = inputs.length,
): LoopResult => {
  const finalState = inputs.slice(0, maxAttempts).reduce<{
    candidate: AstPatch;
    attempts: LoopAttempt[];
    result: LoopResult | null;
  }>(
    (state, raw) => {
      if (state.result !== null) {
        return state;
      }

      const ingress: IngressResult = parseAstPatch(raw);
      if (ingress.success === false) {
        return {
          ...state,
          attempts: [
            ...state.attempts,
            {
              raw,
              ingress,
              candidate: state.candidate,
              analysis: null,
              feedback: describeIngressFailure(ingress),
            },
          ],
        };
      }

      const candidate: AstPatch = mergeAstPatch(state.candidate, ingress.ast);
      const analysis: CompletionAnalysis = analyzeAstCompletion(candidate);
      const feedback: RetryFeedback = normalizeCompletionFeedback(analysis);
      const attempts: LoopAttempt[] = [
        ...state.attempts,
        {
          raw,
          ingress,
          candidate,
          analysis,
          feedback,
        },
      ];

      return analysis.complete
        ? {
            candidate,
            attempts,
            result: {
              terminal: "success",
              value: candidate as ImaginaryModuleAst,
              attempts,
            },
          }
        : {
            candidate,
            attempts,
            result: null,
          };
    },
    {
      candidate: {},
      attempts: [],
      result: null,
    },
  );

  return (
    finalState.result ?? {
      terminal: "retry_exhausted",
      candidate: finalState.candidate,
      attempts: finalState.attempts,
    }
  );
};
