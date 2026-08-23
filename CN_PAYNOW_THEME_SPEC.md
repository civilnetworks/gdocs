# Civil Networks theme for gdocs

Status: Implemented — Revision 2  
Target: `docs/` Svelte application  
Brand source of truth: `G:\Claude\paynow\paynow-theme-cn` and `F:\CN_Branding\logos`  
Layout reference: `https://wiki.facepunch.com/gmod/`  
Last reviewed: 2026-08-23

## 1. Objective

Update the gdocs web UI so it clearly belongs to the same Civil Networks product family as the CN PayNow storefront, while using the Garry's Mod Wiki as the reference for documentation density, navigation structure, API layout, and realm presentation.

The result is a hybrid: GMod Wiki information architecture with restrained CN PayNow branding. It should use:

- a stable charcoal page foundation;
- flat charcoal and slate surfaces with clear one-pixel separation;
- CN red for selected, actionable, or important emphasis;
- high-contrast near-white text;
- compact Inter typography;
- fine neutral borders and short functional motion;
- the approved Civil Networks wordmark and compact mark;
- compact controls, square-to-small radii, and no decorative glow, grid, floating-card, or glass-heavy treatment.

This is a theme and shell update. It must not turn the documentation UI into a storefront or introduce server, account, cart, product-card, or checkout concepts.

## 2. Source-of-truth decisions

The approved base tokens come from the CN PayNow theme's Phase 1 foundation and inline theme variables:

| Token | Value | gdocs use |
| --- | --- | --- |
| `--cn-red` | `#FF2B2B` | Active indicators, primary controls, focus rings, angular motifs |
| `--cn-black` | `#1F2125` | Page foundation |
| `--cn-slate` | `#343946` | Raised navigation and content surfaces |
| `--cn-slate-dark` | `#303134` | Recessed controls and secondary surfaces |
| `--cn-highlight` | `#ECF0F3` | Primary text and high-contrast icons |
| `--cn-text-muted` | `#AEB4BF` | Secondary copy and inactive navigation |

PayNow also establishes the following reusable rules:

- Inter is the UI typeface, with a system sans-serif fallback.
- Translucency is limited to the modal backdrop. Header, navigation, search, and reading surfaces are opaque.
- Ordinary reading surfaces remain opaque enough to preserve contrast.
- Typical radii are small, approximately 2–7 px.
- Borders use low-opacity neutral highlights. Red is not a default border colour.
- Hover states change colour/surface without translating controls.
- Keyboard focus uses a 2 px red outline with a 3 px offset.
- Reduced-motion preferences disable non-essential animation.

CN red has only a 4.32:1 contrast ratio on `--cn-black`, and less on the raised slate surfaces. It therefore must not be used for normal-sized unbolded text. Links should use highlighted text with a red underline or indicator; red text is reserved for large/bold labels, icons, or cases that also have another non-colour cue.

## 3. Current-state audit

The production UI is the Svelte app in `docs/`. The React app under `builder/` is legacy and is out of scope.

The current Svelte UI has:

- a 300 px single-column documentation index with all top-level groups visible and the active group expanded inline;
- a centred document column capped at 900 px;
- a dark palette made from 17 near-duplicate background tokens;
- light blue headings, links, selected states, and argument markers;
- a compact documentation home with reference-section counts;
- a compact modal search surface opened from the header, index, or keyboard;
- desktop navigation that becomes an overlay panel below 1000 px.

Specific issues to resolve during the theme update:

- `docs/src/styles/themes/light.css` is empty and the app is effectively dark-only.
- `SearchPane.svelte` refers to undefined `--sk-back-3` and `--sk-text-1` variables.
- `--codeBlocks-function` is currently an invalid short hex value (`#9b59b`).
- `index.html` and `App.svelte` publish different legacy theme colours.
- Inter is named in the font stack but is not packaged or loaded.
- repeated component-local shadows, transitions, and colour values make the present theme difficult to keep consistent.
- the home page and error/not-found views do not use the same content surface or hierarchy as documentation pages.

