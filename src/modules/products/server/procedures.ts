import { type Where } from "payload";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/app/trpc/init";

import { Category } from "@/payload-types";

export const productsRouter = createTRPCRouter({
  getMany: publicProcedure
    .input(
      z.object({
        category: z.string().nullable().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const where: Where = {};
      if (input.category) {
        const categoriesData = await ctx.payload.find({
          collection: "categories",
          limit: 1,
          depth: 1,
          pagination: false,
          where: {
            slug: {
              equals: input.category,
            },
          },
        });

        const formattedData = categoriesData.docs.map((doc) => ({
          ...doc,
          subcategories: (doc.subcategories?.docs ?? []).map((item) => item as Category),
        }));

        const parentCategory = formattedData[0];
        if (parentCategory) {
          const categorySlugs = [
            parentCategory.slug,
            ...(parentCategory.subcategories ?? []).map((cat) => cat.slug),
          ];
          where["category.slug"] = {
            in: categorySlugs,
          };
        }
      }
      const data = await ctx.payload.find({
        collection: "products",
        depth: 1,
        pagination: true,
        where,
      });

      return data;
    }),
});
