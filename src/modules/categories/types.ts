import { inferRouterOutputs } from "@trpc/server";

import { AppRouter } from "@/app/trpc/routers/_app";

export type CategoriesGetManyOutput = inferRouterOutputs<AppRouter>["categories"]["getMany"];

export type CategoryType = CategoriesGetManyOutput[0];

/** A nested category: a Payload category with its own `subcategories` never populated. */
export type SubcategoryType = Omit<CategoryType["subcategories"][number], "subcategories">;
