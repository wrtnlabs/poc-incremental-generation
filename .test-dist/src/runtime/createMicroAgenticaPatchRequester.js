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
exports.createMicroAgenticaPatchRequester = void 0;
const __typia_transform__validateReport = __importStar(require("typia/lib/internal/_validateReport"));
const __typia_transform__llmApplicationFinalize = __importStar(require("typia/lib/internal/_llmApplicationFinalize"));
const core_1 = require("@agentica/core");
const openai_1 = __importDefault(require("openai"));
const typia_1 = __importDefault(require("typia"));
class AstPatchSubmissionController {
    submitter;
    constructor(submitter) {
        this.submitter = submitter;
    }
    submit(props) {
        this.submitter(props.ast);
        return {
            accepted: true,
        };
    }
}
const buildPrompt = (props) => `You are building an AST for a fictional language over multiple attempts.

Call the submit tool exactly once.
Return only the delta patch that should be added or corrected now.
Do not return the full object unless the full object is still the smallest correct delta.

The final target is a module AST.
Every function body should be represented as AST nodes, not source code text.

Attempt: ${props.attempt}/${props.maxAttempts}
Objective:
${props.objective}

Current accepted candidate:
${JSON.stringify(props.candidate, null, 2)}

Latest feedback:
${JSON.stringify(props.latestFeedback, null, 2)}
`;
const createMicroAgenticaPatchRequester = (config) => {
    let latestPatch;
    const controller = new AstPatchSubmissionController((ast) => {
        latestPatch = ast;
    });
    const agent = new core_1.MicroAgentica({
        vendor: {
            api: new openai_1.default({
                apiKey: config.apiKey,
                baseURL: config.baseURL,
            }),
            model: config.model,
        },
        controllers: [
            {
                protocol: "class",
                name: "astPatch",
                execute: controller,
                application: __typia_transform__llmApplicationFinalize._llmApplicationFinalize({
                    functions: [
                        {
                            name: "submit",
                            parameters: {
                                type: "object",
                                properties: {
                                    ast: {
                                        type: "object",
                                        properties: {
                                            moduleName: {
                                                type: "string"
                                            },
                                            functions: {
                                                type: "array",
                                                items: {
                                                    type: "object",
                                                    properties: {
                                                        name: {
                                                            type: "string"
                                                        },
                                                        parameters: {
                                                            type: "array",
                                                            items: {
                                                                type: "object",
                                                                properties: {
                                                                    name: {
                                                                        type: "string"
                                                                    },
                                                                    type: {
                                                                        type: "object",
                                                                        properties: {
                                                                            kind: {
                                                                                type: "string",
                                                                                "enum": [
                                                                                    "builtin",
                                                                                    "named"
                                                                                ]
                                                                            },
                                                                            name: {
                                                                                type: "string"
                                                                            }
                                                                        },
                                                                        required: []
                                                                    }
                                                                },
                                                                required: []
                                                            }
                                                        },
                                                        returnType: {
                                                            type: "object",
                                                            properties: {
                                                                kind: {
                                                                    type: "string",
                                                                    "enum": [
                                                                        "builtin",
                                                                        "named"
                                                                    ]
                                                                },
                                                                name: {
                                                                    type: "string"
                                                                }
                                                            },
                                                            required: []
                                                        },
                                                        body: {
                                                            type: "object",
                                                            properties: {
                                                                statements: {
                                                                    type: "array",
                                                                    items: {
                                                                        type: "object",
                                                                        properties: {
                                                                            kind: {
                                                                                type: "string",
                                                                                "enum": [
                                                                                    "return"
                                                                                ]
                                                                            },
                                                                            expression: {
                                                                                type: "object",
                                                                                properties: {
                                                                                    kind: {
                                                                                        type: "string",
                                                                                        "enum": [
                                                                                            "binary"
                                                                                        ]
                                                                                    },
                                                                                    operator: {
                                                                                        type: "string",
                                                                                        "enum": [
                                                                                            "+",
                                                                                            "-",
                                                                                            "*",
                                                                                            "/"
                                                                                        ]
                                                                                    },
                                                                                    left: {
                                                                                        type: "object",
                                                                                        properties: {
                                                                                            kind: {
                                                                                                type: "string",
                                                                                                "enum": [
                                                                                                    "identifier"
                                                                                                ]
                                                                                            },
                                                                                            name: {
                                                                                                type: "string"
                                                                                            }
                                                                                        },
                                                                                        required: []
                                                                                    },
                                                                                    right: {
                                                                                        type: "object",
                                                                                        properties: {
                                                                                            kind: {
                                                                                                type: "string",
                                                                                                "enum": [
                                                                                                    "identifier"
                                                                                                ]
                                                                                            },
                                                                                            name: {
                                                                                                type: "string"
                                                                                            }
                                                                                        },
                                                                                        required: []
                                                                                    }
                                                                                },
                                                                                required: []
                                                                            }
                                                                        },
                                                                        required: []
                                                                    }
                                                                }
                                                            },
                                                            required: []
                                                        }
                                                    },
                                                    required: []
                                                }
                                            },
                                            exports: {
                                                type: "array",
                                                items: {
                                                    type: "string"
                                                }
                                            },
                                            docComment: {
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
                                    "ast"
                                ],
                                additionalProperties: false,
                                $defs: {}
                            },
                            output: {
                                type: "object",
                                properties: {
                                    accepted: {
                                        type: "boolean",
                                        "enum": [
                                            true
                                        ]
                                    }
                                },
                                required: [
                                    "accepted"
                                ],
                                additionalProperties: false,
                                $defs: {}
                            },
                            validate: (() => { const _io0 = input => "object" === typeof input.ast && null !== input.ast && false === Array.isArray(input.ast) && _io1(input.ast); const _io1 = input => (undefined === input.moduleName || "string" === typeof input.moduleName) && (undefined === input.functions || Array.isArray(input.functions) && input.functions.every(elem => "object" === typeof elem && null !== elem && false === Array.isArray(elem) && _io2(elem))) && (undefined === input.exports || Array.isArray(input.exports) && input.exports.every(elem => "string" === typeof elem)) && (null === input.docComment || undefined === input.docComment || "string" === typeof input.docComment); const _io2 = input => (undefined === input.name || "string" === typeof input.name) && (undefined === input.parameters || Array.isArray(input.parameters) && input.parameters.every(elem => "object" === typeof elem && null !== elem && false === Array.isArray(elem) && _io3(elem))) && (undefined === input.returnType || "object" === typeof input.returnType && null !== input.returnType && false === Array.isArray(input.returnType) && _io4(input.returnType)) && (undefined === input.body || "object" === typeof input.body && null !== input.body && false === Array.isArray(input.body) && _io5(input.body)); const _io3 = input => (undefined === input.name || "string" === typeof input.name) && (undefined === input.type || "object" === typeof input.type && null !== input.type && false === Array.isArray(input.type) && _io4(input.type)); const _io4 = input => (undefined === input.kind || "builtin" === input.kind || "named" === input.kind) && (undefined === input.name || "string" === typeof input.name); const _io5 = input => undefined === input.statements || Array.isArray(input.statements) && input.statements.every(elem => "object" === typeof elem && null !== elem && false === Array.isArray(elem) && _io6(elem)); const _io6 = input => (undefined === input.kind || "return" === input.kind) && (undefined === input.expression || "object" === typeof input.expression && null !== input.expression && false === Array.isArray(input.expression) && _io7(input.expression)); const _io7 = input => (undefined === input.kind || "binary" === input.kind) && (undefined === input.operator || "+" === input.operator || "-" === input.operator || "*" === input.operator || "/" === input.operator) && (undefined === input.left || "object" === typeof input.left && null !== input.left && false === Array.isArray(input.left) && _io8(input.left)) && (undefined === input.right || "object" === typeof input.right && null !== input.right && false === Array.isArray(input.right) && _io8(input.right)); const _io8 = input => (undefined === input.kind || "identifier" === input.kind) && (undefined === input.name || "string" === typeof input.name); const _vo0 = (input, _path, _exceptionable = true) => [("object" === typeof input.ast && null !== input.ast && false === Array.isArray(input.ast) || _report(_exceptionable, {
                                    path: _path + ".ast",
                                    expected: "__type.o1",
                                    value: input.ast
                                })) && _vo1(input.ast, _path + ".ast", true && _exceptionable) || _report(_exceptionable, {
                                    path: _path + ".ast",
                                    expected: "__type.o1",
                                    value: input.ast
                                })].every(flag => flag); const _vo1 = (input, _path, _exceptionable = true) => [undefined === input.moduleName || "string" === typeof input.moduleName || _report(_exceptionable, {
                                    path: _path + ".moduleName",
                                    expected: "(string | undefined)",
                                    value: input.moduleName
                                }), undefined === input.functions || (Array.isArray(input.functions) || _report(_exceptionable, {
                                    path: _path + ".functions",
                                    expected: "(Array<__type> | undefined)",
                                    value: input.functions
                                })) && input.functions.map((elem, _index5) => ("object" === typeof elem && null !== elem && false === Array.isArray(elem) || _report(_exceptionable, {
                                    path: _path + ".functions[" + _index5 + "]",
                                    expected: "__type.o2",
                                    value: elem
                                })) && _vo2(elem, _path + ".functions[" + _index5 + "]", true && _exceptionable) || _report(_exceptionable, {
                                    path: _path + ".functions[" + _index5 + "]",
                                    expected: "__type.o2",
                                    value: elem
                                })).every(flag => flag) || _report(_exceptionable, {
                                    path: _path + ".functions",
                                    expected: "(Array<__type> | undefined)",
                                    value: input.functions
                                }), undefined === input.exports || (Array.isArray(input.exports) || _report(_exceptionable, {
                                    path: _path + ".exports",
                                    expected: "(Array<string> | undefined)",
                                    value: input.exports
                                })) && input.exports.map((elem, _index6) => "string" === typeof elem || _report(_exceptionable, {
                                    path: _path + ".exports[" + _index6 + "]",
                                    expected: "string",
                                    value: elem
                                })).every(flag => flag) || _report(_exceptionable, {
                                    path: _path + ".exports",
                                    expected: "(Array<string> | undefined)",
                                    value: input.exports
                                }), null === input.docComment || undefined === input.docComment || "string" === typeof input.docComment || _report(_exceptionable, {
                                    path: _path + ".docComment",
                                    expected: "(null | string | undefined)",
                                    value: input.docComment
                                })].every(flag => flag); const _vo2 = (input, _path, _exceptionable = true) => [undefined === input.name || "string" === typeof input.name || _report(_exceptionable, {
                                    path: _path + ".name",
                                    expected: "(string | undefined)",
                                    value: input.name
                                }), undefined === input.parameters || (Array.isArray(input.parameters) || _report(_exceptionable, {
                                    path: _path + ".parameters",
                                    expected: "(Array<__type>.o1 | undefined)",
                                    value: input.parameters
                                })) && input.parameters.map((elem, _index7) => ("object" === typeof elem && null !== elem && false === Array.isArray(elem) || _report(_exceptionable, {
                                    path: _path + ".parameters[" + _index7 + "]",
                                    expected: "__type.o3",
                                    value: elem
                                })) && _vo3(elem, _path + ".parameters[" + _index7 + "]", true && _exceptionable) || _report(_exceptionable, {
                                    path: _path + ".parameters[" + _index7 + "]",
                                    expected: "__type.o3",
                                    value: elem
                                })).every(flag => flag) || _report(_exceptionable, {
                                    path: _path + ".parameters",
                                    expected: "(Array<__type>.o1 | undefined)",
                                    value: input.parameters
                                }), undefined === input.returnType || ("object" === typeof input.returnType && null !== input.returnType && false === Array.isArray(input.returnType) || _report(_exceptionable, {
                                    path: _path + ".returnType",
                                    expected: "(__type.o4 | undefined)",
                                    value: input.returnType
                                })) && _vo4(input.returnType, _path + ".returnType", true && _exceptionable) || _report(_exceptionable, {
                                    path: _path + ".returnType",
                                    expected: "(__type.o4 | undefined)",
                                    value: input.returnType
                                }), undefined === input.body || ("object" === typeof input.body && null !== input.body && false === Array.isArray(input.body) || _report(_exceptionable, {
                                    path: _path + ".body",
                                    expected: "(__type.o5 | undefined)",
                                    value: input.body
                                })) && _vo5(input.body, _path + ".body", true && _exceptionable) || _report(_exceptionable, {
                                    path: _path + ".body",
                                    expected: "(__type.o5 | undefined)",
                                    value: input.body
                                })].every(flag => flag); const _vo3 = (input, _path, _exceptionable = true) => [undefined === input.name || "string" === typeof input.name || _report(_exceptionable, {
                                    path: _path + ".name",
                                    expected: "(string | undefined)",
                                    value: input.name
                                }), undefined === input.type || ("object" === typeof input.type && null !== input.type && false === Array.isArray(input.type) || _report(_exceptionable, {
                                    path: _path + ".type",
                                    expected: "(__type.o4 | undefined)",
                                    value: input.type
                                })) && _vo4(input.type, _path + ".type", true && _exceptionable) || _report(_exceptionable, {
                                    path: _path + ".type",
                                    expected: "(__type.o4 | undefined)",
                                    value: input.type
                                })].every(flag => flag); const _vo4 = (input, _path, _exceptionable = true) => [undefined === input.kind || "builtin" === input.kind || "named" === input.kind || _report(_exceptionable, {
                                    path: _path + ".kind",
                                    expected: "(\"builtin\" | \"named\" | undefined)",
                                    value: input.kind
                                }), undefined === input.name || "string" === typeof input.name || _report(_exceptionable, {
                                    path: _path + ".name",
                                    expected: "(string | undefined)",
                                    value: input.name
                                })].every(flag => flag); const _vo5 = (input, _path, _exceptionable = true) => [undefined === input.statements || (Array.isArray(input.statements) || _report(_exceptionable, {
                                    path: _path + ".statements",
                                    expected: "(Array<__type>.o2 | undefined)",
                                    value: input.statements
                                })) && input.statements.map((elem, _index8) => ("object" === typeof elem && null !== elem && false === Array.isArray(elem) || _report(_exceptionable, {
                                    path: _path + ".statements[" + _index8 + "]",
                                    expected: "__type.o6",
                                    value: elem
                                })) && _vo6(elem, _path + ".statements[" + _index8 + "]", true && _exceptionable) || _report(_exceptionable, {
                                    path: _path + ".statements[" + _index8 + "]",
                                    expected: "__type.o6",
                                    value: elem
                                })).every(flag => flag) || _report(_exceptionable, {
                                    path: _path + ".statements",
                                    expected: "(Array<__type>.o2 | undefined)",
                                    value: input.statements
                                })].every(flag => flag); const _vo6 = (input, _path, _exceptionable = true) => [undefined === input.kind || "return" === input.kind || _report(_exceptionable, {
                                    path: _path + ".kind",
                                    expected: "(\"return\" | undefined)",
                                    value: input.kind
                                }), undefined === input.expression || ("object" === typeof input.expression && null !== input.expression && false === Array.isArray(input.expression) || _report(_exceptionable, {
                                    path: _path + ".expression",
                                    expected: "(__type.o7 | undefined)",
                                    value: input.expression
                                })) && _vo7(input.expression, _path + ".expression", true && _exceptionable) || _report(_exceptionable, {
                                    path: _path + ".expression",
                                    expected: "(__type.o7 | undefined)",
                                    value: input.expression
                                })].every(flag => flag); const _vo7 = (input, _path, _exceptionable = true) => [undefined === input.kind || "binary" === input.kind || _report(_exceptionable, {
                                    path: _path + ".kind",
                                    expected: "(\"binary\" | undefined)",
                                    value: input.kind
                                }), undefined === input.operator || "+" === input.operator || "-" === input.operator || "*" === input.operator || "/" === input.operator || _report(_exceptionable, {
                                    path: _path + ".operator",
                                    expected: "(\"*\" | \"+\" | \"-\" | \"/\" | undefined)",
                                    value: input.operator
                                }), undefined === input.left || ("object" === typeof input.left && null !== input.left && false === Array.isArray(input.left) || _report(_exceptionable, {
                                    path: _path + ".left",
                                    expected: "(__type.o8 | undefined)",
                                    value: input.left
                                })) && _vo8(input.left, _path + ".left", true && _exceptionable) || _report(_exceptionable, {
                                    path: _path + ".left",
                                    expected: "(__type.o8 | undefined)",
                                    value: input.left
                                }), undefined === input.right || ("object" === typeof input.right && null !== input.right && false === Array.isArray(input.right) || _report(_exceptionable, {
                                    path: _path + ".right",
                                    expected: "(__type.o8 | undefined)",
                                    value: input.right
                                })) && _vo8(input.right, _path + ".right", true && _exceptionable) || _report(_exceptionable, {
                                    path: _path + ".right",
                                    expected: "(__type.o8 | undefined)",
                                    value: input.right
                                })].every(flag => flag); const _vo8 = (input, _path, _exceptionable = true) => [undefined === input.kind || "identifier" === input.kind || _report(_exceptionable, {
                                    path: _path + ".kind",
                                    expected: "(\"identifier\" | undefined)",
                                    value: input.kind
                                }), undefined === input.name || "string" === typeof input.name || _report(_exceptionable, {
                                    path: _path + ".name",
                                    expected: "(string | undefined)",
                                    value: input.name
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
                })
            },
        ],
        config: {
            executor: {
                describe: false,
            },
            locale: "en-US",
        },
    });
    return async (context) => {
        latestPatch = undefined;
        await agent.conversate(buildPrompt({
            objective: context.objective,
            attempt: context.attempt,
            maxAttempts: context.maxAttempts,
            candidate: context.candidate,
            latestFeedback: context.latestFeedback,
        }));
        if (latestPatch === undefined) {
            throw new Error("MicroAgentica did not submit a patch.");
        }
        return latestPatch;
    };
};
exports.createMicroAgenticaPatchRequester = createMicroAgenticaPatchRequester;
