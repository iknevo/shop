import { Sort, type Where } from "payload";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/app/trpc/init";

import { DEFAULT_LIMIT } from "@/constants";
import { sortValues } from "@/hooks/search-params";
import { Category, Media, Tenant } from "@/payload-types";

export const productsRouter = createTRPCRouter({
  getOne: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const product = await ctx.payload.findByID({
        collection: "products",
        id: input.id,
        depth: 2,
      });

      return {
        ...product,
        // SAFETY: we used depth: 2, which will populate the subcategory so we will get the Image type not the id as a string but payload has no type detection for that so it will use Image | string by default
        image: product.image as Media | null,
        // SAFETY: using depth: 2
        tenant: product.tenant as Tenant & { image: Media | null },
      };
    }),

  getMany: publicProcedure
    .input(
      z.object({
        category: z.string().nullable().optional(),
        minPrice: z.string().nullable().optional(),
        maxPrice: z.string().nullable().optional(),
        tags: z.array(z.string()).nullable().optional(),
        sort: z.enum(sortValues).nullable().optional(),
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_LIMIT),
        tenantSlug: z.string().nullable().optional(),
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

      if (input.tenantSlug) {
        where["tenant.slug"] = {
          equals: input.tenantSlug,
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
          // SAFETY: we used depth: 1, which will populate the subcategory so we will get the Category type not the id as a string but payload has no type detection for that so it will use Category | string by default
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
        depth: 2,
        pagination: true,
        where,
        sort,
        page: input.cursor,
        limit: input.limit,
      });

      return {
        ...data,
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
