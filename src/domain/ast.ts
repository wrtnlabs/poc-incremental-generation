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
  statements: ImaginaryStatementAst[];
}

export type ImaginaryStatementAst =
  | ImaginaryReturnStatementAst
  | ImaginaryLetStatementAst
  | ImaginaryAssignmentStatementAst
  | ImaginaryIfStatementAst
  | ImaginaryWhileStatementAst;

export interface ImaginaryReturnStatementAst {
  kind: "return";
  expression: ImaginaryExpressionAst;
}

export interface ImaginaryAssignmentStatementAst {
  kind: "assignment";
  target: ImaginaryAssignableAst;
  expression: ImaginaryExpressionAst;
}

export interface ImaginaryLetStatementAst {
  kind: "let";
  name: string;
  expression: ImaginaryExpressionAst;
}

export interface ImaginaryIfStatementAst {
  kind: "if";
  condition: ImaginaryExpressionAst;
  then: ImaginaryBlockAst;
  else: ImaginaryBlockAst;
}

export interface ImaginaryWhileStatementAst {
  kind: "while";
  condition: ImaginaryExpressionAst;
  body: ImaginaryBlockAst;
}

export type ImaginaryExpressionAst =
  | ImaginaryArrayLiteralAst
   | ImaginaryBinaryExpressionAst
   | ImaginaryCallExpressionAst
   | ImaginaryIdentifierAst
   | ImaginaryLiteralAst
  | ImaginaryObjectLiteralAst
  | ImaginaryPropertyAccessAst;

export type ImaginaryAssignableAst =
  | ImaginaryIdentifierAst
  | ImaginaryPropertyAccessAst;

export interface ImaginaryBinaryExpressionAst {
  kind: "binary";
  operator: "+" | "-" | "*" | "/" | ">" | "<" | ">=" | "<=" | "==";
  left: ImaginaryExpressionAst;
  right: ImaginaryExpressionAst;
}

export interface ImaginaryCallExpressionAst {
  kind: "call";
  callee: string;
  arguments: ImaginaryExpressionAst[];
}

export interface ImaginaryIdentifierAst {
  kind: "identifier";
  name: string;
}

export interface ImaginaryPropertyAccessAst {
  kind: "propertyAccess";
  target: ImaginaryIdentifierAst | ImaginaryPropertyAccessAst;
  property: string;
}

export interface ImaginaryObjectLiteralAst {
  kind: "objectLiteral";
  properties: ImaginaryObjectPropertyAst[];
}

export interface ImaginaryObjectPropertyAst {
  key: string;
  value: ImaginaryExpressionAst;
}

export interface ImaginaryArrayLiteralAst {
  kind: "arrayLiteral";
  elements: ImaginaryExpressionAst[];
}

export interface ImaginaryLiteralAst {
  kind: "literal";
  value: number;
}
