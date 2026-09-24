---
tags: [responsive, css]
---

# Responsive

Two `max-width` breakpoints (desktop-first) plus a `prefers-reduced-motion` query. Block numbers refer to [[Architecture#css/style.css block map]].

## Tablet — `@media (max-width: 60rem)` (960px), block 22

| Area | Change |
|---|---|
| Header (all pages) | `.header-main` wraps; `.search` moves to `order: 5; flex-basis: 100%` — its own full-width row under the logo/links. |
| Hero (index) | `.hero` becomes 1 column (`minmax(0, 1fr)`). `.hero-tiles` becomes a 2-column row instead of 2 stacked rows; its tiles get `aspect-ratio: 4/3`. |
| Shelf (index) | `.shelf-layout` becomes 1 column: `.shelf-preview` drops below the shelf instead of sitting beside it, and caps at `max-width: 28rem`. The shelf itself doesn't change — `.shelf-scroll { overflow-x: auto; }` already lets it scroll sideways at any width once it runs out of room, on every breakpoint. |
| Product rows (index, product, basket) | `--columns` drops to `3.4` on `.product-row`/`-5`/`-4`, so about 3½ books show at once — a visual hint that the row scrolls. |
| Category tiles (index) | `.category-grid` becomes 2 columns, tiles `aspect-ratio: 4/3`. |
| Sofia's picks (index) | `.picks` becomes 1 column. |
| Events grid (index) | `.event-grid` becomes 2 columns. |
| Visit (index, events) | `.visit` becomes 2 columns, `.visit-map` spans both (`grid-column: span 2`). |
| Footer (all pages) | `.newsletter` becomes 1 column; `.footer-main` becomes 3 columns with `.footer-brand` spanning all 3. |
| Category layout (manga) | `.category-layout` becomes 1 column — filters sit above the grid. |
| Category feature (manga) | `.category-feature` becomes 1 column, photo `min-height: 12rem`. |
| Product hero (product) | `.product-hero` becomes 1 column. |
| Events layout (events) | `.event-featured` becomes 1 column; `.event-row` narrows to `4rem 8rem 1fr`. |
| Basket layout (basket) | `.basket-layout` becomes 1 column. |

## Mobile — `@media (max-width: 37.5rem)` (600px), block 23

| Area | Change |
|---|---|
| Header (all pages) | `.promo-hours` hidden. Logo shrinks (`1.3rem`, mark `2.25rem`). `.header-link:not(.basket-link)` ("Find us") hidden. `.menu-toggle` becomes visible (`display: inline-flex`). `.site-nav` is `display: none` until JS block 1 adds `.is-open`; `.nav-list` stacks vertically, each link full-width with a top border. |
| Hero (index) | `.slide` becomes 1 column, `.fan` moves above the text (`order: -1`) at 80% width. |
| Hero tiles (index) | `.hero-tiles` becomes 1 column. |
| Shelf preview (index) | `.shelf-preview`'s own grid narrows from `8rem 1fr` to `6rem 1fr` (smaller cover column) — it's already dropped below the shelf from the tablet rule above. |
| Product rows | `--columns` drops to `2.2`. |
| Category tiles (index) | `.category-grid` gap shrinks; tiles become `aspect-ratio: 1` (square). Tile title font shrinks to `1.25rem`. |
| Sofia's picks (index) | `.picks-list` becomes 1 column; each `.pick` becomes its own 2-column row (small book left, note right). |
| Events/visit (index, events) | `.event-grid` and `.visit` become 1 column; `.visit-map` loses its 2-column span. |
| Footer (all pages) | `.footer-main` becomes 2 columns, `.footer-brand` spans both. |
| Product grid (manga) | `repeat(auto-fill, minmax(9rem, 1fr))`, tighter gaps. |
| Spec list (product) | `.spec-list` narrows to a `7rem 1fr` label column. |
| Event row (events) | `.event-row` becomes `3.5rem 1fr`; the day block spans both its rows (`grid-row: 1 / 3`), photo and body share the second column. |
| Basket row (basket) | `.basket-row` becomes `3.5rem 1fr` with the book spanning both rows; `.basket-row-qty` moves to the second column and left-aligns. |

## Reduced motion — `@media (prefers-reduced-motion: reduce)`, block 24

Not a width breakpoint — reacts to the OS/browser "reduce motion" setting, applied site-wide: `transition: none` on `.book`, `.tile img`, `.toast`, `.spine`, `.shelf-cover`; `scroll-behavior: auto` on `.slides` (the carousel jumps instead of smooth-scrolling); `transform: none` on the `.product-link:hover .book`/`:focus-visible .book` lift and `.tile:hover img` zoom. The shelf's `.is-active` lift (`translateY(-1.25rem)`) isn't removed, only its animation — a hovered/focused book still jumps up, just instantly. See [[Accessibility#Reduced motion]].
