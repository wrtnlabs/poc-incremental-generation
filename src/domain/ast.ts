export interface ImaginaryModuleAst {
  moduleName: string;
  functions: ImaginaryFunctionAst[];
  exports: string[];
  docComment: string | null;
}

export interface ImaginaryFunctionAst {
  name: string;
  parameters: ImaginaryParameterAst[];
  returnType: ImaginaryTypeRefAst;
  body: ImaginaryBlockAst;
}

export interface ImaginaryParameterAst {
  name: string;
  type: ImaginaryTypeRefAst;
}

export interface ImaginaryTypeRefAst {
  kind: "builtin" | "named";
  name: string;
}

export interface ImaginaryBlockAst {
  statements: ImaginaryReturnStatementAst[];
}

export interface ImaginaryReturnStatementAst {
  kind: "return";
  expression: ImaginaryBinaryExpressionAst;
}

export interface ImaginaryBinaryExpressionAst {
  kind: "binary";
  operator: "+" | "-" | "*" | "/";
  left: ImaginaryIdentifierAst;
  right: ImaginaryIdentifierAst;
}

export interface ImaginaryIdentifierAst {
  kind: "identifier";
  name: string;
}
