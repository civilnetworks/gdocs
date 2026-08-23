<script lang="ts">
  import marked from "../utils/marked";

  import GetTypes from "../components/GetTypes.svelte";
  import function_name from "../utils/funName";
  import type {
    FunctionPage,
    FunctionParameters,
    FunctionReturns,
  } from "../utils/parsed";
  import Page from "./Page.svelte";
  import FunctionSignature from "./fragments/FunctionSignature.svelte";

  export let item: FunctionPage;
  export let category: string;

  let title: string = "";

  const examples: string[] = item.examples ?? [];
  const parameters: FunctionParameters[] = item.parameters ?? [];
  const returns: FunctionReturns[] = item.returns ?? [];

  const internalMessage =
    "**This is used internally. Although you can use it, you probably shouldn't.**";
  const deprecatedMessage =
    "**We advise against using this. It may be changed or removed in a future update.**";
  const stubMessage = "**This article is a stub.**";
  $: description = [
    item.description || "",
    item.internal ? internalMessage : "",
    item.deprecated ? deprecatedMessage : "",
    item.stub ? stubMessage : "",
  ].filter(Boolean).join("\n\n");
  let func_name: string = "";
  let isMethod: boolean;

  $: {
    [func_name, isMethod] = function_name(item.name);
    title = isMethod ? `${category}:${func_name}` : func_name;
  }

  $: htmlDescription = marked(description as string);
</script>

<Page {title}>
  <div class="section-container">
    <FunctionSignature {item} {category} />
  </div>

  {#if description}
    <h2 class="section">Description</h2>
    <div class="section-container">
      {@html htmlDescription}
    </div>
  {/if}

  {#if parameters.length !== 0}
    <h2 class="section">Arguments</h2>
    <div class="section-container">
      {#each parameters as param, index (index)}
        <div class="parameter-box">
          <p class="title">
            <GetTypes types={param.type} /><span>{" "}</span>
            <strong>{param.name}</strong>
            {#if param.optional}<span class="opt-flag"
                >{param.default
                  ? `optional, defaults to ${param.default}`
                  : "optional"}</span
              >{/if}
          </p>
          <div class="parameter-description">
            {@html marked(param.description)}
          </div>
          <span>{index + 1}</span>
        </div>
      {/each}
    </div>
  {/if}

  {#if returns.length !== 0}
    <h2 class="section">Returns</h2>
    <div class="section-container">
      {#each returns as ret, index (index)}
        <div class="parameter-box">
          <p class="title">
            <GetTypes types={ret.type} />
          </p>
          <div class="parameter-description">
            {@html marked(ret.description)}
          </div>
          <span>{index + 1}</span>
        </div>
      {/each}
    </div>
  {/if}

  {#if examples.length !== 0}
    <h2 class="section">Examples</h2>
    <div class="section-container">
      {@html marked(examples.join("\n\n"))}
    </div>
  {/if}
</Page>

<style>
  .parameter-box {
    position: relative;
    min-height: 5.6rem;
    margin: 0;
    padding: 1.2rem 1.2rem 1.2rem 4.6rem;
    border-top: 1px solid var(--border-subtle);
  }

  .parameter-box:last-child {
    border-bottom: 1px solid var(--border-subtle);
  }

  .parameter-box .opt-flag {
    display: inline-flex;
    min-height: 2rem;
    align-items: center;
    margin-left: 0.8rem;
    padding: 0.2rem 0.7rem;
    color: var(--text-muted);
    background: rgba(17, 18, 22, 0.38);
    border: 1px solid var(--border-strong);
    border-radius: 2px;
    font-size: 1rem;
    font-style: italic;
    white-space: nowrap;
  }

  .parameter-box > span {
    position: absolute;
    top: 1.25rem;
    left: 1rem;
    display: grid;
    width: 2.3rem;
    height: 2.3rem;
    place-items: center;
    color: #fff;
    background: var(--cn-red);
    border-radius: 2px;
    font-size: 1.1rem;
    font-weight: 800;
    user-select: none;
  }

  .parameter-box > p {
    margin: 0.45rem 0 0;
    color: var(--text-secondary);
    line-height: 1.55;
  }

  .parameter-description {
    margin-top: .45rem;
    color: var(--text-secondary);
    line-height: 1.55;
  }

  .parameter-description :global(p) { margin: 0; }

  .parameter-box > p.title {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    column-gap: 0.45rem;
    margin: 0;
    color: var(--text-primary);
    font-family: var(--code-font);
    font-size: 1.35rem;
    font-weight: 600;
  }

  .parameter-box strong {
    overflow-wrap: anywhere;
  }

  @media (max-width: 480px) {
    .parameter-box {
      padding-right: .8rem;
      padding-left: 4.2rem;
    }

    .parameter-box > span {
      left: 1rem;
    }
  }
</style>
