---
tags: [decisions]
---

# Decisions

Deviations from [[Brief]]/the wireframe, and other build choices worth remembering, each with why. Re-verified against the real v2 code on 2026-09-24.

## 2026-09-24 — v2 redesign

### v2 redesign: modern shop look instead of the brief's manga-panel style
The user reviewed v1 and called it "too basic / cheap looking", and asked for a proper-looking shop. Three changes followed from that one conversation:
1. **Real manga series with official covers**, instead of the brief's invented series/no real artwork rule — see [[Decisions#Real covers instead of invented series]]. The user explicitly said to ignore that brief rule; this is a proof-of-concept project and the grading risk was acknowledged at the time.
2. **A modern e-commerce look** instead of the brief's thick-outline, hard-offset-shadow "manga panel" style. The palette (`--ink`/`--paper`/`--sakura`/`--berry`/`--sun`/`--tone`) and the three Google Fonts (Dela Gothic One, Zen Maru Gothic, Kalam) were kept exactly as specified in the brief. What was dropped: the 3–4px black outlines, the hard `6px 6px 0` offset shadows, CSS-drawn book covers, the corkboard/spine/speech-bubble motifs. `--book-shadow` is now a soft, blurred two-layer shadow (`0 1px 2px rgb(0 0 0/.15), 0 14px 22px -12px rgb(0 0 0/.5)`) — see [[Design System]].
3. **Some working JavaScript beyond the brief's "only where needed"**: a real localStorage basket, real filter/sort/search on the manga grid, and a real scroll-snap carousel — see [[JavaScript]].

### Real covers instead of invented series
23 real, English-edition manga covers were fetched from Open Library (`covers.openlibrary.org`) and verified one by one on 2026-09-24. Two were tried and rejected before settling on the final 23: **Kagurabachi Vol. 1** was skipped (only a Japanese-language cover was indexed on Open Library), **Blue Lock Vol. 1** was deleted after fetching (the only cover available was 153px wide and too blurry to use). See [[Images]] for the full file list.

