import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface Props {
  activeCategory?: string | null;
  activeCategoryName?: string | null;
  activeSubCategoryName?: string | null;
}

export function BreadcrumbNavigation({
  activeCategory,
  activeCategoryName,
  activeSubCategoryName,
}: Props) {
  if (!activeCategoryName || activeCategory === "all") return null;
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {activeSubCategoryName ? (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink
                className="text-primary text-xl font-medium underline"
                render={<Link href={`/${activeCategory}`}>{activeCategoryName}</Link>}
              />
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-primary text-lg font-medium">
              /
            </BreadcrumbSeparator>

            <BreadcrumbItem>
              <BreadcrumbPage className="text-xl font-medium">
                {activeSubCategoryName}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        ) : (
          <BreadcrumbItem>
            <BreadcrumbPage className="text-xl font-medium">{activeCategoryName}</BreadcrumbPage>
          </BreadcrumbItem>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
