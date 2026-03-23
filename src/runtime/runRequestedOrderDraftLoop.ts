import type { OrderPatch } from "../domain/patch";
import { runOrderDraftLoop, type LoopAttempt, type LoopResult } from "../loop/runOrderDraftLoop";

export interface PatchRequestContext {
  objective: string;
  attempt: number;
  maxAttempts: number;
  candidate: OrderPatch;
  attempts: LoopAttempt[];
  latestFeedback: LoopAttempt["feedback"] | null;
}

export type RequestPatch = (
  context: PatchRequestContext,
) => Promise<OrderPatch>;

export interface RequestedOrderDraftLoopProps {
  objective: string;
  maxAttempts?: number;
  requestPatch: RequestPatch;
}

const getLoopSnapshot = (rawPatches: readonly string[]): LoopResult | null =>
  rawPatches.length === 0 ? null : runOrderDraftLoop(rawPatches, rawPatches.length);

export const runRequestedOrderDraftLoop = async (
  props: RequestedOrderDraftLoopProps,
): Promise<LoopResult> => {
  const maxAttempts: number = props.maxAttempts ?? 5;
  const rawPatches: string[] = [];

  for (let index = 0; index < maxAttempts; ++index) {
    const snapshot: LoopResult | null = getLoopSnapshot(rawPatches);
    const patch: OrderPatch = await props.requestPatch({
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
    rawPatches.push(JSON.stringify({ draft: patch }));

    const result: LoopResult = runOrderDraftLoop(rawPatches, rawPatches.length);
    if (result.terminal === "success") {
      return result;
    }
  }

  return runOrderDraftLoop(rawPatches, rawPatches.length);
};
