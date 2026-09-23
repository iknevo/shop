"use client";

// TODO: add real ratings
import { useSuspenseQuery } from "@tanstack/react-query";
import { LinkIcon, StarIcon } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { Fragment, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { formatPrice, generateTenantURL } from "@/lib/utils";

import { useTRPC } from "@/app/trpc/client";

import { StarRating } from "@/components/star-rating";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import { IMAGE_PLACEHOLDER } from "@/constants";

const CartButton = dynamic(
  () => import("../components/cart-button").then((mod) => mod.CartButton),
  {
    ssr: false,
    loading: () => (
      <Button disabled className="flex-1 bg-pink-400">
        Add to cart
      </Button>
    ),
  }
);

interface Props {
  productId: string;
  tenantSlug: string;
}

export function ProductView({ productId, tenantSlug }: Props) {
  return (
    <Suspense fallback={<ProductViewLoading />}>
      <ErrorBoundary fallback={<p>error</p>}>
        <ProductViewSuspense productId={productId} tenantSlug={tenantSlug} />
      </ErrorBoundary>
    </Suspense>
  );
}

function ProductViewSuspense({ productId, tenantSlug }: Props) {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.products.getOne.queryOptions({
      id: productId,
    })
  );

  return (
    <div className="px-4 py-10 lg:px-12">
      <div className="overflow-hidden rounded-sm border bg-white">
        <div className="relative aspect-[3.9] border-b">
          <Image
            src={data.image?.url ?? IMAGE_PLACEHOLDER}
            alt={data.image?.alt ?? data.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-6">
          <div className="col-span-4">
            <div className="p-6">
              <h1 className="text-4xl font-medium">{data.name}</h1>
            </div>
            <div className="flex border-y">
              <div className="flex items-center justify-center border-r px-6 py-4">
                <div className="w-fit border bg-pink-400 px-2 py-1">
                  <p className="text-base font-medium">{formatPrice(data.price)}</p>
                </div>
              </div>
              <div className="flex items-center justify-center px-6 py-4 lg:border-r">
                <Link href={generateTenantURL(tenantSlug)} className="flex items-center gap-2">
                  {data.tenant.image?.url && (
                    <Image
                      src={data.tenant.image.url}
                      alt={data.tenant.image.alt ?? data.tenant.name}
                      width={20}
                      height={20}
                      className="size-5 shrink-0 rounded-full border"
                    />
                  )}
                  <p className="text-base font-medium underline">{data.tenant.name}</p>
                </Link>
              </div>
              <div className="hidden items-center justify-center px-6 py-4 lg:flex">
                <div className="flex items-center gap-1">
                  <StarRating rating={4} iconClassName="size-4" />
                </div>
              </div>
            </div>
            <div className="block items-center justify-center border-b px-6 py-4 lg:hidden">
              <div className="flex items-center gap-1">
                <StarRating rating={4} iconClassName="size-4" />
                <p className="text-base font-medium">{5} ratings</p>
              </div>
            </div>
            <div className="p-6">
              {data.description ? (
                <p>{data.description}</p>
              ) : (
                <p className="text-muted-foreground font-medium italic">No description provided</p>
              )}
            </div>
          </div>
          <div className="col-span-2">
            <div className="h-full border-t lg:border-t-0 lg:border-l">
              <div className="flex flex-col gap-4 border-b p-6">
                <div className="flex flex-row items-center gap-2">
                  <CartButton productId={productId} tenantSlug={tenantSlug} />
                  <Button
                    variant="elevated"
                    className="size-12"
                    onClick={() => {}}
                    disabled={false}
                  >
                    <LinkIcon />
                  </Button>
                </div>
                <p className="text-center font-medium">
                  {data.refundPlicy === "no-refunds"
                    ? "No refund available"
                    : `${data.refundPlicy} money back gurantee`}
                </p>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-medium">Ratings</h3>
                  <div className="flex items-center gap-x-1 font-medium">
                    <StarIcon className="size-4 fill-black" />
                    <p>({5})</p>
                    <p className="text-base">{5} ratings</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-[auto_1fr_auto] gap-3">
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <Fragment key={stars}>
                      <div className="font-medium">
                        {stars} {stars === 1 ? "star" : "stars"}
                      </div>
                      <Progress value={30} className="overflow-hidden rounded-full" />
                      <div className="font-medium">{30}%</div>
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductViewLoading() {
  return <div>Loading</div>;
}
