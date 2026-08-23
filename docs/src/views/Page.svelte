<script lang="ts">
  export let title: string | null = null;
</script>

<article class="page">
  <slot name="title">
    {#if title}
      <header class="page-header">
        <span>API reference</span>
        <h1>{title}</h1>
      </header>
    {/if}
  </slot>
  <slot />
</article>

<style>
  .page { width: 100%; max-width: var(--content-width); min-height: 100%; padding: 3.2rem clamp(3.2rem,5vw,5.6rem) 6rem; color: var(--text-secondary); background: var(--surface-page); }
  .page-header { padding: 1rem 0 2rem; border-bottom: 1px solid var(--border-subtle); }
  .page-header > span { color: var(--text-disabled); font-size: 1rem; font-weight: 750; letter-spacing: .12em; text-transform: uppercase; }
  .page-header h1 { margin-top: .35rem; overflow-wrap: anywhere; color: var(--text-primary); font-size: clamp(2.8rem,4vw,3.4rem); font-weight: 760; letter-spacing: -.035em; line-height: 1.1; }
  .page-header h1::after { display: inline-block; width: 2.2rem; height: .3rem; margin: 0 0 .15em .8rem; content: ""; background: var(--cn-red); }

  .page :global(a) { color: var(--link-color); font-weight: 650; text-decoration: none; transition: color var(--motion-fast) ease; }
  .page :global(a:hover) { color: var(--link-hover); }
  .page :global(.section) { display: flex; align-items: center; gap: .8rem; margin: 4rem 0 1.2rem; padding-bottom: .8rem; color: var(--text-primary); border-bottom: 1px solid var(--border-subtle); font-size: 2.1rem; font-weight: 700; letter-spacing: -.02em; line-height: 1.2; }
  .page :global(.section::before) { width: .4rem; height: 1.8rem; flex: 0 0 auto; content: ""; background: var(--cn-red); }
  .page :global(.section-container) { min-width: 0; margin: .8rem 0; }
  .page :global(.section-container > :first-child) { margin-top: 0; }
  .page :global(.section-container > :last-child) { margin-bottom: 0; }
  .page :global(.section-container p) { margin: .8rem 0; color: var(--text-secondary); font-size: 1.5rem; line-height: 1.58; }
  .page :global(.section-container strong) { color: var(--text-primary); font-weight: 700; }
  .page :global(.section-container ul), .page :global(.section-container ol) { display: grid; gap: .45rem; margin: 1rem 0 1rem 2.2rem; }
  .page :global(.section-container li) { padding-left: .2rem; line-height: 1.5; }
  .page :global(.section-container li::marker) { color: var(--cn-red-hover); }
  .page :global(.section-container blockquote) { margin: 1.4rem 0; padding: 1rem 1.4rem; color: var(--text-secondary); background: rgba(0,0,0,.13); border-left: 3px solid var(--cn-red); }
  .page :global(.section-container hr) { height: 1px; margin: 2rem 0; background: var(--border-subtle); border: 0; }
  .page :global(.section-container h1), .page :global(.section-container h2), .page :global(.section-container h3), .page :global(.section-container h4) { margin: 2.2rem 0 .7rem; color: var(--text-primary); line-height: 1.2; }

  .page :global(.section-container code), .page :global(.section-container pre) { color: var(--code-color); text-shadow: none; font-family: var(--code-font); font-size: 1.35rem; font-weight: 450; line-height: 1.55; }
  .page :global(.section-container pre) { max-width: 100%; overflow-x: auto; padding: 1.4rem; margin: 1.4rem 0; background: var(--code-background); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); }
  .page :global(.section-container :not(pre) > code) { padding: .15rem .4rem; color: var(--text-primary); background: var(--surface-recessed); border: 1px solid var(--border-subtle); border-radius: 2px; overflow-wrap: anywhere; }
  .page :global(.token.comment), .page :global(.token.prolog), .page :global(.token.doctype), .page :global(.token.cdata) { color: var(--code-comment); }
  .page :global(.token.punctuation) { color: var(--code-punctuation); }
  .page :global(.token.property), .page :global(.token.tag), .page :global(.token.boolean), .page :global(.token.number), .page :global(.token.constant), .page :global(.token.symbol), .page :global(.token.deleted) { color: var(--code-number); }
  .page :global(.token.selector), .page :global(.token.attr-name), .page :global(.token.string), .page :global(.token.char), .page :global(.token.builtin), .page :global(.token.inserted) { color: var(--code-string); }
  .page :global(.token.operator), .page :global(.token.entity), .page :global(.token.url), .page :global(.language-css .token.string), .page :global(.style .token.string) { color: var(--code-operator); background: none; }
  .page :global(.token.atrule), .page :global(.token.attr-value), .page :global(.token.keyword) { color: var(--code-keyword); }
  .page :global(.token.function), .page :global(.token.class-name) { color: var(--code-function); }

  .page :global(.table-container) { width: 100%; overflow-x: auto; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); }
  .page :global(.table-container table) { width: 100%; min-width: 64rem; border-collapse: collapse; background: rgba(0,0,0,.08); }
  .page :global(.table-container td), .page :global(.table-container th) { padding: .9rem 1.1rem; border-right: 1px solid var(--border-subtle); border-bottom: 1px solid var(--border-subtle); overflow-wrap: anywhere; text-align: left; vertical-align: top; }
  .page :global(.table-container thead) { color: var(--text-primary); background: var(--surface-raised); }
  .page :global(.table-container th) { font-size: 1rem; font-weight: 750; letter-spacing: .09em; text-transform: uppercase; }
  .page :global(.table-container td:last-child), .page :global(.table-container th:last-child) { border-right: 0; }
  .page :global(.table-container tr:last-child td) { border-bottom: 0; }
  .page :global(.table-container tr:nth-child(2n)) { background: rgba(236,240,243,.025); }
  .page :global(.table-container td:nth-child(1)), .page :global(.table-container td:nth-child(2)) { width: 25%; }

  @media (max-width: 900px) { .page { padding: 2.2rem 2rem 4rem; } }
  @media (max-width: 480px) { .page { padding: 1.8rem 1.6rem 3.2rem; } .page :global(.section-container p) { font-size: 1.45rem; } }
</style>
