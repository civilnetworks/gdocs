<script lang="ts">
  import Router from "svelte-spa-router";
  import { onMount, setContext } from "svelte";
  import { get } from "svelte/store";
  import routes from "./routes";
  import { fetchParsedData } from "./utils/parsed";
  import type { ProjectStructure } from "./utils/parsed";
  import { parsedData } from "./stores";
  import SideMenu from "./components/SideMenu.svelte";
  import SearchPane from "./components/SearchPane.svelte";
  import AppHeader from "./components/AppHeader.svelte";
  import { BUNDLE_NAME } from "./constants";

  import "./styles/global.css";
  import "./styles/themes/dark.css";

  let project: ProjectStructure = {};
  let projectTitle = "Documentation";
  let tracedError: string | null = null;
  let navigationOpen = false;
  let navigationTrigger: HTMLButtonElement | null = null;
  let searchVisible = false;
  let searchTrigger: HTMLElement | null = null;
  let lastShiftTime = 0;

  setContext("parsed", {
    getData: () => get(parsedData),
  });

  const openNavigation = (
    event: CustomEvent<{ trigger: HTMLButtonElement }>
  ) => {
    navigationTrigger = event.detail.trigger;
    navigationOpen = true;
  };

  const openSearch = (event: CustomEvent<{ trigger: HTMLButtonElement }>) => {
    searchTrigger = event.detail.trigger;
    searchVisible = true;
  };

  const requestSearch = (trigger: HTMLElement | null) => {
    searchTrigger = trigger;
    searchVisible = true;
  };

  setContext("openSearch", requestSearch);

  const handleGlobalKeys = (event: KeyboardEvent) => {
    if (searchVisible || !$parsedData?.structure) return;

    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      requestSearch(document.activeElement as HTMLElement | null);
      return;
    }

    if (event.key === "Shift" && !event.repeat) {
      const now = Date.now();
      if (lastShiftTime && now - lastShiftTime < 2000) {
        event.preventDefault();
        lastShiftTime = 0;
        requestSearch(document.activeElement as HTMLElement | null);
      } else {
        lastShiftTime = now;
      }
    } else if (!event.shiftKey) {
      lastShiftTime = 0;
    }
  };

  onMount(async () => {
    try {
      const parsed = await fetchParsedData();
      project = parsed.structure;
      projectTitle = parsed.title || "Documentation";
    } catch (error: any) {
      tracedError = `Can't fetch "${BUNDLE_NAME}": ${
        error?.message ?? "Unknown error"
      }`;
      console.error(error);
    }
  });
</script>

<svelte:window on:keydown={handleGlobalKeys} />

<svelte:head>
  {#if tracedError}
    <title>GDocs - Error</title>
  {:else if $parsedData?.title}
    <title>{$parsedData.title}</title>
  {:else}
    <title>Loading documentation…</title>
  {/if}
  <meta name="theme-color" content="#1f2125" />
  <meta name="color-scheme" content="dark" />
</svelte:head>

<div class="app-shell">
  <AppHeader
    title={projectTitle}
    {navigationOpen}
    controlsDisabled={!$parsedData?.structure}
    on:navigation={openNavigation}
    on:search={openSearch}
  />

  <main class="workspace" aria-busy={!tracedError && !$parsedData?.structure}>
    {#if tracedError}
      <section class="state-panel error-panel" role="alert">
        <div class="state-icon error-icon" aria-hidden="true">!</div>
        <p class="state-eyebrow">Documentation unavailable</p>
        <h1>We couldn't load this project</h1>
        <p>
          Check that <code>{BUNDLE_NAME}</code> is deployed beside the application
          and contains valid JSON.
        </p>
        <pre><code>{tracedError}</code></pre>
      </section>
    {:else if $parsedData?.structure}
      <SideMenu
        bind:mobileOpen={navigationOpen}
        mobileTrigger={navigationTrigger}
        on:search={openSearch}
      />
      <div class="content" id="main-content">
        <Router {routes} />
      </div>
    {:else}
      <section class="state-panel loading-panel" aria-live="polite">
        <div class="loading-mark" aria-hidden="true">
          <span></span><span></span><span></span>
        </div>
        <p class="state-eyebrow">Civil Networks</p>
        <h1>Loading documentation…</h1>
        <p>Preparing the project index and navigation.</p>
      </section>
    {/if}
  </main>

  {#if searchVisible}
    <SearchPane
      {project}
      bind:visible={searchVisible}
      returnFocus={searchTrigger}
    />
  {/if}
</div>

<style>
  .app-shell {
    width: 100%;
    min-height: 100vh;
    min-height: 100dvh;
  }

  .workspace {
    display: flex;
    width: 100%;
    height: 100vh;
    height: 100dvh;
    padding-top: var(--header-height);
    align-items: stretch;
    overflow: hidden;
  }

  .content {
    display: flex;
    min-width: 0;
    flex: 1;
    align-items: flex-start;
    justify-content: center;
    overflow-x: hidden;
    overflow-y: auto;
    background: var(--surface-page);
  }

  .content > :global(*) {
    min-height: 100%;
  }

  .state-panel {
    position: relative;
    display: grid;
    width: min(64rem, calc(100vw - 4rem));
    align-self: center;
    justify-items: center;
    gap: 1rem;
    margin: auto;
    padding: 3.2rem;
    overflow: hidden;
    color: var(--text-secondary);
    background: var(--surface-content);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-lg);
    box-shadow: none;
    text-align: center;
  }

  .state-eyebrow {
    color: var(--text-muted);
    font-size: 1.1rem;
    font-weight: 800;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .state-panel h1 {
    color: var(--text-primary);
    font-size: clamp(2.4rem, 4vw, 3.2rem);
    font-weight: 800;
    letter-spacing: -0.04em;
    line-height: 1;
  }

  .state-panel > p:last-of-type {
    max-width: 48rem;
  }

  .state-panel code {
    font-family: var(--code-font);
  }

  .state-panel pre {
    width: 100%;
    overflow-x: auto;
    padding: 1.4rem 1.6rem;
    color: var(--code-color);
    background: var(--code-background);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-md);
    font-size: 1.3rem;
    text-align: left;
    white-space: pre-wrap;
  }

  .state-icon {
    display: grid;
    width: 4rem;
    height: 4rem;
    place-items: center;
    color: var(--text-primary);
    background: rgba(255, 43, 43, 0.15);
    border: 1px solid rgba(255, 43, 43, 0.35);
    border-radius: var(--radius-md);
    font-size: 2rem;
    font-weight: 800;
  }

  .loading-mark {
    display: flex;
    height: 2.6rem;
    align-items: flex-end;
    gap: 0.5rem;
  }

  .loading-mark span {
    display: block;
    width: 0.6rem;
    background: var(--cn-red);
    clip-path: polygon(22% 0, 100% 0, 78% 100%, 0 100%);
    animation: signal 1.1s var(--ease-standard) infinite alternate;
  }

  .loading-mark span:nth-child(1) { height: 1.2rem; }
  .loading-mark span:nth-child(2) { height: 1.8rem; animation-delay: 120ms; }
  .loading-mark span:nth-child(3) { height: 2.5rem; animation-delay: 240ms; }

  @keyframes signal {
    from { opacity: 0.35; transform: translateY(0.3rem); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 900px) {
    .workspace {
      padding-top: var(--header-height-mobile);
    }

    .content {
      width: 100%;
    }

    .state-panel {
      width: min(100% - 3.2rem, 64rem);
      padding: 3.2rem 2rem;
    }
  }
</style>
