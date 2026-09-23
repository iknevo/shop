"use client";

import { ChangeEvent } from "react";

import { formatPrice } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  minPrice?: string | null;
  maxPrice?: string | null;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
}

export const formatAsCurrency = (value: string) => {
  const numericValue = value.replace(/[^0-9.]/g, "");

  const parts = numericValue.split(".");
  const formattedValue = parts[0] + (parts.length > 1 ? "." + parts[1]?.slice(0, 2) : "");

  if (!formattedValue) return "";

  const numberValue = parseFloat(formattedValue);

  if (isNaN(numberValue)) return "";

  return formatPrice(numberValue);
};

export function PriceFilter({ minPrice, maxPrice, onMaxPriceChange, onMinPriceChange }: Props) {
  const handleMinPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const numbericValue = e.target.value.replace(/[^0-9.]/g, "");
    onMinPriceChange(numbericValue);
  };

  const handleMaxPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const numbericValue = e.target.value.replace(/[^0-9.]/g, "");
    onMaxPriceChange(numbericValue);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <Label className="text-base font-medium" htmlFor="min-price-input">
          Minimum Price
        </Label>
        <Input
          id="min-price-input"
          type="text"
          placeholder="$0"
          value={minPrice ? formatAsCurrency(minPrice) : ""}
          onChange={handleMinPriceChange}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-base font-medium" htmlFor="max-price-input">
          Maximum Price
        </Label>
        <Input
          id="max-price-input"
          type="text"
          placeholder="∞"
          value={maxPrice ? formatAsCurrency(maxPrice) : ""}
          onChange={handleMaxPriceChange}
        />
      </div>
    </div>
  );
}
