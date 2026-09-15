import { createTRPCRouter, publicProcedure } from "@/app/trpc/init";

import { Category } from "@/payload-types";

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

    const formattedDate = data.docs.map((doc) => ({
      ...doc,
      subcategories: (doc.subcategories?.docs ?? []).map((item) => ({
        // the option depth: 1 auto populates the document instead of just getting the id, depth 1 is the default but because there's an option for 0 which would only give us the doc id, payload infers it as string | Category. but we are sure it will be populated so we can safely cast it's type
        ...(item as Category),
        subcategories: undefined,
      })),
    }));

    return formattedDate;
  }),
});
