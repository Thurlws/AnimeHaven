---
tags: [architecture, css, js]
---

# Architecture

## File tree

```
anime-haven/
  index.html
  manga.html
  product.html
  events.html
  basket.html
  css/
    style.css
  js/
    main.js
    books.js   the BOOKS array (all 23 books) — see [[JavaScript#books.js]]; loaded (defer, before main.js) only on index.html and product.html
  images/
    covers/    23 real manga cover JPGs (Open Library) — see [[Images]]
    photos/    10 illustrated "photo" JPGs (art-source/artboards.html renders) — see [[Images]]
art-source/
  artboards.html   generates the 10 illustrated photos; not linked from the live site
```

No build step, no framework, no server-side code. Every page opens directly from disk. `.claude/launch.json` also defines a local static server for preview (`npx -y http-server anime-haven -p 5173 -c-1`, see [[Testing]]).

## No templating: header and footer are copy-pasted

All 5 pages carry an **identical** `<header class="site-header">…</header>` and `<footer class="site-footer">…</footer>` block, copy-pasted whole into each HTML file — there is no include/component mechanism. **Consequence: a header or footer change is 5 hand-edits, one per file.**

The only per-page difference inside the shared header is which nav `<li><a>` carries `aria-current="page"`:

| Page | Nav item with `aria-current="page"` |
|---|---|
| `index.html` | none — the homepage isn't a nav item |
| `manga.html` | "Manga" (also sets `id="breadcrumb-current"` on the breadcrumb, and `js/main.js` block 5 moves `aria-current` onto "Figures"/"Blu-ray"/"Merch" instead when `?cat=` is present) |
| `product.html` | "Manga" (hardcoded in the shared header markup — every book shown via `?id=` is a manga volume, so this never needs to change per book) |
| `events.html` | "Events" |
| `basket.html` | none — the basket isn't a nav item |

The footer is byte-identical across all 5 pages: same Instagram/TikTok/Discord links, same Shop/Help nav columns, same restock `<form class="signup">`, same one-line copyright ("Anime Haven is a fictional shop, made for the CMPU 1031 Web Development project. Cover images belong to their publishers.").

`index.html` and `events.html` also both carry a full copy of the "Come say hola" section (`<section class="wrap section visit" id="visit">`: address, hours table, "Get directions" link, shop photo, live OpenStreetMap `<iframe>`). It's pasted into both files, not shared. `manga.html`, `product.html` and `basket.html` do not have this section.

## css/style.css block map

One file, ordered per its own top comment: "tokens > base > layout > components > sections > pages > responsive". **Line numbers drift as the file is edited — search the exact block comment text below, don't trust the numbers.**

