<script lang="ts">
  import { link } from "svelte-spa-router";
</script>

<section class="not-found">
  <div class="code" aria-hidden="true">404</div>
  <p class="eyebrow">Route not found</p>
  <h1>This page doesn't exist</h1>
  <p>The address may be outdated, or the documentation item may have moved.</p>
  <a href="/" use:link>
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6-6 6 6 6" /></svg>
    Back to documentation home
  </a>
</section>

<style>
  .not-found { position: relative; display: grid; width: min(62rem,calc(100% - 4rem)); min-height: 34rem; align-self: center; place-content: center; justify-items: center; gap: 1.1rem; margin: auto; padding: 4rem 2rem; overflow: hidden; color: var(--text-secondary); background: linear-gradient(145deg,rgba(52,57,70,.64),rgba(22,24,30,.94)); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); box-shadow: var(--shadow-raised); text-align: center; }
  .not-found::before { position: absolute; top: 0; right: 2.4rem; left: 2.4rem; height: 2px; content: ""; background: linear-gradient(90deg,transparent,var(--cn-red),transparent); }
  .code { color: rgba(236,240,243,.07); font-size: clamp(8rem,18vw,14rem); font-weight: 900; letter-spacing: -.08em; line-height: .7; user-select: none; }
  .eyebrow { color: var(--cn-red-hover); font-size: 1.1rem; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; }
  h1 { color: var(--text-primary); font-size: clamp(2.8rem,5vw,4.2rem); font-weight: 800; letter-spacing: -.04em; line-height: 1; }
  p:not(.eyebrow) { max-width: 44rem; color: var(--text-muted); }
  a { display: inline-flex; min-height: 4.4rem; align-items: center; gap: .7rem; margin-top: 1rem; padding: 0 1.4rem; color: #fff; background: var(--cn-red); border: 1px solid rgba(255,255,255,.14); border-radius: var(--radius-md); box-shadow: 0 8px 20px rgba(255,43,43,.22); font-size: 1.3rem; font-weight: 800; transition: background var(--motion-fast) ease, transform var(--motion-fast) ease; }
  a:hover { background: var(--cn-red-hover); transform: translateY(-1px); }
  svg { width: 1.8rem; height: 1.8rem; fill: currentColor; }
  @media (max-width: 640px) { .not-found { width: calc(100% - 3.2rem); min-height: 30rem; } }
</style>
