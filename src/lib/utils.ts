export { cn } from "cn";

export function generateTenantURL(tenantSlug: string) {
  return `/tenants/${tenantSlug}`;
}

export function formatPrice(price: number | string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(price));
}
