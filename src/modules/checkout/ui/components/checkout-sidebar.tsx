import { CircleX } from "lucide-react";

import { formatPrice } from "@/lib/utils";

import { Button } from "@/components/ui/button";

interface Props {
  total: number;
  onCheckout: () => void;
  isCancelled?: boolean;
  isPending?: boolean;
}

export function CheckoutSidebar({ onCheckout, total, isCancelled, isPending }: Props) {
  return (
    <div className="flex flex-col overflow-hidden rounded-md border bg-white">
      <div className="flex items-center justify-between border-b p-4">
        <h4 className="text-lg font-medium">Total</h4>
        <p className="text-lg font-medium">{formatPrice(total)}</p>
      </div>

      <div className="flex items-center justify-center p-4">
        <Button
          variant="elevated"
          disabled={isPending}
          onClick={onCheckout}
          size="lg"
          className="bg-primary hover:text-primary w-full text-base text-white hover:bg-pink-400"
        >
          Checkout
        </Button>
      </div>
      {isCancelled && (
        <div className="flex items-center justify-center border-t p-4">
          <div className="flex w-full items-center rounded border border-red-400 bg-red-100 px-4 py-3 font-medium">
            <div className="flex items-center">
              <CircleX className="mr-2 size-6 fill-red-500 text-red-100" />
              <span>Checkout failed, please try again</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
