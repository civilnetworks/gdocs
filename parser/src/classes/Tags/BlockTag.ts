import Tag from "./Tag.ts";

/**
 * A tag that captures all content between two matching tag markers.
 * For example, @code ... @code captures everything between the two @code tags.
 * The captured content is returned as a single argument.
 *
 * During preprocessing in Tags.ts, paired markers like:
 *   @code
 *   content here
 *   @code
 * are converted to a single tag: @code content here
 *
 * This allows the standard Tag.process() method to extract the content.
 */
export default class BlockTag extends Tag {
  constructor(
    name: string,
    unique: boolean = true,
    rich: boolean = true,
  ) {
    // argsCount: 1 for the captured content (after preprocessing)
    // unique: whether only one instance is allowed per block
    // an_alias: false - this is not an alias tag
    // rich: preserve formatting in the content
    const isAlias = false;
    super(name, 1, unique, isAlias, rich);
  }

  /**
   * Process the captured content string.
   *
   * The preprocessing step in Tags.ts converts paired markers (@code...@code)
   * into a single tag format: "@tagname captured_content". This method then
   * uses the parent Tag.process() to extract the content as the tag's argument.
   *
   * @param string The preprocessed tag string in format "@tagname content"
   * @returns An array containing the captured content as the first element
   */
  process(string: string): string[] {
    return super.process(string);
  }
}
