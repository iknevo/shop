import { HydrateClient, prefetch, trpc } from "@/app/trpc/server";

import { ProductFilters } from "@/modules/products/ui/components/product-filters";
import { ProductList } from "@/modules/products/ui/components/product-list";

interface Props {
  params: Promise<{ category: string }>;
}
export default async function Page({ params }: Props) {
  const { category } = await params;
  prefetch(trpc.products.getMany.queryOptions({ category }));

  return (
    <HydrateClient>
      <div className="flex flex-col gap-4 px-4 py-8 lg:px-12">
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
