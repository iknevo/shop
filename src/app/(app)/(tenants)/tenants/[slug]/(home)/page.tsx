import { type SearchParams } from "nuqs/server";

import { HydrateClient, prefetch, trpc } from "@/app/trpc/server";

import { DEFAULT_LIMIT } from "@/constants";
import { loadProductsFilters } from "@/hooks/search-params";
import { ProductListView } from "@/modules/products/ui/views/product-list-view";

interface Props {
  searchParams: Promise<SearchParams>;
  params: Promise<{ slug: string }>;
}

export default async function Page({ searchParams, params }: Props) {
  const { slug } = await params;
  const filters = await loadProductsFilters(searchParams);

  prefetch(
    trpc.products.getMany.infiniteQueryOptions(
      { tenantSlug: slug, ...filters, limit: DEFAULT_LIMIT },
      {
        getNextPageParam: (lastPage) => {
          return lastPage.docs.length > 0 ? lastPage.nextPage : undefined;
        },
      }
    )
  );

  return (
    <HydrateClient>
      <ProductListView tenantSlug={slug} narrowView />
    </HydrateClient>
  );
}
