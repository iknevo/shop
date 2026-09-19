import { HydrateClient, prefetch, trpc } from "@/app/trpc/server";

import { ProductList } from "@/modules/products/ui/components/product-list";

interface Props {
  params: Promise<{ category: string }>;
}
export default async function Page({ params }: Props) {
  const { category } = await params;
  prefetch(trpc.products.getMany.queryOptions({ category }));

  return (
    <HydrateClient>
      <ProductList category={category} />
    </HydrateClient>
  );
}
