<script lang="ts">
  import GetTypes from "../../components/GetTypes.svelte";
  import function_name from "../../utils/funName";
  import type { FunctionPage, FunctionParameters, FunctionReturns } from "../../utils/parsed";

  export let item: FunctionPage;
  export let category: string;

  const returns: FunctionReturns[] = item.returns ?? [];
  const parameters: FunctionParameters[] = item.parameters ?? [];
  let func_name = "";
  let isMethod: boolean;
  $: [func_name, isMethod] = function_name(item.name);
  $: realmText = item.realm === "server"
    ? "Server"
    : item.realm === "client"
      ? "Client"
      : item.realm === "shared"
        ? "Shared"
        : item.realm || "";
  $: realmLabel = realmText === "Shared" ? "Shared client and server realm" : `${realmText} realm`;
</script>

<div class="function-signature" role="group" aria-label="Function signature">
  {#if item.realm}
    <span class="realm-label" title={realmLabel} aria-label={realmLabel}>
      <span class="realm {item.realm}" aria-hidden="true"></span>
      {realmText}
    </span>
  {/if}
  <code class="signature-code">{#each returns as ret, i}{#if i > 0}<span>, </span>{/if}<GetTypes types={ret.type} list={true} />{/each}{#if returns.length > 0}<span>{" "}</span>{/if}{#if isMethod}<GetTypes types={category} /><span>:</span>{/if}<span class="name">{func_name}</span><span>(</span>{#each parameters as param, i}<GetTypes types={param.type} list={true} /><span class:optional={param.optional}>&nbsp;{param.name}</span>{#if param.default}<span class="default"> = {param.default}</span>{/if}{parameters.length > 1 && i < parameters.length - 1 ? ", " : ""}{/each}<span>)</span></code>
</div>

<style>
  .function-signature { display: flex; width: 100%; max-width: 100%; align-items: center; gap: 1rem; margin: 1.6rem 0 1rem; padding: 1.2rem 1.4rem; overflow-x: auto; color: var(--code-color); background: var(--code-background); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); }
  .realm-label { display: inline-flex; min-height: 2.2rem; align-items: center; gap: .55rem; flex: 0 0 auto; padding: 0 .7rem 0 .5rem; color: var(--text-secondary); background: rgba(255,255,255,.045); border: 1px solid var(--border-subtle); border-radius: 2px; font-family: var(--ui-font); font-size: 1rem; font-weight: 750; letter-spacing: .07em; line-height: 1; text-transform: uppercase; }
  .realm { display: inline-block; width: 1.2rem; height: 1.2rem; flex: 0 0 1.2rem; border-radius: 2px; }
  .realm.server { background: var(--realm-server); }
  .realm.client { background: var(--realm-client); }
  .realm.shared { background: linear-gradient(45deg,var(--realm-client) 50%,var(--realm-server) 50.001%); }
  .signature-code { display: inline-flex; flex-flow: row nowrap; padding: 0 !important; color: inherit; background: none !important; border: 0 !important; border-radius: 0 !important; font-family: var(--code-font); font-size: 1.35rem; font-weight: 450; line-height: 1.8rem; white-space: pre; }
  .signature-code :global(a) { color: var(--code-function); text-decoration: none; }
  .name { color: var(--text-primary); font-weight: 700; }
  .optional { color: var(--text-muted); font-style: italic; }
  .default { color: var(--code-number); }
  @media (max-width: 560px) { .function-signature { align-items: flex-start; flex-direction: column; } }
</style>
