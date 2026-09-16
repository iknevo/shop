import { createTRPCRouter } from "../init";

import { authRouter } from "@/modules/auth/server/procedure";
import { categoriesRouter } from "@/modules/categories/server/procedures";

export const appRouter = createTRPCRouter({
  categories: categoriesRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
