import { SearchParams } from "nuqs/server";

import { HydrateClient, prefetch, trpc } from "@/app/trpc/server";

import { loadProductsFilters } from "@/hooks/search-params";
import { ProductListView } from "@/modules/products/ui/views/product-list-view";

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
      <ProductListView category={category} />
    </HydrateClient>
  );
}
