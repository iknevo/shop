"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { ShoppingCartIcon } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { generateTenantURL } from "@/lib/utils";

import { useTRPC } from "@/app/trpc/client";

import { Button } from "@/components/ui/button";

const CheckoutButton = dynamic(
  () =>
    import("@/modules/checkout/ui/components/checkout-button").then((mod) => mod.CheckoutButton),
  {
    ssr: false,
    loading: () => (
      <Button disabled className="bg-white">
        <ShoppingCartIcon className="text-black" />
      </Button>
    ),
  }
);

interface Props {
  slug: string;
}

export function TenantsNavbar({ slug }: Props) {
  return (
    <Suspense fallback={<TenantsNavbarLoading />}>
      <ErrorBoundary fallback={<p>error</p>}>
        <TenantsNavbarSuspense slug={slug} />
      </ErrorBoundary>
    </Suspense>
  );
}

function TenantsNavbarSuspense({ slug }: Props) {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.tenants.getOne.queryOptions({
      slug,
    })
  );

  return (
    <nav className="h-20 border-b bg-white font-medium">
      <div className="mx-auto flex h-full max-w-(--breakpoint-xl) items-center justify-between px-4 lg:px-12">
        <Link href={generateTenantURL(slug)} className="flex items-center gap-2">
          {data.image?.url && (
            <Image
              src={data.image.url}
              width={32}
              height={32}
              className="size-8 shrink-0 rounded-full border"
              alt={slug}
            />
          )}
          <p className="text-xl">{data.name}</p>
        </Link>
        <CheckoutButton tenantSlug={slug} />
      </div>
    </nav>
  );
}

function TenantsNavbarLoading() {
  return (
    <nav className="h-20 border-b bg-white font-medium">
      <div className="mx-auto flex h-full max-w-(--breakpoint-xl) items-center justify-between px-4 lg:px-12">
        <p className="text-xl">
          <span className="sr-only">loading</span>
        </p>

        <Button disabled className="bg-white">
          <ShoppingCartIcon className="text-black" />
        </Button>
      </div>
    </nav>
  );
}
