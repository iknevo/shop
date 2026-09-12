import { CategoryDropdown } from "./category-dropdown";
import { Category } from "@/payload-types";

interface Props {
  data: any;
}

export function Categories({ data }: Props) {
  return (
    <div className="relative w-full">
      <div className="flex flex-nowrap items-center gap-2">
        {data.map((category: Category) => (
          <div key={category.id}>
            <CategoryDropdown category={category} isActive={false} isNavigationHovered={false} />
          </div>
        ))}
      </div>
    </div>
  );
}
