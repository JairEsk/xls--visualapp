# Development Roadmap

This document summarizes the highest-value improvements for Pape and gives future contributors a safe implementation order.

## Current assessment

The application already supports product management, barcode-based autofill, low-stock visibility, multiple Excel projects, and a bilingual UI. The next work should focus on reliability before adding more features.

The main current risks are:

- Import and export show success messages but do not actually move workbook data.
- Failed saves can still produce success messages and clear or change UI state.
- Excel files are overwritten directly, without an atomic write or backup.
- Creating a project with an existing or equivalent filename can erase inventory.
- Product validation and uniqueness are enforced mainly in the renderer, not at the persistence boundary.
- Runtime databases are stored beside the source code, which will not be reliable in a packaged application.
- There are no automated tests or release builds.
- `xlsx@0.18.5` has known high-severity advisories and no npm-provided fix.

## Priority order

| Priority | Goal | Start condition |
|----------|------|-----------------|
| P0 | Protect inventory data and make existing operations truthful | Start immediately |
| P1 | Make the app testable, distributable, secure, and auditable | Start after P0 is complete |
| P2 | Improve scale, architecture, accessibility, and reporting | Start after stable P1 releases |

---

## P0 - Data safety and core correctness

These items are blockers. Do not add major features until they are complete.

### P0.1 Implement real Excel import and export

**Problem**

`main.js` currently opens file dialogs and returns a path, but no workbook is imported or exported. `renderer/renderer.js` can display a success toast even after cancellation or without moving data.

**Tasks**

- [ ] Replace `dialog:openExcel` and `dialog:saveExcel` with explicit `db:importExcel` and `db:exportExcel` operations.
- [ ] On import, read the selected workbook, validate its headers and rows, and only then create or replace a project.
- [ ] On export, save the current project first and copy the active workbook to the selected destination.
- [ ] Return structured results such as `{ ok, canceled, importedCount, errors }`.
- [ ] Show success only when the operation finishes successfully.
- [ ] Show row-specific validation errors for invalid workbooks.
- [ ] Preserve the current project when an import fails or is canceled.

**Acceptance criteria**

- Export creates a valid `.xlsx` file containing the current inventory.
- Import loads a valid workbook into a selected/new project.
- Canceling either dialog does not show success or change data.
- Invalid files do not overwrite existing inventory.

**Primary files:** `main.js`, `preload.js`, `database.js`, `renderer/renderer.js`

### P0.2 Make workbook writes atomic and recoverable

**Problem**

`database.js` rewrites the only workbook directly. A crash, disk error, or forced shutdown during a write can damage the full inventory.

**Tasks**

- [ ] Move runtime data storage to `app.getPath('userData')` instead of `__dirname/data`.
- [ ] Pass/configure the data directory from the Electron main process.
- [ ] Add a one-time migration for existing development workbooks in `data/`.
- [ ] Write changes to a temporary file in the same directory.
- [ ] Reopen and validate the temporary workbook before replacing the active file.
- [ ] Keep the last valid workbook as a `.bak` backup.
- [ ] Atomically rename the temporary file over the active workbook.
- [ ] Serialize writes per project to prevent overlapping saves.
- [ ] Use `app.requestSingleInstanceLock()` to avoid two app instances writing simultaneously.
- [ ] Add a recovery flow when the active workbook is unreadable but a valid backup exists.

**Acceptance criteria**

- Interrupting a simulated save does not destroy the last valid inventory.
- Packaged builds can create, read, and update projects.
- A corrupt active workbook can be recovered from the backup with a clear user message.

**Primary files:** `main.js`, `database.js`

### P0.3 Make save failures block success and preserve UI state

**Problem**

`saveToDB()` catches errors without returning failure. Product updates, deletes, price changes, and sales can appear successful even when Excel was not updated.

**Tasks**

- [ ] Make persistence methods throw or return an explicit failure result.
- [ ] Show success only after persistence is confirmed.
- [ ] Do not clear forms, carts, or dialogs before a successful save.
- [ ] Roll back in-memory product changes when persistence fails.
- [ ] Disable action buttons while a write is in progress.
- [ ] Prevent double submission of add/update/delete/sale actions.
- [ ] Move stock deduction for a completed sale into one authoritative main-process operation.

**Acceptance criteria**

- Simulated write failures leave inventory, stock, forms, and cart state unchanged.
- No success toast appears after a failed operation.
- Repeated clicks cannot apply the same mutation twice.

**Primary files:** `renderer/renderer.js`, `main.js`, `preload.js`, `database.js`

