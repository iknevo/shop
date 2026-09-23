import { inferRouterOutputs } from "@trpc/server";

import { AppRouter } from "@/app/trpc/routers/_app";

export type CategoriesGetManyOutput = inferRouterOutputs<AppRouter>["categories"]["getMany"];

export type CategoryType = CategoriesGetManyOutput[0];
