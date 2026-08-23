<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { location, link } from "svelte-spa-router";

  export let href: string;
  export let label: string;
  export let count: number;

  const dispatch = createEventDispatcher<{ navigate: void }>();

  let expanded = $location.startsWith(href);
  $: active = $location === href;
  $: regionId = `nav-${href.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "")}`;
</script>

<div class="subcategory-group">
  <a
    class="head"
    class:active
    {href}
    use:link
    aria-current={active ? "page" : undefined}
    aria-expanded={expanded}
    aria-controls={regionId}
    on:click={() => {
      expanded = !expanded;
      dispatch("navigate");
    }}
  >
    <svg viewBox="0 0 24 24" aria-hidden="true" class:expanded>
      <path d="m9 6 6 6-6 6" />
    </svg>
    <span>{label}</span>
  </a>

  <div id={regionId} class="body" class:expanded style={`--item-count: ${count}`}>
    <slot />
  </div>
</div>

<style>
  .subcategory-group { display: flex; flex-direction: column; align-items: stretch; }
  .head { position: relative; display: flex; min-height: 3.4rem; align-items: center; gap: .7rem; padding: 0 1.2rem 0 2rem; color: var(--text-secondary); transition: color var(--motion-fast) ease, background var(--motion-fast) ease; }
  .head::before { position: absolute; top: .6rem; bottom: .6rem; left: 0; width: 2px; content: ""; background: var(--cn-red); opacity: 0; }
  .head:hover { color: var(--text-primary); background: var(--surface-hover); }
  .head.active { color: var(--text-primary); background: var(--surface-selected); }
  .head.active::before { opacity: 1; }
  svg { width: 1.5rem; height: 1.5rem; flex: 0 0 auto; fill: currentColor; opacity: .7; transition: transform var(--motion-fast) var(--ease-standard); }
  svg.expanded { transform: rotate(90deg); }
  span { overflow: hidden; font-size: 1.25rem; font-weight: 650; letter-spacing: .01em; text-overflow: ellipsis; white-space: nowrap; }
  .body { max-height: 0; overflow: hidden; transition: max-height var(--motion-standard) var(--ease-standard), margin var(--motion-standard) var(--ease-standard); }
  .body.expanded { max-height: calc(var(--item-count, 0) * 3.4rem); margin-bottom: .4rem; }
  @media (pointer: coarse) { .head { min-height: 4.4rem; } .body.expanded { max-height: calc(var(--item-count, 0) * 4.4rem); } }
</style>
