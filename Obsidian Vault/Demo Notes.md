---
tags: [demo, concepts]
---

# Demo Notes

Plain-English explanations for every concept used, for explaining the code to a Lab TA. See [[Architecture]], [[Design System]] and [[JavaScript]] for exact locations.

## CSS custom properties
Variables set once on `:root` (block 1) and reused everywhere with `var(--name)`. Change a colour or spacing value in one place, the whole site updates. **Where:** all of block 1.

## Inline CSS custom properties (per-element, not `:root`)
A custom property doesn't have to live on `:root` — it can be set right in an element's own `style` attribute, scoping it to just that element and whatever it's inherited by. Each `.spine` on the homepage shelf sets its own `--spine` (background), `--spine-text` (text colour) and `--h`/`--w` (size) this way: `style="--spine: #2f6fb3; --spine-text: #fff; --h: 14rem"`. The CSS rule itself never changes — `background: var(--spine); color: var(--spine-text); height: var(--h, 14rem);` — only the values fed into it per book, straight from the HTML rather than from a class or a stylesheet rule. **Where:** `.spine`, block 14; see [[Design System#`.shelf` / `.spine` / `.shelf-cover` / `.shelf-preview`]].

## `writing-mode`
`writing-mode: vertical-rl` rotates the whole flow of text so it reads top-to-bottom instead of left-to-right — the standard way to fake a real book's spine, where the title runs sideways up the binding. No transform or rotated `<span>` needed; the browser reflows the text itself. **Where:** `.spine`, block 14.

## `min()`
`width: min(100% - 2rem, var(--page-width));` (`.wrap`) picks whichever is *smaller*: full width minus a 1rem gutter each side, or the fixed 82rem max width. Small screens get the gutter version; huge screens stop growing at 82rem. **Where:** `.wrap`, block 3.

## `clamp()`
`clamp(min, preferred, max)` scales smoothly between two limits using a middle expression that usually involves `vw` (viewport width), never going below `min` or above `max`. Used so `h1`/`h2` grow with the screen without getting huge or unreadable. **Where:** `h1`, `h2` (block 2), `.slide-title` (block 8).

## Grid vs. flex
Flexbox lays things out along one axis (nav links, form rows, `.actions` buttons). Grid lays out rows *and* columns at once — used for the hero, product grids, the visit/footer layouts. **Where:** `.hero`, `.product-grid`, `.category-layout`, `.footer-main`, etc.

## `minmax(0, 1fr)` on the hero
`.hero { grid-template-columns: minmax(0, 2.1fr) minmax(0, 1fr); }`. Without the `minmax(0, …)`, a grid track's default minimum is `auto`, which means "at least as wide as my widest child" — the wide `.slides` carousel would force its column wider than intended. `minmax(0, …)` lets the column actually shrink to the `fr` share instead. **Where:** `.hero`, block 8.

## `grid-auto-flow: column` shelves + `scroll-snap`
`.product-row { grid-auto-flow: column; grid-auto-columns: calc(...); overflow-x: auto; scroll-snap-type: x mandatory; }` lays items out left-to-right in a single row that keeps growing sideways instead of wrapping, then lets it scroll. `scroll-snap-type: x mandatory` + each `.product { scroll-snap-align: start; }` makes the row stop with a book's left edge aligned to the frame, instead of stopping mid-book. **Where:** `.product-row` (block 7), `.slides` (block 8, `grid-auto-columns: 100%` — one slide per "page").

## `aspect-ratio` + `object-fit`
`aspect-ratio` forces a box to keep a fixed width:height ratio regardless of content, with no JS. `object-fit: cover` then crops an `<img>` to fill that box without distorting it. Together: `.book { aspect-ratio: 2/3; } .book img { object-fit: cover; }` keeps every cover the same shape even though the real JPGs come in slightly different pixel sizes (see [[Images]]). **Where:** `.book` (block 6), `.tile`/`.category-grid .tile` (block 9), `.event-card img`/`.event-row img` (blocks 11/19).

## `::after` spine crease
`.book::after` is a pseudo-element: a thin `linear-gradient` layered over the cover image (dark → light → dark bands near the left edge) to fake the shadow a real paperback's spine casts onto its own cover. It's inserted purely by CSS, with no extra HTML element and no accessible-tree presence. **Where:** `.book::after`, block 6.

## `repeating-conic-gradient` speedlines
A conic gradient sweeps colour around one centre point; repeating it every few degrees with a short opaque band creates the manga "speedline" burst behind each hero slide's `.fan`. **Where:** `.slide-blush`/`-sun`/`-ink`, block 8.

