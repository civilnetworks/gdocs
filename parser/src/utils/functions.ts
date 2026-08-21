import { DocBlock } from "../classes/Parser/Tags.ts";

export function error_message(
  path: string,
  line: number | number[],
  message: string,
) {
  const line_string: string = line instanceof Array
    ? create_list(Array.from(new Set(line)).map(String))
    : String(line);

  throw new Error(`(${path}) (line ${line_string}) ${message}`);
}

export function warning_message(
  path: string,
  line: number | number[],
  message: string,
) {
  let line_string: string;
  if (line instanceof Array) {
    line_string = Array.from(new Set(line))
      .map((option, index) => {
        if (index >= line.length - 2) {
          return index == line.length - 2 ? `${option} and ` : option;
        }

        return `${option}, `;
      })
      .join("");
  } else {
    line_string = String(line);
  }

  console.warn(`(${path}) (line ${line_string}) ${message}`);
}

export function get_unique(
  block: DocBlock,
  tag_name: string,
  index = 0,
) {
  return block[tag_name] ? block[tag_name][0].args?.[index] : undefined;
}

export function get_multiple(block: DocBlock, tag_name: string): string[][] {
  return block[tag_name]
    ? block[tag_name].map((tag) => tag.args as string[])
    : [];
}

/* Like get_multiple, but keeps the bracketed modifier alongside the args so
   callers can tell '@tparam[opt]' from '@tparam'. */
export function get_multiple_with_modifier(
  block: DocBlock,
  tag_name: string,
): { args: string[]; modifier?: string }[] {
  return block[tag_name]
    ? block[tag_name].map((tag) => ({
      args: tag.args as string[],
      modifier: tag.modifier,
    }))
    : [];
}

export function create_list(array: string[]) {
  if (array.length === 1) {
    return array[0];
  } else if (array.length > 1) {
    return (
      array.slice(0, -1).join(", ") + " and " + array[array.length - 1]
    );
  }

  return "";
}
