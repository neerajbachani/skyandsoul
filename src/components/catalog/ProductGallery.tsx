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
    <div>
      <div
        ref={mainFrameRef}
        className="product-gallery-main group/main relative aspect-[4/5] overflow-hidden bg-sky/20"
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
            sizes="100vw"
            quality={85}
            className="product-gallery-zoom-image pointer-events-none object-cover"
            priority
          />
        </button>

        <button
          ref={zoomButtonRef}
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            openLightbox();
          }}
          className="absolute bottom-3 left-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-chocolate shadow-md transition-[box-shadow,scale] hover:shadow-lg active:scale-95 motion-reduce:active:scale-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-earth"
          aria-label="View larger image"
        >
          <ZoomInIcon />
        </button>
      </div>

      {gallery.length > 1 ? (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {gallery.map((image, index) => (
            <button
              key={image + index}
              type="button"
              onClick={() => handleThumbClick(index)}
              className={`relative aspect-square overflow-hidden border transition-colors ${
                displayIndex === index
                  ? "border-earth"
                  : "border-transparent hover:border-chocolate/20"
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image}
                alt=""
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
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
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
    </svg>
  );
}
