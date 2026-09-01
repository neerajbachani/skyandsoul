import { CLOUDINARY } from "./catalog-images";

export const HANDMADE_NOTE =
  "As each piece is handmade, slight variations in size, shape, or appearance may occur, making every product beautifully unique.";

export const BLANKET_CARE = [
  "Hand wash only using a mild detergent.",
  "Do not hang the blanket after washing.",
  "Lay flat on a clean surface to air dry.",
  "Do not bleach or tumble dry.",
] as const;

export const TOY_CARE = [
  "Gently hand wash with mild detergent when required.",
  "Do not bleach or use harsh chemicals.",
  "Keep away from sharp objects that may catch the yarn.",
] as const;

export const TOY_THREAD_CARE = [
  "Gently hand wash with mild detergent when required.",
  "Do not bleach or use harsh chemicals.",
  "Keep away from sharp objects that may catch the thread.",
] as const;

export const KEYCHAIN_CARE = [
  "Dust gently with a soft, dry cloth or soft brush.",
] as const;

export const FRAME_CARE = [
  "Wipe with a soft dry cloth.",
  "Keep away from prolonged moisture.",
] as const;

export const FRAME_DESIGNS = [
  {
    slug: "wings-of-joy",
    name: "Wings of Joy",
    subtitle: "Butterfly",
    image: CLOUDINARY.wingsOfJoy,
    imageAlt: "Wings of Joy butterfly nursery frame",
  },
  {
    slug: "cloud-nest",
    name: "Cloud Nest",
    subtitle: "Full Cloud",
    image: CLOUDINARY.cloudNest,
    imageAlt: "Cloud Nest full cloud nursery frame",
  },
  {
    slug: "little-roots",
    name: "Little Roots",
    subtitle: "Frame with Tree",
    image: CLOUDINARY.littleRoots,
    imageAlt: "Little Roots frame with tree detail",
  },
  {
    slug: "memory-nest",
    name: "Memory Nest",
    subtitle: "Without Tree",
    image: CLOUDINARY.memoryNest,
    imageAlt: "Memory Nest keepsake frame without tree",
  },
  {
    slug: "jungle-safari",
    name: "Jungle Safari",
    subtitle: "Semi Cloud",
    image: CLOUDINARY.jungleSafari,
    imageAlt: "Jungle Safari semi cloud nursery frame",
  },
  {
    slug: "rattan-heart",
    name: "Rattan Heart",
    subtitle: "Heart Shape",
    image: CLOUDINARY.rattanHeart,
    imageAlt: "Rattan heart wall frame with crochet details",
  },
] as const;

export const HELP_DESK_FAQS = [
  {
    q: "Is my order confirmed?",
    a: "Once payment is successful through Razorpay, you will receive an order confirmation by email. If you placed a request through our contact form, we will confirm availability and pricing before you pay.",
  },
  {
    q: "When will you ship my order?",
    a: "Handmade pieces typically ship within 3–5 business days after confirmation. We will share tracking details as soon as your parcel leaves our nest.",
  },
  {
    q: "When will my order get delivered?",
    a: "Delivery timelines depend on your location and courier partner. Most orders arrive within 5–10 business days after dispatch. We will keep you updated along the way.",
  },
  {
    q: "How much do you charge for delivery?",
    a: "Shipping is free on orders above ₹999. For orders below ₹999, a standard delivery fee applies at checkout based on your pincode.",
  },
  {
    q: "How do I place bulk orders?",
    a: "For bulk or corporate gifting, write to us through the contact page with quantities, products, and your timeline. We will prepare a custom quote.",
  },
  {
    q: "I don't want the package to carry an invoice/amount as it is a gift. Can this be done?",
    a: "Yes. Mention that your order is a gift in the contact notes or at checkout, and we will omit pricing from the outer packaging. A receipt can be sent separately by email if needed.",
  },
  {
    q: "What is the condition for Same Day Delivery?",
    a: "Same Day Delivery is available for Jaipur addresses on in-stock items ordered before 12 noon, Monday to Saturday, subject to courier availability. Contact us to confirm before ordering.",
  },
  {
    q: "What is the condition for Next Day Delivery (NDD)?",
    a: "Next Day Delivery applies to select pin codes on ready-to-ship items ordered before 2 pm, Monday to Friday. Handmade or customized pieces may need extra time — we will confirm at order placement.",
  },
] as const;

export const PRODUCT_CARE_FAQS = [
  {
    q: "What are the blankets made of?",
    a: "Our crochet baby blankets are handcrafted with premium cotton yarn and include a soft backing lining for everyday comfort.",
  },
  {
    q: "How do I wash a blanket?",
    a: "Hand wash only with mild detergent, lay flat to air dry, and avoid hanging, bleaching, or tumble drying.",
  },
] as const;
