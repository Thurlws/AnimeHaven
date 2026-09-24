// Anime Haven: the only JavaScript on the site.
// Each numbered block is one feature. Blocks check that their elements
// exist first, so the same file works on every page.


// 1. Mobile menu
// On phones the nav slides in over the page (the CSS does the animation).
// The Menu button flips aria-expanded (so screen readers hear
// "expanded/collapsed") and adds the class that opens it. The close button,
// the dimmed backdrop, the Escape key and picking a link all close it.
const menuButton = document.querySelector('.menu-toggle');
const siteNav = document.getElementById('site-nav');

if (menuButton && siteNav) {
  const closeButton = siteNav.querySelector('.nav-close');
  const backdrop = document.querySelector('.nav-backdrop');
  const phoneWidth = window.matchMedia('(max-width: 37.5rem)');

  function setMenu(open) {
    menuButton.setAttribute('aria-expanded', open);
    siteNav.classList.toggle('is-open', open);
    // Stop the page behind the menu from scrolling while it's open
    document.documentElement.classList.toggle('menu-open', open);
    if (open) closeButton.focus();
  }

  function closeMenu() {
    if (!siteNav.classList.contains('is-open')) return;
    setMenu(false);
    menuButton.focus(); // back to where the user was
  }

  menuButton.addEventListener('click', function () {
    setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
  });
  closeButton.addEventListener('click', closeMenu);
  backdrop.addEventListener('click', closeMenu);
  siteNav.addEventListener('click', function (event) {
    if (event.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeMenu();
  });
  // Turning a phone sideways (or widening the window) swaps back to the
  // normal nav bar, so don't leave the page locked
  phoneWidth.addEventListener('change', function () {
    if (!phoneWidth.matches) setMenu(false);
  });
}


// 2. Thursday restock email (footer)
// There is no server, so instead of sending the form we show a thank-you.
const signupForm = document.querySelector('.signup');

if (signupForm) {
  signupForm.addEventListener('submit', function (event) {
    event.preventDefault(); // stop the page from reloading
    signupForm.querySelector('.signup-thanks').textContent = 'Thanks! See you on Thursday.';
    signupForm.reset();
  });
}


// 3. Basket
// The basket is saved in the browser with localStorage, so it's still there
// on the next page. It's a list of items like:
// { id: "frieren-01", title: "Frieren ...", price: 11.99, cover: "images/...", qty: 1 }

function getBasket() {
  try {
    return JSON.parse(localStorage.getItem('basket')) || [];
  } catch (error) {
    return []; // storage is blocked or broken: start with an empty basket
  }
}

function saveBasket(basket) {
  try {
    localStorage.setItem('basket', JSON.stringify(basket));
  } catch (error) {
    // storage is blocked: the basket works on this page but won't be remembered
  }
  showBasketCount(basket);
}

// Put the total number of items in the header's basket counter
function showBasketCount(basket) {
  let total = 0;
  basket.forEach(function (item) {
    total = total + item.qty;
  });
  document.querySelectorAll('.basket-count').forEach(function (counter) {
    counter.textContent = total;
  });
}

showBasketCount(getBasket());

// A small message that slides up from the bottom. role="status" means
// screen readers read it out too.
const toast = document.createElement('p');
toast.className = 'toast';
toast.setAttribute('role', 'status');
document.body.appendChild(toast);
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () {
    toast.classList.remove('is-visible');
  }, 2500);
}

// Every "Add to basket" button has class js-add and data-* attributes
// describing the book. If it has data-qty-input, the amount comes from
// that quantity box (product page); otherwise it's 1.
function addToBasket(button) {
  let amount = 1;
  if (button.dataset.qtyInput) {
    amount = Number(document.getElementById(button.dataset.qtyInput).value) || 1;
  }

  const basket = getBasket();
  const existing = basket.find(function (item) {
    return item.id === button.dataset.id;
  });

  if (existing) {
    existing.qty = existing.qty + amount;
  } else {
    basket.push({
      id: button.dataset.id,
      title: button.dataset.title,
      price: Number(button.dataset.price),
      cover: button.dataset.cover,
      qty: amount
    });
  }

  saveBasket(basket);
  showToast('Added ' + button.dataset.title + ' to your basket');

  // Little "it worked" animation (drawn by the CSS): the button says
  // "Added ✓" and the basket counter in the header bounces
  flashClass(button, 'is-added');
  document.querySelectorAll('.basket-count').forEach(function (counter) {
    flashClass(counter, 'is-bumped');
  });
}

