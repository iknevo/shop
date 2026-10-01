"use client";

import { useMutation } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";
import { useEffect, useRef } from "react";

import { useTRPC } from "@/app/trpc/client";

import { toast } from "@/components/ui/toast";

export default function Page() {
  const trpc = useTRPC();

  const verify = useMutation(
    trpc.checkout.verify.mutationOptions({
      onSuccess: (data) => {
        window.location.assign(data.url);
      },
      onError: () => {
        toast.add({ type: "error", description: "Something went wrong verifying stripe account" });
        window.location.assign("/");
      },
    })
  );

  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;

    hasRun.current = true;
    verify.mutate();
  }, [verify]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoaderIcon className="text-muted-foreground animate-spin" />
    </div>
  );
}
