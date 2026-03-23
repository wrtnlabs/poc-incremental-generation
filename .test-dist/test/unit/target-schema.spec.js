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
const __typia_transform__validateReport = __importStar(require("typia/lib/internal/_validateReport"));
const typia_1 = __importDefault(require("typia"));
describe("ImaginaryModuleAst schema fixtures", () => {
    it("accepts a fully complete object", () => {
        const result = (() => { const _io0 = input => "string" === typeof input.moduleName && (Array.isArray(input.functions) && input.functions.every(elem => "object" === typeof elem && null !== elem && _io1(elem))) && (Array.isArray(input.exports) && input.exports.every(elem => "string" === typeof elem)) && (null === input.docComment || "string" === typeof input.docComment); const _io1 = input => "string" === typeof input.name && (Array.isArray(input.parameters) && input.parameters.every(elem => "object" === typeof elem && null !== elem && _io2(elem))) && ("object" === typeof input.returnType && null !== input.returnType && _io3(input.returnType)) && ("object" === typeof input.body && null !== input.body && _io4(input.body)); const _io2 = input => "string" === typeof input.name && ("object" === typeof input.type && null !== input.type && _io3(input.type)); const _io3 = input => ("builtin" === input.kind || "named" === input.kind) && "string" === typeof input.name; const _io4 = input => Array.isArray(input.statements) && input.statements.every(elem => "object" === typeof elem && null !== elem && _io5(elem)); const _io5 = input => "return" === input.kind && ("object" === typeof input.expression && null !== input.expression && _io6(input.expression)); const _io6 = input => "binary" === input.kind && ("+" === input.operator || "-" === input.operator || "*" === input.operator || "/" === input.operator) && ("object" === typeof input.left && null !== input.left && _io7(input.left)) && ("object" === typeof input.right && null !== input.right && _io7(input.right)); const _io7 = input => "identifier" === input.kind && "string" === typeof input.name; const _vo0 = (input, _path, _exceptionable = true) => ["string" === typeof input.moduleName || _report(_exceptionable, {
                path: _path + ".moduleName",
                expected: "string",
                value: input.moduleName
            }), (Array.isArray(input.functions) || _report(_exceptionable, {
                path: _path + ".functions",
                expected: "Array<ImaginaryFunctionAst>",
                value: input.functions
            })) && input.functions.map((elem, _index5) => ("object" === typeof elem && null !== elem || _report(_exceptionable, {
                path: _path + ".functions[" + _index5 + "]",
                expected: "ImaginaryFunctionAst",
                value: elem
            })) && _vo1(elem, _path + ".functions[" + _index5 + "]", true && _exceptionable) || _report(_exceptionable, {
                path: _path + ".functions[" + _index5 + "]",
                expected: "ImaginaryFunctionAst",
                value: elem
            })).every(flag => flag) || _report(_exceptionable, {
                path: _path + ".functions",
                expected: "Array<ImaginaryFunctionAst>",
                value: input.functions
            }), (Array.isArray(input.exports) || _report(_exceptionable, {
                path: _path + ".exports",
                expected: "Array<string>",
                value: input.exports
            })) && input.exports.map((elem, _index6) => "string" === typeof elem || _report(_exceptionable, {
                path: _path + ".exports[" + _index6 + "]",
                expected: "string",
                value: elem
            })).every(flag => flag) || _report(_exceptionable, {
                path: _path + ".exports",
                expected: "Array<string>",
                value: input.exports
            }), null === input.docComment || "string" === typeof input.docComment || _report(_exceptionable, {
                path: _path + ".docComment",
                expected: "(null | string)",
                value: input.docComment
            })].every(flag => flag); const _vo1 = (input, _path, _exceptionable = true) => ["string" === typeof input.name || _report(_exceptionable, {
                path: _path + ".name",
                expected: "string",
                value: input.name
            }), (Array.isArray(input.parameters) || _report(_exceptionable, {
                path: _path + ".parameters",
                expected: "Array<ImaginaryParameterAst>",
                value: input.parameters
            })) && input.parameters.map((elem, _index7) => ("object" === typeof elem && null !== elem || _report(_exceptionable, {
                path: _path + ".parameters[" + _index7 + "]",
                expected: "ImaginaryParameterAst",
                value: elem
            })) && _vo2(elem, _path + ".parameters[" + _index7 + "]", true && _exceptionable) || _report(_exceptionable, {
                path: _path + ".parameters[" + _index7 + "]",
                expected: "ImaginaryParameterAst",
                value: elem
            })).every(flag => flag) || _report(_exceptionable, {
                path: _path + ".parameters",
                expected: "Array<ImaginaryParameterAst>",
                value: input.parameters
            }), ("object" === typeof input.returnType && null !== input.returnType || _report(_exceptionable, {
                path: _path + ".returnType",
                expected: "ImaginaryTypeRefAst",
                value: input.returnType
            })) && _vo3(input.returnType, _path + ".returnType", true && _exceptionable) || _report(_exceptionable, {
                path: _path + ".returnType",
                expected: "ImaginaryTypeRefAst",
                value: input.returnType
            }), ("object" === typeof input.body && null !== input.body || _report(_exceptionable, {
                path: _path + ".body",
                expected: "ImaginaryBlockAst",
                value: input.body
            })) && _vo4(input.body, _path + ".body", true && _exceptionable) || _report(_exceptionable, {
                path: _path + ".body",
                expected: "ImaginaryBlockAst",
                value: input.body
            })].every(flag => flag); const _vo2 = (input, _path, _exceptionable = true) => ["string" === typeof input.name || _report(_exceptionable, {
                path: _path + ".name",
                expected: "string",
                value: input.name
            }), ("object" === typeof input.type && null !== input.type || _report(_exceptionable, {
                path: _path + ".type",
                expected: "ImaginaryTypeRefAst",
                value: input.type
            })) && _vo3(input.type, _path + ".type", true && _exceptionable) || _report(_exceptionable, {
                path: _path + ".type",
                expected: "ImaginaryTypeRefAst",
                value: input.type
            })].every(flag => flag); const _vo3 = (input, _path, _exceptionable = true) => ["builtin" === input.kind || "named" === input.kind || _report(_exceptionable, {
                path: _path + ".kind",
                expected: "(\"builtin\" | \"named\")",
                value: input.kind
            }), "string" === typeof input.name || _report(_exceptionable, {
                path: _path + ".name",
                expected: "string",
                value: input.name
            })].every(flag => flag); const _vo4 = (input, _path, _exceptionable = true) => [(Array.isArray(input.statements) || _report(_exceptionable, {
                path: _path + ".statements",
                expected: "Array<ImaginaryReturnStatementAst>",
                value: input.statements
            })) && input.statements.map((elem, _index8) => ("object" === typeof elem && null !== elem || _report(_exceptionable, {
                path: _path + ".statements[" + _index8 + "]",
                expected: "ImaginaryReturnStatementAst",
                value: elem
            })) && _vo5(elem, _path + ".statements[" + _index8 + "]", true && _exceptionable) || _report(_exceptionable, {
                path: _path + ".statements[" + _index8 + "]",
                expected: "ImaginaryReturnStatementAst",
                value: elem
            })).every(flag => flag) || _report(_exceptionable, {
                path: _path + ".statements",
                expected: "Array<ImaginaryReturnStatementAst>",
                value: input.statements
            })].every(flag => flag); const _vo5 = (input, _path, _exceptionable = true) => ["return" === input.kind || _report(_exceptionable, {
                path: _path + ".kind",
                expected: "\"return\"",
                value: input.kind
            }), ("object" === typeof input.expression && null !== input.expression || _report(_exceptionable, {
                path: _path + ".expression",
                expected: "ImaginaryBinaryExpressionAst",
                value: input.expression
            })) && _vo6(input.expression, _path + ".expression", true && _exceptionable) || _report(_exceptionable, {
                path: _path + ".expression",
                expected: "ImaginaryBinaryExpressionAst",
                value: input.expression
            })].every(flag => flag); const _vo6 = (input, _path, _exceptionable = true) => ["binary" === input.kind || _report(_exceptionable, {
                path: _path + ".kind",
                expected: "\"binary\"",
                value: input.kind
            }), "+" === input.operator || "-" === input.operator || "*" === input.operator || "/" === input.operator || _report(_exceptionable, {
                path: _path + ".operator",
                expected: "(\"*\" | \"+\" | \"-\" | \"/\")",
                value: input.operator
            }), ("object" === typeof input.left && null !== input.left || _report(_exceptionable, {
                path: _path + ".left",
                expected: "ImaginaryIdentifierAst",
                value: input.left
            })) && _vo7(input.left, _path + ".left", true && _exceptionable) || _report(_exceptionable, {
                path: _path + ".left",
                expected: "ImaginaryIdentifierAst",
                value: input.left
            }), ("object" === typeof input.right && null !== input.right || _report(_exceptionable, {
                path: _path + ".right",
                expected: "ImaginaryIdentifierAst",
                value: input.right
            })) && _vo7(input.right, _path + ".right", true && _exceptionable) || _report(_exceptionable, {
                path: _path + ".right",
                expected: "ImaginaryIdentifierAst",
                value: input.right
            })].every(flag => flag); const _vo7 = (input, _path, _exceptionable = true) => ["identifier" === input.kind || _report(_exceptionable, {
                path: _path + ".kind",
                expected: "\"identifier\"",
                value: input.kind
            }), "string" === typeof input.name || _report(_exceptionable, {
                path: _path + ".name",
                expected: "string",
                value: input.name
            })].every(flag => flag); const __is = input => "object" === typeof input && null !== input && _io0(input); let errors; let _report; return input => {
            if (false === __is(input)) {
                errors = [];
                _report = __typia_transform__validateReport._validateReport(errors);
                ((input, _path, _exceptionable = true) => ("object" === typeof input && null !== input || _report(true, {
                    path: _path + "",
                    expected: "ImaginaryModuleAst",
                    value: input
                })) && _vo0(input, _path + "", true) || _report(true, {
                    path: _path + "",
                    expected: "ImaginaryModuleAst",
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
        }; })()({
            moduleName: "MathOps",
            functions: [
                {
                    name: "add",
                    parameters: [
                        {
                            name: "left",
                            type: {
                                kind: "builtin",
                                name: "Int",
                            },
                        },
                        {
                            name: "right",
                            type: {
                                kind: "builtin",
                                name: "Int",
                            },
                        },
                    ],
                    returnType: {
                        kind: "builtin",
                        name: "Int",
                    },
                    body: {
                        statements: [
                            {
                                kind: "return",
                                expression: {
                                    kind: "binary",
                                    operator: "+",
                                    left: {
                                        kind: "identifier",
                                        name: "left",
                                    },
                                    right: {
                                        kind: "identifier",
                                        name: "right",
                                    },
                                },
                            },
                        ],
                    },
                },
            ],
            exports: ["add"],
            docComment: null,
        });
        expect(result.success).toBe(true);
    });
    it("treats omitted required nullable docComment as missing", () => {
        const result = (() => { const _io0 = input => "string" === typeof input.moduleName && (Array.isArray(input.functions) && input.functions.every(elem => "object" === typeof elem && null !== elem && _io1(elem))) && (Array.isArray(input.exports) && input.exports.every(elem => "string" === typeof elem)) && (null === input.docComment || "string" === typeof input.docComment); const _io1 = input => "string" === typeof input.name && (Array.isArray(input.parameters) && input.parameters.every(elem => "object" === typeof elem && null !== elem && _io2(elem))) && ("object" === typeof input.returnType && null !== input.returnType && _io3(input.returnType)) && ("object" === typeof input.body && null !== input.body && _io4(input.body)); const _io2 = input => "string" === typeof input.name && ("object" === typeof input.type && null !== input.type && _io3(input.type)); const _io3 = input => ("builtin" === input.kind || "named" === input.kind) && "string" === typeof input.name; const _io4 = input => Array.isArray(input.statements) && input.statements.every(elem => "object" === typeof elem && null !== elem && _io5(elem)); const _io5 = input => "return" === input.kind && ("object" === typeof input.expression && null !== input.expression && _io6(input.expression)); const _io6 = input => "binary" === input.kind && ("+" === input.operator || "-" === input.operator || "*" === input.operator || "/" === input.operator) && ("object" === typeof input.left && null !== input.left && _io7(input.left)) && ("object" === typeof input.right && null !== input.right && _io7(input.right)); const _io7 = input => "identifier" === input.kind && "string" === typeof input.name; const _vo0 = (input, _path, _exceptionable = true) => ["string" === typeof input.moduleName || _report(_exceptionable, {
                path: _path + ".moduleName",
                expected: "string",
                value: input.moduleName
            }), (Array.isArray(input.functions) || _report(_exceptionable, {
                path: _path + ".functions",
                expected: "Array<ImaginaryFunctionAst>",
                value: input.functions
            })) && input.functions.map((elem, _index5) => ("object" === typeof elem && null !== elem || _report(_exceptionable, {
                path: _path + ".functions[" + _index5 + "]",
                expected: "ImaginaryFunctionAst",
                value: elem
            })) && _vo1(elem, _path + ".functions[" + _index5 + "]", true && _exceptionable) || _report(_exceptionable, {
                path: _path + ".functions[" + _index5 + "]",
                expected: "ImaginaryFunctionAst",
                value: elem
            })).every(flag => flag) || _report(_exceptionable, {
                path: _path + ".functions",
                expected: "Array<ImaginaryFunctionAst>",
                value: input.functions
            }), (Array.isArray(input.exports) || _report(_exceptionable, {
                path: _path + ".exports",
                expected: "Array<string>",
                value: input.exports
            })) && input.exports.map((elem, _index6) => "string" === typeof elem || _report(_exceptionable, {
                path: _path + ".exports[" + _index6 + "]",
                expected: "string",
                value: elem
            })).every(flag => flag) || _report(_exceptionable, {
                path: _path + ".exports",
                expected: "Array<string>",
                value: input.exports
            }), null === input.docComment || "string" === typeof input.docComment || _report(_exceptionable, {
                path: _path + ".docComment",
                expected: "(null | string)",
                value: input.docComment
            })].every(flag => flag); const _vo1 = (input, _path, _exceptionable = true) => ["string" === typeof input.name || _report(_exceptionable, {
                path: _path + ".name",
                expected: "string",
                value: input.name
            }), (Array.isArray(input.parameters) || _report(_exceptionable, {
                path: _path + ".parameters",
                expected: "Array<ImaginaryParameterAst>",
                value: input.parameters
            })) && input.parameters.map((elem, _index7) => ("object" === typeof elem && null !== elem || _report(_exceptionable, {
                path: _path + ".parameters[" + _index7 + "]",
                expected: "ImaginaryParameterAst",
                value: elem
            })) && _vo2(elem, _path + ".parameters[" + _index7 + "]", true && _exceptionable) || _report(_exceptionable, {
                path: _path + ".parameters[" + _index7 + "]",
                expected: "ImaginaryParameterAst",
                value: elem
            })).every(flag => flag) || _report(_exceptionable, {
                path: _path + ".parameters",
                expected: "Array<ImaginaryParameterAst>",
                value: input.parameters
            }), ("object" === typeof input.returnType && null !== input.returnType || _report(_exceptionable, {
                path: _path + ".returnType",
                expected: "ImaginaryTypeRefAst",
                value: input.returnType
            })) && _vo3(input.returnType, _path + ".returnType", true && _exceptionable) || _report(_exceptionable, {
                path: _path + ".returnType",
                expected: "ImaginaryTypeRefAst",
                value: input.returnType
            }), ("object" === typeof input.body && null !== input.body || _report(_exceptionable, {
                path: _path + ".body",
                expected: "ImaginaryBlockAst",
                value: input.body
            })) && _vo4(input.body, _path + ".body", true && _exceptionable) || _report(_exceptionable, {
                path: _path + ".body",
                expected: "ImaginaryBlockAst",
                value: input.body
            })].every(flag => flag); const _vo2 = (input, _path, _exceptionable = true) => ["string" === typeof input.name || _report(_exceptionable, {
                path: _path + ".name",
                expected: "string",
                value: input.name
            }), ("object" === typeof input.type && null !== input.type || _report(_exceptionable, {
                path: _path + ".type",
                expected: "ImaginaryTypeRefAst",
                value: input.type
            })) && _vo3(input.type, _path + ".type", true && _exceptionable) || _report(_exceptionable, {
                path: _path + ".type",
                expected: "ImaginaryTypeRefAst",
                value: input.type
            })].every(flag => flag); const _vo3 = (input, _path, _exceptionable = true) => ["builtin" === input.kind || "named" === input.kind || _report(_exceptionable, {
                path: _path + ".kind",
                expected: "(\"builtin\" | \"named\")",
                value: input.kind
            }), "string" === typeof input.name || _report(_exceptionable, {
                path: _path + ".name",
                expected: "string",
                value: input.name
            })].every(flag => flag); const _vo4 = (input, _path, _exceptionable = true) => [(Array.isArray(input.statements) || _report(_exceptionable, {
                path: _path + ".statements",
                expected: "Array<ImaginaryReturnStatementAst>",
                value: input.statements
            })) && input.statements.map((elem, _index8) => ("object" === typeof elem && null !== elem || _report(_exceptionable, {
                path: _path + ".statements[" + _index8 + "]",
                expected: "ImaginaryReturnStatementAst",
                value: elem
            })) && _vo5(elem, _path + ".statements[" + _index8 + "]", true && _exceptionable) || _report(_exceptionable, {
                path: _path + ".statements[" + _index8 + "]",
                expected: "ImaginaryReturnStatementAst",
                value: elem
            })).every(flag => flag) || _report(_exceptionable, {
                path: _path + ".statements",
                expected: "Array<ImaginaryReturnStatementAst>",
                value: input.statements
            })].every(flag => flag); const _vo5 = (input, _path, _exceptionable = true) => ["return" === input.kind || _report(_exceptionable, {
                path: _path + ".kind",
                expected: "\"return\"",
                value: input.kind
            }), ("object" === typeof input.expression && null !== input.expression || _report(_exceptionable, {
                path: _path + ".expression",
                expected: "ImaginaryBinaryExpressionAst",
                value: input.expression
            })) && _vo6(input.expression, _path + ".expression", true && _exceptionable) || _report(_exceptionable, {
                path: _path + ".expression",
                expected: "ImaginaryBinaryExpressionAst",
                value: input.expression
            })].every(flag => flag); const _vo6 = (input, _path, _exceptionable = true) => ["binary" === input.kind || _report(_exceptionable, {
                path: _path + ".kind",
                expected: "\"binary\"",
                value: input.kind
            }), "+" === input.operator || "-" === input.operator || "*" === input.operator || "/" === input.operator || _report(_exceptionable, {
                path: _path + ".operator",
                expected: "(\"*\" | \"+\" | \"-\" | \"/\")",
                value: input.operator
            }), ("object" === typeof input.left && null !== input.left || _report(_exceptionable, {
                path: _path + ".left",
                expected: "ImaginaryIdentifierAst",
                value: input.left
            })) && _vo7(input.left, _path + ".left", true && _exceptionable) || _report(_exceptionable, {
                path: _path + ".left",
                expected: "ImaginaryIdentifierAst",
                value: input.left
            }), ("object" === typeof input.right && null !== input.right || _report(_exceptionable, {
                path: _path + ".right",
                expected: "ImaginaryIdentifierAst",
                value: input.right
            })) && _vo7(input.right, _path + ".right", true && _exceptionable) || _report(_exceptionable, {
                path: _path + ".right",
                expected: "ImaginaryIdentifierAst",
                value: input.right
            })].every(flag => flag); const _vo7 = (input, _path, _exceptionable = true) => ["identifier" === input.kind || _report(_exceptionable, {
                path: _path + ".kind",
                expected: "\"identifier\"",
                value: input.kind
            }), "string" === typeof input.name || _report(_exceptionable, {
                path: _path + ".name",
                expected: "string",
                value: input.name
            })].every(flag => flag); const __is = input => "object" === typeof input && null !== input && _io0(input); let errors; let _report; return input => {
            if (false === __is(input)) {
                errors = [];
                _report = __typia_transform__validateReport._validateReport(errors);
                ((input, _path, _exceptionable = true) => ("object" === typeof input && null !== input || _report(true, {
                    path: _path + "",
                    expected: "ImaginaryModuleAst",
                    value: input
                })) && _vo0(input, _path + "", true) || _report(true, {
                    path: _path + "",
                    expected: "ImaginaryModuleAst",
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
        }; })()({
            moduleName: "MathOps",
            functions: [
                {
                    name: "add",
                    parameters: [],
                    returnType: {
                        kind: "builtin",
                        name: "Int",
                    },
                    body: {
                        statements: [],
                    },
                },
            ],
            exports: ["add"],
        });
        expect(result.success).toBe(false);
        if (result.success === false) {
            expect(result.errors.some((error) => error.path === "$input.docComment")).toBe(true);
        }
    });
});
