"use client";

import { MenuIcon } from "lucide-react";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";

import { cn } from "@/lib/utils";

import { NavbarMobile } from "./navbar-mobile";
import { Button } from "./ui/button";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});

interface NavbarItemProps {
  href: string;
  children: ReactNode;
}

function NavbarItem({ href, children }: NavbarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Button
      nativeButton={false}
      variant={"outline"}
      className={cn(
        "hover:border-primary rounded-full border-transparent bg-transparent px-3.5 text-lg hover:bg-transparent",
        isActive && "bg-black text-white hover:border-transparent hover:bg-black hover:text-white"
      )}
      render={<Link href={href}>{children}</Link>}
    />
  );
}

const navbarItems = [
  { href: "/", children: "Home" },
  { href: "/about", children: "About" },
  { href: "/features", children: "Features" },
  { href: "/pricing", children: "Pricing" },
  { href: "/contact", children: "Contact" },
];

export function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <>
      <NavbarMobile open={isSidebarOpen} onOpenChange={setIsSidebarOpen} items={navbarItems} />
      <nav className="flex h-20 justify-between border-b bg-white font-medium">
        <Link href={"/"} className="flex items-center pl-6">
          <span className={cn("text-5xl font-semibold", poppins.className)}>Shoply</span>
        </Link>

        <div className="hidden items-center gap-3 lg:flex">
          {navbarItems.map((item) => (
            <NavbarItem href={item.href} key={item.href}>
              {item.children}
            </NavbarItem>
          ))}
        </div>

        <div className="hidden lg:flex">
          <Button
            nativeButton={false}
            variant={"secondary"}
            className="h-full rounded-none border-y-0 border-r-0 border-l border-black bg-white px-12 text-lg transition-colors hover:bg-pink-400 active:not-aria-[haspopup]:translate-y-0"
            render={<Link href="/sign-in">Log in</Link>}
          />
          <Button
            nativeButton={false}
            className="h-full rounded-none border-y-0 border-r-0 border-l border-black bg-black px-12 text-lg text-white transition-colors hover:bg-pink-400 hover:text-black active:not-aria-[haspopup]:translate-y-0"
            render={<Link href="/sign-up">Start selling</Link>}
          />
        </div>

        <div className="flex items-center justify-center lg:hidden">
          <Button
            variant={"ghost"}
            className="size-12 h-full border-transparent bg-white"
            onClick={() => setIsSidebarOpen(true)}
          >
            <MenuIcon />
          </Button>
        </div>
      </nav>
    </>
  );
}
