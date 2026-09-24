---
tags: [javascript, main.js]
---

# JavaScript — js/main.js, block by block

One 501-line file, loaded with `<script src="js/main.js" defer>` on all 5 pages. Every block guards on the element it needs existing, so the same file is safe to load everywhere. Blocks 8 and 9 (the homepage shelf and the product page) also read the `BOOKS` array from `js/books.js`, a separate 399-line data file loaded (defer, before `main.js`) only on `index.html` and `product.html` — see [[#books.js]]. See [[Architecture#js/main.js — 9 numbered blocks]] for the summary table; this note has the data shapes and code excerpts.

## 1. Mobile menu
Lines 6–18 (search the `// 1.` comment if the file has changed, don't trust the number).
Flips `.menu-toggle`'s `aria-expanded` and toggles `.is-open` on `#site-nav`.
```js
menuButton.addEventListener('click', function () {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', !isOpen);
  siteNav.classList.toggle('is-open', !isOpen);
});
```
Page: all 5 (shared header). Data read: none.

## 2. Thursday restock email
Lines 21–31.
No backend — `preventDefault()`s the `.signup` form, writes a thank-you into `.signup-thanks` (`role="status"`), resets the form.
Page: all 5 (shared footer). Data read: none.

## 3. Basket
Lines 34–124.
Defines the shared basket API used by this block itself, block 6, and any `.js-add` button on any page.

**Storage:** `localStorage` key **`basket`**, JSON array. Item shape:
```json
{ "id": "frieren-01", "title": "Frieren: Beyond Journey's End, Vol. 1", "price": 11.99, "cover": "images/covers/frieren-01.jpg", "qty": 1 }
```
```js
function getBasket() {
  try { return JSON.parse(localStorage.getItem('basket')) || []; }
  catch (error) { return []; } // storage blocked or broken: start empty
}
function saveBasket(basket) {
  try { localStorage.setItem('basket', JSON.stringify(basket)); }
  catch (error) { /* basket works on this page but won't be remembered */ }
  showBasketCount(basket);
}
```
`showBasketCount` sums every item's `qty` and writes it into every `.basket-count` on the page (there's exactly one, in the header). A `<p class="toast" role="status">` is created once with `document.createElement`/`appendChild` and reused for every message.

**`addToBasket(button)`** reads the clicked button's `data-*`:
```js
function addToBasket(button) {
  let amount = 1;
  if (button.dataset.qtyInput) {
    amount = Number(document.getElementById(button.dataset.qtyInput).value) || 1;
  }
  const basket = getBasket();
  const existing = basket.find(function (item) { return item.id === button.dataset.id; });
  if (existing) { existing.qty = existing.qty + amount; }
  else { basket.push({ id: button.dataset.id, title: button.dataset.title, price: Number(button.dataset.price), cover: button.dataset.cover, qty: amount }); }
  saveBasket(basket);
  showToast('Added ' + button.dataset.title + ' to your basket');
}
// One listener on the whole page catches clicks on any .js-add button,
// including buttons added later by JavaScript (product page rows).
// closest() finds the button even if the click landed on text inside it.
document.addEventListener('click', function (event) {
  const button = event.target.closest('.js-add');
  if (button) {
    addToBasket(button);
  }
});
```
This one **delegated** listener replaced an earlier `document.querySelectorAll('.js-add').forEach(...)` loop that attached a separate listener to each button that existed at page-load time. The delegated version is needed because block 9 (product page) and block 8's preview card build/rewrite `.js-add` buttons *after* this script runs — a per-button loop would never see them. `event.target.closest('.js-add')` walks up from whatever was actually clicked (e.g. the button's inner `<span>`) to find the button itself.

Every `.js-add` button (there are dozens, on index/manga/product/basket, some built by blocks 8 and 9) carries `data-id`, `data-title`, `data-price`, `data-cover`; only the product-page hero button also carries `data-qty-input="quantity"` to read the quantity `<input>` instead of always adding 1.

Page: all 5 (basket count shows in the header everywhere; `.js-add` buttons exist on index, manga, product, basket).

## 4. Homepage carousel
Lines 127–148.
```js
const direction = Number(button.dataset.dir); // -1 = back, 1 = forward
const atStart = slides.scrollLeft < 5;
const atEnd = slides.scrollLeft + slides.clientWidth > slides.scrollWidth - 5;
if (direction === 1 && atEnd) slides.scrollTo({ left: 0 });
else if (direction === -1 && atStart) slides.scrollTo({ left: slides.scrollWidth });
else slides.scrollBy({ left: direction * slides.clientWidth });
```
Data read: `.carousel-btn`'s `data-dir` (`-1`/`1`). Page: `index.html` only — `#slides` doesn't exist elsewhere.

## 5. Category page
Lines 151–253. Reads two URL params from `manga.html`'s own address bar via `URLSearchParams`:
```js
const params = new URLSearchParams(window.location.search);
const cat = params.get('cat');   // "figures" | "blu-ray" | "merch" | null
```
- **(a) `?cat=`** — if `cat` matches the `categoryInfo` lookup table (`figures`/`blu-ray`/`merch`), swaps in the "in the shop for now" placeholder (see [[Pages/Manga#The `?cat=` placeholder, in full (JS block 5(a))]]) instead of the grid.
- **(b) `?q=`** — otherwise, reads `params.get('q')`, lower-cases it, pre-fills `#search`, and filters against `product.dataset.title` and the `.product-author` text:
```js
function matchesSearch(product) {
  if (!query) return true;
  const title = product.dataset.title.toLowerCase();
  const author = product.querySelector('.product-author').textContent.toLowerCase();
  return title.includes(query) || author.includes(query);
}
```
- **(c) Filters** — reads every checked `input[name="genre"]`/`input[name="availability"]` plus the `#max-price` range value, and for each `.product` compares against its `data-genres` (space-separated string, `.split(' ')`), `data-status`, `data-price`. A product shows only if it passes genre AND status AND price AND search. Toggles the real `hidden` attribute (see [[Demo Notes#`[hidden]` vs. `display: flex`/`grid`]]) and updates `#result-count`/`#empty-state`.
- **(d) Sort** — re-orders the *existing* `<li>` elements by calling `appendChild` again in a new order (this moves a node, doesn't clone it); "Featured" restores the original DOM order captured once at load (`originalOrder = products.slice()`).

Data read: `data-genres`, `data-status`, `data-price`, `data-date`, `data-title` on every `.product`; `?cat=`, `?q=` from the URL. Page: `manga.html` only.

## 6. Basket page
Lines 256–341.
```js
function renderBasket() {
  const basket = getBasket();
  // ...hides #basket-layout / shows #basket-empty if basket.length === 0, and vice versa
  basket.forEach(function (item) {
    const row = basketTemplate.content.cloneNode(true);   // <template> cloning
    // fills in .book img, .basket-row-title, .basket-row-price, .qty-value, .basket-row-total
    basketList.appendChild(row);
  });
  // writes #summary-count, #summary-subtotal, #summary-total
}
```
One **delegated** click listener on the whole `#basket-list` handles every row's decrease/increase/remove button, instead of one listener per row:
```js
basketList.addEventListener('click', function (event) {
  const button = event.target.closest('button');
  if (!button) return;
  const row = button.closest('.basket-row');
  let basket = getBasket();
  const item = basket.find(function (i) { return i.id === row.dataset.id; });
  if (!item) return;
  if (button.classList.contains('basket-remove')) basket = basket.filter(function (i) { return i.id !== item.id; });
  else if (button.dataset.action === 'increase') item.qty += 1;
  else if (button.dataset.action === 'decrease') { item.qty -= 1; if (item.qty <= 0) basket = basket.filter(function (i) { return i.id !== item.id; }); }
  saveBasket(basket);
  renderBasket();
});
```
`#checkout-btn` just calls `showToast('Checkout is switched off: this is a student project')` — no real checkout flow.

A second, page-wide listener re-runs `renderBasket()` whenever a `.js-add` button is clicked anywhere on the page (the "Popular right now" row), so the list updates without a page reload:
```js
// Adding one of the "Popular right now" books should refresh the list too.
// This page-wide listener is added after block 3's, so it runs after the book is saved.
document.addEventListener('click', function (event) {
  if (event.target.closest('.js-add')) {
    renderBasket();
  }
});
```
It's added *after* block 3's own page-wide `.js-add` listener (see [[#3. Basket]]), so by the time it fires the click has already been saved to `localStorage` — otherwise `renderBasket()` would read the basket a step too early and show stale totals.

Data read: `localStorage` `basket` key, `.basket-row`'s `data-id` (set from `item.id` when rendered). Page: `basket.html` only.

## 7. Save a spot
Lines 344–351.
```js
document.querySelectorAll('.reserve-btn').forEach(function (button) {
  button.addEventListener('click', function () {
    button.textContent = 'Spot saved, see you there';
    showToast('Spot saved for ' + button.dataset.event);
  });
});
```
Data read: `.reserve-btn`'s `data-event`. Page: `events.html` only. No count, no persisted state — refreshing the page resets every button's text.

## 8. Homepage shelf
Lines 354–393. Reads `BOOKS` from `js/books.js`. Guards on `document.querySelector('.shelf')`.
```js
function highlightBook(id) {
  const book = BOOKS.find(function (b) { return b.id === id; });
  const cover = 'images/covers/' + id + '.jpg';

  shelfBooks.forEach(function (item) {
    item.classList.toggle('is-active', item.dataset.id === id);
  });

  document.getElementById('preview-cover').src = cover;
  document.getElementById('preview-badge').textContent = book.isNew ? 'New this week' : 'On the shelf';
  document.getElementById('preview-title').textContent = book.title;
  document.getElementById('preview-author').textContent = book.authors;
  document.getElementById('preview-price').textContent = '€' + book.price.toFixed(2);
  document.getElementById('preview-link').href = 'product.html?id=' + id;

  const addButton = document.getElementById('preview-add');
  addButton.dataset.id = id;
  addButton.dataset.title = book.title;
  addButton.dataset.price = book.price;
  addButton.dataset.cover = cover;
}

shelfBooks.forEach(function (item) {
  item.addEventListener('mouseenter', function () { highlightBook(item.dataset.id); });
  item.addEventListener('focus', function () { highlightBook(item.dataset.id); });
});

// Start with the book the preview card already shows
highlightBook(document.getElementById('preview-add').dataset.id);
```
`shelfBooks` is every `[data-id]` inside `.shelf` (both `.spine` and `.shelf-cover` links). `highlightBook` does two things: toggles `.is-active` onto only the matching shelf item (the CSS in [[Design System#`.shelf` / `.spine` / `.shelf-cover` / `.shelf-preview`]] does the actual lifting/glowing/fading), and overwrites every field in `.shelf-preview` — including the "Add to basket" button's `data-*`, so clicking it (via block 3's page-wide `.js-add` listener) adds whichever book is currently highlighted, not always the same one.

Both `mouseenter` (mouse) and `focus` (keyboard Tab, or a screen reader landing on the link) call the same function, so the preview updates identically either way — only the CSS hover-fade on the *other* books (`.shelf:hover :not(.is-active)`) is mouse-only, see [[Accessibility]]. The last line runs `highlightBook` once on load using whatever id the static `#preview-add` button already carries in the HTML (`frieren-04`), so the preview and the shelf's `.is-active` state agree with each other before any pointer/keyboard interaction.

Data read: `BOOKS` (`js/books.js`), `[data-id]` on every shelf item. Page: `index.html` only — `.shelf` doesn't exist elsewhere.

## 9. Product page
Lines 396–501. Reads `BOOKS` from `js/books.js`. Guards on `document.getElementById('product-page')`.
```js
const id = new URLSearchParams(window.location.search).get('id');
const book = BOOKS.find(function (b) { return b.id === id; }) || BOOKS[0];
const cover = 'images/covers/' + book.id + '.jpg';
const isPreOrder = book.status === 'pre-order';

function setText(elementId, text) {
  document.getElementById(elementId).textContent = text;
}
```
`URLSearchParams` reads `?id=` from `product.html`'s own address (`product.html?id=dandadan-01` → `id = "dandadan-01"`). No id, or an id that doesn't match any `BOOKS` entry, falls back to `BOOKS[0]` (Frieren Vol. 1) — the `|| BOOKS[0]` is the entire fallback mechanism, no separate "not found" branch. `setText` is a tiny local helper (`document.getElementById(id).textContent = text`) used for every plain-text field below, so the fill-in code doesn't repeat `document.getElementById(...).textContent = ...` a dozen times.

Every field the static HTML hand-writes for Frieren Vol. 1 gets overwritten: `document.title`, `#breadcrumb-current`, `#product-title`, `#product-authors`, `#product-price`, `#product-description`, `#spec-publisher`, `#spec-format` (`book.format || 'Paperback'`), `#spec-pages` (`book.pages || 'Not listed'`), `#spec-isbn`, `#spec-series`, `#product-cover`'s `src`/`alt`, `#product-badge`'s text and class (`isPreOrder ? 'badge badge-sakura' : 'badge badge-sun'`), `#product-stock`, `#product-add`'s text and `data-*`, and `#product-note-text` plus `#product-note`'s `hidden` (`= !book.note`).

Building the two rows reuses one function and one `<template>`:
```js
const cardTemplate = document.getElementById('product-card');

function productCard(b) {
  const card = cardTemplate.content.cloneNode(true);
  // ...fills the clone's link href, cover, title, author, price, badge, .js-add data-*...
  return card;
}

function fillRow(listId, books) {
  const list = document.getElementById(listId);
  list.innerHTML = '';
  books.forEach(function (b) { list.appendChild(productCard(b)); });
  list.closest('section').hidden = books.length === 0;
}

fillRow('series-list', BOOKS.filter(function (b) {
  return b.series === book.series && b.id !== book.id;
}));

const alsoLike = [];
BOOKS.forEach(function (b) {
  const sharesGenre = b.genres.some(function (g) { return book.genres.includes(g); });
  const seriesAlreadyIn = alsoLike.some(function (a) { return a.series === b.series; });
  if (b.series !== book.series && sharesGenre && !seriesAlreadyIn && alsoLike.length < 5) {
    alsoLike.push(b);
  }
});
fillRow('also-list', alsoLike);
```
`fillRow` is the shared bit: clear the list, clone-and-append one card per book, then hide the whole `<section>` (via `.closest('section')`) if there was nothing to show — this is what makes "More in this series" disappear for a single-volume book like Look Back or Dandadan. "More in this series" is a plain `.filter()` on `book.series`. "You might also like" walks `BOOKS` once, keeping a book only if it shares a genre, isn't the current series, and isn't a series already picked (so 5 different-series recommendations, not 5 volumes of the same one), stopping once `alsoLike` reaches 5.

Data read: `BOOKS` (`js/books.js`), `?id=` from the URL, `<template id="product-card">`. Page: `product.html` only — `#product-page` doesn't exist elsewhere.

## books.js

`js/books.js` is a separate, 399-line data file — no functions, just `const BOOKS = [ {...}, {...}, ... ];`, 23 objects. Loaded with `<script src="js/books.js" defer>` **before** `js/main.js`, and only on `index.html` and `product.html` (the two pages that read it — blocks 8 and 9).

Object shape, every field on every book:
```js
{
  id: 'frieren-01',                 // matches the cover filename: images/covers/frieren-01.jpg
  title: "Frieren: Beyond Journey's End, Vol. 1",
  series: "Frieren: Beyond Journey's End",
  volume: 1,
  authors: 'Kanehito Yamada, Tsukasa Abe',
  price: 11.99,
  publisher: 'VIZ Media',
  pages: 192,                       // null for one book (Jujutsu Kaisen Vol. 2) — shows "Not listed"
  isbn: '9781974725762',
  genres: ['fantasy', 'drama'],     // array; used for "You might also like"
  status: 'in-stock',               // 'in-stock' | 'pre-order'
  due: '',                          // e.g. '9 Oct' — only meaningful when status is 'pre-order'
  isNew: true,
  description: "…",
  note: '…'                         // Sofia's note; '' hides the shelf-talker on product.html
}
```
`format` is **not** on this object — it's only added, as `format: 'Hardcover'`, on the two books that aren't paperbacks: `look-back` and `berserk-deluxe-01` (Berserk Deluxe Edition). Every other book relies on `book.format || 'Paperback'` (block 9) to default to `'Paperback'`.

`id` doubling as the cover filename means adding a new book only needs one new object here (plus the actual cover JPG) — no new HTML file, and every "Add to basket"/product-card/shelf link that points at it is generated, not hand-written.
