"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { useTRPC } from "@/app/trpc/client";

import { ReviewForm, ReviewFormLoading } from "./review-form";

interface Props {
  productId: string;
}

export function ReviewSidebar({ productId }: Props) {
  return (
    <Suspense fallback={<ReviewFormLoading />}>
      <ErrorBoundary fallback={<p>error...</p>}>
        <ReviewSidebarSuspense productId={productId} />
      </ErrorBoundary>
    </Suspense>
  );
}

export function ReviewSidebarSuspense({ productId }: Props) {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.reviews.getOne.queryOptions({
      productId,
    })
  );

  return <ReviewForm productId={productId} initialData={data} />;
}