## 4. Scope

### 4.1 In scope

- A semantic CN design-token layer for colour, type, spacing, radius, elevation, motion, and layout.
- A shared desktop/mobile application header derived from the PayNow shell.
- Restyling and responsive refinement of the single-column index, search dialog, content pages, tables, code, function signatures, status badges, home, loading, error, and not-found states.
- A discoverable search control and keyboard shortcut while retaining the existing search algorithm and route behaviour.
- Accessibility work directly related to the theme: contrast, focus visibility, touch targets, semantic state cues, and reduced motion.
- Updating favicon mask colour and browser theme metadata to the CN palette.
- Visual and functional regression coverage at representative viewport sizes.

### 4.2 Out of scope

- Changes to `parsed.json`, parser tags, category types, or route URL structure.
- Search ranking or indexing changes.
- A light theme or automatic light/dark switching.
- PayNow account, cart, server selector, hero imagery, product cards, or commerce actions.
- Restyling the legacy React app under `builder/`.
- Replacing Prism, Marked, Svelte, or the SPA router.
- Introducing runtime font, icon, or image dependencies on the PayNow deployment.

## 5. Target experience

### 5.1 Application shell

Add a compact fixed CN header above a GMod Wiki-style documentation workspace.

Desktop header:

- 56 px high with an opaque charcoal surface and a one-pixel neutral divider.
- Left: approved full Civil Networks wordmark, neutral divider, and the dynamic project title from `parsed.json`.
- For the CNUI deployment, the product title is **CNUI Documentation**; do not use “CNUI Developer Reference.”
- Right: a compact labelled Search control with `Ctrl K`/`Cmd K` hint. No account, cart, or server selector.
- The project title must truncate safely rather than change the header height.

Desktop workspace below the header:

- Use one persistent 300 px index, matching the GMod Wiki's “all groups visible, active group expanded” model.
- Each top-level group shows its name and direct-child count; the active group reveals compact category and page links inline.
- The index uses an opaque dark surface, 13 px navigation text, one-pixel separators, and a compact search field at the top.
- Document canvas is flat `--cn-black` with no radial wash, decorative background, floating card, or large shadow.
- Main reading column is at most 1120 px with 32–56 px desktop padding and no surrounding card border.

Mobile/tablet shell at 900 px and below:

- Header reduces to 54 px.
- The same single-column documentation index moves into a left drawer, opened by the header menu button.
- The drawer is opaque, traps focus while open, and preserves group counts and active expansion.
- Selecting a route closes the drawer and returns focus to the menu control.
- Search becomes an icon control but retains an accessible name.
- The document content uses 16 px side padding and no viewport-width horizontal overflow.

No permanent mobile rail consumes horizontal space.

### 5.2 Navigation

- Inactive items use muted text and neutral icons.
- Hover uses a quiet highlight wash, not a solid red background.
- The selected top-level category uses a slim red marker, highlighted text, and a quiet neutral surface.
- The selected nested item uses highlighted text, a 2 px red left marker, and `aria-current="page"`.
- Function/table entries with realm metadata show a compact labelled `SV`, `CL`, or `SH` indicator beside the entry; colour is supplementary and never the only cue.
- Expand/collapse chevrons rotate over 180 ms. Their state remains available through `aria-expanded`.
- Internal names beginning with `_` remain visually subdued but still meet minimum contrast.
- Status badges retain text/letter labels so status never relies on colour alone.

### 5.3 Home page

Use a compact documentation landing state built from existing data:

- approved CN compact mark;
- small uppercase eyebrow: `Civil Networks documentation`;
- the dynamic project title as the primary heading;
- short guidance: `Choose a section from the navigation or search the documentation.`;
- a primary Search button and, on desktop, its keyboard shortcut;
- a compact two-column reference-section list showing category names and direct-child counts.

