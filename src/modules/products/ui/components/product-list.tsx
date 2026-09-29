"use client";

import { useProductFilters } from "../../hooks/use-product-filters";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { Inbox } from "lucide-react";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { cn } from "@/lib/utils";

import { useTRPC } from "@/app/trpc/client";

import { Button } from "@/components/ui/button";

import { ProductCard, ProductCardLoading } from "./product-card";
import { DEFAULT_LIMIT } from "@/constants";

interface Props {
  category?: string;
  tenantSlug?: string;
  narrowView?: boolean;
}

export function ProductList({ category, tenantSlug, narrowView }: Props) {
  return (
    <Suspense fallback={<ProductListLoading narrowView={narrowView} />}>
      <ErrorBoundary fallback={<p>error</p>}>
        <ProductListSuspense category={category} tenantSlug={tenantSlug} narrowView={narrowView} />
      </ErrorBoundary>
    </Suspense>
  );
}

function ProductListSuspense({ category, tenantSlug, narrowView }: Props) {
  const [filters] = useProductFilters();
  const trpc = useTRPC();

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useSuspenseInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions(
      { ...filters, category, tenantSlug, limit: DEFAULT_LIMIT },
      {
        getNextPageParam: (lastPage) => {
          return lastPage.docs.length > 0 ? lastPage.nextPage : undefined;
        },
      }
    )
  );

  if (data.pages?.[0]?.docs.length === 0) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-y-4 rounded-lg border border-dashed border-black bg-white p-8">
        <Inbox />
        <p className="text-base font-medium">No products found</p>
      </div>
    );
  }

  return (
    <>
      <div
        className={cn(
          "grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4",
          narrowView && "2xl:grid-cols-3"
        )}
      >
        {data.pages
          .flatMap((page) => page.docs)
          .map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              imageUrl={product.image?.url}
              tenantSlug={product.tenant.slug}
              tenantImageUrl={product.tenant.image?.url}
              reviewRating={product.reviewRating}
              reviewCount={product.reviewCount}
              price={product.price}
            />
          ))}
      </div>
      <div className="flex justify-center pt-8">
        {hasNextPage && (
          <Button
            variant="elevated"
            className="bg-white text-base font-medium disabled:opacity-50"
            disabled={isFetchingNextPage}
            onClick={() => fetchNextPage()}
          >
            Load more
          </Button>
        )}
      </div>
    </>
  );
}

function ProductListLoading({ narrowView }: Props) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4",
        narrowView && "2xl:grid-cols-3"
      )}
    >
      {Array.from({ length: DEFAULT_LIMIT }).map((_, index) => (
        <ProductCardLoading key={index} />
      ))}
    </div>
  );
}
