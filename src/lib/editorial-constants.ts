import { CLOUDINARY } from "@/lib/catalog-images";
import { collectionHref, productHref } from "@/lib/money";

export const EDITORIAL_PRODUCTS = [
  {
    id: "editorial-blanket",
    name: "Rainbow Nest Blanket",
    category: "Baby Blankets",
    collectionSlug: "blankets",
    price: 2999,
    originalPrice: 3499,
    badge: "Bestseller",
    href: productHref("rainbow-nest"),
    primaryImage: {
      src: CLOUDINARY.categoryBlankets,
      alt: "Rainbow Nest crochet baby blanket folded in a gift box",
      objectPosition: "object-center",
    },
    secondaryImage: {
      src: CLOUDINARY.rainbowNestGallery[2] ?? CLOUDINARY.rainbowNestGallery[1],
      alt: "Rainbow Nest crochet baby blanket spread out showcasing handmade detail",
      objectPosition: "object-center",
    },
  },
  {
    id: "editorial-toy",
    name: "Simba The Lion Companion",
    category: "Crochet Toys",
    collectionSlug: "toys",
    price: 1499,
    originalPrice: 1799,
    badge: "Staff Pick",
    href: productHref("simba-lion-toy"),
    primaryImage: {
      src: CLOUDINARY.crochetLionToyBanner,
      alt: "Handmade crochet lion toy in a lime sweater",
      objectPosition: "object-[center_38%]",
    },
    secondaryImage: {
      src: CLOUDINARY.crochetLionToyGallery[0],
      alt: "Simba crochet lion toy seated gracefully on a tabletop",
      objectPosition: "object-center",
    },
  },
  {
    id: "editorial-frame",
    name: "Little Curve Cloud Frame",
    category: "Nursery Keepsakes",
    collectionSlug: "frames",
    price: 2499,
    originalPrice: 2899,
    badge: "Custom Made",
    href: productHref("little-curve"),
    primaryImage: {
      src: CLOUDINARY.littleCurveThird,
      alt: "Little Curve cloud nursery frame with crochet girl, puppy, and name plaque",
      objectPosition: "object-[center_22%]",
    },
    secondaryImage: {
      src: CLOUDINARY.littleCurve,
      alt: "Little Curve nursery frame hanging in warm natural room light",
      objectPosition: "object-center",
    },
  },
  {
    id: "editorial-keychain",
    name: "Cotton Candy Bunny Charm",
    category: "Little Extras",
    collectionSlug: "little-extras",
    price: 349,
    originalPrice: 449,
    badge: "Trending",
    href: productHref("cotton-candy-bunny-keychain"),
    primaryImage: {
      src: CLOUDINARY.bunnyKeychain,
      alt: "Pink crochet bunny keychain hanging from a wooden peg",
      objectPosition: "object-[center_42%]",
    },
    secondaryImage: {
      src: CLOUDINARY.bunnyKeychainGallery[2] ?? CLOUDINARY.bunnyKeychainGallery[1],
      alt: "Cotton candy bunny keychain styled as a handbag charm",
      objectPosition: "object-center",
    },
  },
] as const;

export const EDITORIAL_IMAGES = [
  {
    src: EDITORIAL_PRODUCTS[0].primaryImage.src,
    alt: EDITORIAL_PRODUCTS[0].primaryImage.alt,
    objectPosition: EDITORIAL_PRODUCTS[0].primaryImage.objectPosition,
  },
  {
    src: EDITORIAL_PRODUCTS[1].primaryImage.src,
    alt: EDITORIAL_PRODUCTS[1].primaryImage.alt,
    objectPosition: EDITORIAL_PRODUCTS[1].primaryImage.objectPosition,
  },
  {
    src: EDITORIAL_PRODUCTS[2].primaryImage.src,
    alt: EDITORIAL_PRODUCTS[2].primaryImage.alt,
    objectPosition: EDITORIAL_PRODUCTS[2].primaryImage.objectPosition,
  },
  {
    src: EDITORIAL_PRODUCTS[3].primaryImage.src,
    alt: EDITORIAL_PRODUCTS[3].primaryImage.alt,
    objectPosition: EDITORIAL_PRODUCTS[3].primaryImage.objectPosition,
  },
] as const;

export const EDITORIAL_COPY = {
  eyebrow: "The Curated Edit",
  heading: "Artisan Heirlooms for Modern Living",
  body: "Hand-crocheted baby blankets, timeless keepsake frames, and endearing companion toys — each piece crafted stitch by stitch with pure organic cotton yarn to bring warmth and soul to everyday spaces.",
  cta: "Shop The Collection",
  ctaHref: "/collections",
} as const;

export type EditorialBannerContent = {
  eyebrow: string;
  heading: string;
  body: string;
  cta: string;
  ctaHref: string;
  images: readonly {
    src: string;
    alt: string;
    objectPosition?: string;
    secondarySrc?: string;
    name?: string;
    price?: number;
    originalPrice?: number;
    badge?: string;
    category?: string;
    href?: string;
  }[];
};
