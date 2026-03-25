import type { AstPatch } from "../domain/patch";
import {
  runAstCompletionLoop,
  type LoopAttempt,
  type LoopResult,
} from "../loop/runAstCompletionLoop";
import {
  formatAttemptResultLog,
  formatAttemptStartLog,
  formatPatchReceivedLog,
} from "../runner/formatProgressLog";

export interface PatchRequestContext {
  objective: string;
  attempt: number;
  maxAttempts: number;
  candidate: AstPatch;
  attempts: LoopAttempt[];
  latestFeedback: LoopAttempt["feedback"] | null;
}

export type RequestPatch = (
  context: PatchRequestContext,
) => Promise<AstPatch>;

export interface RequestedAstCompletionLoopProps {
  objective: string;
  maxAttempts?: number;
  requestPatch: RequestPatch;
}

const getLoopSnapshot = (rawPatches: readonly string[]): LoopResult | null =>
  rawPatches.length === 0 ? null : runAstCompletionLoop(rawPatches, rawPatches.length);

export const runRequestedAstCompletionLoop = async (
  props: RequestedAstCompletionLoopProps,
): Promise<LoopResult> => {
  const maxAttempts: number = props.maxAttempts ?? 5;
  const rawPatches: string[] = [];

  for (let index = 0; index < maxAttempts; ++index) {
    const snapshot: LoopResult | null = getLoopSnapshot(rawPatches);
    const context = {
      objective: props.objective,
      attempt: index + 1,
      maxAttempts,
      candidate:
        snapshot?.terminal === "success"
          ? snapshot.value
          : snapshot?.candidate ?? {},
      attempts: snapshot?.attempts ?? [],
      latestFeedback: snapshot?.attempts.at(-1)?.feedback ?? null,
    };
    console.log(formatAttemptStartLog(context));
    const patch: AstPatch = await props.requestPatch(context);
    console.log(formatPatchReceivedLog({
      attempt: context.attempt,
      patch,
    }));

    rawPatches.push(JSON.stringify({ ast: patch }));

    const result: LoopResult = runAstCompletionLoop(rawPatches, rawPatches.length);
    const latestAnalysis = result.attempts.at(-1)?.analysis;
    console.log(formatAttemptResultLog({
      attempt: context.attempt,
      terminal: result.terminal === "success",
      missing: latestAnalysis?.missing.length ?? 0,
      incomplete: latestAnalysis?.incomplete.length ?? 0,
      invalid: latestAnalysis?.invalid.length ?? 0,
    }));
    if (result.terminal === "success") {
      return result;
    }
  }

  return runAstCompletionLoop(rawPatches, rawPatches.length);
};
