import type {
  Category,
  NavLink,
  Product,
  Testimonial,
  ValueProp,
} from "./types";

export const SITE = {
  name: "Sky n Soul",
  tagline: "Where Little Memories Begin",
  announcement: "Free shipping on heirloom gift boxes over ₹12,499",
} as const;

export const NAV_LINKS: NavLink[] = [
  { label: "Shop All", href: "#shop" },
  { label: "Gift Collection", href: "#gift-boxes" },
  { label: "Heirloom Blankets", href: "#blankets" },
  { label: "Crochet Toys", href: "#toys" },
  { label: "Memory Editions", href: "#memory" },
];

export const FOOTER_SHOP_LINKS: NavLink[] = [
  { label: "Shop All", href: "#shop" },
  { label: "Gift Boxes", href: "#gift-boxes" },
  { label: "Heirloom Blankets", href: "#blankets" },
  { label: "Crochet Toys", href: "#toys" },
  { label: "Memory Editions", href: "#memory" },
];

export const FOOTER_CARE_LINKS: NavLink[] = [
  { label: "Shipping & Returns", href: "#" },
  { label: "Care Guide", href: "#" },
  { label: "Gift Wrapping", href: "#" },
  { label: "Contact Us", href: "#" },
  { label: "FAQ", href: "#" },
];

export const CATEGORIES: Category[] = [
  {
    id: "gift-boxes",
    title: "The Gift Boxes",
    href: "#gift-boxes",
    image:
      "https://images.unsplash.com/photo-1513885535751-efb9ff92592b?w=800&q=80",
    imageAlt: "Open cream gift box on a soft white surface",
  },
  {
    id: "toys",
    title: "The Crochet Toys",
    href: "#toys",
    image:
      "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&q=80",
    imageAlt: "Handmade crochet toy beside soft yarn",
  },
  {
    id: "blankets",
    title: "Heirloom Blankets",
    href: "#blankets",
    image:
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80",
    imageAlt: "Knit blanket draped over a wooden crib",
  },
  {
    id: "memory",
    title: "Memory Editions",
    href: "#memory",
    image:
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80",
    imageAlt: "Cloth memory book with wooden rattle and greenery",
  },
];

export const PRODUCTS: Product[] = [
  {
    id: "cloud-knit-blanket",
    name: "Cloud Knit Heirloom Blanket",
    price: 10499,
    href: "#",
    image:
      "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&q=80",
    imageAlt: "Soft cream knit blanket folded neatly",
    category: "Blankets",
  },
  {
    id: "little-fox",
    name: "Little Fox Crochet Companion",
    price: 3999,
    href: "#",
    image:
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&q=80",
    imageAlt: "Handmade soft toy for nursery",
    category: "Toys",
  },
  {
    id: "nest-gift-box",
    name: "The Nest Gift Box",
    price: 13499,
    href: "#",
    image:
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80",
    imageAlt: "Curated baby gift box with soft packaging",
    category: "Gifts",
  },
  {
    id: "first-year-book",
    name: "First Year Memory Book",
    price: 5999,
    href: "#",
    image:
      "https://images.unsplash.com/photo-1471970471555-19d4b113e9ed?w=800&q=80",
    imageAlt: "Keepsake memory book on linen",
    category: "Memory",
  },
];

export const VALUE_PROPS: ValueProp[] = [
  {
    id: "handmade",
    title: "Handmade",
    description: "Every piece is crocheted and woven by hand with patient care.",
  },
  {
    id: "heirloom",
    title: "Heirloom Quality",
    description: "Built to last through childhoods, stories, and generations.",
  },
  {
    id: "gift-ready",
    title: "Gift-Ready",
    description: "Thoughtful packaging that arrives ready to celebrate.",
  },
  {
    id: "made-with-love",
    title: "Made with Love",
    description: "Crafted for Sky, for Soul, and the moments that matter.",
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    quote:
      "The blanket feels like a hug that will last forever. We already know it will be passed down.",
    author: "Priya M.",
    detail: "Heirloom Blanket",
  },
  {
    id: "2",
    quote:
      "Our gift box arrived so beautifully packaged — it felt like opening a little nest of love.",
    author: "James & Elena",
    detail: "The Nest Gift Box",
  },
  {
    id: "3",
    quote:
      "The crochet fox is already my son's favorite companion. Soft, safe, and full of soul.",
    author: "Amelia R.",
    detail: "Crochet Toys",
  },
];

export const HERO = {
  headline: "Out of Love, Built to Last.",
  subheadline: "For Sky, for Soul, and the little moments that define us.",
  cta: "Discover the Collection",
  ctaHref: "#shop",
  image:
    "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=1600&q=80",
  imageAlt: "Close-up of a cream chunky knit heirloom blanket",
} as const;

export const BRAND_STORY = {
  quote: "Two brothers. One endless sky. A lifetime of memories.",
  body: "Sky n Soul began as a family promise — to create premium hand-woven pieces and crocheted keepsakes that hold the warmth of home. Every stitch is made to become part of your story.",
} as const;
