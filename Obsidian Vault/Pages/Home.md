---
tags: [page, homepage]
---

# index.html — Homepage

Purpose: storefront landing page. A carousel hero, an interactive new-arrivals bookshelf, category tiles, a staff-picks band, a bestseller chart, pre-orders, events, and shop info. Built as a modern shop layout, not the brief's manga-panel wireframe — see [[Decisions#v2 redesign: modern shop look instead of the brief's manga-panel style]]. The old wireframe (`attachments/homepage-lowfi-wireframe.webp`) no longer describes this page section by section, though the bookshelf does bring its shelf-of-spines idea back. `js/books.js` (the `BOOKS` array) is loaded before `js/main.js` on this page — see [[JavaScript#books.js]].

`<h1 class="visually-hidden">Anime Haven: manga, figures and events in Dublin</h1>` — the only `<h1>`, kept hidden because the logo already shows the shop name (see [[Accessibility]]).

## 1. Hero — `<section class="wrap hero" aria-label="Featured this week">`

Two-column grid (`.hero`, `minmax(0, 2.1fr) minmax(0, 1fr)`): a carousel on the left, two `.tile`s stacked on the right.

- **Carousel** (`.carousel` → `.slides#slides`, 3 `.slide`s, CSS `scroll-snap-type: x mandatory`):
  1. `.slide-blush` — Frieren restock. `.badge.badge-sun` "Back in stock", `.fan` of 3 covers (`frieren-03/02/01.jpg`), `.btn` "Shop the series" → `product.html`, `.btn-light.js-add` "Add Vol. 1 to basket" (`data-id="frieren-01"`, price 11.99).
  2. `.slide-sun` — "Any three volume 1s for €30" promo. `.fan` of `sakamoto-days-01`, `haikyuu-01`, `dandadan-01`. `.btn` "Pick your three" → `manga.html`. **No add-to-basket button, and the €30 bundle price is never applied anywhere in the basket maths** — see [[Changelog#Known gaps / ideas]].
  3. `.slide-ink` — "Sofia's pick", Witch Hat Atelier. `.slide-quote` (Kalam font) testimonial. `.fan-single` (one book, `witch-hat-atelier-01.jpg`). `.btn.btn-sakura` "See the book" → `product.html`.
  - `.carousel-controls`: two `.carousel-btn`s (`data-dir="-1"`/`"1"`), driven by **JS block 4**, which scrolls `#slides` by one slide width and wraps at either end.
- **`.hero-tiles`**: `.tile` → `events.html` (`watch-night.jpg`, "Watch night"), `.tile` → `manga.html?cat=figures` (`figures.jpg`, "12 new figures").

## 2. New on the shelf — `id="shelf-heading"`, `.shelf-layout`

An interactive bookshelf — the wireframe's original shelf-of-spines idea, brought back in the v2 visual style (see [[Decisions#2026-09-24 (later): interactive shelf replaces "New this week"]]). Replaces the old plain "New this week" scrolling row.

- **The shelf** (`.shelf-scroll` > `<ul class="shelf">`): 11 `.spine` links + 2 `.shelf-cover` (faced-out) links, standing on a black plank (`.shelf`'s `border-bottom`) with a CSS `::after` bookend. In DOM order: Frieren Vol. 1–3 (spines), Frieren Vol. 4 (cover, €11.99), Chainsaw Man Vol. 1–2 (spines), Jujutsu Kaisen Vol. 1–2 (spines), Spy x Family Vol. 1–2 (spines), [Oshi no Ko] Vol. 1 (cover, €13.50), The Summer Hikaru Died Vol. 1 (spine), Dandadan Vol. 1 (spine). Every item is a real `<a href="product.html?id=...">` with `data-id`. Each `.spine` sets its own colour and size inline: `style="--spine: #2f6fb3; --spine-text: #fff; --h: 14rem"` (`--w` too, on the taller/wider ones) — sideways text via `writing-mode: vertical-rl`. Each `.shelf-cover` carries a `.price-sticker` and a `.visually-hidden` title span, since the price sticker alone doesn't name the book.
- **Hover or keyboard focus** on any book (`mouseenter`/`focus`, `js/main.js` block 8) adds `.is-active`: the book lifts 1.25rem with a pink glow, and fills the preview card. While the mouse is over the shelf, every *other* book fades to 55% opacity (`.shelf:hover :not(.is-active)`) — that fade doesn't trigger on keyboard focus, only on `:hover`.
- **`.shelf-preview`** card (on the right on desktop, below the shelf on tablet — see [[Responsive]]): cover, a "New this week"/"On the shelf" badge, title, authors, price, a "View book" link (`product.html?id=...`), and a `.btn.btn-light.js-add` "Add to basket" button whose `data-*` are rewritten to the highlighted book. Starts showing whichever book the static HTML already has in the preview (Frieren Vol. 4).
- "Browse all manga" (`.link-more`) → `manga.html`.

Details in [[JavaScript#8. Homepage shelf]], [[Design System#`.shelf` / `.spine` / `.shelf-cover` / `.shelf-preview`]] and [[Accessibility]].

## 3. Shop by category — `id="category-heading"`

`.category-grid` (4 `.tile`s, `aspect-ratio: 4/5`): Manga (`cat-manga.jpg`) → `manga.html`; Figures (`figures.jpg`) → `manga.html?cat=figures`; Blu-ray (`cat-bluray.jpg`) → `manga.html?cat=blu-ray`; Merch (`cat-merch.jpg`) → `manga.html?cat=merch`.

## 4. Sofia's picks — `<section class="band band-blush" aria-labelledby="picks-heading">`

`.picks` grid: `.picks-intro` (`.portrait` = `sofia.jpg`, alt "Sofia's signature" — see [[Decisions#Sofia's "portrait" is her signature]] — plus a short bio paragraph), then `.picks-list` of 3 `.pick`s, each a `.product-link` (cover + title) with a `.shelf-talker` handwritten note underneath: Witch Hat Atelier Vol. 1, Delicious in Dungeon Vol. 1, Look Back. All link to `product.html`.

## 5. Bestsellers in the shop — `id="best-heading"`

`<ol class="product-row product-row-5">` (ranked, `.rank` badge 1–5): One Piece Vol. 1, Frieren Vol. 1, Chainsaw Man Vol. 1, Jujutsu Kaisen Vol. 1, Spy x Family Vol. 1. "See the full chart" → `manga.html`.

## 6. Back soon — `id="preorder-heading"`

`<ul class="product-row product-row-4">`, all `.badge-sakura` "Pre-order" with a `.product-due` date: Berserk Deluxe Edition Vol. 1 (Due 9 Oct, €49.99), Vagabond VIZBIG Vol. 1 (Due 16 Oct, €24.99), The Apothecary Diaries Vol. 1 (Due 23 Oct, €13.99), Blue Period Vol. 1 (Due 30 Oct, €13.50). Buttons read "Pre-order" instead of "Add to basket" but are still `.js-add` (identical basket behaviour).

## 7. What's on in the shop — `id="events-heading"`

`.event-grid` of 3 `.event-card`s: Friday watch night (3 Oct, 7pm), Drawing club (11 Oct, 2pm), Halloween cosplay contest (31 Oct, 6pm) — same photos/copy as the first 3 rows of `events.html`. "All events" → `events.html`.

## 8. Come say hola — `id="visit"`

Address, `.hours` table, "Get directions" (OpenStreetMap search link), `shop.jpg` photo, live `<iframe class="visit-map">` embed. Identical markup to `events.html`'s own copy — see [[Architecture#No templating: header and footer are copy-pasted]].

## Footer

Shared markup (see [[Architecture]]). Restock `.signup` form handled by JS block 2.

## JS on this page

- Block 1 (mobile menu), block 2 (restock signup) — shared header/footer.
- **Block 3 (basket)** — one page-wide delegated click listener catches every `.js-add` button on this page (hero slide 1, shelf preview, bestsellers, back soon), adds to the localStorage basket and shows the toast; the header's `.basket-count` is kept in sync.
- **Block 4 (carousel)** — drives `.carousel-btn` clicks on `#slides`.
- **Block 8 (homepage shelf)** — `mouseenter`/`focus` on any `.spine`/`.shelf-cover` highlights it and fills `.shelf-preview` from `BOOKS`; see [[JavaScript#8. Homepage shelf]].
- Blocks 5, 6, 7, 9 find nothing on this page and do nothing.
