import Tag from "./Tag.ts";

type MultiBlockAliasCallback = (args: string[]) => string[][];

export default class MultiBlockAliasTag extends Tag {
  constructor(
    name: string,
    argsCount: number,
    public readonly callback: MultiBlockAliasCallback,
    unique: boolean = true,
  ) {
    super(name, argsCount, unique, true);
  }

  convert(string: string): string[][] {
    const args = super.process(string);
    return this.callback(args);
  }
}
