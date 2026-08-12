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
| `npm run build` | Prisma generate + production build (webpack) |
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

## Deploy on Vercel

**Build command:** `npm run build` (default — runs `prisma generate && next build`)  
**Install command:** `npm install` (default)  
**Output directory:** leave default (Next.js)

Catalog pages are rendered dynamically at request time, so the build does **not** need a live database. You still need Postgres and env vars for the deployed app to work.

1. Create a Postgres database ([Neon](https://neon.tech), [Supabase](https://supabase.com), or Vercel Postgres).
2. In Vercel → Project → **Environment Variables**, add (required before deploy succeeds):

| Variable | Required | Notes |
|----------|----------|-------|
| `DATABASE_URL` | Yes | Neon **pooler** URL with `?sslmode=require&pgbouncer=true&connect_timeout=15` |
| `DIRECT_URL` | Yes (Neon) | Neon **direct** URL (hostname without `-pooler`) with `?sslmode=require` |
| `JWT_SECRET` | Yes | Long random string for auth cookies |
| `NEXT_PUBLIC_APP_URL` | Yes | Production URL, e.g. `https://skyandsoul.vercel.app` |
| `RAZORPAY_KEY_ID` | For checkout | Server key |
| `RAZORPAY_KEY_SECRET` | For checkout | Server secret |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | For checkout | Client Checkout.js key |
| `SMTP_*` / `SMTP_FROM` | Optional | Order emails skipped if unset |
| `ADMIN_CONTACT_EMAIL` | Optional | Admin order notifications |

3. After first deploy, run migrations and seed against production (from your machine or CI):

```bash
DATABASE_URL="your-production-url" npm run db:push
DATABASE_URL="your-production-url" npm run db:seed
```

4. Redeploy or visit the site — homepage and collections load from the database at runtime.

**Neon on Vercel checklist**

- Do **not** wrap values in quotes in the Vercel dashboard.
- Remove `channel_binding=require` from connection strings.
- Use the pooler host for `DATABASE_URL` and the direct host for `DIRECT_URL` (see `.env.example`).
- Enable variables for **Production** (and Preview).
- After changing env vars, click **Redeploy** — old deployments keep old values.
- Verify runtime DB access at `/api/health` (should return `{ ok: true, categories: 5 }`).
