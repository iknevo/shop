import { useCart } from "../../hooks/use-cart";
import { ShoppingCartIcon } from "lucide-react";
import Link from "next/link";

import { cn, generateTenantURL } from "@/lib/utils";

import { Button } from "@/components/ui/button";

interface Props {
  className?: string;
  hideIfEmpty?: boolean;
  tenantSlug: string;
}

export function CheckoutButton({ tenantSlug, className, hideIfEmpty }: Props) {
  const { totalItems } = useCart(tenantSlug);

  if (hideIfEmpty && totalItems === 0) return null;

  return (
    <Button
      nativeButton={false}
      variant="elevated"
      className={cn("bg-white", className)}
      render={
        <Link href={`${generateTenantURL(tenantSlug)}/checkout`}>
          <ShoppingCartIcon />
          {totalItems > 0 ? totalItems : ""}
        </Link>
      }
    />
  );
}
