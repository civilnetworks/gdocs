<script lang="ts">
  import { createEventDispatcher, onDestroy, tick } from "svelte";
  import { parsedData } from "../stores";
  import type { Category, ProjectStructure } from "../utils/parsed";
  import { location } from "svelte-spa-router";
  import SubCategory from "./SubCategory.svelte";
  import clear_label from "../utils/clearLabel";
  import ItemLink from "./ItemLink.svelte";
  import { focusTrap } from "../utils/focusTrap";

  export let mobileOpen = false;
  export let mobileTrigger: HTMLButtonElement | null = null;

  const dispatch = createEventDispatcher<{ search: { trigger: HTMLButtonElement } }>();

  let tabs: [string, Category][] = [];
  let project: ProjectStructure = {};
  let expandedTab = "";

  $: routeTab = $location.split("/")[1] ?? "";
  $: if (routeTab && project[routeTab]) expandedTab = routeTab;
  $: if (!expandedTab && tabs.length) expandedTab = tabs[0][0];

  const unSub = parsedData.subscribe((data) => {
    if (data) {
      project = data.structure;
      tabs = Object.entries(project);
    }
  });

  onDestroy(unSub);

  const closeMobileMenu = async (restoreFocus = true) => {
    if (window.innerWidth <= 900 && mobileOpen) {
      mobileOpen = false;
      if (restoreFocus) {
        await tick();
        mobileTrigger?.focus();
      }
    }
  };

  const handleWindowKeydown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && mobileOpen) {
      event.preventDefault();
      closeMobileMenu();
    }
  };

  const openSearch = (event: MouseEvent) => {
    const trigger = mobileOpen && mobileTrigger
      ? mobileTrigger
      : (event.currentTarget as HTMLButtonElement);
    mobileOpen = false;
    dispatch("search", { trigger });
  };

  const sortLabels = (a: string, b: string) => {
    if (a.startsWith("_") && !b.startsWith("_")) return 1;
    if (!a.startsWith("_") && b.startsWith("_")) return -1;
    return a.localeCompare(b);
  };
</script>

<svelte:window on:keydown={handleWindowKeydown} />

<button
  class="drawer-backdrop"
  class:visible={mobileOpen}
  aria-label="Close documentation navigation"
  tabindex={mobileOpen ? 0 : -1}
  on:click={() => closeMobileMenu()}
></button>

<nav
  id="documentation-navigation"
  class="navigation-shell"
  class:mobile-open={mobileOpen}
  aria-label="Documentation navigation"
  use:focusTrap={mobileOpen}