| # | Block comment (exact text) | ~Line | Main classes |
|---|---|---|---|
| 1 | `---------- 1. Design tokens: colours, fonts, spacing ----------` | 7 | `:root` custom properties only — see [[Design System]] |
| 2 | `---------- 2. Base styles ----------` | 47 | `body`, `img`, `h1,h2,h3`, `a`, `button,input,select`, `:focus-visible`, `.icon`, `.visually-hidden`, `.skip-link` |
| 3 | `---------- 3. Layout helpers ----------` | 168 | `.wrap`, `.section`, `.band`, `.band-blush`, `.band-ink`, `.section-head`, `.link-more` |
| 4 | `---------- 4. Buttons and badges ----------` | 218 | `.btn`, `.btn-light`, `.btn-sakura`, `.btn-add`, `.badge`, `.badge-sun`/`-sakura`/`-ink` |
| 5 | `---------- 5. Header: promo bar, logo, search, basket, nav ----------` | 297 | `.promo-bar`, `.header-main`, `.logo`, `.logo-mark`, `.search`, `.search-btn`, `.header-link`, `.basket-count`, `.menu-toggle`, `.site-nav`, `.nav-list` |
| 6 | `---------- 6. Books: real covers made to look like paperbacks ----------` | 441 | `.book`, `.book::after` (spine crease), `.book .badge`, `.rank` |
| 7 | `---------- 7. Product rows: a shelf of books that scrolls sideways when it runs out of room ----------` | 497 | `.product-row`, `.product-row-5`, `.product-row-4`, `.product`, `.product-link`, `.product-title`, `.product-author`, `.product-price`, `.product-due` |
| 8 | `---------- 8. Hero: carousel of slides + two photo tiles ----------` | 562 | `.hero`, `.carousel`, `.slides`, `.slide`, `.slide-blush`/`-sun`/`-ink`, `.slide-text`, `.slide-title`, `.slide-quote`, `.fan`, `.fan-single`, `.carousel-controls`, `.carousel-btn`, `.hero-tiles` |
| 9 | `---------- 9. Photo tiles (hero and categories) ----------` | 707 | `.tile`, `.tile-text`, `.tile-title`, `.tile-kicker`, `.category-grid` |
| 10 | `---------- 10. Sofia's picks: portrait + covers with handwritten shelf talkers ----------` | 767 | `.picks`, `.portrait`, `.picks-intro`, `.picks-list`, `.shelf-talker`, `.shelf-talker::before` |
| 11 | `---------- 11. Events: cards with photo, date, title ----------` | 830 | `.event-grid`, `.event-card`, `.event-date`, `.event-card h3` |
| 12 | `---------- 12. Come say hola: info, photo, live map ----------` | 866 | `.visit`, `.visit-info`, `address`, `.hours`, `.visit-photo`, `.visit-map` |
| 13 | `---------- 13. Newsletter, footer and the basket message ----------` | 914 | `.site-footer`, `.newsletter`, `.signup`, `.footer-main`, `.footer-col`, `.footer-bottom`, `.toast` |
| 14 | `---------- 14. New on the shelf: an interactive bookshelf (homepage) ----------` | 1019 | `.shelf-layout`, `.shelf-scroll`, `.shelf`, `.shelf::after` (bookend), `.spine`, `.shelf-cover`, `.price-sticker`, `.is-active`, `.shelf-preview` — see [[Design System#`.shelf` / `.spine` / `.shelf-cover` / `.shelf-preview`]] |
| — | `PAGE STYLES (manga, product, events, basket) go below this line` | 1159 | section divider comment |
| 15 | `---------- Shared: page intro + breadcrumb ----------` | 1162 | `.page-head`, `.breadcrumb`, `.result-count` |
| 16 | `---------- Category page: filters sidebar ----------` | 1210 | `.category-layout`, `.filters`, `.filter-choice`, `.price-field`, `.filters-clear` |
| 17 | `---------- Category page: product grid + empty state ----------` | 1274 | `.sort-row`, `.product-grid`, `.product[hidden]`, `.empty-state` |
| 18 | `---------- Category page: "in the shop for now" placeholder ----------` | 1308 | `.category-feature` |
| 19 | `---------- Product page: hero, stock line, specs, accordion ----------` | 1334 | `.product-hero`, `.price-large`, `.stock-line`, `.stock-dot`, `.qty-row`, `.spec-list`, `.shelf-talker-label`, `.accordion-group`, `.accordion` |
| 20 | `---------- Events page: featured event + event list ----------` | 1446 | `.event-featured`, `.event-list`, `.event-row`, `.event-day-block`, `.event-day-num`, `.event-day-month` |
| 21 | `---------- Basket page: item rows + order summary ----------` | 1514 | `.basket-layout`, `.basket-list`, `.basket-row`, `.basket-remove`, `.qty-control`, `.qty-btn`, `.order-summary`, `.summary-row`, `.summary-total`, `.basket-empty` |
| — | `RESPONSIVE` | 1655 | section divider comment |
| 22 | `---------- Tablet: 960px and narrower ----------` (`@media (max-width: 60rem)`) | 1658 | see [[Responsive]] |
| 23 | `---------- Mobile: 600px and narrower ----------` (`@media (max-width: 37.5rem)`) | 1772 | see [[Responsive]] |
| 24 | `---------- Reduced motion: no lifting, sliding or zooming ----------` (`@media (prefers-reduced-motion: reduce)`) | 1937 | see [[Responsive]] |

Full component-by-component detail (what each class looks like, minimal markup snippet) is in [[Design System]].

### Which page uses which block

| Block(s) | index | manga | product | events | basket |
|---|---|---|---|---|---|
| 1 tokens, 2 base, 3 layout, 4 buttons/badges, 5 header, 13 footer/toast | yes | yes | yes | yes | yes |
| 6 books (`.book`) | yes (hero fan, shelf preview, rows, picks) | yes (grid) | yes (hero cover, rows) | no | yes (rows, empty state) |
| 7 product rows (`.product`, `.product-link`, …) | yes (2 rows: bestsellers, back soon) | yes (`.product`/`.product-link` reused inside `.product-grid`, not `.product-row` itself) | yes (2 rows) | no | yes (empty-state row) |
| 8 hero/carousel | yes only | no | no | no | no |
| 9 photo tiles/category grid | yes only | no | no | no | no |
| 10 picks/shelf-talker | yes (`.picks`) + product (`.shelf-talker` reused for Sofia's note) | no | yes | no | no |
| 11 events cards (`.event-card`) | yes ("what's on") | no | no | `.event-date` class reused, but `.event-card` itself isn't (events.html uses block 20 instead) | no |
| 12 visit/map | yes | no | no | yes | no |
| 14 shelf (`.shelf`, `.spine`, `.shelf-cover`, `.shelf-preview`) | yes only ("New on the shelf") | no | no | no | no |
| 15 page-head/breadcrumb | no (no page-head at all) | yes | yes | `.page-head` only, no breadcrumb | `.page-head` only, no breadcrumb |
| 16–18 category layout/filters/feature | no | yes only | no | no | no |
| 19 product hero/accordion | no | no | yes only | no | no |
| 20 events page layout | no | no | no | yes only | no |
| 21 basket layout | no | no | no | no | yes only |

## js/main.js — 9 numbered blocks

One file, `<script src="js/main.js" defer>` on all 5 pages. Each block guards on `if (element) { … }`, so the same file runs safely everywhere even though several blocks only find their target on one page. Blocks 8 and 9 also read `BOOKS` from `js/books.js`, which is loaded (defer, before main.js) only on `index.html` and `product.html` — see [[JavaScript#books.js]]. Full detail (data read, code excerpts) is in [[JavaScript]].

| # | Block (comment text) | ~Lines | Runs on |
|---|---|---|---|
| 1 | Mobile menu | 6–18 | All 5 pages (shared header) |
| 2 | Thursday restock email (footer) | 21–31 | All 5 pages (shared footer) |
| 3 | Basket (get/save/render count, toast, `addToBasket`, one page-wide delegated click listener for every `.js-add`) | 34–124 | All 5 pages (basket count in header; `.js-add` buttons on index/manga/product/basket) |
| 4 | Homepage carousel | 127–148 | `index.html` only — `#slides` doesn't exist elsewhere |
| 5 | Category page (filters, sort, search, `?cat=` placeholder) | 151–253 | `manga.html` only — `#product-grid` doesn't exist elsewhere |
| 6 | Basket page (render rows from `<template>`, qty +/−, remove, checkout toast, page-wide refresh listener) | 256–341 | `basket.html` only — `#basket-list` doesn't exist elsewhere |
| 7 | Save a spot (events page) | 344–351 | `events.html` only — `.reserve-btn` doesn't exist elsewhere |
| 8 | Homepage shelf (hover/focus lifts a book, fills the preview card) | 354–393 | `index.html` only — `.shelf` doesn't exist elsewhere |
| 9 | Product page (fills product.html from `BOOKS` via `?id=`, builds the series/also-like rows) | 396–501 | `product.html` only — `#product-page` doesn't exist elsewhere |

The file is 501 lines; search the `// N.` comment rather than trusting line numbers if it grows.
