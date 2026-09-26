import { StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { IMAGE_PLACEHOLDER } from "@/constants";

interface Props {
  id: string;
  name: string;
  imageUrl?: string | null;
  tenantSlug: string;
  tenantImageUrl?: string | null;
  reviewRating: number;
  reviewCount: number;
}

export function LibraryProductCard({
  tenantSlug,
  id,
  name,
  reviewCount,
  reviewRating,
  tenantImageUrl,
  imageUrl,
}: Props) {
  return (
    <Link href={`/library/${id}`}>
      <div className="flex h-full flex-col overflow-hidden rounded-md border bg-white transition-shadow hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
        <div className="relative aspect-square">
          <Image alt={name} fill className="object-cover" src={imageUrl ?? IMAGE_PLACEHOLDER} />
        </div>
        <div className="flex flex-1 flex-col gap-3 border-y p-4">
          <h2 className="line-clamp-4 text-lg font-medium">{name}</h2>
          <div className="flex items-center gap-2">
            {tenantImageUrl && (
              <Image
                src={tenantImageUrl}
                alt={tenantSlug}
                width={16}
                height={16}
                className="size-4 shrink-0 rounded-full border"
              />
            )}
            <p className="px-1 text-sm font-medium underline hover:bg-pink-600 hover:text-white">
              {tenantSlug}
            </p>
          </div>
          {reviewCount > 0 && (
            <div className="flex items-center gap-1">
              <StarIcon className="size-3.5 fill-black" />
              <p className="text-sm font-medium">
                {reviewRating} ({reviewCount})
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export function LibraryProductCardLoading() {
  return <div className="aspect-3/4 w-full animate-pulse rounded-lg bg-neutral-200" />;
}
