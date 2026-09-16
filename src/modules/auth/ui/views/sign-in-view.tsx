"use client";

import { loginSchema } from "../../validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";

import { useTRPC } from "@/app/trpc/client";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});

export function SignInView() {
  const router = useRouter();
  const trpc = useTRPC();
  const login = useMutation(
    trpc.auth.login.mutationOptions({
      onSuccess: () => {
        router.push("/");
      },
      onError: (err) => {
        toast.add({ type: "error", description: err.message });
      },
    })
  );

  const form = useForm<z.infer<typeof loginSchema>>({
    mode: "all",
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: z.infer<typeof loginSchema>) {
    login.mutate(data);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5">
      <div className="h-screen w-full overflow-y-auto bg-[#f4f4f0] lg:col-span-3">
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8 p-4 lg:p-16">
          <div className="mb-8 flex items-center justify-between">
            <Link href="/">
              <span className={cn("text-2xl font-semibold", poppins.className)}>Shoply</span>
            </Link>
            <Button
              nativeButton={false}
              className="border-none text-base underline"
              variant="ghost"
              size="sm"
              render={<Link href="/sign-up">Sign up</Link>}
            />
          </div>
          <h1 className="text-4xl font-medium">Welcome back to Shoply</h1>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-base" htmlFor="email-input">
                  Email
                </FieldLabel>
                <Input
                  {...field}
                  id="email-input"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter your email"
                  autoComplete="email"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-base" htmlFor="password-input">
                  Password
                </FieldLabel>
                <Input
                  {...field}
                  id="password-input"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter your password"
                  type="password"
                  autoComplete="current-password"
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Button
            type="submit"
            size="lg"
            variant="elevated"
            className="hover:text-primary bg-black text-white hover:bg-pink-400"
            disabled={login.isPending}
          >
            Login
          </Button>
        </form>
      </div>
      <div
        className="hidden h-screen w-full lg:col-span-2 lg:block"
        style={{
          backgroundImage: "url('/auth-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </div>
  );
}
