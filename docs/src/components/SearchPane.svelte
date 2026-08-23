<script lang="ts">
  import { onMount, tick } from "svelte";
  import type { Category, ProjectStructure, ValidSubcategory } from "../utils/parsed";
  import { link } from "svelte-spa-router";
  import { focusTrap } from "../utils/focusTrap";

  export let visible = true;
  export let project: ProjectStructure;
  export let searchText = "";
  export let returnFocus: HTMLElement | null = null;

  interface Result {
    text: string;
    score: number;
    reference: {
      item: string;
      parentCategoryItem: string | null;
      chain: string[];
    };
  }

  let input: HTMLInputElement;
  let results: Result[] = [];

  const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  function markTerm(searchTerm: string, value: string) {
    if (!searchTerm) return [{ type: "text", text: value }];
    const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, "gi");
    return value.split(regex).map((segment) => ({
      type: segment.toLowerCase() === searchTerm.toLowerCase() ? "match" : "text",
      text: segment,
    }));
  }

  function searchProjectStructure(structure: ProjectStructure, query: string): Result[] {
    const found: Result[] = [];

    function scoreMatch(value: string) {
      if (value === query) return 100;
      if (value.toLowerCase() === query.toLowerCase()) return 80;
      if (value.startsWith(query)) return 60;
      if (value.toLowerCase().startsWith(query.toLowerCase())) return 40;
      if (value.endsWith(query)) return 30;
      if (value.toLowerCase().endsWith(query.toLowerCase())) return 20;
      if (value.includes(query)) return 10;
      return 0;
    }

    function searchCategory(
      category: ValidSubcategory,
      parentCategoryItem: string | null,
      chain: string[] = []
    ) {
      if (category.name.toLowerCase().includes(query.toLowerCase())) {
        found.push({
          text: category.name.length > 96 ? `${category.name.substring(0, 96)}...` : category.name,
          score: 100 + scoreMatch(category.name),
          reference: { item: category.item, parentCategoryItem, chain },
        });
      }

      if (category.description?.toLowerCase().includes(query.toLowerCase())) {
        found.push({
          text: category.description.length > 96
            ? `${category.description.substring(0, 96)}...`
            : category.description,
          score: scoreMatch(category.name),
          reference: { item: category.item, parentCategoryItem, chain },
        });
      }

      if ((category as Category).subcategories) {
        for (const subcategoryKey in (category as Category).subcategories) {
          const subcategory = (category as Category).subcategories[subcategoryKey];
          searchCategory(subcategory, category.name, [...chain, subcategoryKey]);
        }
      }
    }

    for (const categoryKey in structure) {
      searchCategory(structure[categoryKey], null, [categoryKey]);
    }

    const output = found.sort((a, b) => b.score - a.score);
    if (query.length >= 4) return output;
    if (query.length >= 2) return output.slice(0, 30);
    return output.slice(0, 10);
  }

  const performSearch = () => {
    results = searchText ? searchProjectStructure(project, searchText) : [];
  };

  const doClose = async () => {
    visible = false;
    await tick();
    returnFocus?.focus();
  };

  const handleKeys = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      doClose();
    }
  };

  const chooseResult = () => doClose();

  onMount(() => {
    performSearch();
    input.focus();
  });
</script>

<svelte:window on:keydown={handleKeys} />

