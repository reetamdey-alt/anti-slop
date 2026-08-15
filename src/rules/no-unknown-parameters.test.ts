import { RuleTester } from "oxlint/plugins-dev";

import { noUnknownParametersRule } from "./no-unknown-parameters.ts";

const tester = new RuleTester({ languageOptions: { parserOptions: { lang: "ts" } } });
const error = { messageId: "unknownParameter" };

if (noUnknownParametersRule.meta?.fixable !== undefined) {
  throw new Error("The rule must not offer an unsafe semantics-changing fix.");
}

tester.run("anti-slop/no-unknown-parameters", noUnknownParametersRule, {
  valid: [
    "function handle(input: string) {}",
    "function handle(cause: unknown) {}",
    "function handle() {}",
    "const fn = (x: number) => x;",
    "function handle(...args: string[]) {}",
    "function handle(input: unknown[]) {}",
    "function handle({ a }: { a: string }) {}",
    "function handle(x: string = 'd') {}",
    "function handle(cause: unknown = null) {}",
  ],
  invalid: [
    {
      name: "function declaration",
      code: "function handle(input: unknown) {}",
      errors: [error],
    },
    {
      name: "arrow function",
      code: "const fn = (input: unknown) => {};",
      errors: [error],
    },
    {
      name: "only the unknown parameter is reported",
      code: "function f(x: string, y: unknown) {}",
      errors: [error],
    },
    {
      name: "cause is exempt but other unknown parameters are not",
      code: "function f(cause: unknown, other: unknown) {}",
      errors: [error],
    },
    {
      name: "interface method signature",
      code: "interface I { m(x: unknown): void; }",
      errors: [error],
    },
    {
      name: "function type",
      code: "type T = (x: unknown) => void;",
      errors: [error],
    },
    {
      name: "call signature",
      code: "type T = { (x: unknown): void; };",
      errors: [error],
    },
    {
      name: "constructor type",
      code: "type T = new (x: unknown) => {};",
      errors: [error],
    },
    {
      name: "construct signature",
      code: "interface I { new (x: unknown): {}; }",
      errors: [error],
    },
    {
      name: "class method",
      code: "class A { m(x: unknown) {} }",
      errors: [error],
    },
    {
      name: "declare function",
      code: "declare function f(x: unknown): void;",
      errors: [error],
    },
    {
      name: "assignment pattern with unknown",
      code: "function f(x: unknown = null) {}",
      errors: [error],
    },
    {
      name: "parameter property with unknown",
      code: "class A { constructor(public x: unknown) {} }",
      errors: [error],
    },
  ],
});
