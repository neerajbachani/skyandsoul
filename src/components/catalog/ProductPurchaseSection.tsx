"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { PackSizePicker, type PackVariant } from "@/components/catalog/PackSizePicker";
import { formatInr } from "@/lib/money";

type ProductPurchaseSectionProps = {
  productId: string;
  productName: string;
  basePrice: number;
  variants?: PackVariant[];
  selectedVariantId?: string;
  onVariantChange?: (variantId: string) => void;
  requirePattern?: boolean;
  selectedPatternImage?: string | null;
  selectedPatternLabel?: string | null;
  pickerLabel?: string;
};

export function ProductPurchaseSection({
  productId,
  productName,
  basePrice,
  variants = [],
  selectedVariantId: controlledVariantId,
  onVariantChange,
  requirePattern = false,
  selectedPatternImage = null,
  selectedPatternLabel = null,
  pickerLabel = "Choose pack size",
}: ProductPurchaseSectionProps) {
  const hasVariants = variants.length > 0;
  const [internalVariantId, setInternalVariantId] = useState(variants[0]?.id ?? "");
  const isControlled = controlledVariantId !== undefined && onVariantChange !== undefined;
  const selectedVariantId = isControlled ? controlledVariantId : internalVariantId;

  const selectedVariant = useMemo(
    () => variants.find((variant) => variant.id === selectedVariantId),
    [variants, selectedVariantId],
  );

  const displayPrice = selectedVariant?.price ?? basePrice;

  function handleVariantSelect(variantId: string) {
    if (isControlled) {
      onVariantChange(variantId);
    } else {
      setInternalVariantId(variantId);
    }
  }

  return (
    <div className="space-y-6">
      <p className="font-sans text-lg font-medium tracking-wide text-chocolate">
        {formatInr(displayPrice)}
      </p>

      {hasVariants ? (
        <PackSizePicker
          variants={variants}
          selectedId={selectedVariantId}
          onSelect={handleVariantSelect}
          label={pickerLabel}
        />
      ) : null}

      <AddToCartButton
        productId={productId}
        productName={productName}
        variantId={hasVariants ? selectedVariantId : undefined}
        requireVariant={hasVariants}
        requirePattern={requirePattern}
        selectedPatternImage={selectedPatternImage}
        selectedPatternLabel={selectedPatternLabel}
      />

      <p>
        <Link
          href="/contact"
          className="font-sans text-xs font-medium uppercase tracking-[0.14em] text-earth underline underline-offset-[6px]"
        >
          Contact us
        </Link>
      </p>
    </div>
  );
}
