import { Sort, type Where } from "payload";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/app/trpc/init";

import { sortValues } from "@/hooks/search-params";
import { Category } from "@/payload-types";

export const productsRouter = createTRPCRouter({
  getMany: publicProcedure
    .input(
      z.object({
        category: z.string().nullable().optional(),
        minPrice: z.string().nullable().optional(),
        maxPrice: z.string().nullable().optional(),
        tags: z.array(z.string()).nullable().optional(),
        sort: z.enum(sortValues).nullable().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const where: Where = {};
      let sort: Sort = "-createdAt";

      if (input.sort === "curated") {
        sort = "name";
      }

      if (input.sort === "trending") {
        sort = "+createdAt";
      }

      if (input.sort === "hot_and_new") {
        sort = "name";
      }

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

        if (input.tags && input.tags.length > 0) {
          where["tags.name"] = {
            in: input.tags,
          };
        }

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
        sort,
      });

      return data;
    }),
});
