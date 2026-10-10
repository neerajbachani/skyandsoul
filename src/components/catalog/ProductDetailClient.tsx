"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PatternPicker } from "@/components/catalog/PatternPicker";
import { ProductGallery } from "@/components/catalog/ProductGallery";
import { ProductEditorialAccordion } from "@/components/catalog/ProductEditorialAccordion";
import { ProductPurchaseSection } from "@/components/catalog/ProductPurchaseSection";
import { ProductStickyMobileBar } from "@/components/catalog/ProductStickyMobileBar";
import type { PackVariant } from "@/components/catalog/PackSizePicker";
import { patternLabelForIndex } from "@/lib/patterns";
import {
  teaCoasterImagesForView,
  teaCoasterLabelForImage,
  teaCoasterMatchForImage,
} from "@/lib/catalog-images";

type GalleryView = "singles" | string;
type PackView = "individual" | "set4" | "set6";

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
  fixedPackView?: PackView;
  trackStock?: boolean;
  stockQuantity?: number;
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
  fixedPackView,
  trackStock = false,
  stockQuantity = 0,
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

  const packView = useMemo(() => {
    if (fixedPackView) return fixedPackView;
    if (galleryView === "singles") return "individual" as const;
    const variant = variants.find((entry) => entry.id === galleryView);
    if (variant?.slug === "set-of-6") return "set6" as const;
    if (variant?.slug === "set-of-4") return "set4" as const;
    return "individual" as const;
  }, [fixedPackView, galleryView, variants]);

  const patternGallery = selectedPatternImage
    ? teaCoasterImagesForView(selectedPatternImage, packView)
    : undefined;
  const galleryImages = patternGallery?.length ? patternGallery : activeImages;

  function handleGalleryTab(view: GalleryView) {
    setGalleryView(view);
    if (view !== "singles") {
      setSelectedVariantId(view);
    }
  }

  function handleVariantSelect(variantId: string) {
    setSelectedVariantId(variantId);
    setGalleryView(variantId);
  }

  function handlePatternSelect(image: string, label: string) {
    setSelectedPatternImage(image);
    setSelectedPatternLabel(label);
  }

  const patternLabels = singles.map(
    (image, index) =>
      teaCoasterLabelForImage(image) ?? patternLabelForIndex(index),
  );

  function handleGalleryImageSelect(image: string, index: number) {
    const match = teaCoasterMatchForImage(image);
    const patternImage = match
      ? (singles.find((single) => teaCoasterMatchForImage(single) === match) ??
        singles[index])
      : singles[index];
    if (!patternImage) return;
    const labelIndex = singles.indexOf(patternImage);
    const resolvedIndex = labelIndex >= 0 ? labelIndex : index;
    handlePatternSelect(
      patternImage,
      patternLabels[resolvedIndex] ??
        match?.name ??
        patternLabelForIndex(resolvedIndex),
    );
  }

  const selectedVariant = variants.find((v) => v.id === selectedVariantId);
  const currentPrice = selectedVariant?.price ?? basePrice;
  const mainImage = galleryImages[0] ?? singles[0] ?? "/logo.png";

  return (
    <>
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Left Column: Sticky Gallery */}
        <div className="lg:col-span-7">
          <div className="lg:sticky lg:top-28">
            {variants.length > 0 ? (
              <div className="mb-4 flex flex-wrap gap-2">
                {requiresPatternSelection ? (
                  <GalleryTab
                    label="Individual designs"
                    active={galleryView === "singles"}
                    onClick={() => handleGalleryTab("singles")}
                  />
                ) : null}
                {variants.map((variant) => (
                  <GalleryTab
                    key={variant.id}
                    label={variant.name}
                    active={galleryView === variant.id}
                    onClick={() => handleGalleryTab(variant.id)}
                  />
                ))}
              </div>
            ) : null}

            <ProductGallery
              key={`${galleryView}-${selectedPatternImage ?? "all"}`}
              images={galleryImages}
              alt={imageAlt}
              onImageSelect={handleGalleryImageSelect}
            />
          </div>
        </div>

        {/* Right Column: Sticky Purchase Details */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            {/* Provenance & Category */}
            <div className="flex items-center gap-2.5">
              <Link
                href={`/collections/${categorySlug}`}
                className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-sage hover:underline"
              >
                {categoryName}
              </Link>
              <span className="h-1 w-1 rounded-full bg-chocolate/30" />
              <span className="font-sans text-[10px] uppercase tracking-wider text-chocolate/50">
                Artisanal Heirloom
              </span>
            </div>

            {/* Product Title */}
            <h1 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-chocolate leading-[1.08] text-balance">
              {productName}
            </h1>

            {/* Poetic Tagline */}
            {tagline ? (
              <p className="mt-3 font-serif text-xl italic text-earth leading-snug">
                {tagline}
              </p>
            ) : null}

            {/* Free Shipping & Reassurance Pill */}
            <div className="mt-5 flex items-center gap-3 rounded-xl border border-sage/20 bg-sage/5 p-3 text-xs text-chocolate/80">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sage/20 text-sage font-bold">
                ✓
              </span>
              <span>
                Free shipping Pan-India on orders above ₹999 · Includes complimentary gift box
              </span>
            </div>

            {/* Pattern Picker if applicable */}
            {requiresPatternSelection ? (
              <div className="mt-7">
                <PatternPicker
                  patterns={singles}
                  labels={patternLabels}
                  selectedImage={selectedPatternImage}
                  onSelect={handlePatternSelect}
                />
              </div>
            ) : null}

            {/* Purchase CTA, Quantity, & Variant selector */}
            <div className="mt-7">
              <ProductPurchaseSection
                productId={productId}
                productName={productName}
                basePrice={basePrice}
                trackStock={trackStock}
                stockQuantity={stockQuantity}
                variants={variants}
                selectedVariantId={selectedVariantId}
                onVariantChange={handleVariantSelect}
                requirePattern={requiresPatternSelection}
                selectedPatternImage={selectedPatternImage}
                selectedPatternLabel={selectedPatternLabel}
                pickerLabel={
                  requiresPatternSelection ? "Choose pack size" : "Choose option"
                }
              />
            </div>

            {/* Trust and Help link */}
            <div className="mt-4 flex items-center justify-between border-t border-chocolate/10 pt-3 font-sans text-xs text-chocolate/60">
              <span>Secure Razorpay Checkout</span>
              <Link
                href="/contact"
                className="font-medium text-earth underline underline-offset-4 hover:text-chocolate"
              >
                Need custom sizing?
              </Link>
            </div>

            {/* Structured Heirloom Accordion */}
            <ProductEditorialAccordion
              description={description}
              features={features}
              careInstructions={careInstructions}
              material={material}
              size={size}
              ageRange={ageRange}
            />

            {/* Jaipur Studio Guarantee Seal */}
            <div className="mt-8 rounded-2xl border border-chocolate/10 bg-[#f9f7f4] p-5">
              <div className="flex items-start gap-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-earth text-white font-serif text-xs font-semibold">
                  SN
                </div>
                <div>
                  <h4 className="font-serif text-base font-medium text-chocolate">
                    The Sky n Soul Atelier Promise
                  </h4>
                  <p className="mt-1 font-serif text-xs leading-relaxed text-chocolate/75">
                    Every piece is crafted in small batches by our women artisans in Jaipur, Rajasthan. No shortcuts, no machine compromises — just genuine heirloom craftsmanship.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Purchase Bar */}
      <ProductStickyMobileBar
        productName={productName}
        price={currentPrice}
        image={mainImage}
        onAddToCart={() => {
          // Smooth scroll to buy section on mobile
          window.scrollTo({ top: 380, behavior: "smooth" });
        }}
      />
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
      className={`rounded-full px-4 py-1.5 font-sans text-xs font-medium uppercase tracking-[0.12em] transition-all duration-200 ${
        active
          ? "bg-earth text-white shadow-xs"
          : "border border-chocolate/15 bg-white text-chocolate/70 hover:border-chocolate/30 hover:text-chocolate"
      }`}
    >
      {label}
    </button>
  );
}
