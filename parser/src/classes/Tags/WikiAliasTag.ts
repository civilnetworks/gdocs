import AliasTag from "./AliasTag.ts";

/**
 * A specialized alias tag for wiki pages that extracts both the name
 * (from the first line) and description (from subsequent lines).
 */
export default class WikiAliasTag extends AliasTag {
  constructor() {
    // Use argsCount=1 to extract just the name from the first line
    // The description will be extracted in the convert method
    super("wiki", 1, [], true);
  }

  convert(string: string): string[] {
    // Extract name using parent's process method (only gets first line content)
    const args = super.process(string);
    const name = args[0] || "";

    // Extract description from content after the first line
    // The string is in format: "@wiki Name\nDescription line 1\nDescription line 2..."
    const lines = string.split(/[\n\r\u2028\u2029]/);
    const descriptionLines = lines.slice(1).filter(line => {
      // Trim the line and skip empty lines at the beginning
      const trimmed = line.trim();
      return trimmed.length > 0;
    });
    const description = descriptionLines.join("\n").trim();

    const result = [`@category wikis`, `@name ${name}`];
    if (description) {
      // Don't prefix with @description - the tags_re will capture unprefixed
      // content as description, and DescriptionTag will process it correctly
      result.push(description);
    }
    return result;
  }
}
