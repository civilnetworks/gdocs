import { DocBlock, TagInfo } from "../Parser/Tags.ts";
import { get_unique } from "../../utils/functions.ts";

export interface WikiContent {
  type: "header" | "text" | "code" | "br";
  content: string;
}

export default class WikiPage {
  readonly item: "wiki";
  readonly content: WikiContent[];
  readonly realm?: string;
  readonly internal?: boolean;
  readonly deprecated?: boolean;

  constructor(
    public readonly name: string,
    public readonly description?: string,
    block: DocBlock = {},
  ) {
    // Collect all content items with their line numbers for ordering
    const contentItems: { line: number; type: WikiContent["type"]; content: string }[] = [];

    // Process headers
    if (block["header"]) {
      block["header"].forEach((tag: TagInfo) => {
        contentItems.push({
          line: tag.line,
          type: "header",
          content: tag.args?.[0] ?? "",
        });
      });
    }

    // Process text blocks
    if (block["text"]) {
      block["text"].forEach((tag: TagInfo) => {
        contentItems.push({
          line: tag.line,
          type: "text",
          content: tag.args?.[0] ?? "",
        });
      });
    }

    // Process code blocks
    if (block["code"]) {
      block["code"].forEach((tag: TagInfo) => {
        contentItems.push({
          line: tag.line,
          type: "code",
          content: tag.args?.[0] ?? "",
        });
      });
    }

    // Process br (break) tags
    if (block["br"]) {
      block["br"].forEach((tag: TagInfo) => {
        contentItems.push({
          line: tag.line,
          type: "br",
          content: "",
        });
      });
    }

    // Sort by line number to preserve original order
    contentItems.sort((a, b) => a.line - b.line);

    // Convert to WikiContent format
    this.content = contentItems.map(({ type, content }) => ({ type, content }));
    this.realm = get_unique(block, "realm");
    this.internal = get_unique(block, "internal") === "true" ? true : undefined;
    this.deprecated = get_unique(block, "deprecated") === "true"
      ? true
      : undefined;

    this.item = "wiki";
  }

  print(level = 0) {
    console.log("    ".repeat(level) + this.name);
  }
}
