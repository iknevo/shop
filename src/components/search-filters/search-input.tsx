import { Input } from "../ui/input";
import { SearchIcon } from "lucide-react";

export function SearchInput({ disabled }: { disabled?: boolean }) {
  return (
    <div className="flex w-full items-center gap-2">
      <div className="relative w-full">
        <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-500" />
        <Input className="pl-8" placeholder="Search products" disabled={disabled} />
      </div>
      {/* TODO: add categories view all button  */}
      {/* TODO: add library button  */}
    </div>
  );
}
