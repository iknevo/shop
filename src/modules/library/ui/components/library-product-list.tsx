"use client";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { Inbox } from "lucide-react";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { cn } from "@/lib/utils";

import { useTRPC } from "@/app/trpc/client";

import { Button } from "@/components/ui/button";

import { LibraryProductCard, LibraryProductCardLoading } from "./library-product-card";
import { DEFAULT_LIMIT } from "@/constants";

export function LibraryProductList() {
  return (
    <Suspense fallback={<LibraryProductListLoading />}>
      <ErrorBoundary fallback={<p>error</p>}>
        <LibraryProductListSuspense />
      </ErrorBoundary>
    </Suspense>
  );
}

function LibraryProductListSuspense() {
  const trpc = useTRPC();

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useSuspenseInfiniteQuery(
    trpc.library.getMany.infiniteQueryOptions(
      { limit: DEFAULT_LIMIT },
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {data.pages
          .flatMap((page) => page.docs)
          .map((product) => (
            <LibraryProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              imageUrl={product.image?.url}
              tenantSlug={product.tenant.slug}
              tenantImageUrl={product.tenant.image?.url}
              reviewRating={3}
              reviewCount={5}
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

function LibraryProductListLoading() {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
      )}
    >
      {Array.from({ length: DEFAULT_LIMIT }).map((_, index) => (
        <LibraryProductCardLoading key={index} />
      ))}
    </div>
  );
}
