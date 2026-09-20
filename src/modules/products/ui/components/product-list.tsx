"use client";

import { useProductFilters } from "../../hooks/use-product-filters";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { useTRPC } from "@/app/trpc/client";

interface Props {
  category?: string;
}

export function ProductList({ category }: Props) {
  return (
    <Suspense fallback={<ProductListLoading />}>
      <ErrorBoundary fallback={<p>error</p>}>
        <ProductListSuspense category={category} />
      </ErrorBoundary>
    </Suspense>
  );
}

function ProductListSuspense({ category }: Props) {
  const [filters] = useProductFilters();
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.products.getMany.queryOptions({ category, ...filters }));

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {data.docs.map((product) => (
        <div key={product.id} className="rounded-md border bg-white p-4">
          <h2 className="text-xl font-medium">{product.name}</h2>
          <p>{product.price}</p>
        </div>
      ))}
    </div>
  );
}

function ProductListLoading() {
  return <div>Loading</div>;
}
