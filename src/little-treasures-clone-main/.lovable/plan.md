
# ChildrenGoods Clone — Build Plan

A children's fashion e-commerce store modeled on childrengoods.com, with a real backend (products, categories, cart, auth) powered by Lovable Cloud.

## Brand & Design

- Logo wordmark: **CHILDRENGOODS** in hot pink (#FF2CB1-ish) with star-shaped O's (recreated as SVG).
- Top announcement bar: soft mint green (#DFF7E2) with centered link.
- White header, bold black nav, mint green category tiles.
- Typography: chunky rounded sans (Nunito / Baloo 2) for display, Inter for body.
- Tokens added to `src/styles.css` (oklch): `--brand-pink`, `--brand-mint`, `--brand-ink`, gradients & shadows.

## Pages (separate TanStack routes)

```
/                      Home (hero carousel, category circles, deals, best sellers, new arrivals, trust strip, newsletter)
/collections/all       Shop (grid + filters: category, age, color, price, size; sort)
/collections/$handle   Category landing (Newborn, Baby Boys, Baby Girls, Kids Boys, Kids Girls, New, Sale, Best Seller)
/products/$handle      PDP (gallery, title, price, variants size/color, qty, add to cart, wishlist, accordion: details/shipping/returns, related)
/cart                  Cart (line items, qty, discount code, gift wrap toggle, subtotal, checkout CTA)
/checkout              Checkout (shipping address, payment placeholder, order summary)
/wishlist              Wishlist
/search                Search results
/account, /login, /signup  Auth + order history
/pages/about, /contact, /how-to-place-an-order, /shipping-returns, /terms-conditions, /privacy-policy  Static info pages
```

Each route gets its own `head()` with title/description/og.

## Backend (Lovable Cloud)

Tables:
- `categories` (id, handle, name, parent_id, image_url, sort)
- `products` (id, handle, title, description, price, compare_at_price, category_id, age_group, gender, is_new, is_best_seller, is_sale, stock, rating, image_urls[])
- `product_variants` (id, product_id, size, color, sku, stock, price_override)
- `profiles` (id → auth.users, full_name, phone, default_address)
- `addresses` (id, user_id, line1, city, area, country, phone)
- `cart_items` (id, user_id or session_id, product_id, variant_id, qty)
- `wishlist_items` (id, user_id, product_id)
- `orders` (id, user_id, status, total, shipping_address, gift_wrap, discount_code, created_at)
- `order_items` (id, order_id, product_id, variant_id, qty, price_at_purchase)
- `user_roles` + `app_role` enum + `has_role()` security-definer fn (admin gate for future product mgmt)

RLS on every table; users only see their own cart/orders/wishlist; products & categories public-read.

Auth: email/password + Google sign-in. Profile auto-created via trigger on signup.

Server functions (`createServerFn`):
- `listProducts({ category, filters, sort, page })`
- `getProduct(handle)` with related
- `getCart` / `addToCart` / `updateCartQty` / `removeFromCart` / `applyDiscount`
- `getWishlist` / `toggleWishlist`
- `placeOrder(payload)` (creates order, clears cart) — payment integration deferred
- `listOrders` / `getOrder`

## Components

- `SiteHeader` (announcement bar, logo, nav, search, account, wishlist, cart count)
- `SiteFooter` (link columns, payment icons, social, newsletter)
- `CategoryCircle`, `ProductCard`, `ProductGrid`, `FilterSidebar`, `SortDropdown`
- `ProductGallery`, `VariantPicker`, `QuantityStepper`, `AddToCartButton`
- `CartDrawer` (slide-in + dedicated `/cart` page), `MiniWishlistDrawer`
- `Accordion` for PDP details, `Breadcrumbs`, `EmptyState`

## Seed Data

Seed ~30–40 placeholder products across 6 categories with generated images (kids fashion flat-lays / lifestyle), 2–4 variants each, mixed sale/new/best-seller flags. Hero banners and category tile images generated.

## Build Order

1. Enable Lovable Cloud, create schema + RLS + roles + auth trigger.
2. Design tokens + logo + header + footer + home page shell.
3. Product listing + filters + PDP.
4. Cart + wishlist (client state synced to DB when logged in, localStorage otherwise).
5. Auth pages + account/orders.
6. Checkout (collect address + create order; payment marked as placeholder).
7. Static pages, SEO meta on every route, polish + responsive QA.

## Out of Scope (this pass)

- Real payment processor (Stripe/Paddle hookup) — left as a stub; can be added next.
- Admin dashboard for product CRUD — schema is ready; UI later.
- Multi-language / multi-currency.

After approval, I'll implement step 1 first (Cloud + schema), then iterate.
