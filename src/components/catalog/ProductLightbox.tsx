"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type ProductLightboxProps = {
  images: string[];
  alt: string;
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
};

export function ProductLightbox({
  images,
  alt,
  index,
  onIndexChange,
  onClose,
}: ProductLightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalTarget(document.body);
  }, []);

  const goPrev = useCallback(() => {
    if (images.length <= 1) return;
    onIndexChange((index - 1 + images.length) % images.length);
  }, [images.length, index, onIndexChange]);

  const goNext = useCallback(() => {
    if (images.length <= 1) return;
    onIndexChange((index + 1) % images.length);
  }, [images.length, index, onIndexChange]);

  useEffect(() => {
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [goNext, goPrev, onClose]);

  function handleBackdropClick(event: React.MouseEvent) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  function handleThumbClick(nextIndex: number) {
    onIndexChange(nextIndex);
  }

  const content = (
    <div
      className="fixed inset-0 z-[60] flex flex-col bg-chocolate/92 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="Product image gallery"
      onClick={handleBackdropClick}
    >
      <div className="flex shrink-0 items-center justify-between px-4 py-4 sm:px-6">
        {images.length > 1 ? (
          <p className="font-sans text-xs font-medium uppercase tracking-[0.14em] text-white/80">
            {index + 1} / {images.length}
          </p>
        ) : (
          <span />
        )}
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          aria-label="Close gallery"
        >
          <CloseIcon />
        </button>
      </div>

      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4 sm:px-12"
        onClick={handleBackdropClick}
      >
        {images.length > 1 ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              goPrev();
            }}
            className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:left-4"
            aria-label="Previous image"
          >
            <ChevronLeftIcon />
          </button>
        ) : null}

        <div
          className="relative h-full w-full max-h-[min(72vh,900px)] max-w-5xl"
          onClick={(event) => event.stopPropagation()}
        >
          <Image
            key={images[index]}
            src={images[index] ?? images[0]}
            alt={alt}
            fill
            sizes="100vw"
            quality={85}
            className="object-contain"
            priority
          />
        </div>

        {images.length > 1 ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              goNext();
            }}
            className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-4"
            aria-label="Next image"
          >
            <ChevronRightIcon />
          </button>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="shrink-0 border-t border-white/10 px-4 py-4 sm:px-6">
          <div className="mx-auto flex max-w-3xl gap-2 overflow-x-auto pb-1">
            {images.map((image, thumbIndex) => (
              <button
                key={image + thumbIndex}
                type="button"
                onClick={() => handleThumbClick(thumbIndex)}
                className={`relative h-16 w-16 shrink-0 overflow-hidden border-2 transition-colors sm:h-20 sm:w-20 ${
                  thumbIndex === index
                    ? "border-white"
                    : "border-transparent opacity-70 hover:border-white/40 hover:opacity-100"
                }`}
                aria-label={`View image ${thumbIndex + 1}`}
                aria-current={thumbIndex === index ? "true" : undefined}
              >
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );

  if (!portalTarget) return null;
  return createPortal(content, portalTarget);
}

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}