### P0.4 Add authoritative validation and stable product identity

**Problem**

Renderer validation can be bypassed by imported or manually edited Excel files. Duplicate IDs/barcodes and malformed numbers can make edits, deletes, scans, and stock operations target the wrong product.

**Tasks**

- [ ] Create one validation layer used by saves, imports, and project loading.
- [ ] Require a nonempty product name.
- [ ] Require unique, immutable product IDs.
- [ ] Replace row/index-derived IDs with UUIDs generated in the main process.
- [ ] Require barcodes to be unique when nonempty.
- [ ] Normalize barcode values consistently before comparison.
- [ ] Require prices to be finite and nonnegative.
- [ ] Require stock and box units to be nonnegative integers.
- [ ] Validate box fields only when `soldByBox` is enabled.
- [ ] Reject unsafe numeric barcode cells that may have lost leading zeroes or precision.
- [ ] Report the workbook row and field for every validation error.

**Acceptance criteria**

- Duplicate IDs or nonempty barcodes cannot be saved or imported.
- Leading-zero barcodes survive an Excel round trip when stored as text.
- Invalid values are rejected instead of being silently converted to zero.
- Every saved product has a stable ID independent of workbook row order.

**Primary files:** `database.js`, `main.js`, `renderer/renderer.js`

### P0.5 Prevent destructive project creation and unsafe switching

**Problem**

Creating a project calls `saveProducts([], dbName)` without checking for an existing normalized filename. Switching projects updates the active name before confirming that the target loaded successfully.

**Tasks**

- [ ] Create projects exclusively and fail if the destination already exists.
- [ ] Centralize project-name normalization in the main process.
- [ ] Reject empty names, reserved Windows names, trailing spaces/dots, and normalization collisions.
- [ ] Require explicit confirmation and a backup before any overwrite operation.
- [ ] Load and validate a target project before changing `currentDbName` or `localStorage`.
- [ ] Preserve the previous project and cart when switching fails.
- [ ] Distinguish missing, empty, and corrupt projects in user-facing errors.
- [ ] Stop creating a blank workbook as a side effect of a read operation.

**Acceptance criteria**

- Creating `A:B` cannot silently overwrite an existing `A?B` project.
- Attempting to create an existing project never clears it.
- A failed project switch leaves the previous project active and unchanged.

**Primary files:** `main.js`, `database.js`, `renderer/renderer.js`

---

## P1 - Quality, security, distribution, and auditability

### P1.1 Add automated tests and CI

**Tasks**

- [ ] Add a test runner and `npm test` script.
- [ ] Add database tests for round trips, duplicate detection, invalid rows, leading-zero barcodes, project names, atomic-write failure, backup, and recovery.
- [ ] Add domain tests for stock deductions, cart limits, price/profit calculations, and failed-save rollback.
- [ ] Add Electron end-to-end tests for add/update/delete, barcode autofill, restart persistence, project switching, import/export/cancel, and language switching.
- [ ] Add GitHub Actions for install, tests, audit, and packaged-build smoke tests.
- [ ] Require CI to pass before merging future changes.

**Acceptance criteria**

- Core inventory flows are covered by repeatable tests.
- Pull requests automatically report regressions.
- A packaged app is launched at least once in CI.

### P1.2 Replace or mitigate the vulnerable Excel dependency

**Problem**

`npm audit --omit=dev` reports high-severity prototype-pollution and ReDoS advisories for `xlsx@0.18.5`, with no npm-provided fix.

**Tasks**

- [ ] Evaluate a maintained spreadsheet library or a supported/patched SheetJS distribution.
- [ ] Preserve the existing workbook schema and round-trip behavior during migration.
- [ ] Add file-size, row-count, and processing-time limits for imports.
- [ ] Test malformed and hostile workbook inputs.
- [ ] Validate all IPC arguments and product records in the main process.
- [ ] Prevent unexpected navigation, popups, and permissions in Electron.
- [ ] Avoid inserting workbook/project values into `innerHTML`; use DOM text properties.

**Acceptance criteria**

- Production dependency audit has no unaccepted high-severity findings.
- Malformed or oversized workbook imports fail safely without freezing the app.
- Untrusted workbook text cannot create HTML or execute code.

### P1.3 Create a reproducible installer and release process

**Tasks**

- [ ] Add Electron Forge or electron-builder.
- [ ] Define `appId`, product name, version, icons, included files, and Windows installer target.
- [ ] Confirm runtime databases remain outside the installed application directory.
- [ ] Add release artifact generation to GitHub Actions.
- [ ] Test clean install, upgrade, uninstall, and preservation of user data.
- [ ] Document development, build, and release commands in `README.md`.

