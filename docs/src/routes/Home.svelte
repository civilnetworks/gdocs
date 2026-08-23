<script lang="ts">
  import { getContext, onDestroy } from "svelte";
  import { link } from "svelte-spa-router";
  import { parsedData } from "../stores";
  import type { Category } from "../utils/parsed";

  let title = "Documentation";
  let sections: [string, Category][] = [];
  let searchButton: HTMLButtonElement;
  const openSearch = getContext<(trigger: HTMLElement) => void>("openSearch");

  const unSub = parsedData.subscribe((data) => {
    if (data?.title) title = data.title;
    if (data?.structure) sections = Object.entries(data.structure);
  });

  onDestroy(unSub);
</script>

<section class="home">
  <header class="home-header">
    <img src="branding/cn-logo-mark.png" alt="" />
    <div>
      <p>Civil Networks documentation</p>
      <h1>{title}</h1>
    </div>
  </header>

  <p class="intro">Browse the reference index or search functions, types, and descriptions.</p>

  <button bind:this={searchButton} class="search-button" on:click={() => openSearch(searchButton)}>
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m20 20-4.4-4.4m2.4-5.1a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" /></svg>
    Search documentation
    <kbd>Ctrl K</kbd>
  </button>

  {#if sections.length}
    <section class="reference-index" aria-labelledby="reference-title">
      <h2 id="reference-title">Reference sections</h2>
      <div class="reference-list">
        {#each sections as [key, section]}
          {@const firstItem = Object.values(section.subcategories ?? {})[0]}
          {#if firstItem}
            <a use:link href={`/${key}/${firstItem.name}`}>
              <span>{section.name}</span>
              <small>{Object.keys(section.subcategories).length} entries</small>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
            </a>
          {/if}
        {/each}
      </div>
    </section>
  {/if}
</section>

<style>
  .home { width: 100%; max-width: var(--content-width); min-height: 100%; padding: 4.2rem clamp(3.2rem,5vw,5.6rem) 6rem; color: var(--text-secondary); }
  .home-header { display: flex; align-items: center; gap: 1.6rem; padding-bottom: 2rem; border-bottom: 1px solid var(--border-subtle); }
  .home-header img { width: 5rem; height: 5rem; object-fit: contain; }
  .home-header p { color: var(--text-disabled); font-size: 1rem; font-weight: 750; letter-spacing: .12em; text-transform: uppercase; }
  h1 { margin-top: .25rem; color: var(--text-primary); font-size: clamp(2.8rem,5vw,3.8rem); font-weight: 760; letter-spacing: -.04em; line-height: 1.1; }
  .intro { max-width: 62rem; margin-top: 1.8rem; color: var(--text-secondary); font-size: 1.5rem; line-height: 1.6; }
  .search-button { display: inline-flex; min-height: 3.8rem; align-items: center; gap: .8rem; margin-top: 1.8rem; padding: 0 .7rem 0 1rem; color: var(--text-primary); background: var(--surface-raised); border: 1px solid var(--border-strong); border-radius: var(--radius-sm); font-size: 1.25rem; font-weight: 650; transition: background var(--motion-fast) ease, border-color var(--motion-fast) ease; }
  .search-button:hover { background: #343943; border-color: rgba(255,43,43,.45); }
  .search-button svg { width: 1.7rem; height: 1.7rem; fill: none; stroke: currentColor; stroke-linecap: round; stroke-width: 1.8; }
  kbd { margin-left: .5rem; padding: .15rem .5rem; color: var(--text-muted); background: var(--surface-recessed); border: 1px solid var(--border-subtle); border-radius: 2px; font-family: var(--ui-font); font-size: 1rem; }
  .reference-index { margin-top: 4.2rem; }
  .reference-index h2 { padding-bottom: .8rem; color: var(--text-primary); border-bottom: 1px solid var(--border-subtle); font-size: 2rem; font-weight: 700; }
  .reference-list { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); }
  .reference-list a { display: grid; min-height: 5.2rem; grid-template-columns: minmax(0,1fr) auto auto; align-items: center; gap: 1rem; padding: .8rem 1rem; color: var(--text-secondary); border-bottom: 1px solid var(--border-subtle); text-decoration: none; }
  .reference-list a:nth-child(odd) { border-right: 1px solid var(--border-subtle); }
  .reference-list a:hover { color: var(--text-primary); background: var(--surface-hover); }
  .reference-list span { overflow: hidden; font-size: 1.35rem; font-weight: 650; text-overflow: ellipsis; white-space: nowrap; }
  .reference-list small { color: var(--text-disabled); font-size: 1.05rem; }
  .reference-list svg { width: 1.5rem; height: 1.5rem; fill: currentColor; color: var(--cn-red-hover); }

  @media (max-width: 700px) { .home { padding: 2.4rem 2rem 4rem; } .reference-list { grid-template-columns: 1fr; } .reference-list a:nth-child(odd) { border-right: 0; } }
  @media (max-width: 430px) { .home { padding: 2rem 1.6rem 3.2rem; } .home-header img { width: 4.2rem; height: 4.2rem; } .reference-list small { display: none; } }
</style>