## Halftone dots
`.band-blush` layers a small `radial-gradient` circle, tiled via `background-size: 14px 14px`, over the flat `--blush` colour — the browser repeats that one dot into a grid, mimicking print-manga screentone shading. **Where:** `.band-blush`, block 3.

## The fan (three books, one grid cell)
`.fan { display: grid; place-items: center; } .fan .book { grid-area: 1 / 1; }` puts all 3 covers in the *same* single grid cell (they'd otherwise stack in separate cells), then `transform: translateX(...) rotate(...) scale(...)` on the first two nudges them sideways and shrinks them slightly so the third (front) cover reads as sitting in front of a fanned stack. **Where:** `.fan`, block 8.

## `position: fixed` toast
The "Added to basket" message is `position: fixed; bottom: var(--space-m); left: 50%;`, parked just below the viewport by default (`transform: translate(-50%, calc(100% + 3rem))`) and slid up with `.is-visible { transform: translate(-50%, 0); }`. `fixed` (not `sticky`) means it's positioned relative to the viewport regardless of scrolling. **Where:** `.toast`, block 13; created in JS, see [[JavaScript#3. Basket]].

## `:focus-visible`
Like `:focus`, but only matches when the browser thinks the user is navigating by keyboard — avoids a focus ring after every mouse click while still showing one for Tab users. **Where:** one rule, block 2, site-wide.

## `.visually-hidden`
A CSS pattern (not a browser feature): clips an element to 1×1px and hides overflow without `display: none`, so screen readers still read it as present. **Where:** block 2; homepage `<h1>`, form labels, "Add to basket" button suffixes.

## `[hidden]` vs. `display: flex`/`grid`
The HTML `hidden` attribute sets `display: none` by default — but a more specific CSS rule elsewhere (e.g. `.category-layout { display: grid; }`) can override that and make `hidden` do nothing. That's why the stylesheet has explicit fix-up rules: `.category-layout[hidden] { display: none; }`, `.product[hidden] { display: none; }`, `.basket-layout[hidden] { display: none; }` — each one re-asserts `none` at higher specificity for an element that's normally grid/flex. **Where:** blocks 15, 16, 20.

## `<template>` cloning
`<template>` holds inert markup — the browser parses it but never renders it or runs anything inside it. JS clones its `.content` once per item with `cloneNode(true)`, fills in the clone's text/attributes, and appends it — reusing one piece of markup instead of building HTML strings by hand. **Where:** `#basket-row` in `basket.html` (cloned in `js/main.js` block 6); `#product-card` in `product.html` (cloned in block 9 for both the "More in this series" and "You might also like" rows).

## One template page for many products
`product.html` is hand-written once, for one book (Frieren Vol. 1) — that's what shows with JavaScript off. With JavaScript on, block 9 reads `?id=` from the address with `URLSearchParams`, looks the id up in `BOOKS` (`js/books.js`), and overwrites every `product-*`/`spec-*` element's text/attributes with that book's data — so the exact same HTML file becomes 23 different product pages depending on the link clicked. This is instead of hand-writing 23 near-identical HTML files: one file to keep in sync, and the shared header/footer still only needs editing in the usual 5 places (see [[Architecture#No templating: header and footer are copy-pasted]]), not 23+4. **Where:** `product.html`, `js/main.js` block 9; see [[Pages/Product]].

## `localStorage` + JSON
`localStorage` persists small key/value string data in the browser across page loads (and across tabs on the same origin). Since it only stores strings, the basket array is serialised with `JSON.stringify()` before saving and parsed back with `JSON.parse()` on read. **Where:** `js/main.js` block 3, key `"basket"`.

## `URLSearchParams`
Parses `window.location.search` (the `?...` part of the URL) into a queryable object instead of hand-splitting the string. Used for `?cat=` (figures/blu-ray/merch) and `?q=` (search) on `manga.html`, and for `?id=` (which book to show) on `product.html`: `new URLSearchParams(window.location.search).get('id')`. **Where:** `js/main.js` block 5 (`?cat=`/`?q=`), block 9 (`?id=`).

## `dataset`
Reads custom `data-*` HTML attributes as JS properties (`data-qty-input` → `element.dataset.qtyInput`, camelCased automatically). Used instead of a separate lookup table. **Where:** `.js-add` buttons (`data-id`/`-title`/`-price`/`-cover`/`-qty-input`), `.product` items (`data-genres`/`-status`/`-price`/`-date`/`-title`), `.carousel-btn` (`data-dir`), `.reserve-btn` (`data-event`), basket rows (`data-action`, `data-id`).

## `addEventListener`
Attaches a function to run on an event without overwriting any other handler already on that element. **Where:** every block in `js/main.js`.

## `mouseenter` + `focus` for mouse and keyboard
The homepage shelf highlights a book on `mouseenter` (mouse moves onto it) *and* `focus` (Tab lands on it, or a screen reader's virtual cursor does) — both call the exact same `highlightBook(id)` function, so a keyboard user gets the identical preview-card update a mouse user does. The two events are added as two separate listeners on the same element rather than one combined one, since there's no single native event that fires for both. The one thing that *doesn't* apply to keyboard focus is the CSS hover-fade on the other books (`.shelf:hover :not(.is-active)` only matches `:hover`, not `:focus`) — deliberately, so a keyboard user tabbing through never sees the rest of the shelf dim. **Where:** `js/main.js` block 8; see [[Accessibility]].

## `preventDefault`
Stops the browser's default action for an event — used to stop the restock form's normal page-reloading submit so JS can show an inline thank-you instead (there's no backend to actually submit to). **Where:** `js/main.js` block 2.

## Event delegation
Instead of attaching a click listener to every single button of a kind (which would also mean re-attaching listeners every time new ones appear), one listener sits higher up and inspects `event.target.closest(...)` to work out which button was actually clicked, however deep inside it the click landed. Handles elements added to the page *after* the listener was attached, for free — this is why it matters here specifically: `js/books.js`-driven markup (the shelf preview's button, and everything `product.html` block 9 clones from `<template id="product-card">`) doesn't exist yet when the scripts first run.
- **Every `.js-add` "Add to basket" button, site-wide**: one `document.addEventListener('click', ...)` in block 3 with `event.target.closest('.js-add')` — this *replaced* an earlier version that looped over `document.querySelectorAll('.js-add')` once at load and missed any button created later.
- **Basket page's quantity ±/Remove buttons**: one listener on `#basket-list` with `event.target.closest('button')`, unchanged — see block 6.

**Where:** `js/main.js` blocks 3 and 6.

## `appendChild` re-ordering for sort
`appendChild` moves an element that's already in the document to a new position (it doesn't clone or duplicate it) — calling it again on an existing node just relocates that node. The sort dropdown sorts a copy of the product array, then calls `productGrid.appendChild(product)` for each one in the new order, which re-arranges the real grid items on screen without touching their content. **Where:** `js/main.js` block 5(d).

## `<details>`/`<summary>`
A native, JS-free expand/collapse widget — `<summary>` is always visible and keyboard/click-operable; the rest of `<details>` shows only when open. **Where:** Shipping/Returns accordion, product.html.

## `<dl>`
Semantic "description list" — pairs of `<dt>` (term) and `<dd>` (description), here used for the product spec sheet (Publisher/Format/Pages/ISBN/Series). **Where:** `.spec-list`, product.html.

## `<time datetime>` (yearless dates)
`<time>` marks up a machine-readable date; `datetime` holds the parseable value while the visible text can stay human-friendly. Event dates use `datetime="10-03"` (month-day only, no year) because the events repeat annually and a hardcoded year would eventually make the day-of-week wrong. **Where:** `events.html`, index's "what's on" cards.

## `<iframe>` map with `title`
A live embedded OpenStreetMap view. Every `<iframe>` needs a `title` describing its content for assistive tech, since it's otherwise an opaque embedded document. **Where:** `.visit-map`, index and events.html.

---

## Likely TA questions

**Q: Why real manga covers when the brief said invented series only?**
The user reviewed the first version, found it "too basic / cheap looking", and explicitly asked for real official covers instead — overriding the brief's "no real characters/artwork" rule on purpose, as a proof-of-concept exercise. The grading risk of ignoring that brief rule was acknowledged at the time. See [[Decisions]].

**Q: Where is the basket stored?**
`localStorage`, key `"basket"`, a JSON array of `{ id, title, price, cover, qty }` objects. No server, no cookies, no account.

**Q: Why are the "photos" illustrations instead of real photos?**
The plan was to generate them with Figma Weave AI, but Weave's MCP access needs a paid Figma plan (the free web-app credits don't cover MCP calls). The user said to improvise, so the 10 photos are HTML/CSS scenes built from the real covers (`art-source/artboards.html`) and screenshotted to JPG with headless Edge.

**Q: How do the filters work?**
`js/main.js` block 5(c) reads every checked genre/availability checkbox and the price slider's value, then loops every `.product` comparing its `data-genres`/`data-status`/`data-price` attributes; anything that doesn't match every active filter gets the `hidden` attribute.

**Q: Why `alt=""` on the covers inside the grid?**
Each cover sits right next to a visible `.product-title` that already names the book — an `alt` would just repeat text a screen reader is about to read anyway.

**Q: Why do Figures/Blu-ray/Merch nav links go to `manga.html?cat=...`?**
There's no real stock for those categories, so instead of showing fake products, JS swaps in an "in the shop for now" panel with a photo and a line inviting the visitor to browse manga or find the shop.

**Q: Why was pagination dropped?**
There are only 23 titles, and filters/sort/search now genuinely work against all of them on one page — paging would add complexity without solving a real problem at this scale.

**Q: Why does the basket sometimes "reset" between pages?**
It doesn't, in Chrome or Edge — double-clicking `index.html` there treats every page under `anime-haven/` as the same `file://` origin, so `localStorage` is shared. Firefox treats every `file://` page as its own separate origin, so the basket looks empty when you move to another page. Use the local server (`npx http-server anime-haven -p 5173 -c-1`) for a Firefox demo.

**Q: How does the carousel work?**
The slides sit in one CSS-grid row (`grid-auto-flow: column`) that scrolls sideways, with `scroll-snap-type: x mandatory` making each slide stop neatly in frame. The Previous/Next buttons just call `scrollBy`/`scrollTo` on that row and wrap around at either end — CSS does the actual snapping, JS just nudges the scroll position.

**Q: Why is there no real checkout?**
Out of scope for a first-year proof-of-concept. The Checkout button shows a toast ("Checkout is switched off: this is a student project") instead of processing anything.

**Q: Why does search only find results on the manga page?**
The `?q=` search is a plain JS substring match against the titles/authors already sitting in `manga.html`'s own DOM — there's no shared product database, so a search from any other page just lands on `manga.html?q=...` and filters that one page's 23 items.

**Q: Why do some products show "Pre-order" with a due date?**
Static demo data — each of those `.product` items has `data-status="pre-order"` and a `.product-due` span with a hardcoded date; there's no live inventory feed behind it.

**Q: Why is the homepage `<h1>` visually hidden?**
The logo already displays "Anime Haven" as the first thing on the page. A visually hidden `<h1>` still gives the page a real, unique accessible name for screen readers without a redundant second visible heading.

**Q: Why doesn't the "any three volume 1s for €30" hero promo actually apply in the basket?**
It's a marketing slide only — `main.js` has no bundle/discount logic, so adding three volume-1s to the basket just totals them at full price. Listed as a known gap, not a bug.

**Q: Why is `--berry` never used as text colour anywhere?**
Its contrast on white is ≈4.4:1, below the 4.5:1 minimum for body text. It clears the separate 3:1 minimum for non-text UI elements, so it's used only for the focus ring.

**Q: How does one `product.html` show 23 different books?**
It doesn't, really — it's one hand-written page for Frieren Vol. 1, which is what shows with JavaScript off. With JavaScript on, `js/main.js` block 9 reads `?id=` from the address bar, looks that id up in the `BOOKS` array (`js/books.js`), and overwrites every field on the page (title, cover, price, specs, description, the two related-books rows…) with that book's data. An unrecognised or missing id falls back to `BOOKS[0]`, which is Frieren Vol. 1 again — so the JS path and the no-JS path agree by construction, not by coincidence.

**Q: Why one click listener on the whole document instead of one per button?**
Because some "Add to basket" buttons don't exist yet when the page first loads — the shelf's preview button gets its `data-*` rewritten on the fly, and every button in `product.html`'s "More in this series"/"You might also like" rows is cloned from a `<template>` after the fact. A listener attached only to the buttons present at load time would silently ignore all of those. One listener on `document` that checks `event.target.closest('.js-add')` catches a click on *any* matching button, present now or added five seconds from now, without re-attaching anything.

**Q: Why does the homepage shelf use inline `style="--spine: ...; --h: ..."` instead of a CSS class per book?**
There are 11 different spine colours/sizes and only one is ever needed per book, so a class per colour would mean a growing, mostly-unused stylesheet (`.spine-blue`, `.spine-orange`, …) that has to be kept in sync with the HTML by hand. Custom properties let each `<a class="spine" style="--spine: #2f6fb3; ...">` carry its own values while the CSS rule itself (`background: var(--spine)`) stays single and unchanged — one rule, many books.
