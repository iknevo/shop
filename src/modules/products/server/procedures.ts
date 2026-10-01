import { TRPCError } from "@trpc/server";
import { headers as nextHeaders } from "next/headers";
import { Sort, type Where } from "payload";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/app/trpc/init";

import { DEFAULT_LIMIT } from "@/constants";
import { sortValues } from "@/hooks/search-params";
import { Rating } from "@/modules/reviews/types";
import { Category, Media, Review, Tenant } from "@/payload-types";

export const productsRouter = createTRPCRouter({
  getOne: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const headers = await nextHeaders();
      const session = await ctx.payload.auth({ headers });

      const product = await ctx.payload.findByID({
        collection: "products",
        id: input.id,
        depth: 2,
        select: {
          content: false,
        },
      });

      if (!product || product.isArchived) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Product not found" });
      }

      let isPurchased = false;

      if (session.user) {
        const ordersData = await ctx.payload.find({
          collection: "orders",
          pagination: false,
          limit: 1,
          where: {
            and: [
              {
                product: {
                  equals: input.id,
                },
              },
              {
                user: {
                  equals: session.user.id,
                },
              },
            ],
          },
        });

        isPurchased = ordersData.totalDocs > 0;
      }

      const reviews = await ctx.payload.find({
        collection: "reviews",
        pagination: false,
        where: {
          product: {
            equals: input.id,
          },
        },
      });

      const reviewRating =
        reviews.totalDocs === 0
          ? 0
          : Math.round(
              (reviews.docs.reduce((sum, review) => sum + review.rating, 0) / reviews.totalDocs) *
                10
            ) / 10;

      const ratingDistribution = {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      } satisfies Record<Rating, number>;

      if (reviews.totalDocs > 0) {
        reviews.docs.forEach((review) => {
          const rating = review.rating;

          if (rating >= 1 && rating <= 5 && Number.isInteger(rating)) {
            // SAFETY: rating by default is type of number
            ratingDistribution[rating as Rating]++;
          }
        });

        const ratings: Rating[] = [5, 4, 3, 2, 1];
        ratings.forEach((rating) => {
          const count = ratingDistribution[rating] || 0;
          ratingDistribution[rating] = Math.round((count / reviews.totalDocs) * 100);
        });
      }

      return {
        ...product,
        isPurchased,
        // SAFETY: we used depth: 2, which will populate the subcategory so we will get the Image type not the id as a string but payload has no type detection for that so it will use Image | string by default
        image: product.image as Media | null,
        // SAFETY: using depth: 2
        tenant: product.tenant as Tenant & { image: Media | null },
        reviewRating,
        reviewCount: reviews.totalDocs,
        ratingDistribution,
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
      const where: Where = {
        isArchived: {
          not_equals: true,
        },
      };

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
      } else {
        where["isPrivate"] = {
          not_equals: true,
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
        select: {
          content: false,
        },
      });

      const productsIds = data.docs.map((doc) => doc.id);

      const allReviewsData = await ctx.payload.find({
        collection: "reviews",
        depth: 0,
        pagination: false,
        where: {
          product: {
            in: productsIds,
          },
        },
      });

      const reviewsByProductId = allReviewsData.docs.reduce<Record<string, Review[]>>(
        (acc, review) => {
          // SAFETY: depth: 0 prevents Payload from populating the product relationship,
          // so the relationship value is the product ID returned by the query.
          const productId = review.product as string;

          acc[productId] ??= [];
          acc[productId].push(review);

          return acc;
        },
        {}
      );

      const dataWithSummarizedReviews = data.docs.map((doc) => {
        const productReviews = reviewsByProductId[doc.id] || [];
        const reviewCount = productReviews.length;

        const reviewRating =
          reviewCount === 0
            ? 0
            : Math.round(
                (productReviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount) * 10
              ) / 10;

        return {
          ...doc,
          reviewCount,
          reviewRating,
        };
      });

      return {
        ...data,
        docs: dataWithSummarizedReviews.map((document) => ({
          ...document,

          // SAFETY: Payload returns `image` as a populated Media document at the configured depth.
          image: document.image as Media | null,
          // SAFETY: Payload returns `tenant` as a populated Tenant document with its image populated.
          tenant: document.tenant as Tenant & { image: Media | null },
        })),
      };
    }),
});
