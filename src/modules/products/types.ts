import { inferRouterOutputs } from "@trpc/server";

import { AppRouter } from "@/app/trpc/routers/_app";

export type ProductsGetManyOutput = inferRouterOutputs<AppRouter>["products"]["getMany"];

export type ProductType = ProductsGetManyOutput["docs"][number];
