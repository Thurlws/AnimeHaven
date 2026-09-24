---
tags: [testing, validation]
---

# Testing

## Preview

- Open any `anime-haven/*.html` file directly by double-clicking it. Works fully in Chrome/Edge (including the basket, since they share one `file://` origin per folder); the basket won't carry across pages in Firefox this way — see [[Decisions#Basket works double-clicked in Chrome/Edge, not Firefox]].
- Or use the local static server defined in `.claude/launch.json`:
  ```
  npx http-server anime-haven -p 5173 -c-1
  ```
  then visit http://localhost:5173. Required for a Firefox demo, and required for re-rendering the art boards (see below, they load covers from `http://localhost:5173/...`).
- VS Code's Live Server extension also works as a substitute static server.

## Validate (HTML + CSS)

From inside `anime-haven/`:

```
java -jar "C:/Users/Chef/AppData/Local/npm-cache/_npx/e733b25ab7b4ba7b/node_modules/vnu-jar/build/dist/vnu.jar" --errors-only --also-check-css *.html css/style.css
```

If that jar path is gone (npx cache cleared), re-download it with:

```
npx -y vnu-jar
```

## Screenshots

Headless Edge can render screenshots for quick checks:

```
--headless=new --window-size=W,H --screenshot=...
```

Needs a **new** `--user-data-dir` every run — the previous one stays locked and the command fails silently otherwise. It can't reliably render below ~500px wide, so check narrow widths in a real browser's responsive-design mode instead.

## Re-rendering the art boards

`art-source/artboards.html` holds all 10 illustrated "photos" as separate `<section id="...">` boards, shown one at a time via `:target` (`.board:target { display: block; }`). To regenerate one:

1. Start the local server (the boards' own `<script>` loads covers from `http://localhost:5173/images/covers/...`, so it must be serving `anime-haven/`).
2. Open `art-source/artboards.html#<board-id>` (e.g. `#watch-night`).
3. Screenshot at the board's exact size — `.w43` boards are 800×600, `.w45` boards are 800×1000, `.w11` (`#sofia`) is 600×600 — matching `--window-size` to that exactly.
4. Convert the PNG screenshot to JPG and save it over the matching file in `images/photos/`.

Board id → output file: `watch-night`→`watch-night.jpg`, `figures`→`figures.jpg`, `cat-manga`→`cat-manga.jpg`, `cat-bluray`→`cat-bluray.jpg`, `cat-merch`→`cat-merch.jpg`, `sofia`→`sofia.jpg`, `shop`→`shop.jpg`, `drawing-club`→`drawing-club.jpg`, `cosplay`→`cosplay.jpg`, `swap-meet`→`swap-meet.jpg`. Full size table in [[Images#`images/photos/` — 10 illustrated "photos"]].

## Accessibility

axe-core, injected from jsdelivr, run in the browser console:

```js
var s = document.createElement('script');
s.src = 'https://cdn.jsdelivr.net/npm/axe-core@4/axe.min.js';
document.head.appendChild(s);
// then, once loaded:
axe.run().then(r => console.log(r.violations));
```

## Results (2026-09-24, first pass — homepage/manga/product/events/basket rebuild)

- **W3C Nu validator: 0 errors** on all 5 HTML pages + `css/style.css`.
- **axe-core (WCAG 2.2 AA + best-practice): 0 violations** on `index.html`, `manga.html`, `manga.html?cat=merch`, `product.html`, `events.html`, `basket.html`.
- **No horizontal overflow** at 375px, 768px and 1440px on every page (`index.html` also checked at 320px and 1024px).
- **All local links resolve** — no 404s, no dead relative paths.
- **Basket flow tested end-to-end**: added 2 different items on `index.html` → header count reads 2; set quantity to 3 and added an item on `product.html` → count reads 5; basket total came to €57.95; pressing "−" at qty 1 removed that row; "Remove" removed a row directly; the header count updated correctly after every change.

## Results (2026-09-24, later — shelf + product template)

Re-tested after the "New on the shelf" homepage bookshelf and the `product.html` → `?id=` template change (see [[Decisions#2026-09-24 (later): interactive shelf replaces "New this week"]]).

- **W3C Nu validator: 0 errors** on all 5 pages + CSS again.
- **axe-core: 0 violations** on `index.html`, `manga.html`, `basket.html`, and `product.html` loaded with `?id=berserk-deluxe-01`, `?id=frieren-02`, `?id=look-back` and an unknown id (the no-match/fallback case) — covering a hardcover, a mid-series volume, a single-volume book, and the "book not found" path in one sweep.
- **No horizontal overflow** at 375/768/1440 on all of the above.
- **Keyboard**: real Tab key presses on the homepage lift the focused shelf book and update the preview card, same as hovering.
- **Mouse**: hovering Dandadan on the shelf updates the preview to title "Dandadan, Vol. 1", price €11.99, "View book" linking to `product.html?id=dandadan-01`, badge "On the shelf" (it isn't flagged `isNew`).
- **Basket from generated markup**: adding a book from the shelf's preview card, and separately from a `product.html`-generated "You might also like" card (built by block 9 from `<template id="product-card">`), both land correctly on `basket.html` — confirms the page-wide `.js-add` delegation (block 3) catches buttons that didn't exist when the script first ran.
- **Series row**: `product.html?id=frieren-02` lists Frieren Vol. 1, 3 and 4 under "More in this series". A single-volume book (Look Back, Dandadan) hides that section entirely (`hidden` on the `<section>`, not just an empty list).
- **Link/id integrity**: every `product.html?id=...` link on every page (index, manga, basket, product) matches a real id in `js/books.js` — checked by diffing the links against `BOOKS`.

Previous (v1) validation history is in [[Changelog#2026-09-23 — v1]]. This is the basis for the [[Home#Brief's definition of done — honest status|definition of done]] checklist.
