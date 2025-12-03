import Tag from "./Tag.ts";

type MultiBlockAliasCallback = (args: string[]) => string[][];

/**
 * A tag that converts a single documentation comment into multiple documentation blocks.
 * Unlike AliasTag which converts to tags within the same block, MultiBlockAliasTag
 * creates separate documentation blocks for each entry in the returned array.
 */
export default class MultiBlockAliasTag extends Tag {
  constructor(
    name: string,
    argsCount: number,
    public readonly callback: MultiBlockAliasCallback,
    unique: boolean = true,
  ) {
    // Pass true for an_alias parameter to mark this tag as an alias type
    super(name, argsCount, unique, /* an_alias */ true);
  }

  /**
   * Converts the tag string into multiple sets of tags.
   * @param string The raw tag string to convert
   * @returns An array of string arrays, where each inner array contains the tags
   *          for a new documentation block. For example, the @accessor tag returns
   *          two inner arrays: one for the getter and one for the setter.
   */
  convert(string: string): string[][] {
    const args = super.process(string);
    return this.callback(args);
  }
}
