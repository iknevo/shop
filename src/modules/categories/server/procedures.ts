import { createTRPCRouter, publicProcedure } from "@/app/trpc/init";

import { Category } from "@/payload-types";

type CategoryWithSubcategories = Omit<Category, "subcategories"> & {
  subcategories: Category[];
};

export const categoriesRouter = createTRPCRouter({
  getMany: publicProcedure.query(async ({ ctx }) => {
    const data = await ctx.payload.find({
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

    const formattedData: CategoryWithSubcategories[] = data.docs.map((doc) => ({
      ...doc,
      subcategories: (doc.subcategories?.docs ?? []).map((item) => item as Category),
    }));

    return formattedData;
  }),
});
