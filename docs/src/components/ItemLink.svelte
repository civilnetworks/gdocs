<script lang="ts">
  import { link, location } from "svelte-spa-router";
  import type { ValidSubcategory } from "../utils/parsed";
  import clear_label from "../utils/clearLabel";

  export let item: ValidSubcategory;
  export let parentLink: string;
  export let stacked = false;

  const href = `${parentLink}/${item.name}`;
  const label = clear_label(item.name);
  $: active = $location === href;
  $: realm = "realm" in item ? item.realm : undefined;
  $: realmShort = realm === "server" ? "SV" : realm === "client" ? "CL" : realm === "shared" ? "SH" : "";
  $: realmTitle = realm === "server" ? "Server realm" : realm === "client" ? "Client realm" : realm === "shared" ? "Shared client and server realm" : "";
</script>

<a
  use:link
  {href}
  class="item-link"
  class:stacked
  class:active
  aria-current={active ? "page" : undefined}
  on:click
>
  <span class="item-content">
    <span class="label" class:internal-name={label.startsWith("_")} title={label}>{label}</span>
    {#if realmShort}
      <abbr title={realmTitle} class="realm-badge {realm}">
        <span aria-hidden="true"></span>{realmShort}
      </abbr>
    {/if}
    {#if item?.stub}<abbr title="Stub" class="badge stub">S</abbr>{/if}
    {#if item?.internal}<abbr title="Internal use" class="badge internal">I</abbr>{/if}
    {#if item?.deprecated}<abbr title="Deprecated" class="badge deprecated">D</abbr>{/if}
  </span>
</a>

<style>
  .item-link { position: relative; display: flex; min-height: 3.2rem; align-items: center; padding: .3rem 1.2rem .3rem 4.2rem; color: var(--text-muted); transition: color var(--motion-fast) ease, background var(--motion-fast) ease; }
  .item-link.stacked { padding-left: 2rem; }
  .item-link::before { position: absolute; top: .6rem; bottom: .6rem; left: 0; width: 2px; content: ""; background: var(--cn-red); opacity: 0; }
  .item-link:hover { color: var(--text-primary); background: var(--surface-hover); }
  .item-link.active { color: var(--text-primary); background: var(--surface-selected); }
  .item-link.active::before { opacity: 1; }
  .item-content { display: flex; width: 100%; min-width: 0; align-items: center; gap: .5rem; }
  .label { min-width: 0; flex: 1; overflow: hidden; font-size: 1.22rem; font-weight: 500; line-height: 1.3; text-overflow: ellipsis; white-space: nowrap; }
  .label.internal-name { color: var(--text-disabled); }
  .realm-badge { display: inline-flex; min-width: 2.8rem; height: 1.7rem; align-items: center; justify-content: center; gap: .35rem; flex: 0 0 auto; padding: 0 .35rem; color: var(--text-secondary); background: rgba(255,255,255,.035); border: 1px solid var(--border-subtle); border-radius: 2px; font-size: .8rem; font-weight: 800; letter-spacing: .04em; line-height: 1; text-decoration: none; }
  .realm-badge > span { width: .7rem; height: .7rem; flex: 0 0 .7rem; border-radius: 1px; }
  .realm-badge.server > span { background: var(--realm-server); }
  .realm-badge.client > span { background: var(--realm-client); }
  .realm-badge.shared > span { background: linear-gradient(45deg,var(--realm-client) 50%,var(--realm-server) 50.001%); }
  .badge { display: inline-grid; min-width: 1.7rem; height: 1.7rem; place-items: center; flex: 0 0 auto; color: #fff; border-radius: 2px; font-size: .9rem; font-weight: 800; line-height: 1; text-decoration: none; }
  .badge.internal { background: var(--badge-internal); }
  .badge.stub { background: var(--badge-stub); }
  .badge.deprecated { background: var(--badge-deprecated); }
  @media (pointer: coarse) { .item-link { min-height: 4.4rem; } }
</style>
