import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/app/trpc/init";

import { Media, Tenant } from "@/payload-types";

export const tenantsRouter = createTRPCRouter({
  getOne: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const tenantsData = await ctx.payload.find({
        collection: "tenants",
        depth: 2,
        where: {
          slug: {
            equals: input.slug,
          },
        },
        limit: 1,
        pagination: false,
      });

      const tenant = tenantsData.docs[0];

      if (!tenant) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Tenant not found." });
      }

      return tenant as Tenant & {
        image: Media | null;
      };
    }),
});
