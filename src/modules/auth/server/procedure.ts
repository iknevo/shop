import { AUTH_COOKIE } from "../constants";
import { loginSchema, registerSchema } from "../validation";
import { TRPCError } from "@trpc/server";
import { cookies as nextCookies, headers as nextHeaders } from "next/headers";

import { createTRPCRouter, publicProcedure } from "@/app/trpc/init";

export const authRouter = createTRPCRouter({
  session: publicProcedure.query(async ({ ctx }) => {
    const headers = await nextHeaders();

    const session = await ctx.payload.auth({ headers });

    return session;
  }),

  register: publicProcedure.input(registerSchema).mutation(async ({ ctx, input }) => {
    const { email, password, username } = input;
    const cookies = await nextCookies();

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

    await ctx.payload.create({
      collection: "users",
      data: {
        email,
        password,
        username,
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
    cookies.set({
      name: AUTH_COOKIE,
      value: data.token,
      httpOnly: true,
      path: "/",
      //   sameSite: "none",
      // domain:""
      // TODO: ensure cross domain cookie sharing
    });
    return data;
  }),

  login: publicProcedure.input(loginSchema).mutation(async ({ ctx, input }) => {
    const { email, password } = input;
    const cookies = await nextCookies();
    const data = await ctx.payload.login({
      collection: "users",
      data: {
        email,
        password,
      },
    });
    if (!data.token) throw new TRPCError({ code: "UNAUTHORIZED", message: "Failed to login" });
    cookies.set({
      name: AUTH_COOKIE,
      value: data.token,
      httpOnly: true,
      path: "/",
      //   sameSite: "none",
      // domain:""
      // TODO: ensure cross domain cookie sharing
    });
    return data;
  }),

  logout: publicProcedure.mutation(async () => {
    const cookies = await nextCookies();
    cookies.delete(AUTH_COOKIE);
  }),
});
