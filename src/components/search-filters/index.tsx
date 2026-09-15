"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { useTRPC } from "@/app/trpc/client";

import { Categories } from "./categories";
import { SearchInput } from "./search-input";

export function SearchFilters() {
  return (
    <Suspense fallback={<SearchFiltersLoading />}>
      <ErrorBoundary fallback={<p>error...</p>}>
        <SearchFiltersSuspense />
      </ErrorBoundary>
    </Suspense>
  );
}

function SearchFiltersSuspense() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());

  return (
    <div
      className="flex w-full flex-col gap-4 border-b px-4 py-8 lg:px-12"
      style={{
        backgroundColor: "#f5f5f5",
      }}
    >
      <SearchInput />
      <div className="hidden lg:block">
        <Categories data={data} />
      </div>
    </div>
  );
}

function SearchFiltersLoading() {
  return (
    <div
      className="flex w-full flex-col gap-4 border-b px-4 py-8 lg:px-12"
      style={{
        backgroundColor: "#f5f5f5",
      }}
    >
      <SearchInput disabled />
      <div className="hidden lg:block">
        <div className="h-11" />
      </div>
    </div>
  );
}
