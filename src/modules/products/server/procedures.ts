import { type Where } from "payload";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/app/trpc/init";

import { Category } from "@/payload-types";

export const productsRouter = createTRPCRouter({
  getMany: publicProcedure
    .input(
      z.object({
        category: z.string().nullable().optional(),
        minPrice: z.string().nullable().optional(),
        maxPrice: z.string().nullable().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const where: Where = {};

      if (input.minPrice && input.maxPrice) {
        where.price = {
          greater_than_equal: input.minPrice,
          less_than_equal: input.maxPrice,
        };
      } else if (input.minPrice) {
        where.price = {
          greater_than_equal: input.minPrice,
        };
      } else if (input.maxPrice) {
        where.price = {
          less_than_equal: input.maxPrice,
        };
      }
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
          where["category.slug"] = {
            in: [
              parentCategory.slug,
              ...(parentCategory.subcategories ?? []).map((cat) => cat.slug),
            ],
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
