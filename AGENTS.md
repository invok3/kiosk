<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Kiosk - Coffee Stop

A mobile-first coffee ordering kiosk with a customer-facing web app and an admin dashboard. Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS v4**.

## Project Overview

- **Customer app**: Mobile-only web ordering (pickup or delivery). Orders are submitted via WhatsApp URL.
- **Admin dashboard**: Widescreen desktop-only panel for managing categories and products.
- **Database**: Currently mocked locally. Firebase integration is planned for later.
- **Language**: All UI text is in Arabic (RTL). The app uses `lang="ar"` and `dir="rtl"` globally.
- **Brand colors**: Warm cream (`#FAF6F0`) background, deep espresso (`#2B1E16`) text, coffee brown accents.
- **Font**: Tajawal (Arabic + Latin) as the sans-serif, Geist Mono as the monospace.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16.2.10 (App Router) |
| Runtime | React 19.2.4 / React DOM 19.2.4 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 (`@tailwindcss/postcss`) |
| Linting | ESLint 9 + `eslint-config-next` (flat config) |
| Path alias | `@/*` → project root |

## Project Structure

```
app/
├── layout.tsx                    # Root layout: sets lang="ar", dir="rtl", fonts, metadata
├── page.tsx                      # Landing page (splash screen with "أطلب الآن" button)
├── not-found.tsx                 # 404 page
├── globals.css                   # Tailwind import + custom color tokens
├── favicon.ico
├── types/
│   ├── product.ts                # Product, CartProduct interfaces + cartProductFrom() factory
│   └── category.ts              # Category interface
├── data/
│   └── menu.ts                  # Shared mock categories+products (Firebase snapshot placeholder)
├── context/
│   ├── cart-context.tsx          # Global cart state (CartProvider, useCart)
│   └── auth-provider.tsx         # Stub auth context (AuthProvider, useAuth) — Firebase later
├── ui/
│   ├── menu-header.tsx           # Top header with cart badge + total
│   ├── category-accordion.tsx    # Expandable category list
│   ├── product-tile.tsx          # Individual product row
│   └── product-option-modal.tsx  # Modal for product options, quantity, notes
├── (customer)/                   # Customer-facing routes (mobile)
│   ├── layout.tsx                # Wraps in CartProvider
│   ├── menu/page.tsx             # Menu with mocked categories/products (imports from data/menu)
│   ├── cart/page.tsx             # Shopping cart view
│   └── order/page.tsx            # Checkout form → WhatsApp redirect
└── (admin)/                      # Admin dashboard (desktop)
    ├── layout.tsx                # Wraps in AuthProvider, white bg, full screen
    ├── login/page.tsx            # Login form (stub)
    └── dashboard/
        ├── layout.tsx            # Sidebar nav + header, auth guard (commented out)
        ├── page.tsx              # Dashboard home (placeholder)
        ├── categories/page.tsx   # Category CRUD (imports shared data, modal-based)
        ├── products/page.tsx     # Products page (placeholder)
        └── orders/page.tsx       # Orders page (placeholder)
```

## Key Conventions

### App Router (Next.js 16)
- Uses the **App Router** (`app/` directory), not Pages Router.
- Route groups: `(customer)` and `(admin)` are used to separate concerns. They do NOT appear in URLs.
- Layouts are nested: `app/layout.tsx` → `app/(customer)/layout.tsx` → page.
- All interactive components use `"use client"` directive.
- `Link` components use `prefetch={false}` to avoid unnecessary prefetching on mobile.
- Font loading uses `next/font/google` (e.g., `Tajawal`, `Geist_Mono`).
- Navigation uses `next/navigation` hooks (`useRouter`, `usePathname`).

### Styling
- **Tailwind CSS v4** with `@import "tailwindcss"` in `globals.css` (NOT the v3 `@tailwind base/components/utilities`).
- Custom color tokens defined in `@theme inline` block: `cream-100`, `cream-200`, `coffee-500`, `coffee-800`, `coffee-900`.
- CSS variables for `background`, `foreground`, `accent` with dark mode support via `@media (prefers-color-scheme: dark)`.
- Responsive: Customer pages use `landscape:w-[50vh]` to constrain width on landscape mobile.
- Admin uses `dir="rtl"` and `bg-stone-*` color palette (different from customer's coffee theme).
- No CSS modules or styled-jsx; all styling is inline Tailwind classes.

### ESLint
- Uses ESLint 9 **flat config** format in `eslint.config.mjs`.
- Extends `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`.

### Data Flow
- **Cart**: Global context (`CartContext`) provided at the `(customer)` layout level. Cart items are `CartProduct` objects with unique IDs generated via `Date.now()`.
- **Product options**: Products can have `options` array with `radio` (single choice) or `checkbox` (toggle) types. Extra prices are calculated in `cartProductFrom()`.
- **Mock data**: `CATEGORIES` is defined in `app/data/menu.ts` and shared across customer and admin. Admin derives `count` from `products.length`. Will be replaced by Firebase snapshot later.

### Order Submission
- Orders are submitted via **WhatsApp URL** (`https://wa.me/{phone}?text={encoded_message}`).
- The shop phone number is hardcoded in `app/(customer)/order/page.tsx`.
- The order message includes: order type (pickup/delivery), customer details, itemized list, and total.
- Cart is cleared after submission.

### Production Deployment
- `basePath` is conditionally set via `process.env.NODE_ENV` in `app/page.tsx` (`'/coffee_end_prototype'` in production).
- `next.config.ts` has commented-out `output: 'export'` and `basePath` settings for future static export.

## Scripts

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## Important Notes

1. **This is NOT standard Next.js** — Next.js 16 has breaking changes. Always check `node_modules/next/dist/docs/` for the latest API docs before writing code.
2. **Firebase is not yet integrated** — all data is mocked locally. Auth context, cart, and product data are all in-memory.
3. **Admin auth guard is commented out** — the dashboard is accessible without login. Uncomment in `app/(admin)/dashboard/layout.tsx` when auth is ready.
4. **Mobile-first customer UI** — customer pages are designed for mobile portrait mode with landscape width constraints.
5. **Desktop-only admin** — the admin dashboard assumes widescreen and is not responsive.
