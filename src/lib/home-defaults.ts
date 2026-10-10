import { FEATURED_BANNERS, PRIMARY_BANNERS } from "@/components/home/BannerMosaic";
import { EDITORIAL_COPY, EDITORIAL_IMAGES } from "@/lib/editorial-constants";
import { INSTAGRAM_HANDLE, INSTAGRAM_POSTS } from "@/components/home/InstagramFeed";
import { HERO_SLIDES, SOCIAL_LINKS } from "@/lib/constants";

const instagram = SOCIAL_LINKS.find((link) => link.network === "instagram");

export const rawHomeDefaults = {
  hero: {
    slides: HERO_SLIDES.map((slide, index) => ({
      id: `hero-${index + 1}`,
      eyebrow: slide.eyebrow,
      headline: slide.headline,
      subheadline: slide.subheadline,
      cta: slide.cta,
      ctaHref: slide.ctaHref,
      image: slide.image,
      ...("imageMobile" in slide && slide.imageMobile
        ? { imageMobile: slide.imageMobile }
        : {}),
      imageAlt: slide.imageAlt,
    })),
  },
  shopByCollection: {
    eyebrow: "Explore",
    title: "Shop by Collection",
    banners: PRIMARY_BANNERS,
  },
  featuredBanners: FEATURED_BANNERS,
  editorial: {
    ...EDITORIAL_COPY,
    images: EDITORIAL_IMAGES,
  },
  instagram: {
    handle: INSTAGRAM_HANDLE,
    href: instagram?.href ?? "https://www.instagram.com/skynsoul.co",
    posts: INSTAGRAM_POSTS,
  },
  spotlightProductIds: [] as string[],
};