>
  <div class="mobile-drawer-header">
    <div class="mobile-brand">
      <img src="branding/cn-logo-mark.png" alt="" />
      <div><span>Civil Networks</span><strong>Documentation</strong></div>
    </div>
    <button aria-label="Close documentation navigation" on:click={() => closeMobileMenu()}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
    </button>
  </div>

  <div class="index-tools">
    <button class="index-search" aria-label="Search documentation" on:click={openSearch}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 3a6.5 6.5 0 1 1 0 13A6.5 6.5 0 0 1 9.5 3m5.21 11.71L20 20" /></svg>
      <span>Search documentation</span>
      <kbd>/</kbd>
    </button>
  </div>

  <div class="index-scroll">
    <p class="index-label">Documentation index</p>
    {#each tabs as [key, value]}
      {#if value.subcategories && Object.values(value.subcategories).length !== 0}
        <section class="index-group" class:active={expandedTab === key}>
          <button
            class="group-toggle"
            aria-expanded={expandedTab === key}
            aria-controls={`index-${key}`}
            on:click={() => expandedTab = expandedTab === key ? "" : key}
          >
            <span class="group-marker" aria-hidden="true"></span>
            <span class="group-name">{value.name}</span>
            <span class="group-count">{Object.values(value.subcategories).length}</span>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
          </button>

          {#if expandedTab === key}
            <div class="group-content" id={`index-${key}`}>
              {#each Object.values(value.subcategories).sort((a, b) => sortLabels(clear_label(a.name), clear_label(b.name))) as subcategory (`${key}-${subcategory.name}`)}
                {#if subcategory.item.startsWith("category") && "subcategories" in subcategory}
                  {@const content = Object.values(subcategory.subcategories).sort((a, b) => sortLabels(clear_label(a.name), clear_label(b.name)))}
                  <SubCategory href="/{key}/{subcategory.name}" label={clear_label(subcategory.name)} count={content.length} on:navigate={() => closeMobileMenu()}>
                    {#each content as item}
                      <ItemLink {item} parentLink={`/${key}/${subcategory.name}`} on:click={() => closeMobileMenu()} />
                    {/each}
                  </SubCategory>
                {:else}
                  <ItemLink stacked={true} item={subcategory} parentLink={`/${key}`} on:click={() => closeMobileMenu()} />
                {/if}
              {/each}
            </div>
          {/if}
        </section>
      {/if}
    {/each}
  </div>
</nav>

<style>
  .navigation-shell { position: relative; z-index: 120; display: grid; width: var(--navigation-width); height: 100%; min-height: 0; flex: 0 0 var(--navigation-width); grid-template-rows: auto minmax(0,1fr); color: var(--text-secondary); background: var(--surface-rail); border-right: 1px solid var(--border-subtle); }
  .mobile-drawer-header, .drawer-backdrop { display: none; }
  .index-tools { padding: 1rem; border-bottom: 1px solid var(--border-subtle); }
  .index-search { display: flex; width: 100%; height: 3.6rem; align-items: center; gap: .8rem; padding: 0 .8rem 0 1rem; color: var(--text-muted); background: rgba(0,0,0,.16); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); font-size: 1.25rem; text-align: left; }
  .index-search:hover { color: var(--text-primary); background: var(--surface-hover); }
  .index-search svg { width: 1.7rem; height: 1.7rem; fill: none; stroke: currentColor; stroke-linecap: round; stroke-width: 1.8; }
  .index-search kbd { margin-left: auto; padding: 0 .5rem; color: var(--text-muted); background: var(--surface-recessed); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); font-family: var(--ui-font); font-size: 1rem; }
  .index-scroll { min-height: 0; overflow-y: auto; padding: .8rem 0 1.6rem; }
  .index-label { padding: .9rem 1.4rem .7rem; color: var(--text-disabled); font-size: 1rem; font-weight: 750; letter-spacing: .12em; text-transform: uppercase; }
  .index-group + .index-group { border-top: 1px solid rgba(236,240,243,.055); }
  .group-toggle { display: grid; width: 100%; min-height: 3.8rem; grid-template-columns: .5rem minmax(0,1fr) auto auto; align-items: center; gap: .8rem; padding: .4rem 1.1rem; color: var(--text-secondary); text-align: left; transition: color var(--motion-fast) ease, background var(--motion-fast) ease; }
  .group-toggle:hover { color: var(--text-primary); background: var(--surface-hover); }
  .index-group.active > .group-toggle { color: var(--text-primary); background: rgba(0,0,0,.12); }
  .group-marker { width: .4rem; height: .4rem; background: var(--text-disabled); border-radius: 50%; }
  .index-group.active .group-marker { width: .4rem; height: 1.6rem; background: var(--cn-red); border-radius: 1px; }
  .group-name { overflow: hidden; font-size: 1.3rem; font-weight: 700; text-overflow: ellipsis; white-space: nowrap; }
  .group-count { min-width: 2rem; color: var(--text-disabled); font-size: 1.05rem; text-align: right; }
  .group-toggle svg { width: 1.5rem; height: 1.5rem; fill: currentColor; opacity: .62; transition: transform var(--motion-fast) ease; }
  .index-group.active .group-toggle svg { transform: rotate(90deg); }
  .group-content { padding: .4rem 0 .8rem; background: rgba(0,0,0,.07); border-top: 1px solid rgba(236,240,243,.04); }

  @media (max-width: 900px) {
    .drawer-backdrop { position: fixed; z-index: 390; top: var(--header-height-mobile); right: 0; bottom: 0; left: 0; display: block; visibility: hidden; background: var(--surface-overlay); opacity: 0; transition: opacity var(--motion-standard) ease, visibility var(--motion-standard) ease; }
    .drawer-backdrop.visible { visibility: visible; opacity: 1; }
    .navigation-shell { position: fixed; z-index: 450; top: var(--header-height-mobile); bottom: 0; left: 0; width: min(90vw,34rem); height: auto; grid-template-rows: auto auto minmax(0,1fr); visibility: hidden; border-right: 1px solid var(--border-strong); box-shadow: 14px 0 34px rgba(0,0,0,.34); transform: translateX(-104%); transition: transform var(--motion-standard) var(--ease-standard), visibility var(--motion-standard) ease; }
    .navigation-shell.mobile-open { visibility: visible; transform: translateX(0); }
    .mobile-drawer-header { display: flex; min-height: 5.8rem; align-items: center; justify-content: space-between; gap: 1rem; padding: .7rem 1rem; border-bottom: 1px solid var(--border-subtle); }
    .mobile-brand { display: flex; align-items: center; gap: .8rem; }
    .mobile-brand img { width: 3.4rem; height: 3.4rem; object-fit: contain; }
    .mobile-brand > div { display: grid; line-height: 1.2; }
    .mobile-brand span { color: var(--text-muted); font-size: .9rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; }
    .mobile-brand strong { color: var(--text-primary); font-size: 1.35rem; }
    .mobile-drawer-header > button { display: grid; width: 4rem; height: 4rem; place-items: center; color: var(--text-secondary); border-radius: var(--radius-sm); }
    .mobile-drawer-header > button:hover { background: var(--surface-hover); }
    .mobile-drawer-header svg { width: 1.8rem; height: 1.8rem; fill: none; stroke: currentColor; stroke-linecap: round; stroke-width: 1.8; }
  }

  @media (max-width: 390px) { .navigation-shell { width: 100vw; } }
</style>
