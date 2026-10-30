# Shop

Shop is a multi-tenant digital-products marketplace built with Next.js and Payload CMS. Each tenant can manage a storefront and sell digital products, while customers can browse products, complete Stripe checkout, and access purchased content through a protected library.

Live demo: [nevo-shoply.vercel.app](https://nevo-shoply.vercel.app)

## Features

- Multi-tenant storefronts with tenant-specific URLs
- Product catalogue with categories, tags, pricing, images, and rich descriptions
- Product search, filtering, sorting, and pagination
- Customer authentication and account management
- Cart state scoped to the active tenant
- Stripe checkout and webhook verification
- Protected customer library for purchased products
- Downloadable product documentation, guides, and bonus content
- Product reviews and ratings
- Payload admin panel for managing products, tenants, media, orders, reviews, categories, and tags
- Super-admin access across tenants
- Vercel Blob media storage

## Tech stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 16 and React 19 |
| CMS and API | Payload CMS 3, REST, GraphQL, and tRPC |
| Database | MongoDB through the Payload MongoDB adapter |
| Payments | Stripe Checkout and webhooks |
| Storage | Vercel Blob and Sharp |
| Rich text | Payload Lexical editor |
| Client data | TanStack Query and Zustand |
| UI | Tailwind CSS 4, shadcn/ui, Base UI |
| Validation | Zod and React Hook Form |
| Package manager | Bun |

## Getting started

### Prerequisites

- Node.js 20 or newer
- [Bun](https://bun.sh/)
- MongoDB database
- Stripe account and webhook endpoint
- Vercel Blob token for media uploads

### Installation

```bash
git clone https://github.com/iknevo/shop.git
cd shop
bun install
cp .env.example .env
```

Configure the environment variables, then start the development server:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000). The Payload admin panel is available at `/admin`.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | MongoDB connection string used by Payload |
| `PAYLOAD_SECRET` | Secret used by Payload for authentication and signing |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob media storage token |
| `STRIPE_SECRET_KEY` | Server-side Stripe API key |
| `STRIPE_WEBHOOK_SECRET` | Verifies Stripe webhook events |
| `NEXT_PUBLIC_APP_URL` | Public application URL used for checkout redirects and tRPC |

Keep all secrets in `.env` or the hosting provider's secret manager. Never commit environment files.

## Available scripts

| Command | Description |
| --- | --- |
| `bun run dev` | Start the Next.js development server |
| `bun run build` | Create a production build |
| `bun run start` | Start the production server |
| `bun run lint` | Run Oxlint and the custom lint tooling |
| `bun run lint:fix` | Apply automatic lint fixes |
| `bun run typecheck` | Run TypeScript checks |
| `bun run typecheck:tools` | Type-check the custom lint tooling |
| `bun run format` | Format project files |
| `bun run generate:types` | Regenerate Payload TypeScript types |
| `bun run db:fresh` | Reset Payload migrations/database state |
| `bun run db:seed` | Seed sample data |

## Project structure

```text
src/
├── app/
│   ├── (app)/             # Storefronts, catalogue, checkout, and library
│   ├── (payload)/         # Payload admin, REST, GraphQL, and generated routes
│   └── trpc/              # tRPC client and server setup
├── collections/           # Payload collections for products, tenants, orders, and reviews
├── modules/
│   ├── checkout/          # Cart, checkout state, and Stripe procedures
│   ├── library/           # Purchased-product access
│   ├── products/          # Product listing, filtering, and details
│   ├── reviews/           # Ratings and customer reviews
│   └── tenants/           # Multi-tenant storefront behavior
├── lib/stripe.ts           # Stripe server client
├── payload.config.ts       # Payload CMS configuration
└── scripts/seed.ts         # Sample data seeding
```

## Architecture notes

Payload CMS owns the content model and admin experience, including tenant-aware product access. The Next.js application exposes storefront and customer flows through route groups and typed tRPC procedures. Checkout creates Stripe sessions, and webhook handling verifies payment events before orders become available in the customer's protected library.

The core collections are Users, Tenants, Products, Categories, Tags, Orders, Reviews, and Media. Products can include protected documentation and downloadable content that is only displayed after a verified purchase.

## Stripe setup

For local development, configure a Stripe webhook endpoint that forwards events to:

```text
/api/stripe/webhooks
```

Set the resulting signing secret as `STRIPE_WEBHOOK_SECRET`. Checkout redirect URLs are generated from `NEXT_PUBLIC_APP_URL`.

## Deployment

The application is designed for deployment on Vercel:

1. Provision MongoDB, Stripe, and Vercel Blob.
2. Configure all environment variables.
3. Configure the Stripe webhook URL and signing secret.
4. Run `bun run generate:types` when Payload schemas change.
5. Build with `bun run build` and deploy.

## License

No license file is currently included in the repository.