// Add a class, then take it away again a moment later
function flashClass(element, className) {
  element.classList.add(className);
  setTimeout(function () {
    element.classList.remove(className);
  }, 1200);
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


// 4. Homepage carousel
// The slides are a sideways-scrolling row (CSS scroll-snap does the lining up).
// The buttons scroll by one slide, and wrap round at either end.
const slides = document.getElementById('slides');

if (slides) {
  document.querySelectorAll('.carousel-btn').forEach(function (button) {
    button.addEventListener('click', function () {
      const direction = Number(button.dataset.dir); // -1 = back, 1 = forward
      const atStart = slides.scrollLeft < 5;
      const atEnd = slides.scrollLeft + slides.clientWidth > slides.scrollWidth - 5;

      if (direction === 1 && atEnd) {
        slides.scrollTo({ left: 0 });
      } else if (direction === -1 && atStart) {
        slides.scrollTo({ left: slides.scrollWidth });
      } else {
        slides.scrollBy({ left: direction * slides.clientWidth });
      }
    });
  });
}


// 5. Category page (manga.html)
// Shows the manga, or with ?cat= the figures, Blu-ray or merch. Also handles
// the ?q= search coming from the header, and the sidebar filters + sort dropdown.
const productGrid = document.getElementById('product-grid');

if (productGrid) {
  const params = new URLSearchParams(window.location.search);
  const cat = params.get('cat');

  // (a) Figures, Blu-ray and Merch use this same page: swap the manga in the
  // grid for that category's products from BOOKS (books.js). After that the
  // filters and sort below work on them exactly the same way.
  if (CATEGORIES[cat]) {
    const label = CATEGORIES[cat];
    productGrid.innerHTML = '';
    BOOKS.forEach(function (item) {
      if (item.category === cat) productGrid.appendChild(productCard(item));
    });

    document.title = label + ' | Anime Haven';
    document.getElementById('page-heading').textContent = label;
    document.getElementById('breadcrumb-current').textContent = label;
    document.getElementById('format-filter').hidden = true; // deluxe editions are a manga thing

    // Genre doesn't mean much for a keychain or a tote bag, so these pages
    // filter by series and product type instead
    const items = BOOKS.filter(function (item) { return item.category === cat; });
    const genreFilter = document.getElementById('genre-filter');
    genreFilter.hidden = true;
    const typeFilter = choiceFieldset('Type', 'type', items.map(typeOf));
    const seriesFilter = choiceFieldset('Series', 'series', items.map(function (item) { return item.series; }));
    genreFilter.after(seriesFilter, typeFilter);

    // Blu-rays are all in stock, so a lone "In stock" box would do nothing
    const statuses = new Set(items.map(function (item) { return item.status; }));
    document.getElementById('availability-filter').hidden = statuses.size < 2;
    markNavLink(cat);
  }

  const products = Array.from(productGrid.querySelectorAll('.product'));
  const originalOrder = products.slice(); // "Featured" order, kept for the sort dropdown

  // (b) Read ?q= from the header search box
  const searchInput = document.getElementById('search');
  const query = (params.get('q') || '').toLowerCase();
  if (searchInput && params.get('q')) searchInput.value = params.get('q');

  const form = document.getElementById('filters');
  const resultCount = document.getElementById('result-count');
  const emptyState = document.getElementById('empty-state');
  const maxPriceInput = document.getElementById('max-price');
  const maxPriceOutput = form.querySelector('output');
  const deluxeOnly = document.getElementById('format-deluxe');
  // The homepage "See them all" link (manga.html?format=deluxe) ticks the box for you
  if (params.get('format') === 'deluxe') deluxeOnly.checked = true;

  // The price slider goes up to the dearest product on the page
  const prices = products.map(function (product) { return Number(product.dataset.price); });
  maxPriceInput.max = Math.ceil(Math.max(...prices));
  maxPriceInput.defaultValue = maxPriceInput.max; // where the Clear button puts it back
  maxPriceInput.value = maxPriceInput.max;

  function matchesSearch(product) {
    if (!query) return true;
    const title = product.dataset.title.toLowerCase();
    const author = product.querySelector('.product-author').textContent.toLowerCase();
    return title.includes(query) || author.includes(query);
  }

  // (c) Filters: a product stays visible if it matches every active filter
  function applyFilters() {
    const checkedGenres = Array.from(form.querySelectorAll('input[name="genre"]:checked')).map(function (i) { return i.value; });
    const checkedStatus = Array.from(form.querySelectorAll('input[name="availability"]:checked')).map(function (i) { return i.value; });
    const checkedSeries = Array.from(form.querySelectorAll('input[name="series"]:checked')).map(function (i) { return i.value; });
    const checkedTypes = Array.from(form.querySelectorAll('input[name="type"]:checked')).map(function (i) { return i.value; });
    const maxPrice = Number(maxPriceInput.value);
    maxPriceOutput.textContent = '€' + maxPrice;

    let visible = 0;
    products.forEach(function (product) {
      const genres = product.dataset.genres.split(' ');
      const genreMatch = checkedGenres.length === 0 || checkedGenres.some(function (g) { return genres.includes(g); });
      const statusMatch = checkedStatus.length === 0 || checkedStatus.includes(product.dataset.status);
      const priceMatch = Number(product.dataset.price) <= maxPrice;
      const formatMatch = !deluxeOnly.checked || product.dataset.format === 'deluxe';
      const seriesMatch = checkedSeries.length === 0 || checkedSeries.includes(product.dataset.series);
      const typeMatch = checkedTypes.length === 0 || checkedTypes.includes(product.dataset.type);
      const show = genreMatch && statusMatch && priceMatch && formatMatch && seriesMatch && typeMatch && matchesSearch(product);
      product.hidden = !show;
      if (show) visible += 1;
    });

    resultCount.textContent = query
      ? 'Showing ' + visible + ' results for "' + params.get('q') + '"'
      : 'Showing ' + visible + ' of ' + products.length + (cat ? ' products' : ' titles');
    emptyState.hidden = visible !== 0;
  }

  form.addEventListener('input', applyFilters);
  form.addEventListener('change', applyFilters);
  // The reset button clears the form itself only after this event fires,
  // so wait a tick before recomputing which products should show.
  form.addEventListener('reset', function () {
    setTimeout(applyFilters, 0);
  });
  document.getElementById('empty-clear').addEventListener('click', function () {
    form.reset();
  });

  // (d) Sort: move the existing <li>s into a new order with appendChild
  document.getElementById('sort').addEventListener('change', function (event) {
    let sorted = originalOrder;
    const by = event.target.value;
    if (by === 'newest') sorted = products.slice().sort(function (a, b) { return b.dataset.date.localeCompare(a.dataset.date); });
    else if (by === 'price-asc') sorted = products.slice().sort(function (a, b) { return a.dataset.price - b.dataset.price; });
    else if (by === 'price-desc') sorted = products.slice().sort(function (a, b) { return b.dataset.price - a.dataset.price; });
    else if (by === 'az') sorted = products.slice().sort(function (a, b) { return a.dataset.title.localeCompare(b.dataset.title); });
    sorted.forEach(function (product) { productGrid.appendChild(product); });
  });

  applyFilters();
}


// 6. Basket page
// Renders the basket from localStorage into the item list using the
// <template>, and wires up quantity +/-, remove and the checkout button.
const basketList = document.getElementById('basket-list');
const basketTemplate = document.getElementById('basket-row');

if (basketList && basketTemplate) {
  function renderBasket() {
    const basket = getBasket();
    const basketLayout = document.getElementById('basket-layout');
    const basketEmpty = document.getElementById('basket-empty');
    basketList.innerHTML = '';

    if (basket.length === 0) {
      basketLayout.hidden = true;
      basketEmpty.hidden = false;
      return;
    }
    basketLayout.hidden = false;
    basketEmpty.hidden = true;

    let subtotal = 0;
    let itemCount = 0;

    basket.forEach(function (item) {
      const row = basketTemplate.content.cloneNode(true);
      const li = row.querySelector('.basket-row');
      li.dataset.id = item.id;
      row.querySelector('.book img').src = item.cover;
      row.querySelector('.book').classList.toggle('is-goods', item.cover.includes('/products/'));
      row.querySelector('.basket-row-title').textContent = item.title;
      row.querySelector('.basket-row-price').textContent = '€' + item.price.toFixed(2) + ' each';
      row.querySelector('.qty-value').textContent = item.qty;
      row.querySelector('.basket-row-total').textContent = '€' + (item.price * item.qty).toFixed(2);
      row.querySelector('[data-action="decrease"] .visually-hidden').textContent = 'Remove one ' + item.title;
      row.querySelector('[data-action="increase"] .visually-hidden').textContent = 'Add one more ' + item.title;
      row.querySelector('.basket-remove .visually-hidden').textContent = ': ' + item.title;
      basketList.appendChild(row);

      subtotal += item.price * item.qty;
      itemCount += item.qty;
    });

    document.getElementById('summary-count').textContent = itemCount;
    document.getElementById('summary-subtotal').textContent = '€' + subtotal.toFixed(2);
    document.getElementById('summary-total').textContent = '€' + subtotal.toFixed(2);
  }

  // One listener on the list handles every row's +, - and Remove buttons
  basketList.addEventListener('click', function (event) {
    const button = event.target.closest('button');
    if (!button) return;
    const row = button.closest('.basket-row');
    let basket = getBasket();
    const item = basket.find(function (i) { return i.id === row.dataset.id; });
    if (!item) return;

    if (button.classList.contains('basket-remove')) {
      basket = basket.filter(function (i) { return i.id !== item.id; });
    } else if (button.dataset.action === 'increase') {
      item.qty += 1;
    } else if (button.dataset.action === 'decrease') {
      item.qty -= 1;
      if (item.qty <= 0) basket = basket.filter(function (i) { return i.id !== item.id; });
    }

    saveBasket(basket);
    renderBasket();
  });

  const checkoutButton = document.getElementById('checkout-btn');
  if (checkoutButton) {
    checkoutButton.addEventListener('click', function () {
      showToast('Checkout is switched off: this is a student project');
    });
  }

  // Adding one of the "Popular right now" books should refresh the list too.
  // This page-wide listener is added after block 3's, so it runs after the book is saved.
  document.addEventListener('click', function (event) {
    if (event.target.closest('.js-add')) {
      renderBasket();
    }
  });

  renderBasket();
}


// 7. Save a spot (events page)
// Each button names its own event with data-event, so one handler covers all of them.
document.querySelectorAll('.reserve-btn').forEach(function (button) {
  button.addEventListener('click', function () {
    button.textContent = 'Spot saved, see you there';
    showToast('Spot saved for ' + button.dataset.event);
  });
});


// 8. Homepage shelf
// Pointing at a book (mouse or keyboard) pulls it off the shelf and shows it
// in the preview card next to the shelf. The details come from BOOKS (books.js).
const shelf = document.querySelector('.shelf');

if (shelf) {
  const shelfBooks = shelf.querySelectorAll('[data-id]');

  function highlightBook(id) {
    const book = BOOKS.find(function (b) { return b.id === id; });
    const cover = 'images/covers/' + id + '.jpg';

    // Only the chosen book gets the "is-active" class (lifted and glowing in the CSS)
    shelfBooks.forEach(function (item) {
      item.classList.toggle('is-active', item.dataset.id === id);
    });

    document.getElementById('preview-cover').src = cover;
    document.getElementById('preview-badge').textContent = book.isNew ? 'New this week' : 'On the shelf';
    document.getElementById('preview-title').textContent = book.title;
    document.getElementById('preview-author').textContent = book.authors;
    document.getElementById('preview-price').textContent = '€' + book.price.toFixed(2);
    document.getElementById('preview-link').href = 'product.html?id=' + id;

    // The add button reads these data-* attributes when clicked (block 3)
    const addButton = document.getElementById('preview-add');
    addButton.dataset.id = id;
    addButton.dataset.title = book.title;
    addButton.dataset.price = book.price;
    addButton.dataset.cover = cover;
  }

  // Puts every book back on the shelf. The preview card keeps showing the
  // last book, so its buttons can still be clicked.
  function clearHighlight() {
    shelfBooks.forEach(function (item) { item.classList.remove('is-active'); });
  }

  shelfBooks.forEach(function (item) {
    item.addEventListener('mouseenter', function () { highlightBook(item.dataset.id); });
    item.addEventListener('focus', function () { highlightBook(item.dataset.id); });
  });

  // Leaving the shelf with the mouse drops the book back, unless it was
  // reached with the keyboard (Tab), in which case it stays lifted
  shelf.addEventListener('mouseleave', function () {
    const focused = document.activeElement;
    if (shelf.contains(focused) && focused.matches(':focus-visible')) {
      highlightBook(focused.dataset.id);
    } else {
      clearHighlight();
    }
  });

  // Tabbing out of the shelf drops the book back too
  shelf.addEventListener('focusout', function (event) {
    if (!shelf.contains(event.relatedTarget)) clearHighlight();
  });
}


// 9. Product page
// product.html is one page for every product. It reads ?id= from the address
// (product.html?id=dandadan-01) and fills itself in from BOOKS (books.js).
// No id, or an unknown one, shows the first book (Frieren Vol. 1).
const productPage = document.getElementById('product-page');

if (productPage) {
  const id = new URLSearchParams(window.location.search).get('id');
  const book = BOOKS.find(function (b) { return b.id === id; }) || BOOKS[0];
  const cover = imageFor(book);
  const isPreOrder = book.status === 'pre-order';

  function setText(elementId, text) {
    document.getElementById(elementId).textContent = text;
  }

  document.title = book.title + ' | Anime Haven';
  setText('breadcrumb-current', book.title);
  setText('product-title', book.title);
  setText('product-authors', 'By ' + book.authors);
  setText('product-price', '€' + book.price.toFixed(2));
  setText('product-description', book.description);

  // Figures, Blu-ray and merch: breadcrumb goes back to their own category
  if (book.category) {
    const categoryLink = document.getElementById('breadcrumb-category');
    categoryLink.textContent = CATEGORIES[book.category];
    categoryLink.href = 'manga.html?cat=' + book.category;
    markNavLink(book.category);
  }

  // The details list: books and other products need different facts
  const specs = book.category
    ? [['Maker', book.authors], ['Type', book.type], ['Size', book.size], ['Product code', book.code || 'Not listed'], ['Series', book.series]]
    : [['Publisher', book.publisher], ['Format', book.format || 'Paperback'], ['Pages', book.pages || 'Not listed'], ['ISBN', book.isbn], ['Series', book.series + ', volume ' + book.volume]];
  const specList = document.getElementById('spec-list');
  specList.innerHTML = '';
  specs.forEach(function (spec) {
    const term = document.createElement('dt');
    term.textContent = spec[0];
    const detail = document.createElement('dd');
    detail.textContent = spec[1];
    specList.append(term, detail);
  });

  document.getElementById('product-cover').src = cover;
  document.getElementById('product-cover').alt = (book.category ? 'Photo of ' : 'Cover of ') + book.title;
  document.getElementById('product-cover').parentElement.classList.toggle('is-goods', Boolean(book.category));

  const badge = document.getElementById('product-badge');
  badge.textContent = isPreOrder ? 'Pre-order' : (book.isNew ? 'New this week' : 'In stock');
  badge.className = isPreOrder ? 'badge badge-sakura' : 'badge badge-sun';
  setText('product-stock', isPreOrder ? 'Due ' + book.due + '. Pre-order and we\'ll hold one for you.' : 'In stock in our Dublin 1 shop');

  const addButton = document.getElementById('product-add');
  addButton.textContent = isPreOrder ? 'Pre-order' : 'Add to basket';
  addButton.dataset.id = book.id;
  addButton.dataset.title = book.title;
  addButton.dataset.price = book.price;
  addButton.dataset.cover = cover;

  // Sofia's note only shows for books she has written one for
  setText('product-note-text', book.note);
  document.getElementById('product-note').hidden = !book.note;

  // Other volumes (and figures, Blu-rays, merch) of the same series
  fillRow('series-list', BOOKS.filter(function (b) {
    return b.series === book.series && b.id !== book.id;
  }));

  // Up to 5 books that share a genre: one per series, never this book's series
  const alsoLike = [];
  BOOKS.forEach(function (b) {
    const sharesGenre = b.genres.some(function (g) { return book.genres.includes(g); });
    const seriesAlreadyIn = alsoLike.some(function (a) { return a.series === b.series; });
    if (b.series !== book.series && sharesGenre && !seriesAlreadyIn && alsoLike.length < 5) {
      alsoLike.push(b);
    }
  });
  fillRow('also-list', alsoLike);
}


// 10. Homepage "Deluxe editions" row
// Every book with a format (deluxe, omnibus, hardcover) goes in this row.
const deluxeList = document.getElementById('deluxe-list');

if (deluxeList) {
  fillRow('deluxe-list', BOOKS.filter(function (b) { return b.format; }));
}


// 11. Product cards (used by blocks 5, 9 and 10)
// These are function declarations, so the blocks above can already call them:
// JavaScript reads every function declaration before it runs the file.

// Move the pink "you are here" bar in the main nav to Figures, Blu-ray or Merch
function markNavLink(cat) {
  document.querySelectorAll('.nav-list a[aria-current]').forEach(function (a) {
    a.removeAttribute('aria-current');
  });
  const navLink = document.querySelector('.nav-list a[href="manga.html?cat=' + cat + '"]');
  if (navLink) navLink.setAttribute('aria-current', 'page');
}

// Books show their cover; figures, Blu-ray and merch show a product photo
function imageFor(item) {
  if (item.category) {
    return 'images/products/' + item.id + '.jpg';
  }
  return 'images/covers/' + item.id + '.jpg';
}

// Build one product card from the <template id="product-card"> on the page
// The product type for the Type filter, without the details after the comma
// ("Blu-ray + DVD, 2 discs" -> "Blu-ray + DVD")
function typeOf(item) {
  return item.type.split(',')[0];
}

// Builds a filter fieldset with one checkbox per distinct value, laid out
// like the ones already in manga.html. Returns an empty, hidden fieldset
// when there's only one value, since one checkbox wouldn't filter anything.
function choiceFieldset(legendText, name, values) {
  const fieldset = document.createElement('fieldset');
  const legend = document.createElement('legend');
  legend.textContent = legendText;
  fieldset.appendChild(legend);

  const unique = Array.from(new Set(values)).sort(function (a, b) {
    return a.localeCompare(b, 'en', { ignorePunctuation: true }); // so [Oshi no Ko] files under O
  });
  unique.forEach(function (value, i) {
    const choice = document.createElement('div');
    choice.className = 'filter-choice';
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = name + '-' + i;
    input.name = name;
    input.value = value;
    const label = document.createElement('label');
    label.htmlFor = input.id;
    label.textContent = value;
    choice.append(input, label);
    fieldset.appendChild(choice);
  });

  fieldset.hidden = unique.length < 2;
  return fieldset;
}

function productCard(b) {
  const card = document.getElementById('product-card').content.cloneNode(true);
  const li = card.querySelector('.product');
  const bCover = imageFor(b);
  const bPreOrder = b.status === 'pre-order';

  // The same data-* the category page filters and sorts by (block 5)
  li.dataset.genres = b.genres.join(' ');
  li.dataset.status = b.status;
  li.dataset.price = b.price;
  li.dataset.title = b.title;
  li.dataset.date = b.date || '';
  li.dataset.series = b.series || '';
  li.dataset.type = b.category ? typeOf(b) : '';

  card.querySelector('.product-link').href = 'product.html?id=' + b.id;
  card.querySelector('.book').classList.toggle('is-goods', Boolean(b.category));
  card.querySelector('img').src = bCover;
  card.querySelector('.product-title').textContent = b.title;
  card.querySelector('.product-author').textContent = b.authors;
  card.querySelector('.product-price').textContent = '€' + b.price.toFixed(2) + (bPreOrder ? ', due ' + b.due : '');

  const cardBadge = card.querySelector('.badge');
  if (bPreOrder) {
    cardBadge.textContent = 'Pre-order';
    cardBadge.classList.add('badge-sakura');
  } else if (b.isNew) {
    cardBadge.textContent = 'New';
    cardBadge.classList.add('badge-sun');
  } else {
    cardBadge.remove();
  }

  const cardButton = card.querySelector('.js-add');
  cardButton.querySelector('.add-label').textContent = bPreOrder ? 'Pre-order' : 'Add to basket';
  cardButton.querySelector('.visually-hidden').textContent = ': ' + b.title;
  cardButton.dataset.id = b.id;
  cardButton.dataset.title = b.title;
  cardButton.dataset.price = b.price;
  cardButton.dataset.cover = bCover;
  return card;
}

// Fill a row with cards, or hide its whole section if there's nothing to show
function fillRow(listId, books) {
  const list = document.getElementById(listId);
  list.innerHTML = '';
  books.forEach(function (b) { list.appendChild(productCard(b)); });
  list.closest('section').hidden = books.length === 0;
}
