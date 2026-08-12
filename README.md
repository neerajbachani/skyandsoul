# Sky n Soul

Handmade heirloom baby & nursery e-commerce (catalog + cart/checkout).

## Stack

- Next.js App Router + TypeScript + Tailwind
- Prisma + PostgreSQL
- TanStack Query
- Auth: JWT httpOnly cookie + bcrypt
- Payments: Razorpay (online only)
- Email: nodemailer / SMTP
- Design system: [`DESIGN.md`](./DESIGN.md)

## Setup

1. Copy env and start Postgres (Docker example used in local dev):

```bash
cp .env.example .env
docker start skyandsoul-db 2>/dev/null || docker run -d --name skyandsoul-db \
  -e POSTGRES_USER=skyandsoul \
  -e POSTGRES_PASSWORD=skyandsoul \
  -e POSTGRES_DB=skyandsoul \
  -p 5433:5432 postgres:16-alpine
```

2. Fill `.env` (see `.env.example`):

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Postgres connection |
| `JWT_SECRET` | Signs auth cookies (required for login) |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | Server Razorpay keys |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Client Checkout.js key |
| `SMTP_*` / `SMTP_FROM` | Order confirmation email |
| `ADMIN_CONTACT_EMAIL` | Admin order notification |
| `NEXT_PUBLIC_APP_URL` | Links in emails (e.g. `http://localhost:3000`) |

Without Razorpay keys, checkout fails when creating a payment. Without SMTP, order emails are skipped (order still saves).

3. Install and seed:

```bash
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Next.js dev server |
| `npm run build` | Prisma generate + production build |
| `npm run db:push` | Sync Prisma schema to DB |
| `npm run db:seed` | Seed categories + Google Doc blanket copy |
| `npm run db:studio` | Prisma Studio |

## Phase B — Cart & Checkout

- Guest cart in `localStorage` (`skyandsoul_guest_cart`); merges into DB cart on login/signup
- Login required for checkout (no COD)
- Promo: free shipping when subtotal ≥ ₹999; 10% off first paid order
- Flow: cart → checkout → Razorpay → `/orders/[id]` + confirmation email
- Account order history at `/account/orders`
- Wishlist stays disabled

## Phase A — Catalog

- Collections, product pages, search, and content pages
- Frame It Your Way marketing preview (interactive configurator still later)
