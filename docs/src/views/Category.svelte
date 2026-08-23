<script lang="ts">
  import { marked } from "marked";

  import GetTypes from "../components/GetTypes.svelte";
  import type {
    Category,
    FunctionPage,
    TablePage,
    ValidSubcategory,
  } from "../utils/parsed";
  import Page from "./Page.svelte";
  import { link, location } from "svelte-spa-router";
  import FunctionSignature from "./fragments/FunctionSignature.svelte";

  export let item: Category;
  export let category: string;

  let description = item.description || "";
  const fields = item.fields ?? [];

  interface ParsedSubCategories {
    function: FunctionPage[];
    table: TablePage[];
    category: ValidSubcategory[];
  }

  const subItems: ParsedSubCategories = {
    function: [],
    table: [],
    category: [],
  };

  // Populate arrays based on the "item" property
  Object.values(item.subcategories).forEach((subcategory) => {
    if (subcategory.item === "function") {
      subItems.function.push(subcategory as FunctionPage);
    } else if (subcategory.item === "table") {
      subItems.table.push(subcategory as TablePage);
    } else if (subcategory.item === "category") {
      subItems.category.push(subcategory as Category);
    }
  });
</script>

<Page title={category}>
  {#if item.inherits}
    <p class="inherits">
      <span class="label">Inherits</span>
      <GetTypes types={item.inherits} />
    </p>
  {/if}
  {#if description}
    <h2 class="section">Description</h2>
    <div class="section-container">
      {@html marked(description)}
    </div>
  {/if}
  {#if fields.length !== 0}
    <h2 class="section">Attributes</h2>
    <div class="section-container">
      <div class="table-container">
        <table aria-label={`${category} attributes`}>
          <thead>
            <tr><th scope="col">Type</th><th scope="col">Name</th><th scope="col">Description</th></tr>
          </thead>
          <tbody>
            {#each fields as field, index}
              <tr data-key={`${index}-${field.key}--${field.type}`}>
                <td><GetTypes types={field.type} /></td>
                <td>{field.key}</td>
                <td>{field.description}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}
  {#if subItems.function.length > 0}
    <h2 class="section">Functions</h2>
    <div class="section-container">
      {#each subItems.function as functItem}
        <div class="funct">
          <a use:link href="{$location}/{functItem.name}">{functItem.name}</a>
          <FunctionSignature item={functItem} {category} />
          {#if functItem.description}
            <div class="funct-description">{@html marked(functItem.description)}</div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</Page>

<style>
  .funct {
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 1.4rem 0;
    border-top: 1px solid var(--border-subtle);
  }

  .funct:last-child { border-bottom: 1px solid var(--border-subtle); }

  .funct > a {
    width: fit-content;
    margin-bottom: 0.4rem;
    font-size: 1.45rem;
  }

  .funct-description :global(p) { margin: .5rem 0 0; }

  .inherits {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 0.7rem;
    margin: 2rem 0 0;
    font-size: 1.4rem;
    color: var(--text-muted);
  }

  .inherits .label {
    font-size: 1.1rem;
    font-weight: 800;
    letter-spacing: 0.11em;
    text-transform: uppercase;
    color: var(--text-disabled);
  }
</style>
