import { generateAuthCookie } from "../utils";
import { loginSchema, registerSchema } from "../validation";
import { TRPCError } from "@trpc/server";
import { headers as nextHeaders } from "next/headers";

import { createTRPCRouter, publicProcedure } from "@/app/trpc/init";

export const authRouter = createTRPCRouter({
  session: publicProcedure.query(async ({ ctx }) => {
    const headers = await nextHeaders();

    const session = await ctx.payload.auth({ headers });

    return session;
  }),

  register: publicProcedure.input(registerSchema).mutation(async ({ ctx, input }) => {
    const { email, password, username } = input;

    const exsitingData = await ctx.payload.find({
      collection: "users",
      limit: 1,
      where: {
        username: {
          equals: username,
        },
      },
    });
    const exsitingUser = exsitingData.docs[0];
    if (exsitingUser)
      throw new TRPCError({ code: "BAD_REQUEST", message: "Username already taken" });

    const tenant = await ctx.payload.create({
      collection: "tenants",
      data: {
        name: username,
        slug: username,
        stripeAccountId: "mock",
      },
    });

    await ctx.payload.create({
      collection: "users",
      data: {
        email,
        password,
        username,
        roles: ["user"],
        tenants: [
          {
            tenant: tenant.id,
          },
        ],
      },
    });

    const data = await ctx.payload.login({
      collection: "users",
      data: {
        email,
        password,
      },
    });

    if (!data.token) throw new TRPCError({ code: "UNAUTHORIZED", message: "Failed to login" });

    await generateAuthCookie({
      prefix: ctx.payload.config.cookiePrefix,
      value: data.token,
    });
    return data;
  }),

  login: publicProcedure.input(loginSchema).mutation(async ({ ctx, input }) => {
    const { email, password } = input;
    const data = await ctx.payload.login({
      collection: "users",
      data: {
        email,
        password,
      },
    });
    if (!data.token) throw new TRPCError({ code: "UNAUTHORIZED", message: "Failed to login" });
    await generateAuthCookie({
      prefix: ctx.payload.config.cookiePrefix,
      value: data.token,
    });
    return data;
  }),
});
