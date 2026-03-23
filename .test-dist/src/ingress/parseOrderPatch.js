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
exports.parseOrderPatch = void 0;
const __typia_transform__isFormatEmail = __importStar(require("typia/lib/internal/_isFormatEmail"));
const __typia_transform__validateReport = __importStar(require("typia/lib/internal/_validateReport"));
const __typia_transform__llmApplicationFinalize = __importStar(require("typia/lib/internal/_llmApplicationFinalize"));
const typia_1 = __importDefault(require("typia"));
const PATCH_APPLICATION = __typia_transform__llmApplicationFinalize._llmApplicationFinalize({
    functions: [
        {
            name: "submit",
            parameters: {
                type: "object",
                properties: {
                    draft: {
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
                                required: []
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
                                required: []
                            },
                            items: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        sku: {
                                            type: "string"
                                        },
                                        quantity: {
                                            type: "number"
                                        }
                                    },
                                    required: []
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
                        required: []
                    }
                },
                required: [
                    "draft"
                ],
                additionalProperties: false,
                $defs: {}
            },
            validate: (() => { const _io0 = input => "object" === typeof input.draft && null !== input.draft && false === Array.isArray(input.draft) && _io1(input.draft); const _io1 = input => (undefined === input.customer || "object" === typeof input.customer && null !== input.customer && false === Array.isArray(input.customer) && _io2(input.customer)) && (undefined === input.shipping || "object" === typeof input.shipping && null !== input.shipping && false === Array.isArray(input.shipping) && _io3(input.shipping)) && (undefined === input.items || Array.isArray(input.items) && input.items.every(elem => "object" === typeof elem && null !== elem && false === Array.isArray(elem) && _io4(elem))) && (null === input.note || undefined === input.note || "string" === typeof input.note); const _io2 = input => (undefined === input.name || "string" === typeof input.name) && (undefined === input.email || "string" === typeof input.email && __typia_transform__isFormatEmail._isFormatEmail(input.email)); const _io3 = input => (undefined === input.address1 || "string" === typeof input.address1) && (undefined === input.city || "string" === typeof input.city) && (undefined === input.postalCode || "string" === typeof input.postalCode); const _io4 = input => (undefined === input.sku || "string" === typeof input.sku) && (undefined === input.quantity || "number" === typeof input.quantity); const _vo0 = (input, _path, _exceptionable = true) => [("object" === typeof input.draft && null !== input.draft && false === Array.isArray(input.draft) || _report(_exceptionable, {
                    path: _path + ".draft",
                    expected: "__type.o1",
                    value: input.draft
                })) && _vo1(input.draft, _path + ".draft", true && _exceptionable) || _report(_exceptionable, {
                    path: _path + ".draft",
                    expected: "__type.o1",
                    value: input.draft
                })].every(flag => flag); const _vo1 = (input, _path, _exceptionable = true) => [undefined === input.customer || ("object" === typeof input.customer && null !== input.customer && false === Array.isArray(input.customer) || _report(_exceptionable, {
                    path: _path + ".customer",
                    expected: "(__type.o2 | undefined)",
                    value: input.customer
                })) && _vo2(input.customer, _path + ".customer", true && _exceptionable) || _report(_exceptionable, {
                    path: _path + ".customer",
                    expected: "(__type.o2 | undefined)",
                    value: input.customer
                }), undefined === input.shipping || ("object" === typeof input.shipping && null !== input.shipping && false === Array.isArray(input.shipping) || _report(_exceptionable, {
                    path: _path + ".shipping",
                    expected: "(__type.o5 | undefined)",
                    value: input.shipping
                })) && _vo3(input.shipping, _path + ".shipping", true && _exceptionable) || _report(_exceptionable, {
                    path: _path + ".shipping",
                    expected: "(__type.o5 | undefined)",
                    value: input.shipping
                }), undefined === input.items || (Array.isArray(input.items) || _report(_exceptionable, {
                    path: _path + ".items",
                    expected: "(Array<__type> | undefined)",
                    value: input.items
                })) && input.items.map((elem, _index2) => ("object" === typeof elem && null !== elem && false === Array.isArray(elem) || _report(_exceptionable, {
                    path: _path + ".items[" + _index2 + "]",
                    expected: "__type.o6",
                    value: elem
                })) && _vo4(elem, _path + ".items[" + _index2 + "]", true && _exceptionable) || _report(_exceptionable, {
                    path: _path + ".items[" + _index2 + "]",
                    expected: "__type.o6",
                    value: elem
                })).every(flag => flag) || _report(_exceptionable, {
                    path: _path + ".items",
                    expected: "(Array<__type> | undefined)",
                    value: input.items
                }), null === input.note || undefined === input.note || "string" === typeof input.note || _report(_exceptionable, {
                    path: _path + ".note",
                    expected: "(null | string | undefined)",
                    value: input.note
                })].every(flag => flag); const _vo2 = (input, _path, _exceptionable = true) => [undefined === input.name || "string" === typeof input.name || _report(_exceptionable, {
                    path: _path + ".name",
                    expected: "(string | undefined)",
                    value: input.name
                }), undefined === input.email || "string" === typeof input.email && (__typia_transform__isFormatEmail._isFormatEmail(input.email) || _report(_exceptionable, {
                    path: _path + ".email",
                    expected: "string & Format<\"email\">",
                    value: input.email
                })) || _report(_exceptionable, {
                    path: _path + ".email",
                    expected: "((string & Format<\"email\">) | undefined)",
                    value: input.email
                })].every(flag => flag); const _vo3 = (input, _path, _exceptionable = true) => [undefined === input.address1 || "string" === typeof input.address1 || _report(_exceptionable, {
                    path: _path + ".address1",
                    expected: "(string | undefined)",
                    value: input.address1
                }), undefined === input.city || "string" === typeof input.city || _report(_exceptionable, {
                    path: _path + ".city",
                    expected: "(string | undefined)",
                    value: input.city
                }), undefined === input.postalCode || "string" === typeof input.postalCode || _report(_exceptionable, {
                    path: _path + ".postalCode",
                    expected: "(string | undefined)",
                    value: input.postalCode
                })].every(flag => flag); const _vo4 = (input, _path, _exceptionable = true) => [undefined === input.sku || "string" === typeof input.sku || _report(_exceptionable, {
                    path: _path + ".sku",
                    expected: "(string | undefined)",
                    value: input.sku
                }), undefined === input.quantity || "number" === typeof input.quantity || _report(_exceptionable, {
                    path: _path + ".quantity",
                    expected: "(number | undefined)",
                    value: input.quantity
                })].every(flag => flag); const __is = input => "object" === typeof input && null !== input && _io0(input); let errors; let _report; return input => {
                if (false === __is(input)) {
                    errors = [];
                    _report = __typia_transform__validateReport._validateReport(errors);
                    ((input, _path, _exceptionable = true) => ("object" === typeof input && null !== input || _report(true, {
                        path: _path + "",
                        expected: "__type",
                        value: input
                    })) && _vo0(input, _path + "", true) || _report(true, {
                        path: _path + "",
                        expected: "__type",
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
            }; })()
        }
    ]
});
const PATCH_FUNCTION = PATCH_APPLICATION.functions.find((func) => func.name === "submit");
if (PATCH_FUNCTION === undefined) {
    throw new Error("submit function schema could not be created.");
}
const parseOrderPatch = (input) => {
    const parsed = PATCH_FUNCTION.parse(input);
    if (parsed.success === false) {
        return {
            success: false,
            kind: "parse_error",
            errors: parsed.errors.map((error) => String(error.description ?? error.expected)),
            partial: parsed.data,
        };
    }
    const validation = PATCH_FUNCTION.validate(parsed.data);
    if (validation.success === false) {
        return {
            success: false,
            kind: "patch_validation_error",
            errors: validation.errors.map((error) => ({
                path: error.path,
                expected: error.expected,
            })),
            partial: validation.data,
        };
    }
    return {
        success: true,
        draft: validation.data.draft,
    };
};
exports.parseOrderPatch = parseOrderPatch;
