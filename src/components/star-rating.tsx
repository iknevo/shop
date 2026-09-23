import { StarIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface Props {
  rating: number;
  className?: string;
  iconClassName?: string;
  text?: string;
}

const MIN_RATING = 0;

const MAX_RATING = 5;

export function StarRating({ className, rating, iconClassName, text }: Props) {
  const safeRating = Math.max(MIN_RATING, Math.min(rating, MAX_RATING));

  return (
    <div className={cn("flex items-center gap-x-1", className)}>
      {Array.from({ length: MAX_RATING }).map((_, i) => (
        <StarIcon key={i} className={cn("size-4", i < safeRating && "fill-black", iconClassName)} />
      ))}
      {text && <p>{text}</p>}
    </div>
  );
}
