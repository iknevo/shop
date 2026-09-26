"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";

import { Button, buttonVariants } from "@/components/ui/button";

import { useCart } from "@/modules/checkout/hooks/use-cart";

interface Props {
  tenantSlug: string;
  productId: string;
  isPurchased?: boolean;
}

export function CartButton({ tenantSlug, productId, isPurchased }: Props) {
  const cart = useCart(tenantSlug);

  if (isPurchased) {
    return (
      <Link
        prefetch
        href={`/library/${productId}`}
        className={cn(
          buttonVariants({
            variant: "elevated",
            className: "flex-1 bg-white font-medium",
          })
        )}
      >
        View in library
      </Link>
    );
  }

  return (
    <Button
      variant="elevated"
      className={cn("flex-1 bg-pink-400", cart.isProductInCart(productId) && "bg-white")}
      onClick={() => cart.toggleProduct(productId)}
    >
      {cart.isProductInCart(productId) ? "Remove from cart" : "Add to cart"}
    </Button>
  );
}
