"use client";

import Image from "next/image";
import { patternLabelForIndex } from "@/lib/patterns";

type PatternPickerProps = {
  patterns: string[];
  selectedImage: string | null;
  onSelect: (image: string, label: string) => void;
};

export function PatternPicker({
  patterns,
  selectedImage,
  onSelect,
}: PatternPickerProps) {
  return (
    <div className="space-y-3">
      <p className="font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-chocolate/55">
        Choose your pattern
      </p>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
        {patterns.map((image, index) => {
          const selected = selectedImage === image;
          const label = patternLabelForIndex(index);

          return (
            <button
              key={image}
              type="button"
              onClick={() => onSelect(image, label)}
              className={`relative aspect-square overflow-hidden border transition-colors ${
                selected
                  ? "border-earth ring-2 ring-earth"
                  : "border-chocolate/15 hover:border-earth/40"
              }`}
              aria-label={label}
              aria-pressed={selected}
            >
              <Image
                src={image}
                alt={label}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          );
        })}
      </div>
      {selectedImage ? (
        <p className="font-serif text-sm text-earth">
          Selected: {patterns.findIndex((p) => p === selectedImage) >= 0
            ? patternLabelForIndex(patterns.findIndex((p) => p === selectedImage))
            : "Selected design"}
        </p>
      ) : (
        <p className="font-serif text-sm text-chocolate/55">
          Pick a design before adding to cart.
        </p>
      )}
    </div>
  );
}
