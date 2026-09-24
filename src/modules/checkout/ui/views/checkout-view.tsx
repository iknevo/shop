"use client";

import { useCart } from "../../hooks/use-cart";
import { CheckoutItem } from "../components/checkout-item";
import { CheckoutSidebar } from "../components/checkout-sidebar";
import { useQuery } from "@tanstack/react-query";
import { Inbox, Loader } from "lucide-react";
import { useEffect } from "react";

import { generateTenantURL } from "@/lib/utils";

import { useTRPC } from "@/app/trpc/client";

import { toast } from "@/components/ui/toast";

interface Props {
  tenantSlug: string;
}

export function CheckoutView({ tenantSlug }: Props) {
  const trpc = useTRPC();
  const { productIds, clearAllCarts, removeProduct } = useCart(tenantSlug);

  const { data, isLoading, error } = useQuery(
    trpc.checkout.getProducts.queryOptions({ ids: productIds })
  );

  useEffect(() => {
    if (!error) return;

    if (error.data?.code === "NOT_FOUND") {
      clearAllCarts();
      toast.add({ type: "warning", description: "Invalid products found, cart cleared" });
    }
  }, [error, clearAllCarts]);

  if (isLoading) {
    return (
      <div className="px-4 pt-4 lg:px-12 lg:pt-16">
        <div className="flex w-full flex-col items-center justify-center gap-y-4 rounded-lg border border-dashed border-black bg-white p-8">
          <Loader className="text-muted-foreground animate-spin" />
        </div>
      </div>
    );
  }

  if (data?.totalDocs === 0 || !data) {
    return (
      <div className="px-4 pt-4 lg:px-12 lg:pt-16">
        <div className="flex w-full flex-col items-center justify-center gap-y-4 rounded-lg border border-dashed border-black bg-white p-8">
          <Inbox />
          <p className="text-base font-medium">No products found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 lg:px-12 lg:pt-16">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="overflow-hidden rounded-md border bg-white">
            {data?.docs.map((product, index) => (
              <CheckoutItem
                key={product.id}
                isLast={index === data.docs.length - 1}
                imageUrl={product.image?.url}
                name={product.name}
                productUrl={`${generateTenantURL(product.tenant.slug)}/products/${product.id}`}
                tenantUrl={generateTenantURL(product.tenant.slug)}
                tenantName={product.tenant.name}
                price={product.price}
                onRemove={() => removeProduct(product.id)}
              />
            ))}
          </div>
        </div>
        <div className="lg:col-span-3">
          <CheckoutSidebar
            total={data?.totalPrice}
            onCheckout={() => {}}
            isCancelled={false}
            isPending={false}
          />
        </div>
      </div>
    </div>
  );
}
