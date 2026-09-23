import { HydrateClient, prefetch, trpc } from "@/app/trpc/server";

import { ProductView } from "@/modules/products/ui/views/product-view";

interface Props {
  params: Promise<{ productId: string; slug: string }>;
}

export default async function Page({ params }: Props) {
  const { slug, productId } = await params;

  prefetch(
    trpc.tenants.getOne.queryOptions({
      slug,
    })
  );

  return (
    <HydrateClient>
      <ProductView productId={productId} tenantSlug={slug} />
    </HydrateClient>
  );
}
