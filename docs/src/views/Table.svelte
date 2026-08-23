<script lang="ts">
  import { marked } from "marked";

  import GetTypes from "../components/GetTypes.svelte";
  import Page from "./Page.svelte";

  export let item: any;
  export let category: string;

  let description = item.description || "";
  const fields = item.fields ?? [];
  const realm = item.realm;
</script>

<Page title={category}>
  {#if description}
    <h2 class="section">Description</h2>
    <div class="section-container">
      {@html marked(
        description +
          (realm === "client" || realm === "server"
            ? `\n\nThis enum is only available on the **${realm}side**.`
            : "")
      )}
    </div>
  {/if}
  {#if fields.length !== 0}
    <h2 class="section">Values</h2>
    <div class="section-container">
      <div class="table-container">
        <table aria-label={`${category} values`}>
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
</Page>
