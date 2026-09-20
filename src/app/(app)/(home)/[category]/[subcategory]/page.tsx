import { SearchParams } from "nuqs/server";

import { HydrateClient, prefetch, trpc } from "@/app/trpc/server";

import { ProductList } from "@/modules/products/ui/components/product-list";

interface Props {
  params: Promise<{ subcategory: string }>;
  searchParams: Promise<SearchParams>;
}
export default async function Page({ params, searchParams }: Props) {
  const { subcategory } = await params;
  prefetch(trpc.products.getMany.queryOptions({ category: subcategory }));

  return (
    <HydrateClient>
      <ProductList category={subcategory} />
    </HydrateClient>
  );
}
