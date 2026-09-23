import { SearchParams } from "nuqs/server";

import { HydrateClient, prefetch, trpc } from "@/app/trpc/server";

import { DEFAULT_LIMIT } from "@/constants";
import { loadProductsFilters } from "@/hooks/search-params";
import { ProductListView } from "@/modules/products/ui/views/product-list-view";

interface Props {
  searchParams: Promise<SearchParams>;
}

export default async function Page({ searchParams }: Props) {
  const filters = await loadProductsFilters(searchParams);
  prefetch(
    trpc.products.getMany.infiniteQueryOptions(
      { ...filters, limit: DEFAULT_LIMIT },
      {
        getNextPageParam: (lastPage) => {
          return lastPage.docs.length > 0 ? lastPage.nextPage : undefined;
        },
      }
    )
  );

  return (
    <HydrateClient>
      <ProductListView />
    </HydrateClient>
  );
}
