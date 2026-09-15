import { HydrateClient, prefetch, trpc } from "@/app/trpc/server";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { SearchFilters } from "@/components/search-filters";

export default async function Layout({ children }: LayoutProps<"/">) {
  prefetch(trpc.categories.getMany.queryOptions());

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <HydrateClient>
        <SearchFilters />
      </HydrateClient>
      <div className="flex-1 bg-[#f4f4f4]">{children}</div>
      <Footer />
    </div>
  );
}
