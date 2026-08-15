import { RuleTester } from "oxlint/plugins-dev";

import { noForbiddenTermInSymbolNamesRule } from "./no-shape-in-symbol-names.ts";

const tsTester = new RuleTester({ languageOptions: { parserOptions: { lang: "ts" } } });
const tsxTester = new RuleTester({ languageOptions: { parserOptions: { lang: "tsx" } } });
const error = { messageId: "forbiddenSymbolName" };

if (noForbiddenTermInSymbolNamesRule.meta?.fixable !== undefined) {
  throw new Error("The rule must not offer an unsafe semantics-changing fix.");
}

tsTester.run("anti-slop/no-shape-in-symbol-names", noForbiddenTermInSymbolNamesRule, {
  valid: [
    "const value = 1;",
    "const sharp = 1;",
    "interface User { id: string; }",
    "function compute(total: number) { return total; }",
    "const record = { id: 'x' };",
    "class Service { connect() {} }",
  ],
  invalid: [
    {
      name: "interface name containing shape",
      code: "interface UserShape { id: string; }",
      errors: [error],
    },
    {
      name: "variable named shape",
      code: "const shape = 1;",
      errors: [error],
    },
    {
      name: "function name containing shape",
      code: "function getShape() {}",
      errors: [error],
    },
    {
      name: "class named Shape",
      code: "class Shape {}",
      errors: [error],
    },
    {
      name: "case-insensitive match",
      code: "const ShApE = 1;",
      errors: [error],
    },
    {
      name: "substring match in a longer name",
      code: "const reshaped = 1;",
      errors: [error],
    },
    {
      name: "private identifier",
      code: "class A { #shape = 1; }",
      errors: [error],
    },
    {
      name: "member expression property",
      code: "const value = obj.shape;",
      errors: [error],
    },
  ],
});

tsxTester.run("anti-slop/no-shape-in-symbol-names (jsx)", noForbiddenTermInSymbolNamesRule, {
  valid: ["const el = <Profile />;"],
  invalid: [
    {
      name: "jsx element name",
      code: "const el = <Shape />;",
      errors: [error],
    },
  ],
});
