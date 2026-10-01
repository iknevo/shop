"use client";

import { ReviewsGetOneOutput } from "../../types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { useTRPC } from "@/app/trpc/client";

import { StarPicker } from "@/components/star-picker";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";

interface Props {
  productId: string;
  initialData?: ReviewsGetOneOutput;
}

const formSchema = z.object({
  rating: z.number().min(1, { error: "Rating is required" }).max(5),
  description: z.string().min(1, { error: "Description is required" }),
});

export function ReviewForm({ productId, initialData }: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [isPreview, setIsPreview] = useState(!!initialData);

  const createReview = useMutation(
    trpc.reviews.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.reviews.getOne.queryOptions({
            productId,
          })
        );
        setIsPreview(true);
      },
      onError: (error) => {
        toast.add({ type: "error", description: error.message });
      },
    })
  );

  const updateReview = useMutation(
    trpc.reviews.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.reviews.getOne.queryOptions({
            productId,
          })
        );
        setIsPreview(true);
      },
      onError: (error) => {
        toast.add({ type: "error", description: error.message });
      },
    })
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: initialData?.rating ?? 0,
      description: initialData?.description ?? "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (initialData) {
      updateReview.mutate({
        reviewId: initialData.id,
        description: values.description,
        rating: values.rating,
      });
    } else {
      createReview.mutate({
        productId,
        rating: values.rating,
        description: values.description,
      });
    }
  };

  return (
    <form id="review-form" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <p className="font-medium">{isPreview ? "Your rating:" : "Liked it? Give it a rating"}</p>
      <Controller
        name="rating"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <StarPicker value={field.value} onChange={field.onChange} disabled={isPreview} />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="description"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <Textarea
              {...field}
              placeholder="Want to leave a written review?"
              disabled={isPreview}
              aria-invalid={fieldState.invalid}
              className="min-block-3lh field-sizing-content resize-none"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      {!isPreview && (
        <Button
          variant="elevated"
          disabled={createReview.isPending || updateReview.isPending}
          type="submit"
          size="lg"
          className="hover:text-primary w-fit bg-black text-white hover:bg-pink-400"
        >
          {initialData ? "Update review" : "Post review"}
        </Button>
      )}
      {isPreview && (
        <Button
          variant="elevated"
          type="button"
          size="lg"
          onClick={() => setIsPreview(false)}
          className="w-fit"
        >
          Edit
        </Button>
      )}
    </form>
  );
}

export function ReviewFormLoading() {
  return (
    <div className="flex flex-col gap-4">
      <p className="font-medium">Liked it? Give it a rating</p>
      <StarPicker disabled />
      <Textarea
        placeholder="Want to leave a written review?"
        disabled
        className="min-block-3lh field-sizing-content resize-none"
      />
      <Button
        variant="elevated"
        disabled
        type="button"
        size="lg"
        className="hover:text-primary w-fit bg-black text-white hover:bg-pink-400"
      >
        Post review
      </Button>
    </div>
  );
}
