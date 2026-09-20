import { HydrateClient, prefetch, trpc } from "@/app/trpc/server";

import { ProductList } from "@/modules/products/ui/components/product-list";

interface Props {
  params: Promise<{ subcategory: string }>;
}
export default async function Page({ params }: Props) {
  const { subcategory } = await params;
  prefetch(trpc.products.getMany.queryOptions({ category: subcategory }));

  return (
    <HydrateClient>
      <ProductList category={subcategory} />
    </HydrateClient>
  );
}
