# Anime Haven website: build brief

You are building the semester project website for **CMPU 1031 Web Development 1** (TU Dublin, first year). The client is fictional: **Sofia Martinez**, owner of **Anime Haven**, a small anime shop. The site must be demoed and explained to a Lab TA, so the code must stay simple, readable, and fully understood by a first-year student.

## Reference image

`screenshots/homepage-lowfi-wireframe.png` is the agreed homepage design (v2). Follow its layout and structure closely, section by section. It is the only design reference; there is no other mockup.

The wireframe font (Balsamiq Sans), grey bars and grey boxes with an X are wireframe conventions. Do not copy them into the real site. Apply the visual style described below instead.

## Tech constraints

- Plain **HTML5 + CSS3**. No frameworks, no build tools, no Tailwind, no Bootstrap.
- JavaScript only where it is genuinely needed (for example a mobile menu toggle). Keep it in one small file, commented.
- One shared stylesheet. Use CSS custom properties for colours and spacing.
- Must open by double-clicking `index.html` (no server required).
- Comment each HTML section and each CSS block briefly, so the student can explain every part in the demo.
- Prefer simple, readable CSS (flexbox and grid) over clever tricks.

## File structure

```
anime-haven/
  index.html        Homepage
  manga.html        Category page (also used for Figures, Blu-ray, Merch)
  product.html      Single product page
  events.html       In-shop events
  css/style.css
  js/main.js        Only if needed
  images/           Placeholder images
```

## Client and audience

- **Client:** Sofia Martinez, owner of Anime Haven. Friendly, fan-first, a bit playful ("Hola!").
- **Site purpose:** online storefront for manga, figures, Blu-rays and merch, plus a community hub for in-shop events.
- **Audience:** anime and manga fans, teens to adults, collectors, and locals checking events before visiting.
- **Unique angle:** the site should feel like a real fan-run shop, not a generic e-commerce template. The homepage borrows from the physical shop: a manga-page hero, books on a shelf, a handwritten staff pick card, and a corkboard of flyers.

## Visual style

Colours:

```css
--ink:    #000000;  /* text, borders, panel outlines */
--paper:  #ffffff;  /* background */
--sakura: #ff8fb1;  /* main accent */
--berry:  #d93a73;  /* strong accent, hover states */
--sun:    #ffe45c;  /* tags, price stickers, highlights */
--tone:   #cfcfcf;  /* halftone dots, muted UI */
```

Fonts (Google Fonts, with fallbacks):

