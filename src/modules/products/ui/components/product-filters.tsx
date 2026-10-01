"use client";

import { type ProductFilters, useProductFilters } from "../../hooks/use-product-filters";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { ReactNode, useState } from "react";

import { cn } from "@/lib/utils";

import { PriceFilter } from "./price-filter";
import { TagsFilter } from "./tags-filter";

interface ProductFilterProps {
  title: string;
  className?: string;
  children: ReactNode;
}

function ProductFilter({ title, className, children }: ProductFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = isOpen ? ChevronDownIcon : ChevronRightIcon;

  return (
    <div className={cn("flex flex-col gap-2 border-b p-4", className)}>
      <div
        onClick={() => setIsOpen((c) => !c)}
        className="flex cursor-pointer items-center justify-between select-none"
      >
        <p className="font-medium">{title}</p>
        <Icon className="size-5" />
      </div>
      {isOpen && children}
    </div>
  );
}

export function ProductFilters() {
  const [filters, setFilters] = useProductFilters();

  const hasFilters = filters.minPrice !== "" || filters.maxPrice !== "" || filters.tags.length > 0;

  const onChange = <K extends keyof ProductFilters>(key: K, value: ProductFilters[K]) => {
    setFilters({ ...filters, [key]: value });
  };

  const onClear = () => {
    setFilters({
      minPrice: "",
      maxPrice: "",
      tags: [],
    });
  };

  return (
    <div className="rounded-md border bg-white">
      <div className="flex items-center justify-between border-b p-4">
        <p className="font-medium">filters</p>
        {hasFilters && (
          <button className="cursor-pointer underline" onClick={onClear} type="button">
            Clear
          </button>
        )}
      </div>
      <ProductFilter title="Price">
        <PriceFilter
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onMinPriceChange={(value) => onChange("minPrice", value)}
          onMaxPriceChange={(value) => onChange("maxPrice", value)}
        />
      </ProductFilter>
      <ProductFilter title="Tags" className="border-b-0">
        <TagsFilter
          value={filters.tags}
          onChange={(value) => {
            onChange("tags", value);
          }}
        />
      </ProductFilter>
    </div>
  );
}