### Photos are illustrated art boards, not AI photos
The original plan was to generate the site's "photos" with Figma Weave AI. That wasn't possible: Weave's MCP access requires a paid Figma plan, and the free web-app credits don't extend to MCP tool calls. The user said to improvise instead. The result: `art-source/artboards.html` composes 10 scenes out of the real manga covers using plain HTML/CSS/SVG (speedlines, gradients, drawn shapes), and each board is rendered to a JPG with a headless-Edge screenshot at its exact pixel size. See [[Images#`images/photos/` — 10 illustrated "photos"]] and [[Testing#Re-rendering the art boards]].

### Sofia's "portrait" is her signature
`sofia.jpg` (used as `.portrait` in the homepage's Sofia's picks section) is Sofia's handwritten signature ("Sofia x" in the Kalam typeface), not a photo of a person — rendered from the `#sofia` board in `art-source/artboards.html`. `alt="Sofia's signature"` describes it accurately.

### Figures/Blu-ray/Merch nav links show an "in the shop for now" panel
Those three nav items link to `manga.html?cat=figures` / `?cat=blu-ray` / `?cat=merch`. Rather than invent fake figure/Blu-ray/merch products, `js/main.js` block 5 detects the `?cat=` param and swaps the whole filters+grid section for a single `.category-feature` panel (photo + "lives in the shop for now" copy + links back to the shop). See [[Pages/Manga#The `?cat=` placeholder, in full (JS block 5(a))]].

### Pagination dropped
manga.html has no pagination. With only 23 titles total, and filters/sort/search genuinely working against all of them client-side on one page (see [[JavaScript#5. Category page]]), paging them into multiple pages would add UI without solving a real problem at this scale.

### Basket page added
`basket.html` is new in v2 and isn't in the brief's original file structure (`index.html`/`manga.html`/`product.html`/`events.html` only). It exists because the basket needs somewhere to be reviewed, adjusted and (nominally) checked out — see [[Pages/Basket]].

### Basket works double-clicked in Chrome/Edge, not Firefox
The basket is plain `localStorage`, keyed `"basket"` (see [[JavaScript#3. Basket]]). Opening `index.html` by double-click and browsing to other pages works end-to-end in Chrome and Edge, because every `file://.../anime-haven/*.html` page shares one origin there. Firefox isolates each `file://` page into its own separate origin, so the basket doesn't carry across pages in Firefox unless the site is served over `http://` — hence the local server in [[Testing]].

### Checkout is a toast, not a real flow
`#checkout-btn` on `basket.html` shows `showToast('Checkout is switched off: this is a student project')` and does nothing else — no order is placed, no page changes, no state is saved. Listed under [[Changelog#Known gaps / ideas]], not a bug.

## 2026-09-24 (later): interactive shelf replaces "New this week"

Same day, later session. Two related changes, both at the user's explicit request:

### Shelf replaces "New this week"
The plain scrolling "New this week" `.product-row` was replaced by an interactive shelf (`.shelf`/`.spine`/`.shelf-cover`/`.shelf-preview`) — 11 spines + 2 faced-out covers on a plank, hover/keyboard-focus lifts a book and fills a preview card. This deliberately brings back the *original wireframe's* shelf-of-spines idea (`attachments/homepage-lowfi-wireframe.webp`), which v2's first redesign had dropped in favour of plain cover grids — done this time in the v2 visual style (real covers, soft shadows, sakura glow) rather than the wireframe's thick-outline look. See [[Pages/Home#2. New on the shelf — `id="shelf-heading"`, `.shelf-layout`]] and [[Design System#`.shelf` / `.spine` / `.shelf-cover` / `.shelf-preview`]].

### One product template (`?id=`) instead of 23 HTML files
`product.html` stayed a single file, now filled in for any book via `?id=` (`js/main.js` block 9, data from the new `js/books.js`), instead of writing out 23 near-identical product pages. Two reasons: **fewer files** to keep straight in a 5-page brief, and the shared header/footer (see [[Architecture#No templating: header and footer are copy-pasted]]) still only needs a hand-edit in 5 places, not 23+. The trade-off is the same one v1/v2 already made peace with elsewhere (client-side filtering instead of pagination, etc.) — more logic in `main.js`, fewer files on disk.

### Unknown id falls back to Frieren
`BOOKS.find(...) || BOOKS[0]` in block 9 — a missing or unrecognised `?id=` shows `BOOKS[0]` (Frieren: Beyond Journey's End, Vol. 1), which is also exactly what the hand-written HTML shows before any JavaScript runs. No separate "book not found" page or message; the fallback and the no-JS view are the same thing by construction.

### `format` defaults to Paperback
Every book in `js/books.js` is a paperback except two: `look-back` and `berserk-deluxe-01` (Berserk Deluxe Edition), which carry an explicit `format: 'Hardcover'`. Rather than write `format: 'Paperback'` on all 21 other entries, `js/main.js` block 9 reads `book.format || 'Paperback'` — the field is simply absent everywhere it isn't needed.

## Carried over from v1 (2026-09-23), reverified against the v2 code

### Homepage h1 is visually hidden
`index.html`'s `<h1 class="visually-hidden">Anime Haven: manga, figures and events in Dublin</h1>` — the logo already shows the shop name, and the new homepage (like the old wireframe) has no separate visible page title above the hero.

### Logo mark is the kanji 安
`<span class="logo-mark" aria-hidden="true">安</span>` — "an" (安), Japanese for "peaceful, safe": a visual pun on "haven". `aria-hidden` because the link's accessible name comes from the adjacent visible text "Anime Haven".

### Footer Shipping/Returns/Contact avoid dead links
Shipping and Returns still link to `product.html#shipping` / `product.html#returns` — real `<details id="shipping">`/`<details id="returns">` on that page. Contact still links to `index.html#visit`, the "Come say hola" section. No footer link is a placeholder `#` href.

### Get directions and the shop map
"Get directions" (`.btn.btn-light`) links to an OpenStreetMap URL centred on a marker at the shop's coordinates (`https://www.openstreetmap.org/?mlat=53.3490&mlon=-6.2640#map=17/...`). **This changed from v1**: the map itself is no longer a hand-drawn illustration — it's now a **live OpenStreetMap `<iframe>` embed** (the code's own comment says "Live map from OpenStreetMap (needs an internet connection)"). The address "Unit 4, Lantern Lane, Dublin 1" is still invented for this fictional shop.

### Event dates are yearless
`<time datetime="10-03">3 Oct</time>` etc. — no year in `datetime`, on both `events.html` and index's "what's on" cards, so the displayed weekday/date pairing never goes stale.

### Sofia's note is a `<div>`, not an `<aside>`
The product-page shelf-talker (`<div class="shelf-talker">`) stays a plain `<div>` — an `<aside>` nested in `<main>` without being a sibling of the main content flow gets flagged by axe as a misplaced landmark. (The homepage's per-pick notes are a single `<p class="shelf-talker">` each, no wrapper element needed.)

### Focus ring is berry, 3px, offset 3px
`:focus-visible { outline: 3px solid var(--berry); outline-offset: 3px; }`, one rule, applies everywhere. Berry only ever appears here (see [[Design System#Contrast facts]]) — never as text or a background under text, because it's ≈4.4:1 on white, below the 4.5:1 text minimum but comfortably above the 3:1 non-text-UI minimum.

### Restock form has no backend
`.signup`: `js/main.js` block 2 calls `preventDefault()` and writes a thank-you into `.signup-thanks` (`role="status"`) instead of sending anywhere. The `<form method="post">` is kept regardless, so a JS-off submit still keeps the typed address out of the URL.

### Skills installed and their influence
The same 3 skills from v1 are still installed (`accessibility`, `frontend-design`, `web-design-guidelines` — see `skills-lock.json`). Still true in the v2 code: no ALL-CAPS labels (`grep` for `text-transform: uppercase` and `→`/`·` separators in the HTML/CSS finds nothing).

## Dropped (no longer describe the code — verified gone)

These v1 decisions are removed because the thing they explained doesn't exist anymore:
- **"Basket (2) links to product.html"** — there's a real `basket.html` now.
- **"Nav categories all reuse manga.html"** — superseded by [[Decisions#Figures/Blu-ray/Merch nav links show an "in the shop for now" panel]], which explains the actual placeholder mechanism, not just the reuse.
- **Speech-bubble SVG** (`.bubble`) — no speech-bubble component exists in the v2 markup or CSS.
- **Speedline gradient positions as literal (not custom-property) values, to satisfy the validator** — the reasoning wasn't re-confirmed against the new `repeating-conic-gradient` rules in `.slide-blush`/`-sun`/`-ink`, so it's dropped rather than asserted without evidence.
- **Corkboard / flyers / sticky note** — replaced by ordinary `.event-card`/`.event-row` cards.
- **"All illustrations are original SVGs"** — false now; see [[Decisions#Real covers instead of invented series]] and [[Decisions#Photos are illustrated art boards, not AI photos]].
- **The old shadow/outline claim in "Skills installed and their influence"** ("no soft/blurred box-shadow anywhere") — now false on purpose, see [[Decisions#v2 redesign: modern shop look instead of the brief's manga-panel style]].

Two more v1 decisions were dropped for the same reason, then **reinstated later** in a different form — flagged here so the history stays honest instead of silently vanishing:
- ~~"Spines read top-to-bottom... there's no spine component"~~ — **wrong again as of 2026-09-24 (later)**: `.spine` exists once more, on the homepage shelf, but as a small sideways-text link with inline custom-property colours, not the old v1 corkboard component. See [[Decisions#2026-09-24 (later): interactive shelf replaces "New this week"]].
- ~~"Faced-out shelf covers... no separate faced-out-cover component"~~ — **wrong again as of 2026-09-24 (later)**: `.shelf-cover` exists once more, on the same homepage shelf, with a `.price-sticker`. Everywhere else on the site a cover is still the plain `.book`.
