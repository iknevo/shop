export { cn } from "cn";

export function generateTenantURL(tenantSlug: string) {
  return `/tenants/${tenantSlug}`;
}
