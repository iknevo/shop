import type { CollectionConfig } from "payload";

import { isSuperAdmin } from "@/lib/access";

export const Tenants: CollectionConfig = {
  slug: "tenants",
  admin: {
    useAsTitle: "slug",
  },
  access: {
    create: ({ req }) => isSuperAdmin(req.user),
    delete: ({ req }) => isSuperAdmin(req.user),
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: "Store Name",
      required: true,
      admin: { description: "This is the name of the store (e.g. Ahmed's Store)" },
    },
    {
      name: "slug",
      type: "text",
      index: true,
      required: true,
      unique: true,
      admin: { description: "This is the subdomain of the store (e.g. [slug].shop.com)" },
      access: {
        update: ({ req }) => isSuperAdmin(req.user),
      },
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "stripeAccountId",
      type: "text",
      required: true,
      admin: {
        description: "Stripe account ID associated with your shop",
      },
      access: {
        update: ({ req }) => isSuperAdmin(req.user),
      },
    },
    {
      name: "stripeDetailsSubmitted",
      type: "checkbox",
      admin: {
        description: "You cannot create products until you submit your stripe details",
      },
      access: {
        update: ({ req }) => isSuperAdmin(req.user),
      },
    },
  ],
};
