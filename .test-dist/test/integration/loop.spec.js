"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const runAstCompletionLoop_1 = require("../../src/loop/runAstCompletionLoop");
describe("runAstCompletionLoop", () => {
    it("converges across multiple partial patches", () => {
        const result = (0, runAstCompletionLoop_1.runAstCompletionLoop)([
            '{"ast":{"moduleName":"MathOps"}}',
            '{"ast":{"functions":[{"name":"add","parameters":[{"name":"left","type":{"kind":"builtin","name":"Int"}},{"name":"right","type":{"kind":"builtin","name":"Int"}}],"returnType":{"kind":"builtin","name":"Int"}}]}}',
            '{"ast":{"functions":[{"name":"add","parameters":[{"name":"left","type":{"kind":"builtin","name":"Int"}},{"name":"right","type":{"kind":"builtin","name":"Int"}}],"returnType":{"kind":"builtin","name":"Int"},"body":{"statements":[{"kind":"return","expression":{"kind":"binary","operator":"+","left":{"kind":"identifier","name":"left"},"right":{"kind":"identifier","name":"right"}}}]}}],"exports":["add"],"docComment":null}}',
        ]);
        expect(result.terminal).toBe("success");
        if (result.terminal === "success") {
            expect(result.value.functions[0].name).toBe("add");
            expect(result.value.functions[0].body.statements[0].expression.operator).toBe("+");
        }
    });
    it("stops with retry_exhausted when the sequence never completes", () => {
        const result = (0, runAstCompletionLoop_1.runAstCompletionLoop)([
            '{"ast":{"moduleName":"MathOps"}}',
            '{"ast":{"moduleName":"MathOpsRenamed"}}',
        ]);
        expect(result.terminal).toBe("retry_exhausted");
        if (result.terminal === "retry_exhausted") {
            expect(result.candidate).toEqual({
                moduleName: "MathOpsRenamed",
            });
        }
    });
});
