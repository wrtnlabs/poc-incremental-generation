"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeOrderPatch = void 0;
const isPlainObject = (value) => typeof value === "object" && value !== null && Array.isArray(value) === false;
const mergeUnknown = (base, patch) => {
    if (patch === undefined) {
        return base;
    }
    if (Array.isArray(patch)) {
        return patch.map((element) => mergeUnknown(undefined, element));
    }
    if (isPlainObject(patch)) {
        const baseRecord = isPlainObject(base) ? base : {};
        const patchRecord = Object.fromEntries(Object.entries(patch).flatMap(([key, value]) => {
            const merged = mergeUnknown(baseRecord[key], value);
            return merged === undefined ? [] : [[key, merged]];
        }));
        return {
            ...baseRecord,
            ...patchRecord,
        };
    }
    return patch;
};
const mergeOrderPatch = (current, incoming) => mergeUnknown(current, incoming);
exports.mergeOrderPatch = mergeOrderPatch;
