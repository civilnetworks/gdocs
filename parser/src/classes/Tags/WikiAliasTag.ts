import AliasTag from "./AliasTag.ts";

/**
 * A specialized alias tag for wiki pages that extracts both the name
 * (from the first line) and description (from subsequent lines).
 */
export default class WikiAliasTag extends AliasTag {
  constructor() {
    // Use argsCount=1 to extract just the name from the first line
    // The description will be extracted in the convert method
    // unique=true means only one @wiki tag per block is allowed
    super("wiki", /* argsCount */ 1, /* callback */ [], /* unique */ true);
  }

  convert(string: string): string[] {
    // Extract name using parent's process method (only gets first line content)
    const args = super.process(string);
    const name = args[0] || "";

    // Extract description from content after the first line
    // The string is in format: "@wiki Name\nDescription line 1\nDescription line 2..."
    const lines = string.split(/[\n\r\u2028\u2029]/);
    // Filter out all empty lines from the description
    const descriptionLines = lines.slice(1).filter(line => {
      const trimmed = line.trim();
      return trimmed.length > 0;
    });
    const description = descriptionLines.join("\n").trim();

    const result = [`@category wikis`, `@name ${name}`];
    if (description) {
      // Output description without @description prefix - the parser's tags_re regex
      // will capture unprefixed content and process it as a description tag
      result.push(description);
    }
    return result;
  }
}
