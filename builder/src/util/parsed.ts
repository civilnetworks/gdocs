import {
  mdiBook,
  mdiBookshelf,
  mdiCodeBraces,
  mdiCursorDefault,
  mdiDatabase,
  mdiFormatListNumbered,
  mdiHook,
  mdiViewQuilt,
  mdiFileDocument,
} from "@mdi/js";
import * as mdiIcons from "@mdi/js";

export interface FunctionParameters {
  name: string;
  type: string;
  description: string;
}

export interface FunctionReturns {
  type: string;
  description: string;
}

export interface FunctionPage {
  name: string;
  description?: string;
  parameters?: FunctionParameters[];
  returns?: FunctionReturns[];
  examples?: string[];
  realm?: string;
  internal?: boolean;
  deprecated?: boolean;
  stub?: boolean;
  item: "function";
}

export interface FieldInfo {
  type: string;
  key: string;
  description: string;
}

export interface TablePage {
  name: string;
  description?: string;
  fields?: FieldInfo[];
  realm?: string;
  internal?: boolean;
  deprecated?: boolean;
  stub?: boolean;
  item: "table";
}

export interface WikiContent {
  type: "header" | "text" | "code" | "br";
  content: string;
}

export interface WikiPage {
  name: string;
  description?: string;
  content: WikiContent[];
  realm?: string;
  internal?: boolean;
  deprecated?: boolean;
  item: "wiki";
}

export interface Category {
  name: string;
  description?: string;
  fields?: FieldInfo[];
  subcategories: {
    [key: string]: ValidSubcategory;
  };
  internal?: boolean;
  deprecated?: boolean;
  stub?: boolean;
  item: "category";
}

export type ValidSubcategory = Category | FunctionPage | TablePage | WikiPage;

export interface ProjectStructure {
  [key: string]: Category;
}

/**************************************************************************** */

const parsed = require("../parsed.json");
export const project: ProjectStructure = parsed.structure;
export const category_types: string[] = parsed.category_types;
export const title: string = parsed.title;
const extraIcons: {
  [key: string]: string;
} = parsed.icons;

export const icons: {
  [key: string]: string;
} = {
  globals: mdiCodeBraces,
  classes: mdiBook,
  libraries: mdiBookshelf,
  hooks: mdiHook,
  panels: mdiViewQuilt,
  enums: mdiFormatListNumbered,
  structs: mdiDatabase,
  wikis: mdiFileDocument,
  default: mdiCursorDefault,
};

console.log(mdiIcons);

Object.entries(extraIcons).forEach(([tab, icon]: string[]) => {
  const key = tab.toLocaleLowerCase();

  // @ts-ignore
  icons[key] = mdiIcons[icon] !== undefined ? mdiIcons[icon] : mdiCursorDefault;
});
