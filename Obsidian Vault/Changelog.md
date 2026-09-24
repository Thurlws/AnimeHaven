---
tags: [changelog]
---

# Changelog

## 2026-09-23 — v1

Built the original brief-compliant site: 4 pages (`index`, `manga`, `product`, `events`), CSS-drawn book covers, 14 original SVG illustrations, a corkboard/spine/speech-bubble manga-panel look, 3 installed skills steering the visual/code decisions (`accessibility`, `frontend-design`, `web-design-guidelines`). Validated 0 errors (W3C Nu) and 0 violations (axe-core) on all 4 pages. Fully superseded by the 2026-09-24 redesign below — none of v1's HTML/CSS/JS survives unchanged except the colour palette and the 3 Google Fonts.

## 2026-09-24 — v2 redesign

The user called v1 "too basic / cheap looking" and asked for a proper-looking shop. Full rebuild in one session:

- **Skills used:** same 3 as v1 (`accessibility`, `frontend-design`, `web-design-guidelines`), still installed and still shaping decisions like avoiding ALL-CAPS labels and arrow/middle-dot separators.
- **Covers fetched:** 23 English-edition manga covers from Open Library (`covers.openlibrary.org`), verified one by one. Kagurabachi Vol. 1 skipped (Japanese cover only). Blue Lock Vol. 1 fetched then deleted (153px wide, blurry). See [[Images]] and [[Decisions#Real covers instead of invented series]].
- **Homepage rebuilt** (`index.html`), section by section:
  1. Hero: 3-slide carousel (Frieren restock, "any three vol. 1s for €30" promo, Sofia's pick) + 2 photo tiles.
  2. New this week: scrolling row of 6 new arrivals.
  3. Shop by category: 4 photo tiles (Manga/Figures/Blu-ray/Merch).
  4. Sofia's picks: portrait (her signature) + 3 books with handwritten shelf talkers.
  5. Bestsellers in the shop: ranked row of 5.
  6. Back soon: 4 pre-order reprints with due dates.
  7. What's on in the shop: 3 event cards.
  8. Come say hola: address, hours, photo, live map.
- **Layout bugs fixed along the way:**
  - Hero column sizing: `.hero`'s carousel column needed `minmax(0, 2.1fr)` (not a bare `2.1fr`), otherwise the wide `.slides` content forced the column past its intended share.
  - Visually-hidden text inside a horizontally-scrolling row (`.product-row`) needed `.product-row { position: relative; }` so the clipped/absolute hidden text stayed inside the scroll container instead of affecting layout.
  - `aspect-ratio` + `min-height` together on `.category-grid .tile` was forcing an unwanted min-*width* too (an `aspect-ratio` box with a `min-height` set implies a minimum width to match the ratio) — fixed by setting `min-height: 0` on tiles that already get their height from `aspect-ratio`.
  - `height: 100%` fighting `aspect-ratio` on the same element — removed the redundant `height: 100%` where `aspect-ratio` was already sizing the box.
  - The empty toast element was visible/"peeking up" at the bottom of the viewport before any button had been clicked — fixed by parking it fully offscreen (`transform: translate(-50%, calc(100% + 3rem))`) until `.is-visible` is added.
- **Other pages rebuilt**: `manga.html` (filters/sort/search + `?cat=` placeholder), `product.html` (Frieren Vol. 1 detail page), `events.html` (featured event + event list). **`basket.html` added** (not in the original brief) — see [[Decisions#Basket page added]].
- **Art-board photos**: built `art-source/artboards.html` (10 illustrated scenes composed from the real covers) and rendered each to JPG with headless Edge, after Figma Weave AI generation turned out to need a paid MCP plan. See [[Decisions#Photos are illustrated art boards, not AI photos]].
- **Old SVGs deleted**: all 14 v1 illustration SVGs (`bubble.svg`, `cosplay.svg`, `episode-still.svg`, `moon-courier-*.svg`, etc.) removed, replaced by the JPGs in `images/covers/` and `images/photos/`.
- **Product page spacing/alt fixes**: corrected spacing around the specs/accordion block, and fixed cover `alt` text so the main product image (not `alt=""` like the grid covers) carries a real description.
- **Category image sizes**: the three 4:5 category images (`cat-manga`, `cat-bluray`, `cat-merch`) now declare `width="800" height="1000"` to match the real files (spotted during the vault review).

### Known gaps / ideas

Deliberate scope cuts, not bugs — see [[Demo Notes#Likely TA questions]] for how to explain them:

- Checkout (`basket.html`) is a toast only ("Checkout is switched off: this is a student project") — no real order flow.
- No real stock exists for figures, Blu-ray or merch — those nav links show an "in the shop for now" panel instead.
- The header search only matches `manga.html`'s own titles/authors — there's no shared product data to search from other pages.
- The basket doesn't share state across pages in Firefox when opened via `file://` (works fine via the local server, or in Chrome/Edge either way) — see [[Decisions#Basket works double-clicked in Chrome/Edge, not Firefox]].
- Covers are ~333px wide in their source files but get stretched larger in some layouts, so they can look slightly soft on very large screens — see [[Images]].
- The hero's "any three volume 1s for €30" promo is copy only — `main.js` has no bundle/discount logic, so three volume-1s in the basket total at full price.

## 2026-09-24 (later) — interactive shelf + product template

Same day, later session, at the user's request:

- **`js/books.js` added**: a new 399-line data file, `const BOOKS = [ ... ]`, one object per book (id, title, series, volume, authors, price, publisher, pages, isbn, genres, status, due, isNew, description, note, optional `format`) for all 23 books. Loaded (defer, before `main.js`) on `index.html` and `product.html` only.
- **Homepage "New this week" row replaced by "New on the shelf"**, an interactive bookshelf: 11 `.spine` links + 2 `.shelf-cover` faced-out links on a plank, each spine colouring/sizing itself with inline CSS custom properties (`--spine`, `--spine-text`, `--h`, `--w`) and sideways text (`writing-mode: vertical-rl`). Hovering or keyboard-focusing a book lifts it and fills a `.shelf-preview` card next to the shelf; on tablet the preview moves below the shelf. New `js/main.js` block 8 and CSS block 14 (`css/style.css`, now 24 blocks). This is the original wireframe's shelf-of-spines idea, brought back in the v2 visual style — see [[Decisions#2026-09-24 (later): interactive shelf replaces "New this week"]].
- **`product.html` turned into a template**: `js/main.js` block 9 reads `?id=` with `URLSearchParams`, finds the matching book in `BOOKS`, and fills every `product-*`/`spec-*` element. No id, or an unrecognised one, shows `BOOKS[0]` (Frieren Vol. 1) — the same book the static HTML shows with JavaScript off. "More in this series" and "You might also like" are built by cloning a new `<template id="product-card">`, and every product link across the whole site (index, manga, basket, product) now points at `product.html?id=<id>` instead of a bare `product.html`.
- **Basket click handling switched to event delegation**: block 3 now uses one `document.addEventListener('click', ...)` + `event.target.closest('.js-add')` instead of attaching a listener to each `.js-add` button at load time, so buttons built later by JS (the shelf preview, the product-page rows) work too. Block 6 (basket page) got a matching page-wide listener, added after block 3's, to refresh the basket list once a "Popular right now" click has actually been saved.
- **`js/main.js` grew from 7 to 9 numbered blocks** (346 → 501 lines); `css/style.css` grew from 23 to 24 comment-delimited blocks.
- **Testing**: W3C Nu validator 0 errors on all 5 pages + CSS; axe-core 0 violations on index, manga, basket, and product.html with `?id=berserk-deluxe-01`/`frieren-02`/`look-back`/an unknown id; no horizontal overflow at 375/768/1440 on all of those; real keyboard Tab presses lift the focused shelf book and update the preview, matching mouse hover; basket additions from both the shelf preview and a JS-built product card land correctly on `basket.html`; every `product.html?id=` link site-wide matches a real `BOOKS` id. Full detail in [[Testing#Results (2026-09-24, later — shelf + product template)]].

### Known gaps / ideas (added this pass)

- Not a bug, but worth knowing for the demo: with JavaScript on, the `badge-ink` "You're here" label never actually shows in "More in this series" — the current book is filtered out of that row before the cards are built. It only exists in `product.html`'s hand-written no-JS fallback markup. See [[Design System#`.badge` (`-sun`, `-sakura`, `-ink`)]].
