"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runOrderDraftLoop = void 0;
const mergeOrderPatch_1 = require("../accumulation/mergeOrderPatch");
const analyzeOrderCompletion_1 = require("../completeness/analyzeOrderCompletion");
const normalizeCompletionFeedback_1 = require("../feedback/normalizeCompletionFeedback");
const parseOrderPatch_1 = require("../ingress/parseOrderPatch");
const describeIngressFailure = (result) => result.kind === "parse_error"
    ? `Unable to parse the latest patch: ${result.errors.join("; ")}`
    : `The latest patch shape is invalid for DeepPartial<OrderDraft>: ${result.errors.map((error) => `${error.path} -> ${error.expected}`).join("; ")}`;
const runOrderDraftLoop = (inputs, maxAttempts = inputs.length) => {
    const finalState = inputs.slice(0, maxAttempts).reduce((state, raw) => {
        if (state.result !== null) {
            return state;
        }
        const ingress = (0, parseOrderPatch_1.parseOrderPatch)(raw);
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
        const candidate = (0, mergeOrderPatch_1.mergeOrderPatch)(state.candidate, ingress.draft);
        const analysis = (0, analyzeOrderCompletion_1.analyzeOrderCompletion)(candidate);
        const feedback = (0, normalizeCompletionFeedback_1.normalizeCompletionFeedback)(analysis);
        const attempts = [
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
                    value: candidate,
                    attempts,
                },
            }
            : {
                candidate,
                attempts,
                result: null,
            };
    }, {
        candidate: {},
        attempts: [],
        result: null,
    });
    return (finalState.result ?? {
        terminal: "retry_exhausted",
        candidate: finalState.candidate,
        attempts: finalState.attempts,
    });
};
exports.runOrderDraftLoop = runOrderDraftLoop;
