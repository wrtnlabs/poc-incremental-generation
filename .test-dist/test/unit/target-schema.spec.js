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
const __typia_transform__isFormatEmail = __importStar(require("typia/lib/internal/_isFormatEmail"));
const __typia_transform__validateReport = __importStar(require("typia/lib/internal/_validateReport"));
const typia_1 = __importDefault(require("typia"));
describe("OrderDraft schema fixtures", () => {
    it("accepts a fully complete object", () => {
        const result = (() => { const _io0 = input => "object" === typeof input.customer && null !== input.customer && _io1(input.customer) && ("object" === typeof input.shipping && null !== input.shipping && _io2(input.shipping)) && (Array.isArray(input.items) && input.items.every(elem => "object" === typeof elem && null !== elem && _io3(elem))) && (null === input.note || "string" === typeof input.note); const _io1 = input => "string" === typeof input.name && ("string" === typeof input.email && __typia_transform__isFormatEmail._isFormatEmail(input.email)); const _io2 = input => "string" === typeof input.address1 && "string" === typeof input.city && "string" === typeof input.postalCode; const _io3 = input => "string" === typeof input.sku && "number" === typeof input.quantity; const _vo0 = (input, _path, _exceptionable = true) => [("object" === typeof input.customer && null !== input.customer || _report(_exceptionable, {
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
        }; })()({
            customer: {
                name: "Alice",
                email: "alice@example.com",
            },
            shipping: {
                address1: "123 Main St",
                city: "Seoul",
                postalCode: "04524",
            },
            items: [
                {
                    sku: "SKU-001",
                    quantity: 2,
                },
            ],
            note: null,
        });
        expect(result.success).toBe(true);
    });
    it("treats omitted required nullable note as missing", () => {
        const result = (() => { const _io0 = input => "object" === typeof input.customer && null !== input.customer && _io1(input.customer) && ("object" === typeof input.shipping && null !== input.shipping && _io2(input.shipping)) && (Array.isArray(input.items) && input.items.every(elem => "object" === typeof elem && null !== elem && _io3(elem))) && (null === input.note || "string" === typeof input.note); const _io1 = input => "string" === typeof input.name && ("string" === typeof input.email && __typia_transform__isFormatEmail._isFormatEmail(input.email)); const _io2 = input => "string" === typeof input.address1 && "string" === typeof input.city && "string" === typeof input.postalCode; const _io3 = input => "string" === typeof input.sku && "number" === typeof input.quantity; const _vo0 = (input, _path, _exceptionable = true) => [("object" === typeof input.customer && null !== input.customer || _report(_exceptionable, {
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
        }; })()({
            customer: {
                name: "Alice",
                email: "alice@example.com",
            },
            shipping: {
                address1: "123 Main St",
                city: "Seoul",
                postalCode: "04524",
            },
            items: [
                {
                    sku: "SKU-001",
                    quantity: 2,
                },
            ],
        });
        expect(result.success).toBe(false);
        if (result.success === false) {
            expect(result.errors.some((error) => error.path === "$input.note")).toBe(true);
        }
    });
});
