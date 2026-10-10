"use client";

import Image from "next/image";
import { useCallback, useMemo, useRef, useState } from "react";
import { ProductLightbox } from "@/components/catalog/ProductLightbox";

type ProductGalleryProps = {
  images: string[];
  alt: string;
  selectedImage?: string | null;
  onImageSelect?: (image: string, index: number) => void;
};

export function ProductGallery({
  images,
  alt,
  selectedImage,
  onImageSelect,
}: ProductGalleryProps) {
  const gallery = useMemo(
    () => (images.length > 0 ? images : ["/logo.png"]),
    [images],
  );
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const mainFrameRef = useRef<HTMLDivElement>(null);
  const zoomButtonRef = useRef<HTMLButtonElement>(null);

  const selectedIndex = selectedImage
    ? gallery.findIndex((image) => image === selectedImage)
    : -1;
  const displayIndex = selectedIndex >= 0 ? selectedIndex : active;

  const selectIndex = useCallback(
    (index: number) => {
      setActive(index);
      onImageSelect?.(gallery[index], index);
    },
    [gallery, onImageSelect],
  );

  function handleThumbClick(index: number) {
    selectIndex(index);
  }

  function handleMainMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const frame = mainFrameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    frame.style.setProperty("--zoom-x", `${x}%`);
    frame.style.setProperty("--zoom-y", `${y}%`);
  }

  function handleMainMouseLeave() {
    const frame = mainFrameRef.current;
    if (!frame) return;
    frame.style.removeProperty("--zoom-x");
    frame.style.removeProperty("--zoom-y");
  }

  function openLightbox() {
    setLightboxOpen(true);
  }

  function closeLightbox() {
    setLightboxOpen(false);
    requestAnimationFrame(() => zoomButtonRef.current?.focus());
  }

  function handleLightboxIndexChange(index: number) {
    selectIndex(index);
  }

  const currentSrc = gallery[displayIndex] ?? gallery[0];

  return (
    <div className="rounded-3xl bg-white p-2.5 sm:p-3.5 ring-1 ring-chocolate/10 shadow-[0_4px_24px_-4px_rgba(75,50,34,0.06)]">
      {/* Main Image Stage */}
      <div
        ref={mainFrameRef}
        className="product-gallery-main group/main relative aspect-[4/5] overflow-hidden rounded-2xl bg-canvas ring-1 ring-chocolate/5"
        onMouseMove={handleMainMouseMove}
        onMouseLeave={handleMainMouseLeave}
      >
        <button
          type="button"
          onClick={openLightbox}
          className="absolute inset-0 z-0 block cursor-zoom-in focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-earth"
          aria-label="View larger image"
        >
          <Image
            src={currentSrc}
            alt={alt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            quality={85}
            className="product-gallery-zoom-image pointer-events-none object-cover"
            priority
          />
        </button>

        {/* Floating Provenance Tag */}
        <div className="absolute left-3 top-3 z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 font-sans text-[10px] font-medium uppercase tracking-[0.12em] text-chocolate shadow-xs backdrop-blur-md ring-1 ring-chocolate/10">
            <span className="h-1.5 w-1.5 rounded-full bg-sage" />
            Jaipur Atelier
          </span>
        </div>

        {/* Floating Zoom Action Pill */}
        <button
          ref={zoomButtonRef}
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            openLightbox();
          }}
          className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 font-sans text-xs font-medium text-chocolate shadow-md backdrop-blur-sm transition-all duration-200 hover:bg-white hover:shadow-lg active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-earth"
          aria-label="View larger image"
        >
          <ZoomInIcon />
          <span>Zoom</span>
        </button>
      </div>

      {/* Thumbnails strip */}
      {gallery.length > 1 ? (
        <div className="mt-3 flex items-center gap-2.5 overflow-x-auto pb-1 pt-0.5">
          {gallery.map((image, index) => {
            const isSelected = displayIndex === index;
            return (
              <button
                key={image + index}
                type="button"
                onClick={() => handleThumbClick(index)}
                className={`relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-xl transition-all duration-200 ${
                  isSelected
                    ? "ring-2 ring-earth ring-offset-2 scale-[1.02] shadow-xs"
                    : "ring-1 ring-chocolate/15 opacity-70 hover:opacity-100 hover:ring-chocolate/30"
                }`}
                aria-label={`View photo ${index + 1}`}
              >
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      ) : null}

      {lightboxOpen ? (
        <ProductLightbox
          images={gallery}
          alt={alt}
          index={displayIndex}
          onIndexChange={handleLightboxIndexChange}
          onClose={closeLightbox}
        />
      ) : null}
    </div>
  );
}

function ZoomInIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
    </svg>
  );
}
