"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { useTRPC } from "@/app/trpc/client";

import { PrettyStringify } from "@/components/dev/pretty-stringify";

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
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.products.getMany.queryOptions({ category }));

  return <PrettyStringify data={data} />;
}

function ProductListLoading() {
  return <div>Loading</div>;
}