<div class="search-dialog" role="presentation">
  <section
    class="search-box"
    role="dialog"
    aria-modal="true"
    aria-labelledby="search-title"
    aria-describedby="search-status"
    use:focusTrap={visible}
  >
    <header>
      <div class="heading-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="m20 20-4.4-4.4m2.4-5.1a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" /></svg>
      </div>
      <div>
        <span>Quick find</span>
        <h2 id="search-title">Search documentation</h2>
      </div>
      <button aria-label="Close search" class="close-button" on:click={doClose}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
      </button>
    </header>

    <div class="input-wrap">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m20 20-4.4-4.4m2.4-5.1a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" /></svg>
      <input
        bind:this={input}
        bind:value={searchText}
        data-focusindex="1"
        placeholder="Search functions, categories, and descriptions"
        aria-label="Search documentation"
        spellcheck="false"
        autocomplete="off"
        on:input={performSearch}
      />
    </div>

    <p id="search-status" class="status" aria-live="polite">
      {#if !searchText}
        Type to search the project index.
      {:else if results.length === 0}
        No results found for “{searchText}”.
      {:else}
        {results.length} {results.length === 1 ? "result" : "results"} found.
      {/if}
    </p>

    <div class="results">
      {#if searchText && results.length === 0}
        <div class="empty-state">
          <span aria-hidden="true">?</span>
          <strong>No matching documentation</strong>
          <p>Try a function name, category, or a broader term.</p>
        </div>
      {:else if results.length > 0}
        <ul>
          {#each results as result}
            <li>
              <a use:link href={`/${result.reference.chain.join("/")}`} on:click={chooseResult}>
                <span class="result-path">{result.reference.chain.join(" / ")}</span>
                <span class="result-copy">
                  {#each markTerm(searchText, result.text) as segment}
                    {#if segment.type === "match"}<mark>{segment.text}</mark>{:else}{segment.text}{/if}
                  {/each}
                </span>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
              </a>
            </li>
          {/each}
        </ul>
      {:else}
        <div class="empty-state initial">
          <span class="signal" aria-hidden="true"></span>
          <strong>Find anything quickly</strong>
          <p>Search names and descriptions across the loaded documentation.</p>
        </div>
      {/if}
    </div>

    <footer><span><kbd>↑</kbd><kbd>↓</kbd> Browse results</span><span><kbd>Esc</kbd> Close</span></footer>
  </section>
  <button class="backdrop" aria-label="Close search" tabindex="-1" on:click={doClose}></button>
</div>

<style>
  .search-dialog { position: fixed; z-index: 9000; inset: 0; display: grid; place-items: center; padding: 2rem; }
  .backdrop { position: absolute; z-index: -1; inset: 0; width: 100%; height: 100%; background: var(--surface-overlay); }
  .search-box { display: grid; width: min(60rem,100%); max-height: min(66rem,calc(100dvh - 4rem)); grid-template-rows: auto auto auto minmax(12rem,1fr) auto; overflow: hidden; color: var(--text-secondary); background: var(--surface-navigation); border: 1px solid var(--border-strong); border-radius: var(--radius-md); box-shadow: var(--shadow-overlay); }
  header { position: relative; display: grid; grid-template-columns: auto minmax(0,1fr) auto; align-items: center; gap: 1rem; padding: 1.2rem 1.4rem; border-bottom: 1px solid var(--border-subtle); }
  .heading-icon { display: grid; width: 3.2rem; height: 3.2rem; place-items: center; color: var(--text-secondary); background: var(--surface-recessed); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); }
  .heading-icon svg, .input-wrap svg { width: 2rem; height: 2rem; fill: none; stroke: currentColor; stroke-linecap: round; stroke-width: 1.8; }
  header span { color: var(--text-disabled); font-size: .9rem; font-weight: 750; letter-spacing: .11em; text-transform: uppercase; }
  h2 { margin-top: .1rem; color: var(--text-primary); font-size: 1.65rem; font-weight: 700; letter-spacing: -.01em; }
  .close-button { display: grid; width: 3.6rem; height: 3.6rem; place-items: center; color: var(--text-secondary); border-radius: var(--radius-sm); transition: color var(--motion-fast) ease, background var(--motion-fast) ease; }
  .close-button:hover { color: var(--text-primary); background: var(--surface-selected); }
  .close-button svg { width: 2rem; height: 2rem; fill: none; stroke: currentColor; stroke-linecap: round; stroke-width: 1.8; }
  .input-wrap { position: relative; margin: 1.2rem 1.4rem .6rem; }
  .input-wrap > svg { position: absolute; top: 50%; left: 1.4rem; color: var(--text-muted); transform: translateY(-50%); pointer-events: none; }
  input { width: 100%; height: 4.2rem; padding: 0 1.2rem 0 4.2rem; color: var(--text-primary); background: var(--surface-recessed); border: 1px solid var(--border-strong); border-radius: var(--radius-sm); outline: none; font-size: 1.35rem; font-weight: 550; transition: border-color var(--motion-fast) ease, box-shadow var(--motion-fast) ease; }
  input::placeholder { color: var(--text-disabled); }
  input:focus { border-color: rgba(255,43,43,.72); box-shadow: 0 0 0 3px rgba(255,43,43,.15); }
  .status { min-height: 2.4rem; padding: 0 1.4rem .7rem; color: var(--text-muted); font-size: 1.1rem; }
  .results { min-height: 0; overflow-y: auto; border-top: 1px solid var(--border-subtle); }
  ul { list-style: none; }
  li + li { border-top: 1px solid rgba(236,240,243,.065); }
  li a { display: grid; grid-template-columns: minmax(0,1fr) auto; gap: .3rem 1rem; padding: .9rem 1.4rem; transition: background var(--motion-fast) ease; }
  li a:hover, li a:focus-visible { background: var(--surface-hover); }
  .result-path { overflow: hidden; color: var(--text-primary); font-size: 1.3rem; font-weight: 750; text-overflow: ellipsis; white-space: nowrap; }
  .result-copy { overflow: hidden; color: var(--text-muted); font-size: 1.2rem; text-overflow: ellipsis; white-space: nowrap; }
  li svg { grid-row: 1 / 3; grid-column: 2; width: 1.8rem; height: 1.8rem; align-self: center; fill: currentColor; color: var(--cn-red-hover); transition: transform var(--motion-fast) ease; }
  li a:hover svg { transform: translateX(.15rem); }
  mark { color: var(--text-primary); background: rgba(255,43,43,.22); border-radius: .3rem; }
  .empty-state { display: grid; min-height: 18rem; place-content: center; justify-items: center; gap: .7rem; padding: 2.4rem; text-align: center; }
  .empty-state > span:not(.signal) { display: grid; width: 4.4rem; height: 4.4rem; place-items: center; color: var(--text-primary); background: var(--surface-selected); border: 1px solid rgba(255,43,43,.28); border-radius: var(--radius-md); font-size: 2rem; font-weight: 800; }
  .empty-state strong { color: var(--text-primary); font-size: 1.6rem; }
  .empty-state p { color: var(--text-muted); font-size: 1.3rem; }
  .signal { width: 3.6rem; height: .3rem; margin-bottom: .6rem; background: var(--cn-red); }
  footer { display: flex; min-height: 4.6rem; align-items: center; justify-content: space-between; gap: 1rem; padding: .8rem 2rem; color: var(--text-muted); background: rgba(17,18,22,.55); border-top: 1px solid var(--border-subtle); font-size: 1.1rem; }
  footer span { display: inline-flex; align-items: center; gap: .5rem; }
  kbd { padding: .25rem .5rem; color: var(--text-secondary); background: var(--surface-raised); border: 1px solid var(--border-subtle); border-radius: .4rem; font-family: var(--ui-font); font-size: 1rem; font-weight: 700; }
  @media (max-width: 640px) { .search-dialog { padding: .8rem; } .search-box { height: calc(100dvh - 1.6rem); max-height: none; } header { padding: 1rem 1.2rem; } .heading-icon { display: none; } .input-wrap { margin: 1.2rem 1.2rem .7rem; } .status { padding-right: 1.2rem; padding-left: 1.2rem; } li a { padding-right: 1.2rem; padding-left: 1.2rem; } footer { padding-right: 1.2rem; padding-left: 1.2rem; } footer span:first-child { display: none; } }
</style>
