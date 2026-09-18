"use client";

import { useQuery } from "@tanstack/react-query";
import { BookmarkCheckIcon, ListFilterIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { useTRPC } from "@/app/trpc/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { CategoriesSidebar } from "./categories-sidebar";

export function SearchInput({ disabled }: { disabled?: boolean }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const trpc = useTRPC();
  const session = useQuery(trpc.auth.session.queryOptions());

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
      {session.data?.user && (
        <Button
          variant="elevated"
          nativeButton={false}
          render={
            <Link href="/library">
              <BookmarkCheckIcon className="mr-2" />
              Library
            </Link>
          }
        />
      )}
    </div>
  );
}
