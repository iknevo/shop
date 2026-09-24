import Image from "next/image";
import Link from "next/link";

import { cn, formatPrice } from "@/lib/utils";

import { IMAGE_PLACEHOLDER } from "@/constants";

interface Props {
  isLast?: boolean;
  imageUrl?: string | null;
  name: string;
  productUrl: string;
  tenantUrl: string;
  tenantName: string;
  price: number;
  onRemove: () => void;
}

export function CheckoutItem({
  name,
  price,
  onRemove,
  productUrl,
  tenantName,
  tenantUrl,
  imageUrl,
  isLast,
}: Props) {
  return (
    <div
      className={cn("grid grid-cols-[8.5rem_1fr_auto] gap-4 border-b pr-4", isLast && "border-b-0")}
    >
      <div className="overflow-hidden border-r">
        <div className="relative aspect-square h-full">
          <Image src={imageUrl ?? IMAGE_PLACEHOLDER} alt={name} fill className="object-cover" />
        </div>
      </div>

      <div className="flex flex-col justify-between py-4">
        <div>
          <Link href={productUrl}>
            <h4 className="font-bold underline">{name}</h4>
          </Link>

          <Link href={tenantUrl}>
            <p className="font-medium underline">{tenantName}</p>
          </Link>
        </div>
      </div>

      <div className="flex flex-col justify-between py-4">
        <p className="font-medium">{formatPrice(price)}</p>
        <button className="cursor-pointer font-medium underline" onClick={onRemove} type="button">
          remove
        </button>
      </div>
    </div>
  );
}
