import { ReactNode } from "react";

import { CheckoutNavbar } from "@/modules/checkout/ui/components/checkout-navbar";
import { TenantsFooter } from "@/modules/tenants/ui/components/tenants-footer";

interface Props {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function Layout({ children, params }: Props) {
  const { slug } = await params;

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f4f0]">
      <CheckoutNavbar slug={slug} />
      <main className="flex-1">
        <div className="mx-auto max-w-(--breakpoint-xl)">{children}</div>
      </main>
      <TenantsFooter />
    </div>
  );
}
