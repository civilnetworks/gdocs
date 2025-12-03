import Tag from "./Tag.ts";

/**
 * A tag that captures all content between two matching tag markers.
 * For example, @code ... @code captures everything between the two @code tags.
 * The captured content is returned as a single argument.
 */
export default class BlockTag extends Tag {
  constructor(
    name: string,
    unique: boolean = true,
    rich: boolean = true,
  ) {
    // 1 argument for the captured content, but the tag itself has 0 required args in source
    super(name, 1, unique, /* an_alias */ false, rich);
  }

  /**
   * Process the captured content string.
   * @param string The captured content between the two tag markers
   * @returns An array containing the processed content
   */
  process(string: string): string[] {
    // The string passed here should already be the captured content
    // wrapped as "@tagname content", so we use the parent's process
    return super.process(string);
  }
}
