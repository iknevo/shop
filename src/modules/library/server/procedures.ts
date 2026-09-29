import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/app/trpc/init";

import { DEFAULT_LIMIT } from "@/constants";
import { Media, Review, Tenant } from "@/payload-types";

export const libraryRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const ordersData = await ctx.payload.find({
        collection: "orders",
        pagination: false,
        limit: 1,
        where: {
          and: [
            {
              product: {
                equals: input.productId,
              },
            },
            {
              user: {
                equals: ctx.session.user.id,
              },
            },
          ],
        },
      });

      const order = ordersData.docs[0];

      if (!order) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Order not found" });
      }

      const product = await ctx.payload.findByID({
        collection: "products",
        id: input.productId,
      });

      if (!product) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Product not found" });
      }

      return product;
    }),

  getMany: protectedProcedure
    .input(
      z.object({
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_LIMIT),
      })
    )
    .query(async ({ ctx, input }) => {
      const ordersData = await ctx.payload.find({
        collection: "orders",
        depth: 0,
        pagination: true,
        page: input.cursor,
        limit: input.limit,
        where: {
          user: {
            equals: ctx.session.user.id,
          },
        },
      });

      const productIds = ordersData.docs.map((order) => order.product);

      const productsData = await ctx.payload.find({
        collection: "products",
        pagination: false,
        where: {
          id: {
            in: productIds,
          },
        },
      });

      const productsIds = productsData.docs.map((doc) => doc.id);

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

      const dataWithSummarizedReviews = productsData.docs.map((doc) => {
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
        ...productsData,
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
