import { runAstCompletionLoop } from "../../src/loop/runAstCompletionLoop";

describe("runAstCompletionLoop", () => {
  it("converges across multiple partial patches", () => {
    const result = runAstCompletionLoop([
      '{"ast":{"moduleName":"MathOps"}}',
      '{"ast":{"functions":[{"name":"add","parameters":[{"name":"left","type":{"kind":"builtin","name":"Int"}},{"name":"right","type":{"kind":"builtin","name":"Int"}}],"returnType":{"kind":"builtin","name":"Int"}},{"name":"scaleAndShift","parameters":[{"name":"value","type":{"kind":"builtin","name":"Int"}},{"name":"factor","type":{"kind":"builtin","name":"Int"}},{"name":"offset","type":{"kind":"builtin","name":"Int"}}],"returnType":{"kind":"builtin","name":"Int"}},{"name":"compute","parameters":[],"returnType":{"kind":"builtin","name":"Int"}}]}}',
      '{"ast":{"functions":[{"name":"add","parameters":[{"name":"left","type":{"kind":"builtin","name":"Int"}},{"name":"right","type":{"kind":"builtin","name":"Int"}}],"returnType":{"kind":"builtin","name":"Int"},"body":{"statements":[{"kind":"return","expression":{"kind":"binary","operator":"+","left":{"kind":"identifier","name":"left"},"right":{"kind":"identifier","name":"right"}}}]}},{"name":"scaleAndShift","parameters":[{"name":"value","type":{"kind":"builtin","name":"Int"}},{"name":"factor","type":{"kind":"builtin","name":"Int"}},{"name":"offset","type":{"kind":"builtin","name":"Int"}}],"returnType":{"kind":"builtin","name":"Int"},"body":{"statements":[{"kind":"return","expression":{"kind":"binary","operator":"+","left":{"kind":"binary","operator":"*","left":{"kind":"identifier","name":"value"},"right":{"kind":"identifier","name":"factor"}},"right":{"kind":"identifier","name":"offset"}}}]}},{"name":"compute","parameters":[],"returnType":{"kind":"builtin","name":"Int"},"body":{"statements":[{"kind":"return","expression":{"kind":"call","callee":"scaleAndShift","arguments":[{"kind":"call","callee":"add","arguments":[{"kind":"literal","value":1},{"kind":"literal","value":2}]},{"kind":"literal","value":3},{"kind":"literal","value":4}]}}]}}],"exports":["add","scaleAndShift","compute"],"docComment":null}}',
    ]);
    expect(result.terminal).toBe("success");
    if (result.terminal === "success") {
      expect(result.value.functions).toHaveLength(3);
      expect(result.value.functions[2].body.statements[0].expression.kind).toBe("call");
    }
  });

  it("stops with retry_exhausted when the sequence never completes", () => {
    const result = runAstCompletionLoop([
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
