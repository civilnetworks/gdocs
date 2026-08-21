import { DocBlock } from "../Parser/Tags.ts";
import {
  get_multiple,
  get_multiple_with_modifier,
  get_unique,
} from "../../utils/functions.ts";

export interface FunctionParameters {
  name: string;
  type: string;
  description: string;
  optional?: boolean;
  default?: string;
}

export interface FunctionReturns {
  type: string;
  description: string;
}

export default class FunctionPage {
  readonly item: string;
  readonly parameters?: FunctionParameters[];
  readonly returns?: FunctionReturns[];
  readonly examples?: string[];
  readonly realm?: string;
  readonly internal?: boolean;

  readonly deprecated?: boolean;
  readonly stub?: boolean;

  constructor(
    public readonly name: string,
    public readonly description?: string,
    block: DocBlock = {},
  ) {
    const params: FunctionParameters[] = get_multiple_with_modifier(
      block,
      "tparam",
    ).map(({ args, modifier }) => {
      /* "opt" marks the parameter optional; "opt=5" also gives its default. */
      const optional = modifier !== undefined && /^opt\b/.test(modifier);
      const [, defaultValue] = optional ? modifier!.split(/=(.*)/s) : [];

      return {
        type: args[0],
        name: args[1],
        description: args[2] ?? "",
        optional: optional ? true : undefined,
        default: defaultValue !== undefined && defaultValue !== ""
          ? defaultValue
          : undefined,
      };
    });
    this.parameters = params.length > 0 ? params : undefined;
    const returns: FunctionReturns[] = get_multiple(block, "treturn").map(
      (ret) => ({
        type: ret[0],
        description: ret[1],
      }),
    );
    this.returns = returns.length > 0 ? returns : undefined;
    const examples: string[] = get_multiple(block, "example").map(
      (example) => example[0],
    );
    this.examples = examples.length > 0 ? examples : undefined;
    this.realm = get_unique(block, "realm");
    this.internal = get_unique(block, "internal") === "true" ? true : undefined;
    this.deprecated = get_unique(block, "deprecated") === "true"
      ? true
      : undefined;
    this.stub = get_unique(block, "stub") === "true" ? true : undefined;

    this.item = "function";
  }

  print(level = 0) {
    console.log("    ".repeat(level) + this.name);
  }
}
