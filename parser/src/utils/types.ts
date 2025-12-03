import Tag from "../classes/Tags/Tag.ts";
import SelectorTag from "../classes/Tags/SelectorTag.ts";
import BooleanTag from "../classes/Tags/BooleanTag.ts";
import AliasTag from "../classes/Tags/AliasTag.ts";
import DescriptionTag from "../classes/Tags/DescriptionTag.ts";
import MultiBlockAliasTag from "../classes/Tags/MultiBlockAliasTag.ts";
import BlockTag from "../classes/Tags/BlockTag.ts";

export type AnyTag = Tag | SelectorTag | BooleanTag | AliasTag | DescriptionTag | MultiBlockAliasTag | BlockTag;
