import { inferRouterInputs } from "@trpc/server";

import { AppRouter } from "@/app/trpc/routers/_app";

export type SignUpFromInputSchema = inferRouterInputs<AppRouter>["auth"]["register"];
