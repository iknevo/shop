import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/app/trpc/init";

import { Media, Tenant } from "@/payload-types";

export const checkoutRouter = createTRPCRouter({
  getProducts: publicProcedure
    .input(
      z.object({
        ids: z.array(z.string()),
      })
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.payload.find({
        collection: "products",
        depth: 2,
        pagination: true,
        where: {
          id: { in: input.ids },
        },
      });

      if (data.totalDocs !== input.ids.length) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Products not found" });
      }

      const totalPrice = data.docs.reduce((sum, item) => {
        const price = Number(item.price);

        return sum + (isNaN(price) ? 0 : price);
      }, 0);

      return {
        ...data,
        totalPrice,
        docs: data.docs.map((document) => ({
          ...document,

          // SAFETY: Payload returns `image` as a populated Media document at the configured depth.
          image: document.image as Media | null,
          // SAFETY: Payload returns `tenant` as a populated Tenant document with its image populated.
          tenant: document.tenant as Tenant & { image: Media | null },
        })),
      };
    }),
});
