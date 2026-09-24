---
tags: [page, product]
---

# product.html — Product template

Purpose: **one page that shows any of the 23 books**, filled in by `js/main.js` block 9 from `js/books.js`'s `BOOKS` array, reading `?id=` from the address (`product.html?id=dandadan-01`). Every product link on every page now points at `product.html?id=<id>`, where `<id>` is the book's cover filename (e.g. `frieren-02`, `look-back`, `berserk-deluxe-01`). One template instead of 23 hand-written HTML files — see [[Decisions#2026-09-24 (later): interactive shelf replaces "New this week"]].

**Fallback:** if the address has no `?id=` at all, or an id that isn't in `BOOKS`, block 9 shows `BOOKS[0]` — **Frieren: Beyond Journey's End, Vol. 1**. That's also exactly what the static HTML below shows before JavaScript runs (with JavaScript off, or in a no-JS crawler), since the markup is hand-written for Frieren Vol. 1 and block 9 only *overwrites* it.

## Sections, in order

### 1. Breadcrumb — `<div class="wrap page-head">`
Home / Manga / the book's title (`id="breadcrumb-current"`, last item `aria-current="page"`, not a link — filled by `setText('breadcrumb-current', book.title)`). The "Manga" header-nav link also carries `aria-current="page"` here (see [[Architecture]]).

### 2. Cover + details — `<div class="wrap product-hero" id="product-page">`
`id="product-page"` is what block 9 checks for (`document.getElementById('product-page')`) to know it's running on this page.
- **Cover** (`#product-cover`): `images/covers/<id>.jpg`, `alt` rewritten to `'Cover of ' + book.title` (a generic but real description — the one cover image on the whole site that isn't `alt=""`, because there's no adjacent visible title text repeating it the way a `.product-title` does in a grid).
- **Badge** (`#product-badge`): `Pre-order` (`.badge-sakura`) if `book.status === 'pre-order'`, else `New this week` (`.badge-sun`) if `book.isNew`, else `In stock` (`.badge-sun`).
- `<h1 id="product-title">`, `.product-authors` (`#product-authors`, `'By ' + book.authors`), `.price-large` (`#product-price`, `'€' + book.price.toFixed(2)`).
- `.stock-line` (`#product-stock`): pre-order books show `'Due ' + book.due + ". Pre-order and we'll hold one for you."`; everything else shows the static line `'In stock in our Dublin 1 shop'`. **Not wired to any real per-book inventory count** — same simplification as before, just no longer a fake number.
- `.qty-row`: `<label for="quantity">Quantity</label>` + `<input type="number" id="quantity" min="1" max="10" value="1">` — static markup, not touched by JS.
- `.actions`: `#product-add` (`.btn.js-add`, `data-qty-input="quantity"`) — text is `Pre-order` for pre-order books, `Add to basket` otherwise; `data-id`/`data-title`/`data-price`/`data-cover` are rewritten to the current book. This is the one add-to-basket button on the whole site that reads its quantity from an input instead of always adding 1. Alongside it, `.btn.btn-light` "Reserve for click and collect" → `basket.html` (static, doesn't change per book).
- `.product-description` paragraph (`#product-description`, `book.description`).
- `.spec-list` (`<dl>`): Publisher (`#spec-publisher`, `book.publisher`), Format (`#spec-format`, `book.format || 'Paperback'` — see [[JavaScript#books.js]]), Pages (`#spec-pages`, `book.pages || 'Not listed'` — `null` for Jujutsu Kaisen Vol. 2, whose page count wasn't available), ISBN (`#spec-isbn`, `book.isbn`), Series (`#spec-series`, `book.series + ', volume ' + book.volume`).
- `.shelf-talker` (`#product-note`): Sofia's note, full `<div>` version with `.shelf-talker-label`. **Hidden (`hidden = !book.note`) for books without one** — 13 of the 23 books have `note: ''` in `books.js`.
- `.accordion-group`: two `<details>` — `id="shipping"` ("Shipping and click and collect") and `id="returns"` ("Returns") — the real targets of the footer's Shipping/Returns links, and the same on every book since the page's `id`s never change, only its content.

### 3. More in this series — `id="series-heading"`, `<ul class="product-row product-row-4" id="series-list">`
Built by block 9's `fillRow('series-list', ...)`: every other `BOOKS` entry with the same `series` as the current book (`book.id` itself excluded), each cloned from `<template id="product-card">` (see below). **The whole `<section>` is hidden (`hidden = true`) when the array is empty** — e.g. `product.html?id=look-back` or `?id=dandadan-01`, both single-volume books. `product.html?id=frieren-02` lists Frieren Vol. 1, 3 and 4.

### 4. You might also like — `id="also-heading"`, `<ul class="product-row product-row-5" id="also-list">`
Built by block 9's `also-list` fill: up to 5 books that share at least one genre with the current book, **one book per series, never the current book's own series** — walks `BOOKS` in array order and stops once it has 5. The section is hidden (`hidden = true`) if the list comes back empty, same `fillRow` helper as the series row above.

### The `<template id="product-card">`
A blank `<li class="product">` — cover `<img>`, `.badge`, `.product-title`, `.product-author`, `.product-price`, a `.btn-add.js-add` button — cloned once per book by block 9's `productCard(b)` for both rows above. Its fields are filled the same way the static product cards on other pages are hand-written: badge text/class set (or the whole `<span class="badge">` removed via `cardBadge.remove()` if the book is neither pre-order nor new), price gets `', due ' + b.due` appended for pre-orders, and the add button's `data-*` are set from the book.

## JS on this page

- Block 1 (mobile menu), block 2 (restock signup) — shared.
- **Block 3 (basket)** — one page-wide delegated click listener catches the hero's `.js-add` button (reads `#quantity`) and every `.js-add` built into the two rows below, including the ones block 9 creates from the `<template>` after block 3 has already run (see [[JavaScript#3. Basket]]).
- **Block 9 (product page)** — does everything described above: reads `?id=`, looks up `BOOKS`, falls back to `BOOKS[0]`, fills every `product-*`/`spec-*` id, and builds the two rows. See [[JavaScript#9. Product page]].
- Blocks 4, 5, 6, 7, 8 find nothing on this page and do nothing.

`js/books.js` is loaded (defer, before `js/main.js`) in this page's `<head>` — see [[Architecture#js/main.js — 9 numbered blocks]].
