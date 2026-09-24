"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";
import { generateTenantURL } from "@/lib/utils";

import { buttonVariants } from "@/components/ui/button";

interface Props {
  slug: string;
}

export function CheckoutNavbar({ slug }: Props) {
  return (
    <nav className="h-20 border-b bg-white font-medium">
      <div className="mx-auto flex h-full max-w-(--breakpoint-xl) items-center justify-between px-4 lg:px-12">
        <p className="text-xl">Checkout</p>
        <Link
          href={generateTenantURL(slug)}
          className={cn(buttonVariants({ variant: "elevated" }))}
        >
          Continue shopping
        </Link>
      </div>
    </nav>
  );
}
