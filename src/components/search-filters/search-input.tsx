"use client";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ListFilterIcon, SearchIcon } from "lucide-react";
import { useState } from "react";

import { CategoriesSidebar } from "./categories-sidebar";

export function SearchInput({ disabled }: { disabled?: boolean }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="flex w-full items-center gap-2">
      <CategoriesSidebar open={isSidebarOpen} onOpenChange={setIsSidebarOpen} />
      <div className="relative w-full">
        <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-500" />
        <Input className="pl-8" placeholder="Search products" disabled={disabled} />
      </div>
      <Button
        variant={"elevated"}
        className="flex size-12 shrink-0 lg:hidden"
        onClick={() => setIsSidebarOpen(true)}
      >
        <ListFilterIcon />
      </Button>
      {/* TODO: add library button  */}
    </div>
  );
}