Do not add hero imagery, decorative grids, floating cards, product/server imagery, oversized typography, or hard-coded categories. The home view must remain useful for any valid `parsed.json` structure.

### 5.4 Documentation content

Typography:

- Package Inter locally as WOFF2 if licensing/source is available; otherwise use `Inter, system-ui, sans-serif` without adding a remote request.
- Base reading text: 15 px, approximately 1.58 line height.
- Page title: 28–34 px, weight 700–760, left aligned.
- Section headings: approximately 21 px, weight 700, with a slim red vertical marker and neutral divider.
- Eyebrows and small labels: uppercase, 700–800 weight, wider tracking.
- Code: retain the system monospace stack at approximately 13.5 px.

Content rules:

- Normal links use an accessible bright CN-red text token, weight 600–700, and no persistent underline, matching the GMod Wiki convention that link text itself carries the accent. Hover uses a lighter red; focus remains independently outlined.
- Paragraph width remains governed by the 1120 px content column; no additional narrow prose column is needed for API signatures and tables.
- Markdown blockquotes, lists, inline code, horizontal rules, and headings must receive explicit styles so arbitrary wiki content does not fall back to browser defaults.
- Long URLs, identifiers, signatures, tables, and preformatted blocks scroll or wrap within the content surface rather than expanding the page.

### 5.5 Code and function signatures

- Code panels use a deep opaque surface such as `#181A1F`, a neutral border, and 3 px radius without decorative shadow.
- Preserve semantic syntax colours; do not recolour every token red. Adjust only colours that fail contrast on the new code surface.
- Function signatures use the same panel treatment as fenced code and must remain horizontally scrollable on narrow screens.
- Client, server, and shared realm markers use the GMod Wiki's compact colour-square convention plus an explicit uppercase text label. Shared uses a split client/server square.
- Argument/return indices use compact numbered red chips, followed by type, name, optional/default metadata, and description in a flat divided row.
- Optional/default chips use neutral borders and muted copy, with a minimum 24 px height.

### 5.6 Tables and API lists

- Header/primary rows use the raised slate surface; alternate rows use a quiet neutral tint.
- Replace 3 px background-coloured cell gaps with 1 px neutral dividers.
- Use 9–11 px cell padding and visible row hover only where the row is interactive.
- At narrow widths, tables scroll inside a labelled container. Do not collapse API tables into ambiguous card stacks.
- Function lists use flat divided rows; do not create a card for every function.

### 5.7 Search

Retain current search matching, scoring, result limits, and route generation.

Presentation and interaction changes:

- Open from the header Search control, the navigation Search item, `Ctrl K`/`Cmd K`, or the existing double-Shift shortcut.
- Search dialog uses a plain dark backdrop and an opaque 600 px panel with 5 px radius and neutral border.
- Give the dialog an explicit heading, search icon, labelled close button, and result count/status text.
- Keep focus trapped; Escape closes it; closing returns focus to the trigger.
- Highlight matched text with a high-contrast neutral/red treatment that remains legible.
- Show an initial hint, a no-results state, and a bounded results list.
- On mobile the dialog becomes a near-full-screen sheet with 16 px outer spacing.

### 5.8 Loading, failure, and not-found states

- Add a visible initial loading state instead of rendering an empty workspace while `parsed.json` is fetched.
- Loading should use a static or reduced-motion-safe CN signal mark and `Loading documentation…` text.
- Fetch failure appears in the shared content surface, with a concise title, the requested bundle name, and the technical message in a code panel.
- Both current not-found implementations should share one component/style and offer a route back to Home.
- Error red is not the same thing as brand emphasis: include an icon/title and plain-language copy, not colour alone.

## 6. Token architecture

Replace the numbered background ladder with semantic tokens. Component code should consume role-based tokens rather than raw palette values.

Suggested token contract:

