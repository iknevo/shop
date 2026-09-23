"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useTRPC } from "@/app/trpc/client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

import { CategoriesGetManyOutput, CategoryType } from "@/modules/categories/types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CategoriesSidebar({ onOpenChange, open }: Props) {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.categories.getMany.queryOptions());
  const router = useRouter();
  const [parentCategories, setParentCategories] = useState<CategoriesGetManyOutput | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);

  const currentCategories = parentCategories ?? data ?? [];

  const handleOpenChange = (value: boolean) => {
    setSelectedCategory(null);
    setParentCategories(null);
    onOpenChange(value);
  };

  const handleCategoryClick = (category: CategoryType) => {
    if (category.subcategories && category.subcategories.length > 0) {
      setParentCategories(category.subcategories as CategoriesGetManyOutput);
      setSelectedCategory(category);
    } else {
      if (parentCategories && selectedCategory) {
        router.push(`/${selectedCategory.slug}/${category.slug}`);
      } else {
        if (category.slug === "all") {
          router.push("/");
        } else {
          router.push(`/${category.slug}`);
        }
      }

      handleOpenChange(false);
    }
  };

  const handleBackClick = () => {
    if (parentCategories) {
      setParentCategories(null);
      setSelectedCategory(null);
    }
  };

  const backgroundColor = selectedCategory?.color ?? "white";

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="left"
        className="p-0"
        style={{
          backgroundColor: backgroundColor,
        }}
      >
        <SheetHeader className="border-b p-4">
          <SheetTitle>Categories</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex h-full flex-col overflow-y-auto pe-2 pb-2">
          {parentCategories && (
            <button
              onClick={handleBackClick}
              className="flex w-full items-center p-4 text-left text-base font-medium hover:bg-black hover:text-white"
            >
              <ChevronLeftIcon className="mr-2 size-4" />
              Back
            </button>
          )}

          {currentCategories.map((category) => (
            <button
              key={category.slug}
              onClick={() => handleCategoryClick(category)}
              className="flex w-full items-center justify-between p-4 text-left text-base font-medium hover:bg-black hover:text-white"
            >
              {category.name}
              {category.subcategories && category.subcategories?.length > 0 && (
                <ChevronRightIcon className="size-4" />
              )}
            </button>
          ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
