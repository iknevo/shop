import { CheckoutMetadata, ProductMetadata } from "../types";
import { TRPCError } from "@trpc/server";
import type Stripe from "stripe";
import { z } from "zod";

import { stripe } from "@/lib/stripe";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/app/trpc/init";

import { PLATFORM_FEES_PERCENT } from "@/constants";
import { Media, Tenant } from "@/payload-types";

export const checkoutRouter = createTRPCRouter({
  verify: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.payload.findByID({
      collection: "users",
      id: ctx.session.user.id,
      depth: 0,
    });

    if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });

    // SAFETY: depth: 0, would make the tenant come as an id which is string
    const tenantId = user.tenants?.[0]?.tenant as string;

    const tenant = await ctx.payload.findByID({
      collection: "tenants",
      id: tenantId,
    });

    if (!tenant) throw new TRPCError({ code: "NOT_FOUND", message: "Tenant not found" });

    const accountLink = await stripe.accountLinks.create({
      account: tenant.stripeAccountId,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL!}/admin`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL!}/admin`,
      type: "account_onboarding",
    });

    if (!accountLink.url)
      throw new TRPCError({ code: "BAD_REQUEST", message: "Failed to create verification link" });

    return {
      url: accountLink.url,
    };
  }),

  purchase: protectedProcedure
    .input(
      z.object({
        productIds: z.array(z.string()).min(1),
        tenantSlug: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const products = await ctx.payload.find({
        collection: "products",
        depth: 2,
        where: {
          and: [
            {
              id: {
                in: input.productIds,
              },
            },
            {
              "tenant.slug": {
                equals: input.tenantSlug,
              },
            },
            {
              isArchived: {
                not_equals: true,
              },
            },
          ],
        },
        select: {
          content: false,
        },
      });

      if (products.totalDocs !== input.productIds.length) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Products not found" });
      }

      const tenantsData = await ctx.payload.find({
        collection: "tenants",
        limit: 1,
        pagination: false,
        where: {
          slug: {
            equals: input.tenantSlug,
          },
        },
      });

      const tenant = tenantsData.docs[0];

      if (!tenant) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Tenant not found" });
      }

      if (!tenant.stripeDetailsSubmitted) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Tenant not allowed to sell products",
        });
      }

      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = products.docs.map(
        (product) => ({
          quantity: 1,
          price_data: {
            unit_amount: Math.round(product.price * 100),
            currency: "usd",
            product_data: {
              name: product.name,
              // SAFETY: metadata is not strictly typed so i made a type for it and did assertion for it
              metadata: {
                stripeAccountId: tenant.stripeAccountId,
                id: product.id,
                name: product.name,
                price: product.price,
              } as ProductMetadata,
            },
          },
        })
      );

      const totalAmount = products.docs.reduce((sum, product) => sum + product.price * 100, 0);
      const platformFeeAmount = Math.round((totalAmount * PLATFORM_FEES_PERCENT) / 100);
      // NOTE: only for testing
      const appUrl = process.env.NEXT_PUBLIC_APP_URL;

      console.log({
        appUrl,
        successUrl: `${appUrl}/tenants/${input.tenantSlug}/checkout?success=true`,
        cancelUrl: `${appUrl}/tenants/${input.tenantSlug}/checkout?cancel=true`,
      });

      const checkout = await stripe.checkout.sessions.create(
        {
          customer_email: ctx.session.user.email,
          success_url: `${process.env.NEXT_PUBLIC_APP_URL}/tenants/${input.tenantSlug}/checkout?success=true`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/tenants/${input.tenantSlug}/checkout?cancel=true`,
          mode: "payment",
          line_items: lineItems,
          invoice_creation: {
            enabled: true,
          },
          // SAFETY: metadata is not strictly typed so i made a type for it and did assertion for it
          metadata: {
            userId: ctx.session.user.id,
          } as CheckoutMetadata,
          payment_intent_data: {
            application_fee_amount: platformFeeAmount,
          },
        },
        {
          stripeAccount: tenant.stripeAccountId,
        }
      );

      if (!checkout.url) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create checkout session",
        });
      }

      return {
        url: checkout.url,
      };
    }),

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
          and: [
            {
              id: { in: input.ids },
            },
            {
              isArchived: {
                not_equals: true,
              },
            },
          ],
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
