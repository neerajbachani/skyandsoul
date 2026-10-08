import { FRAME_DESIGNS } from "@/lib/catalog-content";
import type { NavLink, SocialLink, Testimonial, ValueProp } from "./types";

export const SITE = {
  name: "Sky n Soul",
  tagline: "Where Little Memories Begin",
  announcement: "Free shipping above ₹999 · Flat 10% off on your first order",
  url: "https://skynsoul.com",
  email: "infoskynsoul@gmail.com",
  phones: ["+918602423131", "+918560048348"],
  address: {
    line1: "Plot no 86, Sector 5",
    city: "Vidhyadhar Nagar, Jaipur",
    pincode: "302039",
  },
  hours: "Monday to Saturday · 9am to 6pm",
} as const;

export const NAV_LINKS: NavLink[] = [
  { label: "Shop All", href: "/collections" },
  { label: "Blankets", href: "/collections/blankets" },
  { label: "Toys", href: "/collections/toys" },
  { label: "Frames", href: "/collections/frames" },
  { label: "Frame It Your Way", href: "/collections/frame-it-your-way" },
  { label: "Little Extras", href: "/collections/little-extras" },
];

export const FOOTER_SHOP_LINKS: NavLink[] = [
  { label: "Shop All", href: "/collections" },
  { label: "Blankets", href: "/collections/blankets" },
  { label: "Toys", href: "/collections/toys" },
  { label: "Frames", href: "/collections/frames" },
  { label: "Frame It Your Way", href: "/collections/frame-it-your-way" },
  { label: "Little Extras", href: "/collections/little-extras" },
];

export const FOOTER_CARE_LINKS: NavLink[] = [
  { label: "Shipping & Returns", href: "/shipping" },
  { label: "Care Guide", href: "/care-guide" },
  { label: "Contact Us", href: "/contact" },
  { label: "Help Desk", href: "/faq" },
];

export const FOOTER_LEGAL_LINKS: NavLink[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/skynsoul.co?utm_source=qr",
    network: "instagram",
  },
  {
    label: "Pinterest",
    href: "https://www.pinterest.com/",
    network: "pinterest",
  },
  {
    label: "Email",
    href: `mailto:${SITE.email}`,
    network: "email",
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
      "Our gift arrived so beautifully packaged — it felt like opening a little nest of love.",
    author: "James & Elena",
    detail: "Gift Collection",
  },
  {
    id: "3",
    quote:
      "The crochet fox is already my son's favorite companion. Soft, safe, and full of soul.",
    author: "Amelia R.",
    detail: "Crochet Toys",
  },
];

export const HERO_SLIDES = [
  {
    eyebrow: "Blankets",
    headline: "Out of Love, Built to Last.",
    subheadline: "For Sky, for Soul, and the little moments that define us.",
    cta: "Discover the Collection",
    ctaHref: "/collections",
    image:
      "https://res.cloudinary.com/dix9x012c/image/upload/v1791481000/Handmade_Cloud_Blanket_Ad_ydds3o.png",
    imageMobile:
      "https://res.cloudinary.com/dix9x012c/image/upload/v1791482050/Handmade_Clouds__Wrap_It_Up_yrbpvx.png",
    imageAlt:
      "Colorful handmade crochet cloud blanket draped on a red chair against a blue wall",
    objectPosition: "object-center",
  },
  {
    eyebrow: "Toys",
    headline: "Soft companions, stitched by hand.",
    subheadline: "Crochet friends made to be held, loved, and kept.",
    cta: "Shop Toys",
    ctaHref: "/collections/toys",
    image:
      "https://res.cloudinary.com/dix9x012c/image/upload/v1791483496/Ready_for_Takeoff__Made_With_Love_a634jn.png",
    imageMobile:
      "https://res.cloudinary.com/dix9x012c/image/upload/v1791483666/Ready_for_Takeoff__Handmade_Pilot_Bear_djtiqs.png",
    imageAlt:
      "Ready for Takeoff hero with a crochet pilot bear, Made With Love, and Shop Now",
    objectPosition: "object-center",
  },
  {
    eyebrow: "Frames",
    headline: "A name, a nest, a beginning.",
    subheadline:
      "Personalized nursery frames, handmade to hold the first details of a life.",
    cta: "Shop Frames",
    ctaHref: "/collections/frames",
    image:
      "https://res.cloudinary.com/dix9x012c/image/upload/v1791178703/Mint_Nursery_Lion_Birth_Announcement_daixnp.png",
    imageAlt:
      "Mint nursery frame with a crochet lion, balloons, and a birth announcement",
    objectPosition: "object-center",
  },
] as const;

export const BRAND_STORY = {
  quote: "Two brothers. One endless sky. A lifetime of memories.",
  body: "Sky n Soul began as a family promise — to create premium hand-woven pieces and crocheted keepsakes that hold the warmth of home. Every stitch is made to become part of your story.",
} as const;

export const FRAME_IT_STEPS = [
  {
    step: 1,
    title: "Choose a Frame Design",
    description: "Browse 12 frame design options and pick the one that feels like home.",
  },
  {
    step: 2,
    title: "Select a Toy",
    description: "Pair your frame with a soft crochet companion from our toy collection.",
  },
  {
    step: 3,
    title: "Write Your Name",
    description: "Add a name or short dedication to make the keepsake uniquely yours.",
  },
  {
    step: 4,
    title: "Preview the Final View",
    description: "See how your personalized piece comes together before you order.",
  },
  {
    step: 5,
    title: "Purchase",
    description: "Checkout opens in Phase B — for now, reach out and we will hold your design.",
  },
] as const;

export { FRAME_DESIGNS };
