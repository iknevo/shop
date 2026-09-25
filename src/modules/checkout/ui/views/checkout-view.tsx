"use client";

import { useCart } from "../../hooks/use-cart";
import { useCheckoutStates } from "../../hooks/use-checkout-state";
import { CheckoutItem } from "../components/checkout-item";
import { CheckoutSidebar } from "../components/checkout-sidebar";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Inbox, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { generateTenantURL } from "@/lib/utils";

import { useTRPC } from "@/app/trpc/client";

import { toast } from "@/components/ui/toast";

interface Props {
  tenantSlug: string;
}

export function CheckoutView({ tenantSlug }: Props) {
  const trpc = useTRPC();
  const router = useRouter();
  const { productIds, clearCart, removeProduct } = useCart(tenantSlug);

  const [states, setStates] = useCheckoutStates();

  const { data, isLoading, error } = useQuery(
    trpc.checkout.getProducts.queryOptions({ ids: productIds })
  );

  const purchase = useMutation(
    trpc.checkout.purchase.mutationOptions({
      onMutate: () => {
        setStates({ success: false, cancel: false });
      },
      onSuccess: (data) => {
        window.location.assign(data.url);
      },
      onError: (err) => {
        if (err.data?.code === "UNAUTHORIZED") {
          // TODO: modify when subdomains enabled
          router.push("/sign-in");
        }

        toast.add({ type: "error", description: err.message });
      },
    })
  );

  useEffect(() => {
    if (states.success) {
      setStates({ success: false, cancel: false });
      clearCart();
      // TODO: invalidate library
      router.push("/products");
    }
  }, [states.success, clearCart, router, setStates]);

  useEffect(() => {
    if (!error) return;

    if (error.data?.code === "NOT_FOUND") {
      clearCart();
      toast.add({ type: "warning", description: "Invalid products found, cart cleared" });
    }
  }, [error, clearCart]);

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
            onPurchase={() => purchase.mutate({ tenantSlug, productIds })}
            isCancelled={states.cancel}
            disabled={purchase.isPending}
          />
        </div>
      </div>
    </div>
  );
}
