import Link from "next/link";
import { ReactNode } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface NavbarItem {
  href: string;
  children: ReactNode;
}
interface NavbarMobileProps {
  items: NavbarItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export function NavbarMobile({ items, onOpenChange, open }: NavbarMobileProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="p-0">
        <SheetHeader className="border-b p-4">
          <div className="flex items-center">
            <SheetTitle>Menu</SheetTitle>
          </div>
        </SheetHeader>
        <ScrollArea className="flex h-full flex-col overflow-y-auto pb-2">
          {items.map((link) => (
            <Link
              href={link.href}
              onClick={() => onOpenChange(false)}
              key={link.href}
              className="flex w-full items-center p-4 text-left text-base font-medium hover:bg-black hover:text-white"
            >
              {link.children}
            </Link>
          ))}
          <div className="border-t">
            <Link
              href="/sign-in"
              className="flex w-full items-center p-4 text-left text-base font-medium hover:bg-black hover:text-white"
            >
              Log in
            </Link>

            <Link
              href="/sign-up"
              className="flex w-full items-center p-4 text-left text-base font-medium hover:bg-black hover:text-white"
            >
              Start selling
            </Link>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
