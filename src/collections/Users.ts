import { tenantsArrayField } from "@payloadcms/plugin-multi-tenant/fields";
import type { CollectionConfig } from "payload";

const customTenantsArrayField = tenantsArrayField({
  tenantsArrayFieldName: "tenants",
  tenantsCollectionSlug: "tenants",
  tenantsArrayTenantFieldName: "tenant",
  arrayFieldAccess: {
    read: () => true,
    create: () => true,
    update: () => true,
  },
  tenantFieldAccess: {
    read: () => true,
    create: () => true,
    update: () => true,
  },
});

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
  },
  auth: true,
  fields: [
    { name: "username", type: "text", required: true, unique: true },
    {
      name: "roles",
      type: "select",
      hasMany: true,
      options: ["super-admin", "user"],
      admin: {
        position: "sidebar",
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
