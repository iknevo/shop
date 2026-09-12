import Link from "next/link";

import { Category } from "@/payload-types";

interface Props {
  category: Category;
  isOpen: boolean;
  position: { left: number; top: number };
}

export function SubcategoryMenu({ category, isOpen, position }: Props) {
  if (!isOpen || !category.subcategories || category.subcategories.length === 0) {
    return null;
  }

  const backgroundColor = category.color ?? "#f5f5f5";

  return (
    <div
      className="fixed z-100"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      <div className="h-3 w-60" />
      <div
        className="w-60 -translate-x-0.5 -translate-y-0.5 overflow-hidden rounded-md border text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        style={{
          backgroundColor: backgroundColor,
        }}
      >
        <div>
          {category.subcategories.map((sub: Category) => (
            <Link
              key={sub.slug}
              href={"/"}
              className="flex w-full items-center justify-between p-4 text-left font-medium underline hover:bg-black hover:text-white"
            >
              {sub.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
