---
tags: [map, overview]
---

# Anime Haven — vault map

Anime Haven is a fictional manga/anime shop site for TU Dublin CMPU 1031 Web Development 1 (first-year project, client Sofia Martinez). Plain HTML5 + CSS3 + three small JS files, 5 pages, must open by double-clicking `index.html`.

**Status: v2 redesign finished (2026-09-24), extended the same evening.** The whole site was rebuilt from a thick-outline "manga panel" look into a modern e-commerce shop with real book covers, an illustrated photo set, and working basket/filter/sort/search/carousel JS. The evening session added: a **dark mode** switch (and a closable promo bar) driven by the new `js/settings.js`; **real Figures, Blu-ray and Merch listings** (18 products with real product photos, in the same `BOOKS` array as the manga); a **Format filter + "Deluxe editions" homepage row** (7 more deluxe manga); an **"Added ✓" button flash and basket-counter bump**; spines with a mini cover crop and publisher mark; and a fix for the shelf jumping up and down as you hover books. The old vault (before 2026-09-24) described v1 and was wrong about almost everything except the brand colours, the three fonts, and a handful of accessibility patterns — see [[Decisions]] for exactly what changed and why, and [[Changelog]] for the evening entry and the known gaps.

## Notes

| Note | Answers |
|---|---|
| [[Architecture]] | File tree, header/footer duplication across 5 pages, which pages load which scripts, the CSS block map (24 blocks, block 15 = dark mode), the JS block map (11 blocks in `main.js` + `settings.js`), which page uses which block |
| [[Design System]] | Colour/font/spacing/radius tokens and their contrast facts; the dark-mode tokens and their two exception lists; a markup snippet for every component class (incl. `.theme-toggle`, `.promo-close`, `.is-added`, `.book.is-goods`, spine anatomy) |
| [[Pages/Home]] | index.html section by section: header controls, hero carousel, the "New on the shelf" interactive bookshelf (spine art + fixed-height preview), category tiles, Sofia's picks, bestsellers, the new "Deluxe editions" row, back soon, what's on, come say hola |
| [[Pages/Manga]] | manga.html: one page for manga AND Figures/Blu-ray/Merch (`?cat=`), filters (genre, availability, Format, price), sort, search, `?format=deluxe` |
| [[Pages/Product]] | product.html: a template for all 48 products (`?id=`), books and goods, cover/photo, price, quantity, details list, accordion, more-in-series and also-like rows |
| [[Pages/Events]] | events.html: featured event, event list, come say hola |
| [[Pages/Basket]] | basket.html: basket rows (book covers and 4:5 product photos), order summary, empty state, the `<template>` |
| [[JavaScript]] | What `js/settings.js`, the 11 `js/main.js` blocks and `js/books.js` do, which page each runs on, and the data they read (`data-*`, `localStorage`, URL params, `BOOKS`, `CATEGORIES`) |
| [[Images]] | Where every image comes from (Open Library covers, real product photos from shop sites, illustrated art-board photos), sizes, which page uses each, how to add or replace one |
| [[Accessibility]] | How each accessibility requirement is met in the real markup, incl. the theme toggle, promo close and both-theme testing |
| [[Responsive]] | What changes at the 60rem and 37.5rem breakpoints, per page (phone header rows, fixed-height shelf preview) |
| [[Demo Notes]] | Plain-English explanation of every concept used, plus likely TA questions |
| [[Decisions]] | Dated list of deviations from the brief and why, including the 2026-09-24 redesign and evening decisions |
| [[Testing]] | Preview/validate commands, screenshot and art-board re-render notes, latest results |
| [[Changelog]] | Dated build history (v1 short, v2 redesign in full, evening session) and known gaps |
| [[Brief]] | Original client brief (source of truth for what was *asked* — do not edit; the site now deliberately diverges from it in several places, see [[Decisions]]) |

## Quick file map

