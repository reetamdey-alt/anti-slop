import { RuleTester } from "oxlint/plugins-dev";

import { noChainedTypeAssertionsRule } from "./no-chained-type-assertions.ts";

const tester = new RuleTester({ languageOptions: { parserOptions: { lang: "ts" } } });
const error = { messageId: "chained" };

if (noChainedTypeAssertionsRule.meta?.fixable !== undefined) {
  throw new Error("The rule must not offer an unsafe semantics-changing fix.");
}

tester.run("anti-slop/no-chained-type-assertions", noChainedTypeAssertionsRule, {
  valid: [
    "const user = input;",
    "const user = input as User;",
    "const user = input as const;",
    "const user = input as const as const;",
    "const user = (input as Foo);",
    "const value = typeof input === 'string' ? (input as String) : (input as Number);",
  ],
  invalid: [
    {
      name: "as-as chain",
      code: "const user = input as object as User;",
      errors: [error],
    },
    {
      name: "parenthesized chain",
      code: "const user = (input as Foo) as Bar;",
      errors: [error],
    },
    {
      name: "chain ending in const still has a non-const assertion",
      code: "const user = input as Foo as const;",
      errors: [error],
    },
    {
      name: "angle-bracket chain",
      code: "const user = <User>(<object>input);",
      errors: [error],
    },
    {
      name: "nested parentheses around inner assertion",
      code: "const user = ((input as Foo)) as Bar;",
      errors: [error],
    },
  ],
});
