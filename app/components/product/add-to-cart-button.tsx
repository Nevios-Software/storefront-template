import { useRef, useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import { useCart } from "@nevios/storefront-kit";
import type { ProductVariant } from "@nevios/storefront-js";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";

interface AddToCartButtonProps {
  variant: ProductVariant | null;
  quantity?: number;
  className?: string;
}

/**
 * The PDP buy button — adds the selected variant via the shared cart
 * (kit `useCart`, same state the header count + drawer read). Disabled when
 * the variant is out of stock; flashes a "Přidáno" confirmation on success.
 */
export function AddToCartButton({ variant, quantity = 1, className }: AddToCartButtonProps) {
  const { addLine, loading } = useCart();
  const [added, setAdded] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const soldOut = variant?.availability?.status === "out_of_stock";
  const disabled = !variant || soldOut || loading;

  const onAdd = async () => {
    if (!variant) return;
    await addLine({ variant_id: variant.id, quantity });
    setAdded(true);
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Button
      type="button"
      size="lg"
      disabled={disabled}
      onClick={onAdd}
      className={cn("w-full", className)}
    >
      {added ? (
        <>
          <Check className="size-5" /> Přidáno do košíku
        </>
      ) : soldOut ? (
        "Vyprodáno"
      ) : (
        <>
          <ShoppingBag className="size-5" /> Přidat do košíku
        </>
      )}
    </Button>
  );
}