```css
:root {
  color-scheme: dark;

  --cn-red: #ff2b2b;
  --cn-red-hover: #ff4545;
  --cn-black: #1f2125;
  --cn-slate: #343946;
  --cn-slate-dark: #303134;
  --cn-highlight: #ecf0f3;
  --cn-text-muted: #aeb4bf;

  --surface-page: var(--cn-black);
  --surface-header: #17191d;
  --surface-rail: #202329;
  --surface-navigation: #25282e;
  --surface-content: #24272d;
  --surface-raised: #2c3038;
  --surface-recessed: #181a1f;
  --surface-hover: rgba(236, 240, 243, 0.055);
  --surface-selected: rgba(255, 43, 43, 0.095);
  --surface-overlay: rgba(5, 6, 8, 0.78);

  --text-primary: var(--cn-highlight);
  --text-secondary: #c5cbd4;
  --text-muted: var(--cn-text-muted);
  --border-subtle: rgba(236, 240, 243, 0.10);
  --border-strong: rgba(236, 240, 243, 0.16);
  --focus-ring: var(--cn-red);
  --link-color: #ff6b6b;
  --link-hover: #ff8a8a;

  --radius-sm: 3px;
  --radius-md: 5px;
  --radius-lg: 7px;
  --shadow-raised: 0 1px 2px rgba(0, 0, 0, 0.16);
  --motion-fast: 180ms;
  --motion-standard: 220ms;
  --header-height: 56px;
  --header-height-mobile: 54px;
  --navigation-width: 300px;
  --content-width: 1120px;
}
```

Exact alpha values may be tuned during visual QA, but the five approved brand colours must remain unchanged. Derived surfaces must remain neutral and red must stay semantic.

Keep dedicated functional tokens for syntax highlighting, realm markers, and internal/stub/deprecated states. These are information semantics, not brand accents.

## 7. Component and file plan

| File/area | Required change |
| --- | --- |
| `docs/src/styles/themes/dark.css` | Replace numbered palette with the semantic CN token contract; retain temporary aliases only if needed during migration |
| `docs/src/styles/global.css` | Add body background treatment, locally available font faces, focus rules, reduced motion, selection, scrollbar, and global Markdown defaults |
| `docs/src/App.svelte` | Introduce app header, explicit loading state, responsive workspace/drawer state, and consistent theme metadata |
| `docs/src/components/AppHeader.svelte` | New shared header with mark/title, navigation toggle, and Search trigger |
| `docs/src/components/SideMenu.svelte` | Replace rail/panel with one counted, expandable index; support controlled mobile drawer state, focus return, and correct navigation ARIA |
| `docs/src/components/SubCategory.svelte` | CN expand/collapse treatment and ARIA state |
| `docs/src/components/ItemLink.svelte` | Selected marker, status badge treatment, `aria-current`, touch sizing |
| `docs/src/components/SearchPane.svelte` | Compact opaque CN dialog, shortcut handling, initial/empty states, result status, remove undefined tokens |
| `docs/src/views/Page.svelte` | Shared content surface and comprehensive Markdown/table/code rules |
| `docs/src/views/Function.svelte` | CN argument/return rows and optional state chips |
| `docs/src/views/fragments/FunctionSignature.svelte` | Unified code panel and accessible realm presentation |
| `docs/src/views/Category.svelte` | Function-list surface and responsive grouping |
| `docs/src/routes/Home.svelte` | Documentation landing state with CN motifs and Search action |
| `docs/src/routes/NotFound.svelte` and `docs/src/views/NotFound.svelte` | Consolidate presentation around one shared empty-state pattern |
| `docs/index.html` | CN browser theme/mask colours and optional local font preload |
| `docs/public/` | Add approved/local font files and any approved CN/gdocs lockup asset; do not hotlink PayNow assets |

Do not edit `builder/` as part of this work. If the old builder must remain publicly supported, that should be a separate compatibility project.

## 8. Behaviour and data compatibility

The theme implementation must preserve:

- all current hash routes and deep links;
- dynamic title and structure loading from `parsed.json`;
- parser output compatibility;
- category/subcategory ordering and underscore-last sorting;
- current link resolution for local and Facepunch types;
- current Markdown and Lua syntax rendering;
- search scoring, result caps, and route selection;
- desktop ability to collapse the active navigation panel.

