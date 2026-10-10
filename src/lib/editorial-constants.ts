import { CLOUDINARY } from "@/lib/catalog-images";
import { collectionHref, productHref } from "@/lib/money";

export const EDITORIAL_PRODUCTS = [
  {
    id: "editorial-lavender-bliss",
    name: "Lavender Bliss",
    category: "Baby Blankets",
    collectionSlug: "blankets",
    price: 3699,
    href: productHref("lavender-bliss"),
    primaryImage: {
      src: CLOUDINARY.lavenderBliss,
      alt: "Lavender Bliss lilac crochet blanket with cream daisy appliqués and a cream border",
      objectPosition: "object-center",
    },
    secondaryImage: {
      src: CLOUDINARY.lavenderBlissGallery[1],
      alt: "Lavender Bliss blanket draped over a sleeping baby",
      objectPosition: "object-[center_28%]",
    },
  },
  {
    id: "editorial-sunny-sam",
    name: "Sunny Sam Dog Toy",
    category: "Crochet Toys",
    collectionSlug: "toys",
    price: 1949,
    href: productHref("sunny-sam-dog-toy"),
    primaryImage: {
      src: CLOUDINARY.sunnySamDogToy,
      alt: "Sunny Sam Dog Toy",
      objectPosition: "object-[center_28%]",
    },
    secondaryImage: {
      src: CLOUDINARY.sunnySamDogToyGallery[5],
      alt: "Sunny Sam crochet dog toy lying on an open book",
      objectPosition: "object-[center_40%]",
    },
  },
  {
    id: "editorial-welcome",
    name: "Welcome to the World",
    category: "Nursery Keepsakes",
    collectionSlug: "frames",
    price: 3099,
    href: productHref("welcome-to-the-world"),
    primaryImage: {
      src: CLOUDINARY.welcomeToTheWorld,
      alt: "Welcome to the World personalized crochet birth announcement frame",
      objectPosition: "object-center",
    },
    secondaryImage: {
      src: CLOUDINARY.welcomeToTheWorld,
      alt: "Welcome to the World personalized crochet birth announcement frame",
      objectPosition: "object-[center_42%]",
    },
  },
  {
    id: "editorial-giraffe",
    name: "Ginger Giraff Keychain",
    category: "Little Extras",
    collectionSlug: "little-extras",
    price: 799,
    href: productHref("giraffe-keychain"),
    primaryImage: {
      src: CLOUDINARY.giraffeKeychain,
      alt: "Ginger Giraff Keychain",
      objectPosition: "object-center",
    },
    secondaryImage: {
      src: CLOUDINARY.giraffeKeychainGallery[2],
      alt: "Ginger Giraff crochet keychain from another angle",
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
