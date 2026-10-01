import { inferParserType, parseAsStringLiteral, useQueryStates } from "nuqs";
import { parseAsArrayOf, parseAsString } from "nuqs";

const sortValues = ["curated", "trending", "hot_and_new"] as const;

const params = {
  search: parseAsString.withOptions({ clearOnDefault: true }).withDefault(""),
  minPrice: parseAsString.withOptions({ clearOnDefault: true }).withDefault(""),
  maxPrice: parseAsString.withOptions({ clearOnDefault: true }).withDefault(""),
  tags: parseAsArrayOf(parseAsString).withOptions({ clearOnDefault: true }).withDefault([]),
  sort: parseAsStringLiteral(sortValues).withDefault("curated"),
};

export type ProductFilters = inferParserType<typeof params>;

export function useProductFilters() {
  return useQueryStates(params, {
    shallow: true,
    limitUrlUpdates: {
      method: "debounce",
      timeMs: 500,
    },
  });
}
