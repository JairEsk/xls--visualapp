# Renderer Blocks

The renderer is intentionally split into small browser scripts loaded from `renderer/index.html`.

Load order matters:

1. `app-core.js`: shared state, i18n dictionary, DOM helpers, formatting, persistence, tabs, and no-op fallbacks.
2. Feature scripts: `explorer-pos.js`, `restock.js`, `inventory.js`, `projects.js`, `store-title.js`, `i18n-ui.js`.
3. `init.js`: startup sequence.

A feature script should own its DOM queries, event listeners, render function, and local constants. Cross-feature calls should go through existing shared functions and tolerate missing optional modules by relying on the no-op fallbacks in `app-core.js`.
