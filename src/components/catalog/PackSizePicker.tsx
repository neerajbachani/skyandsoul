"use client";

import { formatInr } from "@/lib/money";

export type PackVariant = {
  id: string;
  slug: string;
  name: string;
  price: number;
  badge: string | null;
  images?: string[];
};

type PackSizePickerProps = {
  variants: PackVariant[];
  selectedId: string;
  onSelect: (variantId: string) => void;
};

export function PackSizePicker({
  variants,
  selectedId,
  onSelect,
}: PackSizePickerProps) {
  return (
    <div className="space-y-3">
      <p className="font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-chocolate/55">
        Choose pack size
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {variants.map((variant) => {
          const selected = variant.id === selectedId;

          return (
            <button
              key={variant.id}
              type="button"
              onClick={() => onSelect(variant.id)}
              className={`relative border px-4 py-4 text-left transition-colors ${
                selected
                  ? "border-earth bg-earth/5 ring-1 ring-earth"
                  : "border-chocolate/15 bg-white hover:border-earth/40"
              }`}
            >
              {variant.badge ? (
                <span className="absolute right-3 top-3 rounded-full bg-sage/15 px-2 py-0.5 font-sans text-[10px] font-medium uppercase tracking-[0.12em] text-sage">
                  {variant.badge}
                </span>
              ) : null}
              <span className="block font-serif text-lg text-chocolate">
                {variant.name}
              </span>
              <span className="mt-1 block font-sans text-sm font-medium text-earth">
                {formatInr(variant.price)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
