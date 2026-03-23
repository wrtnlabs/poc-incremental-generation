import { mergeOrderPatch } from "../accumulation/mergeOrderPatch";
import {
  analyzeOrderCompletion,
  type CompletionAnalysis,
} from "../completeness/analyzeOrderCompletion";
import type { OrderDraft } from "../domain/order";
import type { OrderPatch } from "../domain/patch";
import {
  normalizeCompletionFeedback,
  type RetryFeedback,
} from "../feedback/normalizeCompletionFeedback";
import { parseOrderPatch, type IngressResult } from "../ingress/parseOrderPatch";

export interface LoopAttempt {
  raw: string;
  ingress: IngressResult;
  candidate: OrderPatch;
  analysis: CompletionAnalysis | null;
  feedback: RetryFeedback | string;
}

export type LoopResult =
  | {
      terminal: "success";
      value: OrderDraft;
      attempts: LoopAttempt[];
    }
  | {
      terminal: "retry_exhausted";
      candidate: OrderPatch;
      attempts: LoopAttempt[];
    };

const describeIngressFailure = (result: Exclude<IngressResult, { success: true }>): string =>
  result.kind === "parse_error"
    ? `Unable to parse the latest patch: ${result.errors.join("; ")}`
    : `The latest patch shape is invalid for DeepPartial<OrderDraft>: ${result.errors.map((error) => `${error.path} -> ${error.expected}`).join("; ")}`;

export const runOrderDraftLoop = (
  inputs: readonly string[],
  maxAttempts: number = inputs.length,
): LoopResult => {
  const finalState = inputs.slice(0, maxAttempts).reduce<{
    candidate: OrderPatch;
    attempts: LoopAttempt[];
    result: LoopResult | null;
  }>(
    (state, raw) => {
      if (state.result !== null) {
        return state;
      }

      const ingress: IngressResult = parseOrderPatch(raw);
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

      const candidate: OrderPatch = mergeOrderPatch(state.candidate, ingress.draft);
      const analysis: CompletionAnalysis = analyzeOrderCompletion(candidate);
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
              value: candidate as OrderDraft,
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
