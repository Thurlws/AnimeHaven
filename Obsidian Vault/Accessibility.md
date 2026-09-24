---
tags: [accessibility, a11y]
---

# Accessibility

How each requirement is met in the real v2 code. Confirmed by axe-core (0 violations, WCAG 2.2 AA + best-practice) on index, manga, manga?cat=merch, product (default, and `?id=berserk-deluxe-01`/`frieren-02`/`look-back`/an unknown id), events and basket — see [[Testing]].

## Landmarks; one `<h1>` per page

Every page: `<header class="site-header">`, `<nav aria-label="Main">` (inside the header), `<main id="main">`, one or more `<section>`s, `<footer class="site-footer">`. manga.html and product.html add `<nav aria-label="Breadcrumb">`. The footer's Shop/Help/Follow columns are each `<nav aria-labelledby="footer-shop|footer-help|footer-follow">`.

Exactly one `<h1>` per page:
- `index.html` — `<h1 class="visually-hidden">Anime Haven: manga, figures and events in Dublin</h1>` (visually hidden — the logo already shows the shop name; see [[Decisions]]).
- `manga.html` — `<h1 id="page-heading">Manga</h1>` (text changes to "Figures"/"Blu-ray"/"Merch" for `?cat=` pages, but it's still the one `<h1>`).
- `product.html` — `<h1>` holds the book's title, e.g. `<h1>Frieren: Beyond Journey's End, Vol. 1</h1>` by default, rewritten per book by `js/main.js` block 9 from `?id=` — see [[Pages/Product]].
- `events.html` — `<h1>In the shop</h1>`.
- `basket.html` — `<h1>Your basket</h1>`.

## Alt text strategy

- **Cover images inside product links (`.product-link`, `.pick`, hero `.fan`)** use `alt=""` — the visible `.product-title`/`.slide-title` text right next to the image already names the book, so a screen reader would hear it twice otherwise.
- **The main product cover on product.html** and the **scene photos** (`watch-night.jpg`, `figures.jpg` on event/category cards, `shop.jpg`, `drawing-club.jpg`, `cosplay.jpg`, `swap-meet.jpg` on events.html/index event section) get real descriptive `alt` text, e.g. `alt="Cover of Frieren: Beyond Journey's End, volume 1: Frieren resting with her old hero party in ivy-covered ruins"`, `alt="The shop stage under spotlights, with pumpkins, confetti and last year's top three entries wearing rosettes"`.
- **Hero/category tile photos** (`.tile img` on index's hero tiles and `.category-grid`) use `alt=""` because the `.tile-title`/`.tile-kicker` overlay text names them visually and is real text in the DOM.
- **Homepage shelf**: `.spine` links carry their own visible sideways text (e.g. "Frieren 1"), so no `alt`/label is needed beyond that. `.shelf-cover` links wrap an `alt=""` cover image plus a `.price-sticker` (decorative-ish but real text, "€11.99") plus a `.visually-hidden` span with the full title ("Frieren: Beyond Journey's End, Vol. 4") — needed because the price alone doesn't identify the book. Either way, every book on the shelf is a real `<a href="product.html?id=...">`, reachable and operable with Tab/Enter like any other link, not a div with a click handler.
- **Sofia's portrait** (`sofia.jpg`) gets `alt="Sofia's signature"` — accurate, since the image is her handwritten signature, not a photo of her face (see [[Decisions]]).
- **Icons are `aria-hidden="true"` inline `<svg class="icon">`s**, paired with a `.visually-hidden` text label: search button (`<span class="visually-hidden">Search</span>`), basket link ("items" suffix), carousel buttons ("Previous slide"/"Next slide"), menu toggle ("Menu" is visible text, so no extra span needed there), "Find us" (visible text). The `安` logo mark is `<span class="logo-mark" aria-hidden="true">安</span>` — the link's accessible name comes from the adjacent visible text "Anime Haven".
- The map `<iframe>` has `title="Map of Anime Haven in Dublin 1"`.

## Contrast; pink backgrounds get black text, never white on sakura/berry

See [[Design System#Contrast facts]] for the verified numbers: black on `--sakura` ≈ 9.8:1, `--muted` on white ≈ 6.7:1, `--berry` on white ≈ 4.4:1. Because 4.4:1 is below the 4.5:1 body-text minimum, **`--berry` is used only as the focus ring**, never as a text or background colour under text — grep confirms its only two uses in `style.css` are the token declaration and the single `:focus-visible` outline rule. No `color: var(--paper)` (white) is ever paired with a sakura or berry background — every white-text rule sits on `--ink` or a dark photo gradient.

## Visible `:focus-visible`

One rule, block 2: `:focus-visible { outline: 3px solid var(--berry); outline-offset: 3px; }` — applies to every link, button and form control site-wide, no per-component overrides.

## Skip link

`<a class="skip-link" href="#main">Skip to main content</a>` — first element in `<body>` on all 5 pages, offscreen until focused, jumps to `<main id="main">`.

## Labels on every input

- `<label class="visually-hidden" for="search">Search manga, figures and authors</label>` — header search, all 5 pages.
- manga.html filters: every genre/availability checkbox has a real `<label for="…">` (e.g. `<label for="genre-action">Action</label>`); `<label for="max-price">Max price</label>` on the range slider.
- `<label for="sort">Sort by</label>` — manga.html sort dropdown.
- `<label for="quantity">Quantity</label>` — product.html stepper.
- `<label class="visually-hidden" for="signup-email">Email address</label>` — footer signup, all 5 pages.

## `aria-expanded` menu; `aria-current` nav

`.menu-toggle` has `aria-expanded="false"` by default, `aria-controls="site-nav"`; JS block 1 flips it to `"true"` on click (see [[JavaScript]]). `aria-current="page"` is set on the matching header-nav `<li><a>` (manga.html: "Manga"; product.html: "Manga"; events.html: "Events"; index/basket: none, since neither is a nav item), and moved onto "Figures"/"Blu-ray"/"Merch" by JS when `?cat=` matches. Breadcrumbs use `aria-current="page"` on the current (non-linked) item too.

## `aria-live` result count; `role="status"`

`<p class="result-count" id="result-count" aria-live="polite">` on manga.html announces the filtered count as it changes. `role="status"` is set on the footer's `.signup-thanks` message (in HTML) and on the JS-created `.toast` (set in `js/main.js` block 3, `toast.setAttribute('role', 'status')`) — both are live regions read out without needing focus to move.

## Homepage shelf: keyboard parity with the mouse

Every book on the "New on the shelf" bookshelf is a real link, so it's reachable by Tab in normal document order and operable with Enter without any extra JS. `js/main.js` block 8 attaches the exact same `highlightBook(id)` handler to both `mouseenter` and `focus` — a keyboard user tabbing through gets the identical lifted-book-plus-updated-preview-card behaviour a mouse user gets by hovering, not a degraded fallback. The one intentional difference: the CSS that fades the *other* books to 55% opacity while browsing (`.shelf:hover :not(.is-active)`) is written with `:hover`, not `:focus`, so tabbing through the shelf never dims the books around the one currently focused — dimming everything else would make it harder, not easier, for a keyboard user to see where they are. See [[JavaScript#8. Homepage shelf]] and [[Design System#`.shelf` / `.spine` / `.shelf-cover` / `.shelf-preview`]].

## Reduced motion

`@media (prefers-reduced-motion: reduce)` (block 24, end of the file) sets `transition: none` on `.book`, `.tile img`, `.toast`, `.spine` and `.shelf-cover`, `scroll-behavior: auto` on `.slides`, and `transform: none` on the `.product-link:hover .book`/`:focus-visible .book`/`.tile:hover img` lift/zoom effects. The carousel still works (buttons still scroll), it just doesn't smooth-scroll or lift/zoom. The shelf still lifts a hovered/focused book (`.is-active`'s `transform: translateY(-1.25rem)` isn't itself removed, only its `transition`), it just snaps into place instead of animating.

## `rem` sizing

Every `font-size` in `style.css` is `rem` or `clamp(rem, rem + vw, rem)` — e.g. `body { font-size: 1rem; }`, `h1 { font-size: clamp(2.25rem, 1.6rem + 2.6vw, 3.5rem); }`. Borders, shadows, `border-radius` and outline widths stay in `px` (they don't need to scale with text).

## `lang="en"`

`<html lang="en">` on all 5 pages, confirmed line 2 of each file.
