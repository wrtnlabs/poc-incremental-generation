"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runRequestedOrderDraftLoop = void 0;
const runOrderDraftLoop_1 = require("../loop/runOrderDraftLoop");
const getLoopSnapshot = (rawPatches) => rawPatches.length === 0 ? null : (0, runOrderDraftLoop_1.runOrderDraftLoop)(rawPatches, rawPatches.length);
const runRequestedOrderDraftLoop = async (props) => {
    const maxAttempts = props.maxAttempts ?? 5;
    const rawPatches = [];
    for (let index = 0; index < maxAttempts; ++index) {
        const snapshot = getLoopSnapshot(rawPatches);
        const patch = await props.requestPatch({
            objective: props.objective,
            attempt: index + 1,
            maxAttempts,
            candidate: snapshot?.terminal === "success"
                ? snapshot.value
                : snapshot?.candidate ?? {},
            attempts: snapshot?.attempts ?? [],
            latestFeedback: snapshot?.attempts.at(-1)?.feedback ?? null,
        });
        rawPatches.push(JSON.stringify({ draft: patch }));
        const result = (0, runOrderDraftLoop_1.runOrderDraftLoop)(rawPatches, rawPatches.length);
        if (result.terminal === "success") {
            return result;
        }
    }
    return (0, runOrderDraftLoop_1.runOrderDraftLoop)(rawPatches, rawPatches.length);
};
exports.runRequestedOrderDraftLoop = runRequestedOrderDraftLoop;
