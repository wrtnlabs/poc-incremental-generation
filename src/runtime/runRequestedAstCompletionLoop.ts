import type { AstPatch } from "../domain/patch";
import {
  runAstCompletionLoop,
  type LoopAttempt,
  type LoopResult,
} from "../loop/runAstCompletionLoop";

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
    const patch: AstPatch = await props.requestPatch({
      objective: props.objective,
      attempt: index + 1,
      maxAttempts,
      candidate:
        snapshot?.terminal === "success"
          ? snapshot.value
          : snapshot?.candidate ?? {},
      attempts: snapshot?.attempts ?? [],
      latestFeedback: snapshot?.attempts.at(-1)?.feedback ?? null,
    });
    rawPatches.push(JSON.stringify({ ast: patch }));

    const result: LoopResult = runAstCompletionLoop(rawPatches, rawPatches.length);
    if (result.terminal === "success") {
      return result;
    }
  }

  return runAstCompletionLoop(rawPatches, rawPatches.length);
};
