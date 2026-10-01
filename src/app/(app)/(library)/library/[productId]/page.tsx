import { prefetch, trpc } from "@/app/trpc/server";

import { LibraryProductView } from "@/modules/library/ui/views/library-product-view";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ productId: string }>;
}

export default async function Page({ params }: Props) {
  const { productId } = await params;

  prefetch(trpc.library.getOne.queryOptions({ productId }));
  prefetch(trpc.reviews.getOne.queryOptions({ productId }));

  return <LibraryProductView productId={productId} />;
}
