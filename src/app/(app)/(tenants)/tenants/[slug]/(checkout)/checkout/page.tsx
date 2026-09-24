import { CheckoutView } from "@/modules/checkout/ui/views/checkout-view";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: Props) {
  const { slug } = await params;

  return <CheckoutView tenantSlug={slug} />;
}
