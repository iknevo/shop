import { inferRouterOutputs } from "@trpc/server";

import { AppRouter } from "@/app/trpc/routers/_app";

export type ReviewsGetOneOutput = inferRouterOutputs<AppRouter>["reviews"]["getOne"];
