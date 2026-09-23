import { ReactNode } from "react";

import { HydrateClient, prefetch, trpc } from "@/app/trpc/server";

import { TenantsFooter } from "@/modules/tenants/ui/components/tenants-footer";
import { TenantsNavbar } from "@/modules/tenants/ui/components/tenants-navbar";

interface Props {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}
export default async function Layout({ children, params }: Props) {
  const { slug } = await params;

  prefetch(
    trpc.tenants.getOne.queryOptions({
      slug,
    })
  );

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f4f0]">
      <HydrateClient>
        <TenantsNavbar slug={slug} />
      </HydrateClient>
      <main className="flex-1">
        <div className="mx-auto max-w-(--breakpoint-xl)">{children}</div>
      </main>
      <TenantsFooter />
    </div>
  );
}
