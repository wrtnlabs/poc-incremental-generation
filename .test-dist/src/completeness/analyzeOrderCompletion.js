"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeOrderCompletion = void 0;
const __typia_transform__isFormatEmail = __importStar(require("typia/lib/internal/_isFormatEmail"));
const __typia_transform__validateReport = __importStar(require("typia/lib/internal/_validateReport"));
const typia_1 = __importDefault(require("typia"));
const ORDER_SCHEMA = {
    type: "object",
    properties: {
        customer: {
            type: "object",
            properties: {
                name: {
                    type: "string"
                },
                email: {
                    type: "string",
                    format: "email"
                }
            },
            required: [
                "name",
                "email"
            ]
        },
        shipping: {
            type: "object",
            properties: {
                address1: {
                    type: "string"
                },
                city: {
                    type: "string"
                },
                postalCode: {
                    type: "string"
                }
            },
            required: [
                "address1",
                "city",
                "postalCode"
            ]
        },
        items: {
            type: "array",
            items: {
                $ref: "#/$defs/OrderItem"
            }
        },
        note: {
            anyOf: [
                {
                    type: "null"
                },
                {
                    type: "string"
                }
            ]
        }
    },
    required: [
        "customer",
        "shipping",
        "items",
        "note"
    ],
    additionalProperties: false,
    $defs: {
        OrderItem: {
            type: "object",
            properties: {
                sku: {
                    type: "string"
                },
                quantity: {
                    type: "number"
                }
            },
            required: [
                "sku",
                "quantity"
            ]
        }
    }
};
const toPath = (path) => path.startsWith("$input.")
    ? path.slice("$input.".length)
    : path === "$input"
        ? ""
        : path.replace(/^\$input/, "");
