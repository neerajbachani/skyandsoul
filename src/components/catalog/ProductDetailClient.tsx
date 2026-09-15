"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PatternPicker } from "@/components/catalog/PatternPicker";
import { ProductGallery } from "@/components/catalog/ProductGallery";
import { ProductInfo } from "@/components/catalog/ProductInfo";
import { ProductPurchaseSection } from "@/components/catalog/ProductPurchaseSection";
import type { PackVariant } from "@/components/catalog/PackSizePicker";
import { patternLabelForIndex } from "@/lib/patterns";

type GalleryView = "singles" | string;

type ProductDetailClientProps = {
  productId: string;
  productName: string;
  tagline: string | null;
  description: string;
  features: string[];
  careInstructions: string[];
  material: string | null;
  size: string | null;
  ageRange: string | null;
  categoryName: string;
  categorySlug: string;
  basePrice: number;
  imageAlt: string;
  singles: string[];
  variants: PackVariant[];
  requiresPatternSelection?: boolean;
};

export function ProductDetailClient({
  productId,
  productName,
  tagline,
  description,
  features,
  careInstructions,
  material,
  size,
  ageRange,
  categoryName,
  categorySlug,
  basePrice,
  imageAlt,
  singles,
  variants,
  requiresPatternSelection = false,
}: ProductDetailClientProps) {
  const defaultVariantId = variants[0]?.id ?? "";
  const [selectedVariantId, setSelectedVariantId] = useState(defaultVariantId);
  const [galleryView, setGalleryView] = useState<GalleryView>(defaultVariantId);
  const [selectedPatternImage, setSelectedPatternImage] = useState<string | null>(
    null,
  );
  const [selectedPatternLabel, setSelectedPatternLabel] = useState<string | null>(
    null,
  );

  const activeImages = useMemo(() => {
    if (galleryView === "singles") return singles;
    const variant = variants.find((entry) => entry.id === galleryView);
    return variant?.images?.length ? variant.images : singles;
  }, [galleryView, singles, variants]);

  function handleVariantSelect(variantId: string) {
    setSelectedVariantId(variantId);
    setGalleryView(variantId);
  }

  function handlePatternSelect(image: string, label: string) {
    setSelectedPatternImage(image);
    setSelectedPatternLabel(label);
  }

  function handleGalleryPatternSelect(image: string, index: number) {
    if (galleryView !== "singles") return;
    handlePatternSelect(image, patternLabelForIndex(index));
  }

  return (
    <>
      <div>
        <div className="mb-4 flex flex-wrap gap-2">
          <GalleryTab
            label="Individual designs"
            active={galleryView === "singles"}
            onClick={() => setGalleryView("singles")}
          />
          {variants.map((variant) => (
            <GalleryTab
              key={variant.id}
              label={variant.name}
              active={galleryView === variant.id}
              onClick={() => setGalleryView(variant.id)}
            />
          ))}
        </div>
        <ProductGallery
          key={galleryView}
          images={activeImages}
          alt={imageAlt}
          selectedImage={galleryView === "singles" ? selectedPatternImage : null}
          onImageSelect={
            galleryView === "singles" ? handleGalleryPatternSelect : undefined
          }
        />
      </div>

      <div>
        <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-sage">
          {categoryName}
        </p>
        <h1 className="mt-3 font-serif text-4xl font-medium text-chocolate sm:text-5xl">
          {productName}
        </h1>
        {tagline ? (
          <p className="mt-4 font-serif text-xl italic text-earth">{tagline}</p>
        ) : null}

        <dl className="mt-8 grid gap-4 border-y border-chocolate/10 py-6 sm:grid-cols-3">
          {material ? (
            <div>
              <dt className="font-sans text-[10px] uppercase tracking-[0.14em] text-chocolate/50">
                Material
              </dt>
              <dd className="mt-1 font-serif text-base text-chocolate">{material}</dd>
            </div>
          ) : null}
          {size ? (
            <div>
              <dt className="font-sans text-[10px] uppercase tracking-[0.14em] text-chocolate/50">
                Size
              </dt>
              <dd className="mt-1 font-serif text-base text-chocolate">{size}</dd>
            </div>
          ) : null}
          {ageRange ? (
            <div>
              <dt className="font-sans text-[10px] uppercase tracking-[0.14em] text-chocolate/50">
                Age
              </dt>
              <dd className="mt-1 font-serif text-base text-chocolate">{ageRange}</dd>
            </div>
          ) : null}
        </dl>

        {requiresPatternSelection ? (
          <div className="mt-8">
            <PatternPicker
              patterns={singles}
              selectedImage={selectedPatternImage}
              onSelect={handlePatternSelect}
            />
          </div>
        ) : null}

        <div className="mt-8">
          <ProductPurchaseSection
            productId={productId}
            productName={productName}
            basePrice={basePrice}
            variants={variants}
            selectedVariantId={selectedVariantId}
            onVariantChange={handleVariantSelect}
            requirePattern={requiresPatternSelection}
            selectedPatternImage={selectedPatternImage}
            selectedPatternLabel={selectedPatternLabel}
          />
        </div>

        <p className="mt-3">
          <Link
            href={`/collections/${categorySlug}`}
            className="font-sans text-xs font-medium uppercase tracking-[0.14em] text-earth underline underline-offset-[6px]"
          >
            More in {categoryName}
          </Link>
        </p>
        <p className="mt-4 font-sans text-xs text-chocolate/55">
          Secure checkout with Razorpay. Sign in to complete your order.
        </p>

        <ProductInfo
          description={description}
          features={features}
          careInstructions={careInstructions}
        />
      </div>
    </>
  );
}

function GalleryTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border px-3 py-2 font-sans text-[11px] font-medium uppercase tracking-[0.12em] transition-colors ${
        active
          ? "border-earth bg-earth/5 text-chocolate"
          : "border-chocolate/15 bg-white text-chocolate/60 hover:border-earth/40 hover:text-chocolate"
      }`}
    >
      {label}
    </button>
  );
}
