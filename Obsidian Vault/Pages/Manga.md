---
tags: [page, manga]
---

# manga.html — Category page

Purpose: the manga grid, plus the placeholder that Figures/Blu-ray/Merch reuse. Only one HTML file; which mode it's in is decided entirely by **JS block 5** reading `?cat=` from the URL.

## Sections, in order

### 1. Breadcrumb + heading — `<div class="wrap page-head">`
`<nav aria-label="Breadcrumb">` → `.breadcrumb` (Home / current, `<li id="breadcrumb-current" aria-current="page">`). `<h1 id="page-heading">Manga</h1>`. `<p class="result-count" id="result-count" aria-live="polite">Showing 23 of 23 titles</p>` — the "23 of 23" is computed live by JS, not static copy (unlike v1).

### 2. Filters + product grid — `<div class="wrap category-layout" id="category-layout">`
Only shown for the plain manga list (no `?cat=`, or `?cat=` not recognised).

- **`<aside><form id="filters" class="filters">`**:
  - `<fieldset>Genre</fieldset>`: 7 checkboxes, `name="genre"`, values `action`/`comedy`/`drama`/`fantasy`/`horror`/`slice-of-life`/`sports`.
  - `<fieldset>Availability</fieldset>`: 2 checkboxes, `name="availability"`, values `in-stock`/`pre-order`.
  - `<fieldset>Price</fieldset>`: `<input type="range" id="max-price" min="10" max="50" step="1" value="50">` + `<output for="max-price">`.
  - `<button class="btn btn-light filters-clear" type="reset">Clear filters</button>`.
- **Right column**: `.sort-row` (`<label for="sort">` + `<select id="sort">`, options `featured`/`newest`/`price-asc`/`price-desc`/`az`), then `<ul class="product-grid" id="product-grid">` of 23 `.product` `<li>`s, then `<div class="empty-state" id="empty-state" hidden>` with a "Clear filters" button (`id="empty-clear"`).

Every `.product` `<li>` carries the data the filters/sort/search read: `data-genres`, `data-status`, `data-price`, `data-date`, `data-title` — see [[JavaScript#5. Category page]] for the full mechanism.

All 23 titles: Frieren Vol. 1–4, Chainsaw Man Vol. 1–2, Spy x Family Vol. 1–2, Jujutsu Kaisen Vol. 1–2, One Piece Vol. 1, Dandadan Vol. 1, [Oshi no Ko] Vol. 1, Witch Hat Atelier Vol. 1, Delicious in Dungeon Vol. 1, Sakamoto Days Vol. 1, Look Back, Haikyu!! Vol. 1, The Summer Hikaru Died Vol. 1, Berserk Deluxe Edition Vol. 1, Vagabond VIZBIG Vol. 1, The Apothecary Diaries Vol. 1, Blue Period Vol. 1.

### 3. "In the shop for now" placeholder — `<section class="wrap category-feature" id="in-store" hidden>`
Shown instead of section 2 when `?cat=figures`, `?cat=blu-ray` or `?cat=merch` is recognised. `<img id="in-store-photo">` + `<h2 id="in-store-heading" class="visually-hidden">In the shop</h2>` + `<p id="in-store-text">`, plus two `.btn`s: "Find the shop" (→ `index.html#visit`) and "Browse manga" (→ `manga.html`). All of the photo/alt/text are rewritten by JS from a lookup table — see below.

## The `?cat=` placeholder, in full (JS block 5(a))

```js
const categoryInfo = {
  figures: { label: 'Figures', photo: 'images/photos/figures.jpg', alt: 'Boxed figures from Chainsaw Man, Frieren, Spy x Family and more in a pink-lit glass cabinet', text: "Our figures live in the shop for now. New ones land every Thursday, so come and have a look." },
  'blu-ray': { label: 'Blu-ray', photo: 'images/photos/cat-bluray.jpg', alt: '…', text: "Our Blu-ray shelf lives in the shop for now…" },
  merch: { label: 'Merch', photo: 'images/photos/cat-merch.jpg', alt: '…', text: "Our totes, pins and stationery live in the shop for now…" }
};
```
When `cat` matches a key: page `<title>` and `#page-heading`/`#breadcrumb-current` text change to the label, `#result-count` and `#category-layout` are hidden, `#in-store` is un-hidden and filled from the table, and `aria-current="page"` is moved from "Manga" onto the matching nav link (`.nav-list a[href="manga.html?cat=..."]`). This exists because Figures/Blu-ray/Merch have no real stock — see [[Decisions#Figures/Blu-ray/Merch nav links show an "in the shop for now" panel]].

## The search box (`?q=`)

The header's `<form class="search" action="manga.html" role="search">` submits `?q=...` here. JS block 5(b) reads `params.get('q')`, pre-fills `#search` with it, and filters `.product` items by substring match against `data-title` and the `.product-author` text — manga.html titles/authors only, nothing else on the site is searched (see [[JavaScript]] and [[Demo Notes#Likely TA questions]]).

## JS on this page

- Block 1 (mobile menu), block 2 (restock signup), **block 3 (basket — every `.js-add` in the grid)** — shared.
- **Block 5 (category page)** is the one that matters here: the `?cat=` placeholder switch, the `?q=` search, the genre/availability/price filters (`applyFilters`, toggling `[hidden]` on `.product`), and the sort dropdown (`appendChild`-reordering the grid). No pagination — see [[Decisions#Pagination dropped]].