const isObjectSchema = (schema) => "type" in schema && schema.type === "object";
const isArraySchema = (schema) => "type" in schema && schema.type === "array";
const isReferenceSchema = (schema) => "$ref" in schema;
const isAnyOfSchema = (schema) => "anyOf" in schema;
const isNullSchema = (schema) => "type" in schema && schema.type === "null";
const isRecord = (value) => typeof value === "object" && value !== null && Array.isArray(value) === false;
const describeSchema = (schema) => {
    if (isReferenceSchema(schema)) {
        return schema.$ref.split("/").at(-1) ?? "reference";
    }
    if (isAnyOfSchema(schema)) {
        return schema.anyOf.map(describeSchema).join(" | ");
    }
    if ("type" in schema) {
        return schema.type ?? "unknown";
    }
    return "unknown";
};
const resolveSchema = (schema, defs) => {
    if (isReferenceSchema(schema)) {
        const key = schema.$ref.split("/").at(-1);
        return key !== undefined && defs[key] !== undefined
            ? resolveSchema(defs[key], defs)
            : schema;
    }
    return schema;
};
const selectSchema = (schema, defs, value) => {
    const resolved = resolveSchema(schema, defs);
    if (isAnyOfSchema(resolved)) {
        const nonNull = resolved.anyOf.filter((candidate) => {
            const item = resolveSchema(candidate, defs);
            return isNullSchema(item) === false;
        });
        if (value === null) {
            return resolved;
        }
        if (nonNull.length === 1) {
            return resolveSchema(nonNull[0], defs);
        }
    }
    return resolved;
};
const makeMissingIssue = (path, expected) => ({
    kind: "missing",
    path,
    expected,
});
const makeIncompleteIssue = (path, expected) => ({
    kind: "incomplete",
    path,
    expected,
});
const sortByPath = (items) => [...items].sort((a, b) => a.path.localeCompare(b.path));
const dedupeByPath = (items) => items.filter((item, index, array) => array.findIndex((candidate) => candidate.path === item.path) === index);
const analyzeOrderCompletion = (candidate) => {
    const walkNode = (schema, value, path) => {
        const selected = selectSchema(schema, ORDER_SCHEMA.$defs, value);
        if (isObjectSchema(selected)) {
            if (isRecord(value) === false) {
                return {
                    missing: [],
                    incomplete: [],
                    hasMissingDescendant: false,
                };
            }
            const childResults = selected.required
                .map((key) => {
                const childSchema = selected.properties[key];
                if (childSchema === undefined) {
                    return null;
                }
                const childPath = path.length === 0 ? key : `${path}.${key}`;
                const childValue = value[key];
                return childValue === undefined
                    ? {
                        missing: [makeMissingIssue(childPath, describeSchema(childSchema))],
                        incomplete: [],
                        hasMissingDescendant: true,
                    }
                    : walkNode(childSchema, childValue, childPath);
            })
                .filter((result) => result !== null);
            const hasMissingDescendant = childResults.some((result) => result.hasMissingDescendant);
            return {
                missing: childResults.flatMap((result) => result.missing),
                incomplete: [
                    ...childResults.flatMap((result) => result.incomplete),
                    ...(hasMissingDescendant && path.length > 0
                        ? [makeIncompleteIssue(path, describeSchema(selected))]
                        : []),
                ],
                hasMissingDescendant,
            };
        }
        if (isArraySchema(selected)) {
            if (Array.isArray(value) === false) {
                return {
                    missing: [],
                    incomplete: [],
                    hasMissingDescendant: false,
                };
            }
            const childResults = value.map((element, index) => walkNode(selected.items, element, `${path}[${index}]`));
            return {
                missing: childResults.flatMap((result) => result.missing),
                incomplete: childResults.flatMap((result) => result.incomplete),
                hasMissingDescendant: childResults.some((result) => result.hasMissingDescendant),
            };
        }
        return {
            missing: [],
            incomplete: [],
            hasMissingDescendant: false,
        };
    };
    const traversal = walkNode(ORDER_SCHEMA, candidate, "");
    const validation = (() => { const _io0 = input => "object" === typeof input.customer && null !== input.customer && _io1(input.customer) && ("object" === typeof input.shipping && null !== input.shipping && _io2(input.shipping)) && (Array.isArray(input.items) && input.items.every(elem => "object" === typeof elem && null !== elem && _io3(elem))) && (null === input.note || "string" === typeof input.note); const _io1 = input => "string" === typeof input.name && ("string" === typeof input.email && __typia_transform__isFormatEmail._isFormatEmail(input.email)); const _io2 = input => "string" === typeof input.address1 && "string" === typeof input.city && "string" === typeof input.postalCode; const _io3 = input => "string" === typeof input.sku && "number" === typeof input.quantity; const _vo0 = (input, _path, _exceptionable = true) => [("object" === typeof input.customer && null !== input.customer || _report(_exceptionable, {
            path: _path + ".customer",
            expected: "__type",
            value: input.customer
        })) && _vo1(input.customer, _path + ".customer", true && _exceptionable) || _report(_exceptionable, {
            path: _path + ".customer",
            expected: "__type",
            value: input.customer
        }), ("object" === typeof input.shipping && null !== input.shipping || _report(_exceptionable, {
            path: _path + ".shipping",
            expected: "__type.o3",
            value: input.shipping
        })) && _vo2(input.shipping, _path + ".shipping", true && _exceptionable) || _report(_exceptionable, {
            path: _path + ".shipping",
            expected: "__type.o3",
            value: input.shipping
        }), (Array.isArray(input.items) || _report(_exceptionable, {
            path: _path + ".items",
            expected: "Array<OrderItem>",
            value: input.items
        })) && input.items.map((elem, _index2) => ("object" === typeof elem && null !== elem || _report(_exceptionable, {
            path: _path + ".items[" + _index2 + "]",
            expected: "OrderItem",
            value: elem
        })) && _vo3(elem, _path + ".items[" + _index2 + "]", true && _exceptionable) || _report(_exceptionable, {
            path: _path + ".items[" + _index2 + "]",
            expected: "OrderItem",
            value: elem
        })).every(flag => flag) || _report(_exceptionable, {
            path: _path + ".items",
            expected: "Array<OrderItem>",
            value: input.items
        }), null === input.note || "string" === typeof input.note || _report(_exceptionable, {
            path: _path + ".note",
            expected: "(null | string)",
            value: input.note
        })].every(flag => flag); const _vo1 = (input, _path, _exceptionable = true) => ["string" === typeof input.name || _report(_exceptionable, {
            path: _path + ".name",
            expected: "string",
            value: input.name
        }), "string" === typeof input.email && (__typia_transform__isFormatEmail._isFormatEmail(input.email) || _report(_exceptionable, {
            path: _path + ".email",
            expected: "string & Format<\"email\">",
            value: input.email
        })) || _report(_exceptionable, {
            path: _path + ".email",
            expected: "(string & Format<\"email\">)",
            value: input.email
        })].every(flag => flag); const _vo2 = (input, _path, _exceptionable = true) => ["string" === typeof input.address1 || _report(_exceptionable, {
            path: _path + ".address1",
            expected: "string",
            value: input.address1
        }), "string" === typeof input.city || _report(_exceptionable, {
            path: _path + ".city",
            expected: "string",
            value: input.city
        }), "string" === typeof input.postalCode || _report(_exceptionable, {
            path: _path + ".postalCode",
            expected: "string",
            value: input.postalCode
        })].every(flag => flag); const _vo3 = (input, _path, _exceptionable = true) => ["string" === typeof input.sku || _report(_exceptionable, {
            path: _path + ".sku",
            expected: "string",
            value: input.sku
        }), "number" === typeof input.quantity || _report(_exceptionable, {
            path: _path + ".quantity",
            expected: "number",
            value: input.quantity
        })].every(flag => flag); const __is = input => "object" === typeof input && null !== input && _io0(input); let errors; let _report; return input => {
        if (false === __is(input)) {
            errors = [];
            _report = __typia_transform__validateReport._validateReport(errors);
            ((input, _path, _exceptionable = true) => ("object" === typeof input && null !== input || _report(true, {
                path: _path + "",
                expected: "OrderDraft",
                value: input
            })) && _vo0(input, _path + "", true) || _report(true, {
                path: _path + "",
                expected: "OrderDraft",
                value: input
            }))(input, "$input", true);
            const success = 0 === errors.length;
            return success ? {
                success,
                data: input
            } : {
                success,
                errors,
                data: input
            };
        }
        return {
            success: true,
            data: input
        };
    }; })()(candidate);
    const invalid = sortByPath(dedupeByPath((validation.success === false
        ? validation.errors.filter((error) => error.value !== undefined)
            .map((error) => ({
            kind: "invalid",
            path: toPath(error.path),
            expected: error.expected,
            actual: error.value,
        }))
        : [])));
    const missing = sortByPath(dedupeByPath(traversal.missing));
    const incomplete = sortByPath(dedupeByPath(traversal.incomplete.filter((issue) => issue.path.length > 0)));
    return {
        complete: missing.length === 0 &&
            incomplete.length === 0 &&
            invalid.length === 0,
        missing,
        incomplete,
        invalid,
    };
};
exports.analyzeOrderCompletion = analyzeOrderCompletion;
