"use client";

import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/app/trpc/client";

import { PrettyStringify } from "@/components/dev/pretty-stringify";

export default function Page() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.auth.session.queryOptions());
  return <PrettyStringify data={data?.user} />;
}
