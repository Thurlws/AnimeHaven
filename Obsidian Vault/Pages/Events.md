---
tags: [page, events]
---

# events.html — Events page

Purpose: list of in-shop events, plus a second copy of "Come say hola".

## Sections, in order

### 1. Heading — `<div class="wrap page-head">`
`<h1>In the shop</h1>` + "Every event is free and everyone's welcome. Save a spot so we put out enough chairs."

### 2. Featured next event — `<section class="wrap event-featured" aria-labelledby="featured-heading">`
`watch-night.jpg` (real descriptive alt), `.event-date` (`<time datetime="10-03">3 Oct</time>, 7pm`), `<h2 id="featured-heading">Friday watch night</h2>`, description, `.btn.reserve-btn` "Save a spot" (`data-event="Friday watch night"`).

### 3. Upcoming events — `<ul class="wrap event-list" aria-label="Upcoming events">`
Three `.event-row`s (day-number block + photo + body):

| Event | `datetime` | Time | Photo |
|---|---|---|---|
| Drawing club | `10-11` (11 Oct) | 2pm | `drawing-club.jpg` |
| Halloween cosplay contest | `10-31` (31 Oct) | 6pm | `cosplay.jpg` |
| Manga swap meet | `11-14` (14 Nov) | 12pm | `swap-meet.jpg` |

Each row: `<h2>` title, `.event-date` (time only, e.g. "2pm"), description, `.btn.reserve-btn` (`data-event="…"`). Dates are yearless (`datetime="10-11"`, no year) — see [[Decisions#Event dates are yearless]].

### 4. Come say hola — `id="visit"`
Identical markup to `index.html`'s copy — see [[Architecture#No templating: header and footer are copy-pasted]].

## JS on this page

- Block 1 (mobile menu), block 2 (restock signup) — shared.
- **Block 7 (save a spot)** — the only page with `.reserve-btn` elements. Click rewrites the button's own text to "Spot saved, see you there" and shows a toast ("Spot saved for " + `data-event`). No backend, no per-event count, no persisted state (a page refresh resets every button).