**Acceptance criteria**

- A new user can install and run the app without Node.js or npm.
- Updating the app does not remove inventory files.
- Releases are reproducible from a tagged commit.

### P1.4 Add a sales/inventory movement ledger

**Problem**

Completing a sale changes stock, but the app does not preserve an auditable transaction history. This limits analysis and makes stock discrepancies difficult to investigate.

**Tasks**

- [ ] Define a movement model: sale, purchase/restock, manual adjustment, return, and correction.
- [ ] Record timestamp, product ID, quantity, unit price/cost, project, and reason/source.
- [ ] Save stock changes and movement records together.
- [ ] Add a history view with date, product, and movement filters.
- [ ] Add CSV/XLSX export for movement history.
- [ ] Calculate basic totals from movements: sales, cost, gross profit, units sold, and stock adjustments.

**Acceptance criteria**

- Every stock change has a corresponding movement record.
- Users can explain current stock from historical movements.
- Sales and gross-profit summaries can be reproduced from the ledger.

---

## P2 - UX, scale, architecture, and advanced reporting

### P2.1 Improve accessibility and explicit editing controls

**Tasks**

- [ ] Add a visible, keyboard-accessible Edit action to product rows if manual editing is required; do not restore row-click autofill.
- [ ] Keep barcode entry as the only automatic form-fill trigger.
- [ ] Add proper tab, dialog, and live-region semantics.
- [ ] Add modal focus trapping/restoration and Escape handling.
- [ ] Add accessible labels to icon-only controls.
- [ ] Add consistent `:focus-visible` styles and reduced-motion support.
- [ ] Verify desktop and minimum-window-size layouts.

### P2.2 Improve performance for larger inventories

**Tasks**

- [ ] Build in-memory indexes for product ID and barcode lookups.
- [ ] Debounce free-text searches while keeping barcode scanning immediate.
- [ ] Paginate or virtualize inventory and search results.
- [ ] Move expensive workbook operations off the main UI path.
- [ ] Define target limits and test with 1k, 10k, and 50k products.
- [ ] If Excel becomes a bottleneck, evaluate SQLite as the canonical store while keeping Excel for import/export.

### P2.3 Split the renderer into maintainable modules

**Tasks**

- [ ] Separate translations, state, domain rules, API calls, and feature views.
- [ ] Move product/cart/stock rules into testable pure functions.
- [ ] Centralize DOM rendering and validation helpers.
- [ ] Add linting and formatting commands.
- [ ] Consider TypeScript or runtime schemas once behavior is covered by tests.
- [ ] Keep changes incremental; do not rewrite the entire app at once.

### P2.4 Add advanced inventory analytics

Start this only after the movement ledger exists.

**Tasks**

- [ ] Add date-range sales and gross-profit summaries.
- [ ] Add best-selling and slow-moving product reports.
- [ ] Add inventory valuation at purchase and sale price.
- [ ] Add stockout frequency and suggested reorder quantities.
- [ ] Add category-level performance.
- [ ] Let users export each report to Excel.

---

## Recommended implementation sequence

1. Implement real import/export.
2. Move data to `userData` and add atomic writes/backups.
3. Make all mutations wait for confirmed persistence.
4. Add centralized validation, UUIDs, and barcode uniqueness.
5. Make project creation/switching non-destructive.
6. Add tests around all completed P0 behavior.
7. Replace/mitigate `xlsx` security risk.
8. Add packaging and CI release artifacts.
9. Add the movement ledger and basic reports.
10. Improve accessibility, performance, and module structure incrementally.

## Guidance for the next contributor/model

- Read this file, `README.md`, `database.js`, `main.js`, `preload.js`, and the relevant section of `renderer/renderer.js` before editing.
- Work on one roadmap item at a time and keep changes minimal.
- Add or update tests with every behavior change.
- Never show a success message before the main-process operation confirms success.
- Never overwrite or delete a workbook without validation and a recoverable backup.
- Preserve the requirement that barcode entry triggers automatic form filling; clicking product rows must not automatically fill the inventory form.
- Keep source code, comments, commit messages, and repository documentation in English. Spanish should remain only in the `i18n.es` UI translations.
- Do not commit runtime `.xlsx` files, `node_modules/`, build artifacts, or personal inventory data.
- Do not start P1/P2 feature work while unresolved P0 items can cause data loss.
