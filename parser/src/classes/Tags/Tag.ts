import { escape_regex } from "../../utils/regex.ts";

// Pattern for capturing the rest of the line including multiline content (used with s flag for rich tags)
const restRe = "(?: |\\t)+(.+)$";
const optionalRestRe = "(?:(?: |\\t)+(.+))?$";
// Pattern for capturing only single-line content (does not match newlines)
const restReSingleLine = "(?: |\\t)+([^\\n\\r\\u2028\\u2029]+)";
const optionalRestReSingleLine = "(?:(?: |\\t)+([^\\n\\r\\u2028\\u2029]+))?";
const middleArgRe =
  "(?:(?:(?: |\\t)+\"((?:[^\\\\]|\\\\.)*?)\")|(?:(?: |\\t)+'((?:[^\\\\]|\\\\.)*?)')|(?: |\\t)+([^ \\t]+))";
export default class Tag {
  readonly re: RegExp;

  constructor(
    public readonly name: string,
    public readonly argsCount: number,
    public readonly unique: boolean = true,
    public readonly an_alias: boolean = false,
    public readonly rich: boolean = false,
    public readonly optionalLastArg: boolean = false,
  ) {
    const tagRe = `^(?: |\\t)*@${escape_regex(name)}`;
    // Use single-line patterns for non-rich tags to prevent capturing multiline content as the argument
    const useRestRe = rich ? restRe : restReSingleLine;
    const useOptionalRestRe = rich ? optionalRestRe : optionalRestReSingleLine;
    if (argsCount == 0) {
      this.re = RegExp(tagRe + "$", "s");
    } else if (argsCount == 1) {
      this.re = RegExp(tagRe + (optionalLastArg ? useOptionalRestRe : useRestRe), "s");
    } else {
      this.re = RegExp(
        tagRe + middleArgRe.repeat(argsCount - 1) + (optionalLastArg ? useOptionalRestRe : useRestRe),
        "s",
      );
    }
  }

  process(string: string): string[] {
    const match = string.match(this.re);

    if (!match) {
      const requiredArgs = this.optionalLastArg ? this.argsCount - 1 : this.argsCount;
      throw (
        `The '@${this.name}' tag requires ${this.optionalLastArg ? 'at least ' : ''}${requiredArgs} ` +
        `argument(s).`
      );
    }

    return match.filter((match, index) => {
      return match !== undefined && index > 0;
    });
  }
}
