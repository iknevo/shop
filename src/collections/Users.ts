import { tenantsArrayField } from "@payloadcms/plugin-multi-tenant/fields";
import type { CollectionConfig } from "payload";

import { isSuperAdmin } from "@/lib/access";

const customTenantsArrayField = tenantsArrayField({
  tenantsArrayFieldName: "tenants",
  tenantsCollectionSlug: "tenants",
  tenantsArrayTenantFieldName: "tenant",
  arrayFieldAccess: {
    read: () => true,
    create: ({ req }) => isSuperAdmin(req.user),
    update: ({ req }) => isSuperAdmin(req.user),
  },
  tenantFieldAccess: {
    read: () => true,
    create: ({ req }) => isSuperAdmin(req.user),
    update: ({ req }) => isSuperAdmin(req.user),
  },
});

export const Users: CollectionConfig = {
  slug: "users",
  access: {
    read: () => true,
    create: ({ req }) => isSuperAdmin(req.user),
    delete: ({ req }) => isSuperAdmin(req.user),
    update: ({ req, id }) => {
      if (isSuperAdmin(req.user)) return true;

      return req.user?.id === id;
    },
  },
  admin: {
    useAsTitle: "email",
    hidden: ({ user }) => !isSuperAdmin(user),
  },
  auth: {
    cookies: {
      ...(process.env.NODE_ENV !== "development" && {
        sameSite: "Lax",
        secure: true,
      }),
    },
  },
  fields: [
    {
      name: "username",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "roles",
      type: "select",
      hasMany: true,
      options: ["super-admin", "user"],
      admin: {
        position: "sidebar",
      },
      access: {
        update: ({ req }) => isSuperAdmin(req.user),
      },
    },
    {
      ...customTenantsArrayField,
      admin: {
        ...customTenantsArrayField.admin,
        position: "sidebar",
      },
    },
  ],
};
