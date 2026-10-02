# ARVELI Admin — Architecture Notes

This folder is the **admin side** of the ARVELI Plant/Tree Delivery Booking
System. It sits alongside your existing `images/` and `home/` folders,
exactly like before — only the admin pages themselves were reorganized.

## Folder structure

```
admin/
├── admin.html      Dashboard (overview + stats)
├── product.html    Product catalog CRUD
├── order.html      Order tracking + status updates (this IS the booking)
├── category.html   Plant category CRUD                   (rebuilt — was empty)
├── customer.html   Customer accounts                     (rebuilt — was empty)
├── settings.html   Store profile + notification prefs    (NEW)
├── css/
│   └── admin.css   One shared stylesheet for all admin pages
├── js/
│   ├── sidebar.js  Shared sidebar component + mobile menu toggle
│   ├── product.js  Product page logic only
│   ├── order.js    Order page logic only
│   ├── customer.js Customer page logic only
│   ├── category.js Category page logic only
│   └── settings.js Settings page logic only
└── README.md       This file
```

## Why this structure (for your viva)

**One shared sidebar, not six copies.** Every page used to carry its own
hand-copied ~100-line sidebar block. Now `sidebar.js` builds it once from a
list of links and drops it into a placeholder `<div id="sidebarPlaceholder">`
on each page. Adding a new nav link, or renaming one, now means editing one
file instead of six. The currently active link is set by a single
`data-page="orders"` attribute on `<body>` — no manual "active" class needed.

**One JS file per page, not one giant shared file.** The old `admin.js` mixed
sidebar toggling, product modals, order filtering, and customer logic
together in one 360-line file loaded on every page, whether it was needed or
not. Each page now loads only the script it actually uses. Every script
still checks that its page's key element exists before running
(`if (!ordersTableBody) return;`), so nothing breaks if a script is
accidentally left on the wrong page.

**One CSS file, with duplicate rules merged.** The old stylesheet had two
near-identical sets of classes for "search + filter + table + detail modal"
pages — one named `order-*`, one named `management-*`, written for pages that
didn't exist yet. They're now one shared set (`.list-toolbar`, `.list-filter`,
`.action-group`, `.detail-grid`, `.detail-item`, `.empty-state`) used by
Orders, Bookings, Categories, and Customers alike.

**Dummy data is isolated from DOM logic.** Each page script keeps its sample
data (`customers`, `categories`, `bookings`) as a plain array at the top,
completely separate from the rendering functions. When you connect
Node.js/Express/MongoDB, you replace the array with a `fetch('/api/...')`
call and the rest of the file — rendering, search, filtering — needs no
changes. `// TODO:` comments mark exactly where each API call will go
(e.g. in `order.js`: `// TODO: PATCH /api/orders/:id`).

## What was fixed

- `category.html` and `customer.html` were **empty files** even though
  `admin.js` already had customer-management logic expecting them — they're
  now built out to match `customer.js`/`category.js`.
- `booking.html` didn't exist, and the sidebar link pointing to it was
  removed rather than built out: the dashboard already labels an order row
  "Recent Plant **Bookings**" — in this project a booking and an order are
  the same entity (a customer books a plant delivery, which becomes an
  order). Orders is the single source of truth; a separate Bookings page
  would just be a second list of the same data.
- Every remaining sidebar link that pointed to `#` now points to a real page,
  including **Settings**, which now holds a store profile form and
  notification-preference toggles, persisted in `localStorage` so it
  actually works in the browser today (swap `loadSettings()` /
  `saveSettings()` in `settings.js` for `fetch()` calls later — same
  pattern as the other pages).
- Form `<label>`s now use `for="..."` matching each input's `id` (screen
  reader accessibility).
- Table thumbnail images use `loading="lazy"`.
- Inline `style="color:#64748b"` was replaced with a `.cell-caption` class.

## What to build next (backend)

Each page's `// TODO:` comments map directly to the REST endpoints you'll
need in Express: `GET/POST/PUT/DELETE /api/products`, `/api/orders`,
`/api/categories`, `/api/customers`, `/api/bookings`. No frontend
restructuring should be needed when that backend arrives — only swapping
the dummy arrays for `fetch()` calls inside each page's own JS file.
