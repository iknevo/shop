import { createTRPCRouter } from "../init";

import { authRouter } from "@/modules/auth/server/procedures";
import { categoriesRouter } from "@/modules/categories/server/procedures";
import { checkoutRouter } from "@/modules/checkout/server/procedures";
import { libraryRouter } from "@/modules/library/server/procedures";
import { productsRouter } from "@/modules/products/server/procedures";
import { reviewesRouter } from "@/modules/reviews/server/procedures";
import { tagsRouter } from "@/modules/tags/server/procedures";
import { tenantsRouter } from "@/modules/tenants/server/procedures";

export const appRouter = createTRPCRouter({
  categories: categoriesRouter,
  checkout: checkoutRouter,
  products: productsRouter,
  reviews: reviewesRouter,
  library: libraryRouter,
  tenants: tenantsRouter,
  auth: authRouter,
  tags: tagsRouter,
});

export type AppRouter = typeof appRouter;
