"use client";

import { ChevronDownIcon } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import { SubcategoryMenu } from "./subcategory-menu";
import { useDropdownPosition } from "@/hooks/use-dropdown-position";
import { CategoryType } from "@/modules/categories/types";

interface Props {
  category: CategoryType;
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

  // const toggleDropdown = () => {
  //   if (category.subcategories?.docs?.length) {
  //     setIsOpen((c) => !c);
  //   }
  // };
  //

  return (
    <div
      className="relative"
      ref={dropdownRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      // onClick={toggleDropdown}
    >
      <div className="relative">
        <Button
          variant="elevated"
          className={cn(
            "hover:border-primary h-11 rounded-full border-transparent bg-transparent px-4 text-black hover:bg-white",
            isActive && !isNavigationHovered && "border-primary bg-white",
            isOpen &&
              "border-border -translate-x-0.75 -translate-y-0.75 bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
          )}
        >
          <Link
            href={`/${category.slug === "all" ? "" : category.slug}`}
            className="flex items-center"
          >
            {category.name}
            {category.subcategories && category.subcategories.length > 0 && (
              <span className="ml-1 flex w-5 shrink-0 items-center justify-center">
                <ChevronDownIcon />
              </span>
            )}
          </Link>
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
