"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { useTRPC } from "@/app/trpc/client";

import { BreadcrumbNavigation } from "./breadcrumb-navigation";
import { Categories } from "./categories";
import { SearchInput } from "./search-input";
import { DEFAULT_BG_COLOR } from "@/modules/home/constants";
import { useProductFilters } from "@/modules/products/hooks/use-product-filters";

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
  const params = useParams<{ category?: string; subcategory?: string }>();

  const [filters, setFilters] = useProductFilters();

  const categoryParam = params.category;
  const activeSubCategory = params.subcategory;

  const activeCategory = categoryParam ?? "all";
  const activeCategoryData = data.find((category) => category.slug === activeCategory);
  const activeCategoryColor = activeCategoryData?.color ?? DEFAULT_BG_COLOR;
  const activeCategoryName = activeCategoryData?.name ?? null;

  const activeSubCategoryName =
    activeCategoryData?.subcategories?.find((sub) => sub.slug === activeSubCategory)?.name ?? null;

  return (
    <div
      className="flex w-full flex-col gap-4 border-b px-4 py-8 lg:px-12"
      style={{
        backgroundColor: activeCategoryColor,
      }}
    >
      <SearchInput
        defaultValue={filters.search}
        onChange={(value) => setFilters({ search: value })}
      />
      <div className="hidden lg:block">
        <Categories data={data} />
      </div>
      <BreadcrumbNavigation
        activeCategoryName={activeCategoryName}
        activeCategory={activeCategory}
        activeSubCategoryName={activeSubCategoryName}
      />
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
