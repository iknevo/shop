import { Poppins } from "next/font/google";
import Link from "next/link";

import { cn } from "@/lib/utils";

const poppings = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});

export function TenantsFooter() {
  return (
    <footer className="border-t bg-white font-medium">
      <div className="mx-auto flex h-full max-w-(--breakpoint-xl) items-center gap-2 px-4 py-6 lg:px-12">
        <p>Powered by</p>
        <Link href="/">
          <span className={cn("text-2xl font-semibold", poppings.className)}>Shoply</span>
        </Link>
      </div>
    </footer>
  );
}
