import configPromise from "@payload-config";
import { TRPCError, initTRPC } from "@trpc/server";
import { headers as nextHeaders } from "next/headers";
import { getPayload } from "payload";
import { cache } from "react";
import superjson from "superjson";

export const createTRPCContext = cache(async () => {
  return { userId: "user_123" };
});

const t = initTRPC.create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;

export const createCallerFactory = t.createCallerFactory;

export const publicProcedure = t.procedure.use(async ({ next }) => {
  const payload = await getPayload({ config: configPromise });

  return next({ ctx: { payload } });
});

export const protectedProcedure = publicProcedure.use(async ({ ctx, next }) => {
  const headers = await nextHeaders();
  const session = await ctx.payload.auth({ headers });

  if (!session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthenticated" });
  }

  return next({
    ctx: {
      ...ctx,
      session: {
        ...session,
        user: session.user,
      },
    },
  });
});
