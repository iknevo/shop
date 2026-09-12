"use client";

import { Button } from "../ui/button";
import { useRef, useState } from "react";

import { cn } from "@/lib/utils";

import { SubcategoryMenu } from "./subcategory-menu";
import { useDropdownPosition } from "@/hooks/use-dropdown-position";
import { Category } from "@/payload-types";

interface Props {
  category: Category;
  isActive?: boolean;
  isNavigationHovered?: boolean;
}

export function CategoryDropdown({ isActive, category, isNavigationHovered }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { getDropdownPosition } = useDropdownPosition(dropdownRef);
  const dropdownPosition = getDropdownPosition();

  const onMouseEnter = () => {
    if (category.subcategories) {
      setIsOpen(true);
    }
  };

  const onMouseLeave = () => setIsOpen(false);

  return (
    <div
      className="relative"
      ref={dropdownRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="relative">
        <Button
          variant="elevated"
          className={cn(
            "hover:border-primary h-11 rounded-full border-transparent bg-transparent px-4 text-black hover:bg-white",
            isActive && !isNavigationHovered && "border-primary bg-white"
          )}
        >
          {category.name}
        </Button>

        {category.subcategories && category.subcategories.length > 0 && (
          <div
            className={cn(
              "absolute -bottom-3 left-1/2 h-0 w-0 -translate-x-1/2 border-x-10 border-b-10 border-r-transparent border-b-black border-l-transparent opacity-0",
              isOpen && "opacity-100"
            )}
          />
        )}
        <SubcategoryMenu category={category} isOpen={isOpen} position={dropdownPosition} />
      </div>
    </div>
  );
}
