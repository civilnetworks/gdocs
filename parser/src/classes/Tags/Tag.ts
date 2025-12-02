import { escape_regex } from "../../utils/regex.ts";

const restRe = "(?: |\\t)+(.+)$";
const optionalRestRe = "(?:(?: |\\t)+(.+))?$";
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
    if (argsCount == 0) {
      this.re = RegExp(tagRe + "$", "s");
    } else if (argsCount == 1) {
      this.re = RegExp(tagRe + (optionalLastArg ? optionalRestRe : restRe), "s");
    } else {
      this.re = RegExp(
        tagRe + middleArgRe.repeat(argsCount - 1) + (optionalLastArg ? optionalRestRe : restRe),
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
