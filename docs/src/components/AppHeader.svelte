<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { link } from "svelte-spa-router";

  export let title = "Documentation";
  export let navigationOpen = false;
  export let controlsDisabled = false;

  const dispatch = createEventDispatcher<{
    navigation: { trigger: HTMLButtonElement };
    search: { trigger: HTMLButtonElement };
  }>();

  const openNavigation = (event: MouseEvent) => {
    dispatch("navigation", { trigger: event.currentTarget as HTMLButtonElement });
  };

  const openSearch = (event: MouseEvent) => {
    dispatch("search", { trigger: event.currentTarget as HTMLButtonElement });
  };
</script>

<header class="site-header">
  <div class="header-inner">
    <button
      class="navigation-toggle"
      aria-label="Open documentation navigation"
      aria-controls="documentation-navigation"
      aria-expanded={navigationOpen}
      disabled={controlsDisabled}
      on:click={openNavigation}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
    </button>

    <a class="brand" href="/" use:link aria-label={`${title} home`}>
      <img class="brand-wordmark" src="branding/cn-logo-full.png" alt="Civil Networks" />
      <span class="brand-divider" aria-hidden="true"></span>
      <span class="project-title">{title}</span>
    </a>

    <button
      class="search-trigger"
      aria-label="Search documentation"
      disabled={controlsDisabled}
      on:click={openSearch}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m20 20-4.4-4.4m2.4-5.1a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" />
      </svg>
      <span>Search documentation</span>
      <kbd><span class="command-key">Ctrl</span> K</kbd>
    </button>
  </div>
</header>

<style>
  .site-header { position: fixed; z-index: 500; top: 0; right: 0; left: 0; height: var(--header-height); background: var(--surface-header); border-bottom: 1px solid var(--border-subtle); }
  .header-inner { display: grid; width: 100%; height: 100%; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 1.6rem; padding: 0 1.6rem; }
  .brand { display: inline-flex; min-width: 0; align-items: center; justify-self: start; gap: 1.2rem; }
  .brand-wordmark { width: 15rem; height: 3.2rem; flex: 0 0 auto; object-fit: contain; object-position: left center; }
  .brand-divider { width: 1px; height: 2.2rem; background: var(--border-strong); }
  .project-title { overflow: hidden; color: var(--text-secondary); font-size: 1.3rem; font-weight: 650; letter-spacing: .06em; text-overflow: ellipsis; text-transform: uppercase; white-space: nowrap; }
  .search-trigger, .navigation-toggle { display: inline-flex; min-height: 3.6rem; align-items: center; justify-content: center; color: var(--text-primary); background: #23262c; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); transition: background var(--motion-fast) ease, border-color var(--motion-fast) ease, color var(--motion-fast) ease; }
  .search-trigger { min-width: 23rem; justify-content: flex-start; gap: .75rem; padding: 0 .7rem 0 1rem; color: var(--text-muted); font-size: 1.25rem; font-weight: 600; }
  .search-trigger:hover, .navigation-toggle:hover { color: var(--text-primary); background: var(--surface-raised); border-color: var(--border-strong); }
  .search-trigger svg, .navigation-toggle svg { width: 1.8rem; height: 1.8rem; fill: none; stroke: currentColor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 1.8; }
  kbd { min-width: 5rem; margin-left: auto; padding: .2rem .5rem; color: var(--text-muted); background: var(--surface-recessed); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); font-family: var(--ui-font); font-size: 1rem; font-weight: 700; text-align: center; }
  .navigation-toggle { display: none; width: 3.8rem; padding: 0; }

  @media (max-width: 900px) {
    .site-header { height: var(--header-height-mobile); }
    .header-inner { grid-template-columns: auto minmax(0, 1fr) auto; gap: .8rem; padding: 0 .8rem; }
    .navigation-toggle { display: inline-flex; }
    .brand { gap: .8rem; }
    .brand-wordmark { width: 12rem; height: 2.8rem; }
    .brand-divider, .project-title, .search-trigger > span, .search-trigger kbd { display: none; }
    .search-trigger { width: 3.8rem; min-width: 0; justify-content: center; padding: 0; }
  }

  @media (max-width: 430px) { .brand-wordmark { width: 10.2rem; } }
</style>
