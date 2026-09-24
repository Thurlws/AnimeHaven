---
tags: [images, assets]
---

# Images

Two folders, two completely different sources — see [[Decisions#Real covers instead of invented series]] and [[Decisions#Photos are illustrated art boards, not AI photos]] for why.

## `images/covers/` — 23 real manga covers

Source: **Open Library** cover API (`covers.openlibrary.org`), English-edition covers, each verified one by one on 2026-09-24. Publisher-owned artwork — credited in every page's footer: *"Cover images belong to their publishers."* Two covers were tried and dropped before landing on this final set of 23 (see [[Decisions]] and [[Changelog]]): Kagurabachi Vol. 1 (only a Japanese cover was indexed) and Blue Lock Vol. 1 (only 153px wide, too blurry to use).

All are JPGs, natural width 300–351px (height 450–500px, except `jujutsu-kaisen-02.jpg` and `spy-x-family-02.jpg` at ~317–320×~475–480 and `vagabond-01.jpg` at 300×450) — narrower than the `.book` component is often stretched to, which is why covers can look slightly soft at very large screen sizes (see [[Changelog#Known gaps / ideas]]). Every `<img>` in `.book` is served at `width="400" height="600"` regardless of the file's real pixel size; `object-fit: cover` fills the box.

| File | Used on (via `data-cover`/`src`) |
|---|---|
| `frieren-01.jpg`…`frieren-03.jpg` | index (hero fan; shown as `.spine` text on the homepage shelf, not an image there — but the file loads into `#preview-cover` if that spine is hovered/focused), manga.html grid, product.html (hero + more-in-series) |
| `frieren-04.jpg` | index (hero fan; a `.shelf-cover`, one of the shelf's 2 faced-out books), manga.html grid, product.html (hero + more-in-series) |
| `chainsaw-man-01.jpg`, `chainsaw-man-02.jpg` | index (`chainsaw-man-01`/`02` are `.spine`s on the shelf), manga.html grid, basket.html empty state |
| `spy-x-family-01.jpg`, `spy-x-family-02.jpg` | index (`.spine`s on the shelf), manga.html grid, basket.html empty state |
| `jujutsu-kaisen-01.jpg`, `jujutsu-kaisen-02.jpg` | index (`.spine`s on the shelf), manga.html grid, basket.html empty state |
| `one-piece-01.jpg` | index (bestsellers), manga.html grid, basket.html empty state |
| `dandadan-01.jpg` | index (hero slide 2; a `.spine` on the shelf), manga.html grid |
| `oshi-no-ko-01.jpg` | index (a `.shelf-cover`, the shelf's other faced-out book, €13.50), manga.html grid |
| `witch-hat-atelier-01.jpg` | index (hero slide 3, Sofia's picks), manga.html grid, product.html (also-like) |
| `delicious-in-dungeon-01.jpg` | index (Sofia's picks), manga.html grid, product.html (also-like) |
| `sakamoto-days-01.jpg` | index (hero slide 2), manga.html grid |
| `look-back.jpg` | index (Sofia's picks), manga.html grid, product.html (also-like) |
| `haikyuu-01.jpg` | index (hero slide 2), manga.html grid |
| `summer-hikaru-died-01.jpg` | index (a `.spine` on the shelf), manga.html grid |
| `berserk-deluxe-01.jpg` | index (back soon), manga.html grid |
| `vagabond-01.jpg` | index (back soon), manga.html grid |
| `apothecary-diaries-01.jpg` | index (back soon), manga.html grid, product.html (also-like) |
| `blue-period-01.jpg` | index (back soon), manga.html grid, product.html (also-like) |

Every one of the shelf's 13 books (11 spines + 2 faced-out covers) loads its cover into the `.shelf-preview` card's `#preview-cover` once hovered or keyboard-focused — see [[JavaScript#8. Homepage shelf]] — so a `.spine`'s cover JPG is only ever actually *displayed as an image* through that preview card, never on the spine itself (the spine shows coloured text, not the cover).

**To replace one:** swap the JPG in place at the same filename (keeps every `src`/`data-cover` reference, and every `js/books.js` `id`-based path, working), or add a new file and update `js/books.js`'s matching entry plus every remaining literal `src="images/covers/…"`/`data-cover="images/covers/…"` elsewhere in the static HTML. There's still no single central place for *every* usage — `js/books.js` centralises the shelf and product-page/product-card paths (`'images/covers/' + id + '.jpg'`), but the static rows on index/manga/basket (hero, picks, bestsellers, back soon, grid, empty state) remain literal paths written into each HTML file.

## `images/photos/` — 10 illustrated "photos"

Not real photographs. Built as HTML/CSS/SVG "art boards" in `art-source/artboards.html` (composed from the real covers above) and rendered to JPG with headless Edge screenshots — see [[Decisions#Photos are illustrated art boards, not AI photos]] and [[Testing#Re-rendering the art boards]].

| File | Actual size | Board id in `artboards.html` | Used on |
|---|---|---|---|
| `watch-night.jpg` | 800×600 | `#watch-night` | index (hero tile, "what's on" card), events.html (featured event) |
| `figures.jpg` | 800×600 | `#figures` | index (hero tile, category tile, "in the shop for now" default), manga.html JS `categoryInfo.figures.photo` |
| `cat-manga.jpg` | **800×1000** | `#cat-manga` | index (category tile) |
| `cat-bluray.jpg` | **800×1000** | `#cat-bluray` | index (category tile), manga.html JS `categoryInfo['blu-ray'].photo` |
| `cat-merch.jpg` | **800×1000** | `#cat-merch` | index (category tile), manga.html JS `categoryInfo.merch.photo` |
| `sofia.jpg` | 600×600 | `#sofia` | index (`.portrait` in Sofia's picks) — this is her handwritten signature, not a face photo |
| `shop.jpg` | 800×1000 | `#shop` | index and events.html ("Come say hola" `.visit-photo`) |
| `drawing-club.jpg` | 800×600 | `#drawing-club` | index ("what's on"), events.html (event row) |
| `cosplay.jpg` | 800×600 | `#cosplay` | index ("what's on"), events.html (event row) |
| `swap-meet.jpg` | 800×600 | `#swap-meet` | events.html (event row) only |


**To regenerate a photo:** open `art-source/artboards.html#<board-id>` with the local server running (`npx http-server anime-haven -p 5173 -c-1` — the art board's own JS reads covers from `http://localhost:5173/images/covers/…`, so the server must be serving `anime-haven/`), screenshot at the board's exact pixel size (800×600, 800×1000, or 600×600 — see the table above and [[Testing#Re-rendering the art boards]]), convert PNG→JPG, and save over the matching file in `images/photos/`.