The only intentional interaction additions are the shared header, mobile drawer, visible loading state, and `Ctrl K`/`Cmd K` search shortcut.

## 9. Accessibility requirements

- Meet WCAG 2.2 AA contrast for text and interactive controls.
- All interactive controls have a visible focus treatment; no focus outline is removed without replacement.
- Controls are at least 44 by 44 px on coarse pointers.
- Active navigation uses text/position/indicator in addition to colour.
- Drawer and search dialog trap focus, close on Escape, and restore focus to their trigger.
- Icon-only controls have accessible names.
- Expand/collapse controls expose `aria-expanded` and reference their controlled region.
- The active page link exposes `aria-current="page"`.
- Loading and search-result updates use a polite live region without announcing every keystroke excessively.
- Animations respect `prefers-reduced-motion: reduce`.
- At 200% zoom and at 320 CSS px width, primary reading and navigation tasks remain possible without page-level horizontal scrolling.

## 10. Acceptance criteria

### Visual

- The shell uses CN palette, typography, focus, and approved logos, while the layout and density read as a documentation tool in the GMod Wiki family.
- No legacy light-blue primary accent remains in headings, links, selected navigation, argument indices, favicon mask, or theme metadata.
- CN red is used selectively and is not applied as every border or block heading.
- Header, navigation, search panel, and content are opaque; only modal backdrops use transparency.
- No decorative glow, radial wash, grid motif, oversized hero, floating content card, or repeated rounded API cards remain.
- Home, content, search, loading, error, and not-found states read as one design system.

### Responsive

- Validate at 1440×900, 1024×768, 768×1024, 390×844, and 320×568.
- Desktop header, 300 px index, and document content do not overlap.
- At 900 px and below, navigation is a dismissible drawer and no permanent rail consumes content width.
- Tables and code scroll inside their own containers; the overall page does not horizontally scroll.

### Functional

- Existing route links and direct hash URLs render the same content as before.
- Search opens from all specified triggers, finds the same results, navigates correctly, and closes/restores focus.
- Navigation sections expand/collapse and active-state tracking remains correct.
- A missing or malformed `parsed.json` produces the themed error state rather than a blank screen.
- The app still works without a network connection once deployed assets and `parsed.json` are available.

### Engineering

- `npm run check` passes in `docs/`.
- `npm run build` passes in `docs/`.
- No new console errors or undefined CSS custom properties are present.
- No change is required to parser output to adopt the theme.
- Visual QA captures are reviewed for the home page, function page, category/table page, search with results, search empty state, loading, error, and mobile drawer.

## 11. Recommended delivery sequence

1. **Foundation:** introduce semantic tokens, global type/background/focus/motion rules, metadata, and local asset strategy.
2. **Shell:** add the header and responsive workspace; convert mobile navigation to a drawer without changing routes.
3. **Navigation and search:** restyle both navigation levels and the search dialog; add ARIA and shortcut improvements.
4. **Reading surfaces:** update Page, Markdown, code, function signatures, parameters, tables, and semantic badges.
5. **States and QA:** update Home/loading/error/not-found; run checks, responsive/accessibility review, and visual regression capture.

Each step should leave the app buildable. Token aliases can be used temporarily, but the final implementation should not keep the 17-value legacy background ladder as a second competing theme API.

## 12. Brand asset decision

This specification assumes gdocs is being intentionally presented as a Civil Networks property, while still using the dynamic project title supplied by `parsed.json`.

The approved brand source is `F:\CN_Branding\logos`. The implementation packages local copies of `cn_logo_full.png`, `cn_logo_transparent.png`, and `favicon.ico` under `docs/public/`; it does not hotlink or depend on PayNow at runtime. The full wordmark appears in the header, the compact mark appears in the drawer and home view, and the approved favicon replaces the legacy gdocs favicon.