- **Dela Gothic One** for headings and the logo.
- **Zen Maru Gothic** (500, 700) for body text and UI.
- **Kalam** for handwritten elements only (Sofia's shelf card, sticky note).

Style rules:

- Thick black outlines (3 to 4px) on panels and cards, like manga panels.
- Hard offset shadows (for example `6px 6px 0 var(--ink)`), not soft blurred shadows.
- Halftone dot backgrounds via `radial-gradient` in a few places, not everywhere.
- Slight rotations (1 to 3 degrees) only on the shelf card, flyers and sticky note.
- Do not use real anime characters, logos or official artwork. All series names are invented (see content below). Use CSS-drawn covers or simple placeholder images.

## Homepage (index.html)

Follow `screenshots/homepage-lowfi-wireframe.png` top to bottom:

1. **Info strip.** Thin bar: "Open today 11:00 to 19:00. Watch night this Friday." Basket link on the right.
2. **Header.** Logo mark + "Anime Haven" on the left. Nav on the right: Manga, Figures, Blu-ray, Merch, Events. Rounded search box.
3. **Hero as a manga page.** Four uneven panels with small gutters:
   - Panel A (large, left): featured arrival. Faced-out cover on the left with speedlines behind it. Text: "Just landed", "Moon Courier", "Vol. 4 is in", a short line of copy, a "Reserve a copy" button, and a "read the first chapter" link.
   - Panel B (top right): Sofia in a real speech-bubble shape: "Hola! New Paper Crane volumes just landed." Round avatar placeholder labelled Sofia.
   - Panel C (bottom right): "Watch night", "Fri 7pm, free", photo, "Save a seat" link to events.html.
   - Panel D (bottom right): "12 new figures", photo, "See figures" link.
4. **New on the shelf.** Heading plus "Restocked every Thursday". A row of book spines of varying widths and heights sitting on a shelf plank, with two covers faced out (price stickers in `--sun`). Spine titles run vertically. On hover and on keyboard focus, a spine lifts up slightly (`transform: translateY(-12px)`). Each spine links to product.html. "Browse all manga" link below.
5. **Shelf talker.** Beside the shelf, a slightly rotated card with a pin, in Kalam: "Sofia says: Paper Crane made me cry on the bus. Start at vol. 1, trust me. Sofia x"
6. **Pinned up in the shop.** A corkboard panel with three flyers pinned at slight angles:
   - Friday watch night, 3 Oct, 7pm, with an image.
   - Drawing club, 11 Oct, all levels, with tear-off "sign up" tabs along the bottom (each tab links to events.html).
   - Cosplay contest, 31 Oct, prizes, with an image.
   - A small sticky note: "Bring your own snacks!"
7. **Come say hola.** Shop address placeholder, opening hours as a small table (Mon to Fri 11:00 to 19:00, Sat 10:00 to 18:00, Sun 12:00 to 17:00), "Get directions" button, and a large map placeholder on the right.
8. **Footer.** Simple, light (not a dark block). Logo text, links (Instagram, TikTok, Discord, Shipping, Returns, Contact), and a small "Thursday restock email" signup (no backend; the form does nothing).

## Other pages

Reuse the same header, footer and visual style.

**manga.html (category page)**
- Breadcrumb "Home / Manga", big heading, "Showing 6 of 48 titles".
- Left sidebar filters (visual only): Genre checkboxes (Action, Comedy, Romance, Slice of life), a price range input, Availability (In stock, Pre-order).
- Sort dropdown, a grid of 6 products (cover, title, format, price, add button), simple pagination.

**product.html**
- Breadcrumb, large product image with 3 thumbnails.
- Title "Moon Courier figure", price "€49.00", "Pre-order. Ships in November.", short description, quantity stepper, "Pre-order now" and "Add to wishlist" buttons.
- A small handwritten "Sofia's note" card, like the shelf talker.
- "You might also like" row of 4 products.

**events.html**
- Heading "In the shop" and "Free events at Anime Haven. Everyone welcome."
- Event list styled as pinned flyers or cards: date, photo, title, description, "Reserve a spot" button.
  - 3 Oct: Friday watch night
  - 11 Oct: Drawing club
  - 31 Oct: Halloween cosplay contest
  - 14 Nov: Manga swap meet
- Map placeholder at the bottom.

## Placeholder content

Invented products (use these, never real series):

| Title | Type | Price |
|---|---|---|
| Ramen Knight, Vol. 1 | Manga | €11.99 |
| Moon Courier figure | Figure | €49.00 |
| Tofu Ronin, Season 1 | Blu-ray | €34.50 |
| Lantern Club tote | Merch | €15.00 |
| Paper Crane, Vol. 3 | Manga | €11.99 |
| Star Tide, Vol. 2 | Manga | €12.50 |

## Accessibility (required, this is graded)

- Semantic landmarks: `header`, `nav`, `main`, `section`, `footer`. One `h1` per page, headings in order.
- Every image has meaningful `alt` text. Purely decorative elements (speedlines, halftone dots, pins) use `alt=""` or are CSS-only.
- Text colour contrast of at least 4.5:1. Pink backgrounds get black text, never white text on `--sakura`.
- Visible `:focus-visible` styles on every link, button and input. Everything reachable by keyboard, including shelf spines and tear-off tabs.
- Font sizes in `rem`, so text scales with browser settings.
- Rotated elements stay readable (3 degrees maximum). Respect `prefers-reduced-motion` by turning off the spine lift animation.
- Form inputs have real `<label>` elements (visually hidden is fine).
- `lang="en"` on every page.

## Responsive

- Designed at 1440px desktop first, but must work down to 375px.
- Tablet: hero panels stack into 2 columns; the shelf scrolls horizontally inside its own container.
- Mobile: hero panels stack into 1 column; the nav collapses into a menu button; flyers stack vertically with no rotation.

## Definition of done

- [ ] All 4 pages exist, linked from the nav, with no broken links.
- [ ] Homepage matches the wireframe structure section by section.
- [ ] Colours and fonts match the Visual style section.
- [ ] Passes the W3C HTML validator with no errors.
- [ ] Keyboard-only navigation works across every page.
- [ ] Looks right at 1440px, 768px and 375px wide.
- [ ] Code is commented and simple enough to explain line by line in a lab demo.

## How to work

1. Read the wireframe screenshot first.
2. Build `index.html` and `css/style.css` first, section by section, and stop after the homepage so it can be reviewed.
3. Then build the three other pages reusing the same components.
4. After each step, briefly explain what you built and any new HTML or CSS concept used, so the student can explain it to their Lab TA.
