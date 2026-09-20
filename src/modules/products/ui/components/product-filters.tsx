"use client";

import { useProductFilters } from "../../hooks/use-product-filters";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { ReactNode, useState } from "react";

import { cn } from "@/lib/utils";

import { PriceFilter } from "./price-filter";

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

  const onChange = (key: keyof typeof filters, value: unknown) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="rounded-md border bg-white">
      <div className="flex items-center justify-between border-b p-4">
        <p className="font-medium">filters</p>
        <button className="underline" onClick={() => {}} type="button">
          Clear
        </button>
      </div>
      <ProductFilter title="Price">
        <PriceFilter
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onMinPriceChange={(value) => onChange("minPrice", value)}
          onMaxPriceChange={(value) => onChange("maxPrice", value)}
        />
      </ProductFilter>
    </div>
  );
}
