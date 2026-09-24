---
tags: [design-system, css, components]
---

# Design System

All tokens live in `css/style.css`, block 1 (`:root`), see [[Architecture#css/style.css block map]].

## Colour tokens

| Token | Hex | Role |
|---|---|---|
| `--ink` | `#000000` | Text, main button fill |
| `--paper` | `#ffffff` | Page background |
| `--sakura` | `#ff8fb1` | Brand pink: badges, accents, logo mark, hero highlight |
| `--berry` | `#d93a73` | Focus ring only — comment in the code itself says "never small text: only 4.4:1 on white" |
| `--sun` | `#ffe45c` | "New" badges, price stickers, promo-bar hours, rank circles |
| `--tone` | `#cfcfcf` | Muted text on black (footer newsletter copy) |
| `--blush` | `#ffeef3` | Very light pink section background (`.band-blush`, halftone dots) |
| `--mist` | `#f4f4f4` | Light grey panels (`.filters`, `.visit-info`, `.order-summary`, `.category-feature`, `.book`'s empty background) |
| `--line` | `#e4e4e4` | Thin borders (nav underline, table rows, breadcrumb separators) |
| `--muted` | `#5c5c5c` | Secondary text (product author, footer links, muted paragraphs) |

### Contrast facts

- **Black text on `--sakura`: ≈ 9.8:1.**
- **`--muted` (`#5c5c5c`) on white: ≈ 6.7:1.**
- **`--berry` on white: ≈ 4.4:1** — this is *why* berry is used only as the `:focus-visible` ring (a 3:1 minimum applies to UI/non-text elements), never as body text. Confirmed by `grep -n berry css/style.css`: the only two hits are the token comment (line 13) and the single `outline: 3px solid var(--berry);` rule (line 119, block 2). It is never a `color` or `background`.
- **No white text is ever placed on `--sakura` or `--berry`.** Grep for `color: var(--paper)` finds 9 hits, and every one is paired with an `--ink` background or a dark photo-gradient overlay (promo bar, `.btn`, `.btn-add:hover`, `.badge-ink`, `.slide-ink`, `.tile-text` gradient, `.toast`) — never sakura or berry.
- `.badge-sakura` and `.btn-sakura` both explicitly set `color: var(--ink)` (black) on the sakura background, matching the 9.8:1 figure above.

## Fonts

| Token | Font | Role |
|---|---|---|
| `--font-display` | `"Dela Gothic One", "Arial Black", sans-serif` | `h1`, `h2` (only weight 400 exists), `.logo`, `.slide-title`, `.tile-title`, `.event-day-num`, `.rank` |
| `--font-body` | `"Zen Maru Gothic", "Trebuchet MS", sans-serif` | Body text and every UI control (set on `body`, weight 500 default) |
| `--font-hand` | `"Kalam", "Comic Sans MS", cursive` | Handwritten elements only: `.slide-quote` (Sofia's pick quote on the hero) and `.shelf-talker` |

Loaded via one Google Fonts `<link>` in every page's `<head>`: `Dela Gothic One`, `Kalam:wght@400;700`, `Zen Maru Gothic:wght@500;700;900`.

## Spacing, radius and shadow tokens

| Token | Value |
|---|---|
| `--space-2xs` | `0.25rem` |
| `--space-xs` | `0.5rem` |
| `--space-s` | `1rem` |
| `--space-m` | `1.5rem` |
| `--space-l` | `2.5rem` |
| `--space-xl` | `4rem` |
| `--space-2xl` | `6rem` |
| `--radius-s` | `8px` |
| `--radius-m` | `14px` |
| `--radius-l` | `22px` |
| `--book-shadow` | `0 1px 2px rgb(0 0 0 / 0.15), 0 14px 22px -12px rgb(0 0 0 / 0.5)` — a soft, blurred drop shadow under every `.book` cover, replacing v1's hard offset shadow (see [[Decisions]]) |
| `--page-width` | `82rem` |

## Component catalogue

### `.book`
Wrapper around every real cover `<img>`. `aspect-ratio: 2/3`, `overflow: hidden`, rounded corners biased to look like a paperback's right edge, `box-shadow: var(--book-shadow)`. A `::after` layer draws a thin gradient "spine crease" down the left edge.
```html
<span class="book"><img src="images/covers/frieren-01.jpg" alt="" width="400" height="600"></span>
```
Used on: index (hero fan, shelf preview cover, 2 product rows, picks), manga.html (grid), product.html (hero + 2 rows), basket.html (rows + empty-state row).

### `.shelf` / `.spine` / `.shelf-cover` / `.shelf-preview`
The homepage's "New on the shelf" interactive bookshelf (block 14 in [[Architecture#css/style.css block map]]; behaviour in [[JavaScript#8. Homepage shelf]]). `.shelf-scroll` (`overflow-x: auto`) holds a `<ul class="shelf">` (`display: flex; align-items: flex-end`) with a 14px `border-bottom` acting as the plank and a `::after` pseudo-element drawn as a bookend at the end.

Two kinds of book, both real `<a href="product.html?id=...">` links with `data-id`:
- **`.spine`** — sideways text via `writing-mode: vertical-rl`. Colour and size are **per-book inline CSS custom properties** in the `style` attribute, not classes, so there's no "book colour" rule in the stylesheet at all — the CSS only ever reads `var(--spine)`/`var(--spine-text)`/`var(--h, 2.6rem)`/`var(--w, 14rem)`.
  ```html
  <a class="spine" href="product.html?id=jujutsu-kaisen-01" data-id="jujutsu-kaisen-01"
     style="--spine: #1f5e63; --spine-text: #fff; --h: 15rem; --w: 2.9rem">Jujutsu Kaisen <span>1</span></a>
  ```
- **`.shelf-cover`** — a book faced out with a real cover image and a circular `.price-sticker`. The link's accessible name comes from a `.visually-hidden` span (the price sticker text alone wouldn't name the book).
  ```html
  <a class="shelf-cover" href="product.html?id=frieren-04" data-id="frieren-04">
    <img src="images/covers/frieren-04.jpg" alt="" width="400" height="600">
    <span class="price-sticker">€11.99</span>
    <span class="visually-hidden">Frieren: Beyond Journey's End, Vol. 4</span>
  </a>
  ```

Hover or keyboard focus (`js/main.js` block 8) adds **`.is-active`**: `transform: translateY(-1.25rem)` plus a `--sakura` glow (`box-shadow`). While the mouse is over `.shelf`, every other `.spine`/`.shelf-cover` fades to `opacity: 0.55` (`.shelf:hover :not(.is-active)`) — a hover-only rule, so keyboard focus never fades the rest of the shelf. Reduced motion turns off the lift/fade `transition` (not the lift itself) on `.spine`/`.shelf-cover`, see [[Responsive#Reduced motion — `@media (prefers-reduced-motion: reduce)`, block 24]].

**Contrast:** every `.spine`'s `--spine`/`--spine-text` pair clears the 4.5:1 text minimum — lowest is Frieren's blue-on-white at 5.19:1; the rest run from 6.2:1 (Chainsaw Man Vol. 1) up to 16.5:1 (Spy x Family Vol. 2, Dandadan).

**`.shelf-preview`**: a `.blush`-background card next to the shelf (`grid-template-columns: 8rem 1fr`) showing whichever book is highlighted — cover, badge, title, author, price, a "View book" link and a `.btn.btn-light.js-add` "Add to basket" button. Moves below the shelf at tablet width, see [[Responsive]].
```html
<div class="shelf-preview">
  <span class="book"><img id="preview-cover" src="images/covers/frieren-04.jpg" alt="" width="400" height="600"></span>
  <div>
    <p class="badge badge-sun" id="preview-badge">New this week</p>
    <h3 id="preview-title">Frieren: Beyond Journey's End, Vol. 4</h3>
    <p class="product-author" id="preview-author">Kanehito Yamada, Tsukasa Abe</p>
    <p class="product-price" id="preview-price">€11.99</p>
    <a class="btn" id="preview-link" href="product.html?id=frieren-04">View book</a>
    <button class="btn btn-light js-add" id="preview-add" type="button" data-id="frieren-04" data-title="…" data-price="11.99" data-cover="…">Add to basket</button>
  </div>
</div>
```
Used on: index only (`id="shelf-heading"` section).

### `.product` / `.product-link` / `.product-row` (`-4`, `-5`) / `.product-grid`
`.product-row` is `display: grid; grid-auto-flow: column` with `--columns` controlling `grid-auto-columns` — a shelf that scrolls sideways with `scroll-snap-type: x mandatory` once it runs out of room. `.product-row-5`/`.product-row-4` just override `--columns`. `.product-grid` (manga.html only) is a normal `repeat(auto-fill, minmax(11rem, 1fr))` grid, no scrolling. Either way each item is one `.product` `<li>` with a `.product-link` wrapping the cover + title.
```html
<li class="product">
  <a class="product-link" href="product.html">
    <span class="book"><img src="images/covers/one-piece-01.jpg" alt="" width="400" height="600" loading="lazy"><span class="rank">1</span></span>
    <span class="product-title">One Piece, Vol. 1</span>
  </a>
  <p class="product-author">Eiichiro Oda</p>
  <p class="product-price">€10.99</p>
  <button class="btn-add js-add" type="button" data-id="one-piece-01" data-title="One Piece, Vol. 1" data-price="10.99" data-cover="images/covers/one-piece-01.jpg">Add to basket<span class="visually-hidden">: One Piece, Vol. 1</span></button>
</li>
```
Used on: index (`.product-row-5` bestsellers, `.product-row-4` back soon — 2 rows; the old "New this week" `.product-row` was replaced by the `.shelf` component above), manga.html (`.product-grid`), product.html (`.product-row-4`, `.product-row-5`), basket.html empty state (`.product-row-5`).

### `.btn` / `.btn-light` / `.btn-sakura` / `.btn-add`
`.btn`: solid black pill, `:hover` swaps to sakura background + black text. `.btn-light`: white with a black border, `:hover` → sun background. `.btn-sakura`: sakura fill + black text from the start, `:hover` → white. `.btn-add`: small full-width pill under each cover, white by default, `:hover` inverts to black.
```html
<a class="btn" href="manga.html">Pick your three</a>
<a class="btn btn-light" href="https://www.openstreetmap.org/...">Get directions</a>
<button class="btn btn-sakura" type="submit">Sign up</button>
<button class="btn-add js-add" type="button" data-id="…">Add to basket</button>
```
Used everywhere (nav CTAs, hero actions, footer signup, every product card).

### `.badge` (`-sun`, `-sakura`, `-ink`)
Small pill label positioned absolutely over the top-left corner of a `.book`.
```html
<span class="book"><img src="…" alt=""><span class="badge badge-sun">New</span></span>
```
`badge-sun` = "New"/"Back in stock", `badge-sakura` = "Pre-order"/"Sofia's pick", `badge-ink` = "This month" (hero slide 2). `badge-ink` "You're here" only exists in product.html's hand-written no-JS fallback markup (Frieren Vol. 1's own row in "More in this series") — `js/main.js` block 9's `productCard()` never produces it, since the current book is filtered *out* of the series row before the cards are built (see [[JavaScript#9. Product page]]), so with JavaScript on, "You're here" never actually shows.

### `.rank`
A circular sun-coloured number over a `.book`, used only in ranked lists.
```html
<span class="book"><img src="…" alt=""><span class="rank">1</span></span>
```
Used on: index Bestsellers row (1–5), basket.html empty-state "Popular right now" row (1–5).

### `.tile`
A photo card: `<img>` absolutely filling the box with `object-fit: cover`, a dark gradient `.tile-text` overlay pinned to the bottom holding `.tile-kicker` + `.tile-title`.
```html
<a class="tile" href="events.html">
  <img src="images/photos/watch-night.jpg" alt="" width="800" height="600">
  <span class="tile-text">
    <span class="tile-kicker">Friday, 7pm, free</span>
    <span class="tile-title">Watch night</span>
  </span>
</a>
```
Used on: index hero (2 tiles) and "Shop by category" (`.category-grid`, 4 tiles, `aspect-ratio: 4/5`).

### `.slide` / `.fan`
`.slide` is one carousel panel (`.slide-blush`/`-sun`/`-ink` background variants, each a `repeating-conic-gradient` "speedline" burst over a flat colour). `.fan` places 3 `.book`s in the *same* grid cell (`grid-area: 1 / 1`) and nudges/rotates the first two sideways with `transform`, so they read as a fanned stack behind the front cover. `.fan-single` is the one-book version (just a slight rotation).
```html
<article class="slide slide-blush">
  <div class="slide-text">…</div>
  <div class="fan" aria-hidden="true">
    <span class="book"><img src="images/covers/frieren-03.jpg" alt="" width="400" height="600"></span>
    <span class="book"><img src="images/covers/frieren-02.jpg" alt="" width="400" height="600"></span>
    <span class="book"><img src="images/covers/frieren-01.jpg" alt="" width="400" height="600"></span>
  </div>
</article>
```
Used on: index hero only (3 slides).

### `.shelf-talker`
A handwritten (`--font-hand`) note. On product.html it's a `<div>` with a label + note text and a small pink "tape" strip drawn with `::before`; on index (Sofia's picks) it's a plain `<p class="shelf-talker">` per pick, no wrapper needed.
```html
<div class="shelf-talker">
  <p class="shelf-talker-label">Sofia's note</p>
  <p>I put off starting this for a year because "sad elf" didn't sound like my thing…</p>
</div>
```
Used on: index (3× under Sofia's picks, plain `<p>`), product.html (1×, full `<div>` version with the tape strip and label).

### `.event-card`
Used only on index's "What's on" row: photo (`aspect-ratio: 4/3`), `.event-date` (wraps a `<time datetime>`), `<h3><a>` title, description paragraph.
```html
<li class="event-card">
  <img src="images/photos/watch-night.jpg" alt="Frieren playing on the shop's big screen, with rows of fans watching" width="800" height="600" loading="lazy">
  <p class="event-date"><time datetime="10-03">3 Oct</time>, 7pm</p>
  <h3><a href="events.html">Friday watch night</a></h3>
  <p>Frieren, episodes 1 to 3, on the big screen. Popcorn is on us.</p>
</li>
```

### `.event-row`
events.html's own list item (different from `.event-card`): a day-number block, a photo, and a body with `<h2>`, `.event-date`, description and a `.btn.reserve-btn`.
```html
<li class="event-row">
  <div class="event-day-block"><time datetime="10-11"><span class="event-day-num">11</span><span class="event-day-month">Oct</span></time></div>
  <img src="images/photos/drawing-club.jpg" alt="…" width="800" height="600" loading="lazy">
  <div class="event-row-body">
    <h2>Drawing club</h2>
    <p class="event-date">2pm</p>
    <p>All levels welcome…</p>
    <button class="btn reserve-btn" type="button" data-event="Drawing club">Save a spot<span class="visually-hidden">: Drawing club</span></button>
  </div>
</li>
```

### `.visit`
3-column info block: `.visit-info` (mist background, address + `.hours` table + "Get directions"), a shop photo, and a live OpenStreetMap `<iframe class="visit-map">`.
```html
<section class="wrap section visit" id="visit" aria-labelledby="visit-heading">
  <div class="visit-info">…</div>
  <img class="visit-photo" src="images/photos/shop.jpg" alt="Inside Anime Haven: tall shelves of manga and a pink neon sign" width="800" height="1000" loading="lazy">
  <iframe class="visit-map" title="Map of Anime Haven in Dublin 1" src="https://www.openstreetmap.org/export/embed.html?…" loading="lazy"></iframe>
</section>
```
Used on: index and events.html (pasted twice, see [[Architecture]]).

### `.breadcrumb`
```html
<nav aria-label="Breadcrumb">
  <ol class="breadcrumb">
    <li><a href="index.html">Home</a></li>
    <li aria-current="page" id="breadcrumb-current">Manga</li>
  </ol>
</nav>
```
Used on: manga.html, product.html. Not on index/events/basket.

### `.accordion`
Two native `<details>` elements grouped in `.accordion-group`, targeted by the footer's Shipping/Returns links.
```html
<details class="accordion" id="shipping">
  <summary>Shipping and click and collect</summary>
  <p>Free click and collect from our Dublin 1 shop…</p>
</details>
```
Used on: product.html only (`#shipping`, `#returns`).

### `.toast`
Created entirely by JS (`js/main.js` block 3), not present in any HTML file. `position: fixed`, parked below the viewport (`translate(-50%, calc(100% + 3rem))`), slides up via `.is-visible`. `role="status"` is set in JS so screen readers announce it.
```js
const toast = document.createElement('p');
toast.className = 'toast';
toast.setAttribute('role', 'status');
document.body.appendChild(toast);
```
Shown on: every "Add to basket" click, checkout click, and "Save a spot" click, on every page.

### `.band-blush` / `.band-ink`
Full-width coloured strip; the content inside still uses `.wrap` for the centred column. `.band-blush` adds a halftone-dot `radial-gradient` texture over `--blush`. `.band-ink` is the newsletter footer band: `--ink` background, `--paper` text.
```html
<section class="band band-blush" aria-labelledby="picks-heading">
  <div class="wrap picks">…</div>
</section>
```
Used on: index (`.band-blush` around Sofia's picks), all 5 pages' footer (`.band-ink` around the newsletter).

### `.section-head`
Heading (+ optional one-line subtitle) on the left, a "view all" link on the right, wrapping on narrow screens.
```html
<div class="section-head">
  <div><h2 id="best-heading">Bestsellers in the shop</h2><p>What Dublin bought most this month.</p></div>
  <a class="link-more" href="manga.html">See the full chart</a>
</div>
```
Used throughout index and product.html's row headings.

### `.visually-hidden` / `.skip-link`
Standard offscreen-but-readable technique, and a skip link that becomes visible on focus.
```html
<a class="skip-link" href="#main">Skip to main content</a>
<h1 class="visually-hidden">Anime Haven: manga, figures and events in Dublin</h1>
```
Used on: every page (skip link is always the first element in `<body>`), the homepage `<h1>`, every icon-only button's label, and disambiguating suffixes on repeated "Add to basket" buttons.

### `.wrap`
Layout helper, not a visual component: `width: min(100% - 2rem, var(--page-width))`, `margin-inline: auto`.
```html
<div class="wrap header-main">
```
Used throughout every page.
