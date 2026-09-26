"use client";

import { LibraryProductList } from "../components/library-product-list";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export function LibraryView() {
  return (
    <Suspense fallback={<LibraryViewLoading />}>
      <ErrorBoundary fallback={<p>error...</p>}>
        <LibraryViewSuspense />
      </ErrorBoundary>
    </Suspense>
  );
}

export function LibraryViewSuspense() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="w-full border-b bg-[#f4f4f0] p-4">
        <Link prefetch href="/" className="flex items-center gap-2">
          <ArrowLeftIcon className="size-4" />
          <span className="text-base font-medium">Continue shopping</span>
        </Link>
      </nav>
      <header className="border-b bg-white py-8">
        <div className="mx-auto flex max-w-(--breakpoint-xl) flex-col gap-y-4 px-4 lg:px-12">
          <h1 className="text-[40px] font-medium">Library</h1>
          <p className="font-medium">Your purchases and reviews</p>
        </div>
      </header>
      <section className="mx-auto max-w-(--breakpoint-xl) px-4 py-10 lg:px-12">
        <LibraryProductList />
      </section>
    </div>
  );
}

function LibraryViewLoading() {
  return <p>Loading...</p>;
}