```
anime-haven/
  index.html      Homepage
  manga.html      Category page: manga grid, or Figures/Blu-ray/Merch via ?cat= (filter/sort/search on both)
  product.html    Product template: fills itself in for any of the 48 products via ?id= (falls back to Frieren Vol. 1)
  events.html     In-shop events
  basket.html     Basket (new in v2 — not in the original brief)
  css/style.css   One shared stylesheet, 24 comment-delimited blocks (block 15 = dark mode)
  js/settings.js  Dark mode + closable promo bar; loaded in <head> WITHOUT defer, on all 5 pages
  js/main.js      One shared script, 11 numbered blocks (deferred, all 5 pages)
  js/books.js     The BOOKS array (48 entries: 30 books, then 18 figures/Blu-ray/merch) + CATEGORIES; loaded before main.js, only on index, manga and product
  images/
    covers/       30 real manga cover JPGs, from Open Library
    products/     18 real product photos (6 figures, 6 Blu-ray, 6 merch), from the makers' and shops' sites
    photos/       10 illustrated "photo" JPGs, rendered from art-source/artboards.html
art-source/
  artboards.html  HTML/CSS/JS source that generates the illustrated photos (not shipped with the site)
```

## Brief's definition of done — honest status

From [[Brief#Definition of done]]:

- [x] All 4 pages exist, linked from the nav, with no broken links. — **now 5 pages**; `basket.html` was added beyond the brief (see [[Decisions#Basket page added]]). Links checked in [[Testing]].
- [ ] Homepage matches the wireframe structure section by section. — **deliberately dropped.** The homepage no longer follows `attachments/homepage-lowfi-wireframe.webp` (4-panel manga hero, shelf of spines, corkboard) section by section. It's a modern shop layout instead: carousel hero, an interactive "New on the shelf" bookshelf (which does bring back the wireframe's shelf-of-spines idea, redone in the v2 visual style — see [[Decisions#2026-09-24 (later): interactive shelf replaces "New this week"]]), category tiles, Sofia's picks, bestsellers, deluxe editions, back soon, what's on, come say hola. See [[Decisions#v2 redesign: modern shop look instead of the brief's manga-panel style]].
- [~] Colours and fonts match the Visual style section. — **partly.** All 6 colour tokens and the 3 Google Fonts are unchanged from the brief (light mode). The brief's *style rules* (3–4px black outlines, hard offset shadows, CSS-drawn covers, invented series only) were dropped for a softer, real-cover look, and there is now an extra dark theme that swaps the tokens — see [[Design System]] and [[Decisions]].
- [x] Passes the W3C HTML validator with no errors. — 0 errors on all 5 pages + `css/style.css`, all three 2026-09-24 testing passes (see [[Testing#Results (2026-09-24, evening — dark mode, product listings, deluxe editions)]]).
- [x] Keyboard-only navigation works across every page. — every interactive element is a real `<a>`/`<button>`/form control with a visible `:focus-visible` ring; axe-core reports 0 violations on 10 tested URLs, in both light and dark theme. Not manually tabbed through control-by-control on every page, so treat as "strongly supported by automated checks", not hand-verified.
- [x] Looks right at 1440px, 768px and 375px wide. — no horizontal overflow at 375/768/1280 on the pages re-checked in the evening pass, and at 375/768/1440 on every page in the earlier passes (see [[Testing]]).
- [x] Code is commented and simple enough to explain line by line in a lab demo. — every CSS block and JS block carries a header/inline comment; see [[Demo Notes]] for plain-English explanations of each concept.

**Not a checklist line item, but graded content the brief was explicit about, and now violated on purpose:**
- Brief: *"Do not use real anime characters, logos or official artwork... all series names are invented."* The shop now uses 30 real, official English-edition manga covers (Frieren, Chainsaw Man, One Piece, Jujutsu Kaisen, etc.) sourced from Open Library, plus 18 real product photos (figures, Blu-ray covers, merch) taken from goodsmile.com, blu-ray.com, sentaifilmworks.com, tohoanimationstore.us, netflix.shop and gbpostersmerch.com (exact list in [[Images]]). This was the user's explicit instruction, and each download batch of product photos was approved by the user first — see [[Decisions#Real covers instead of invented series]] and [[Decisions#Real product photos, approved batch by batch]]. Grading risk was acknowledged at the time.
- Brief: *"JavaScript only where it is genuinely needed."* v2 ships a working basket (localStorage), working filters/sort/search on the manga grid, a working carousel, and now a dark-mode switch and a JS-built Deluxe row — more JS than the brief asked for, again by explicit user request. See [[JavaScript]].
