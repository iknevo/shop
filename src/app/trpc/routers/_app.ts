import { createTRPCRouter } from "../init";

import { authRouter } from "@/modules/auth/server/procedure";
import { categoriesRouter } from "@/modules/categories/server/procedures";
import { productsRouter } from "@/modules/products/server/procedures";
import { tagsRouter } from "@/modules/tags/server/procedures";

export const appRouter = createTRPCRouter({
  products: productsRouter,
  categories: categoriesRouter,
  auth: authRouter,
  tags: tagsRouter,
});

export type AppRouter = typeof appRouter;
