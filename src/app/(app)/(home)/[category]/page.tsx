import { SearchParams } from "nuqs/server";

import { HydrateClient, prefetch, trpc } from "@/app/trpc/server";

import { loadProductsFilters } from "@/hooks/search-params";
import { ProductFilters } from "@/modules/products/ui/components/product-filters";
import { ProductList } from "@/modules/products/ui/components/product-list";
import { ProductSort } from "@/modules/products/ui/components/product-sort";

interface Props {
  params: Promise<{ category: string }>;

  searchParams: Promise<SearchParams>;
}
export default async function Page({ params, searchParams }: Props) {
  const { category } = await params;
  const filters = await loadProductsFilters(searchParams);
  prefetch(trpc.products.getMany.queryOptions({ category, ...filters }));

  return (
    <HydrateClient>
      <div className="flex flex-col gap-4 px-4 py-8 lg:px-12">
        <div className="flex flex-col justify-between gap-y-2 lg:flex-row lg:items-center lg:gap-y-0">
          <p className="text-2xl font-medium">Curated for you</p>
          <ProductSort />
        </div>
        <div className="grid grid-cols-1 gap-x-12 gap-y-6 lg:grid-cols-6 xl:grid-cols-8">
          <div className="lg:col-span-2 xl:col-span-2">
            <ProductFilters />
          </div>
          <div className="lg:col-span-4 xl:col-span-6">
            <ProductList category={category} />
          </div>
        </div>
      </div>
    </HydrateClient>
  );
}
