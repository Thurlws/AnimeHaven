---
tags: [page, basket]
---

# basket.html — Basket

New in the v2 redesign; not in the original [[Brief]] file structure — see [[Decisions#Basket page added]]. Purpose: show what's in the localStorage basket, let the shopper adjust quantity or remove a line, and show a running total. No checkout, no payment, no server.

## Sections, in order

### 1. Heading — `<div class="wrap page-head"><h1>Your basket</h1></div>`

### 2. Items + order summary — `<div class="wrap basket-layout" id="basket-layout" hidden>`
Hidden by default in the HTML; JS block 6 un-hides it once it confirms the basket isn't empty, and hides `#basket-empty` instead.
- `<ul class="basket-list" id="basket-list">` — filled entirely by JS from the `<template>` below.
- `<aside class="order-summary" id="order-summary">`: `<h2>Order summary</h2>`, `.summary-row`s for Items (`#summary-count`), Subtotal (`#summary-subtotal`), Delivery ("Free click and collect", static), `.summary-total` Total (`#summary-total`), `<button id="checkout-btn">Checkout</button>`, and a note ("Pay in the shop when you collect. We'll hold your order for 7 days.").

### 3. Empty state — `<div class="wrap basket-empty" id="basket-empty">`
Shown by default (before JS runs) and whenever the basket is empty: "Your basket is empty." + `.btn` "Browse manga" → `manga.html`, then a "Popular right now" `<ol class="product-row product-row-5">` (One Piece, Frieren, Chainsaw Man, Jujutsu Kaisen, Spy x Family — all Vol. 1, `.rank` 1–5) so there's still something to add from an empty basket.

### `<template id="basket-row">`
The row markup cloned once per basket item by JS: `.book` (image), `.basket-row-title`, `.basket-row-price` ("€X each"), `.basket-remove` button, a `.qty-control` (`data-action="decrease"`/`"increase"` buttons around a `.qty-value` span), and `.basket-row-total`. `<template>` content is inert until cloned — see [[Demo Notes]].

## JS on this page

- Block 1 (mobile menu), block 2 (restock signup) — shared.
- **Block 3 (basket helpers)** — `getBasket`/`saveBasket`/`showBasketCount`/toast are defined here and used by block 6; the "Popular right now" row's `.js-add` buttons also go through block 3.
- **Block 6 (basket page)** — `renderBasket()` builds the whole item list + summary from `localStorage`; one delegated `click` listener on `#basket-list` handles every row's decrease/increase/remove button (see [[Demo Notes#Event delegation]]); `#checkout-btn` just shows a toast ("Checkout is switched off: this is a student project") — see [[Decisions#Checkout is a toast, not a real flow]].
- Blocks 4, 5, 7 find nothing on this page and do nothing.

## Known limitation

The basket is `localStorage`, keyed the same across every page of the site — but only within one **origin**. Opened by double-clicking `index.html` in Chrome or Edge, every `file://.../anime-haven/*.html` page shares the same origin, so the basket carries across pages correctly. **Firefox treats each `file://` page as its own separate origin**, so the basket does *not* persist between pages there — use the local server (`npx http-server anime-haven -p 5173 -c-1`, see [[Testing]]) for a Firefox demo. See [[Decisions#Basket works double-clicked in Chrome/Edge, not Firefox]].
