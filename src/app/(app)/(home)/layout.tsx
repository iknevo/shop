import configPromise from "@payload-config";
import { getPayload } from "payload";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { SearchFilters } from "@/components/search-filters";

import { Category } from "@/payload-types";

export default async function Layout({ children }: LayoutProps<"/">) {
  const payload = await getPayload({ config: configPromise });
  const data = await payload.find({
    collection: "categories",
    depth: 1,
    pagination: false,
    where: {
      parent: {
        exists: false,
      },
    },
    sort: "name",
  });

  const formattedDate = data.docs.map((doc) => ({
    ...doc,
    subcategories: (doc.subcategories?.docs ?? []).map((item) => ({
      // the option depth: 1 auto populates the document instead of just getting the id, depth 1 is the default but because there's an option for 0 which would only give us the doc id, payload infers it as string | Category. but we are sure it will be populated so we can safely cast it's type
      ...(item as Category),
      subcategories: undefined,
    })),
  }));

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <SearchFilters data={formattedDate} />
      <div className="flex-1 bg-[#f4f4f4]">{children}</div>
      <Footer />
    </div>
  );
}
