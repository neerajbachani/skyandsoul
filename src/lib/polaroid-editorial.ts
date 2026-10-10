import type { SpotlightProduct } from "@/lib/types";
import type { PolaroidEditorialMeta } from "@/components/PolaroidStackSlider";

const PRODUCT_EDITORIALS: Record<string, Partial<PolaroidEditorialMeta>> = {
  "bedtime-buddies": {
    eyebrow: "01 · Handcrafted Blanket",
    title: "Bed Time Buddies",
    description:
      "Playful animal faces nestled into pastel cotton granny squares, finished with a scalloped border.",
    detailTitle: "100% Cotton Yarn",
    detailDescription:
      "Breathable cotton weave with soft backing lining for all-night cozy comfort.",
    tag: "Heirloom Warmth",
  },
  "cozy-cub": {
    eyebrow: "02 · Striped Blanket",
    title: "Cozy Cub",
    description:
      "Warm terracotta, mustard, and olive stripes centering a sweet hand-stitched lion cub.",
    detailTitle: "Corner Tassel Accents",
    detailDescription:
      "Lightweight yet cozy cotton knit designed to soothe baby from newborn to toddler years.",
    tag: "Playful Companion",
  },
  "rainbow-nest": {
    eyebrow: "03 · Nursery Blanket",
    title: "Rainbow Nest",
    description:
      "Soft pastel rainbow stripes with fluffy cloud appliqués, crafted for serene slumber.",
    detailTitle: "Dual-Layer Softness",
    detailDescription:
      "Plush cotton backing adds gentle warmth without weight, ideal for all seasons.",
    tag: "Cloudlike Cuddle",
  },
  "dream-keeper": {
    eyebrow: "04 · Keepsake Blanket",
    title: "Dream Keeper",
    description:
      "Calming sky blues and earthy tones with endearing owl details to watch over sweet dreams.",
    detailTitle: "Artisanal Knotting",
    detailDescription:
      "Hand-knitted with hypoallergenic fibers that feel delightfully tender against sensitive skin.",
    tag: "Sweet Slumber",
  },
  "butter-cup-bliss": {
    eyebrow: "05 · Floral Blanket",
    title: "Butter Cup Bliss",
    description:
      "Radiant blooming white daisies on cheerful meadow green, bringing springtime into the crib.",
    detailTitle: "Organic Cotton Touch",
    detailDescription:
      "Breathable cotton crochet with reinforced edge stitching made to be cherished for years.",
    tag: "Sunny Slumber",
  },
  "tiny-paws": {
    eyebrow: "06 · Keepsake Blanket",
    title: "Tiny Paws",
    description:
      "Soft sky blue blanket decorated with adorable teddy bear appliqués for peaceful naptime.",
    detailTitle: "Tender Weave",
    detailDescription:
      "Gentle on delicate skin with double-lined backing for stroller rides and snuggles.",
    tag: "First Moments",
  },
  "lavender-bliss": {
    eyebrow: "07 · Pastel Blanket",
    title: "Lavender Bliss",
    description:
      "Calming lilac tones with hand-stitched cream daisy motifs and a scalloped finish.",
    detailTitle: "Soothing Palette",
    detailDescription:
      "Feather-soft cotton yarn made to create a serene nursery sanctuary.",
    tag: "Gentle Slumber",
  },
  "crochet-lion-toy": {
    eyebrow: "Amigurumi Toy",
    title: "Simba Lion Toy",
    description:
      "A royal little companion with a hand-looped mane, sized for tiny hands to clasp and hug.",
    detailTitle: "Child-Safe Cotton",
    detailDescription:
      "Firmly crocheted with hypoallergenic stuffing to withstand endless playroom adventures.",
    tag: "Loyal Friend",
  },
  "simba-lion-toy": {
    eyebrow: "Amigurumi Toy",
    title: "Simba Lion Toy",
    description:
      "A royal little companion with a hand-looped mane, sized for tiny hands to clasp and hug.",
    detailTitle: "Child-Safe Cotton",
    detailDescription:
      "Firmly crocheted with hypoallergenic stuffing to withstand endless playroom adventures.",
    tag: "Loyal Friend",
  },
  "crochet-bear-toy": {
    eyebrow: "Amigurumi Toy",
    title: "Marshmallow Bear",
    description:
      "The sweetest bedtime buddy with sleepy embroidered eyes and snuggly teddy charm.",
    detailTitle: "Tactile Comfort",
    detailDescription:
      "Handmade from soft premium yarn that brings warmth to nursery snuggles and milestones.",
    tag: "Tender Hugs",
  },
  "marshmallow-bear-toy": {
    eyebrow: "Amigurumi Toy",
    title: "Marshmallow Bear",
    description:
      "The sweetest bedtime buddy with sleepy embroidered eyes and snuggly teddy charm.",
    detailTitle: "Tactile Comfort",
    detailDescription:
      "Handmade from soft premium yarn that brings warmth to nursery snuggles and milestones.",
    tag: "Tender Hugs",
  },
  "wings-of-joy": {
    eyebrow: "Nursery Keepsake",
    title: "Wings of Joy",
    description:
      "Whimsical 3D crochet butterfly frame crafted to celebrate newborn milestones.",
    detailTitle: "Handmade Nursery Art",
    detailDescription:
      "Mounted in a natural wooden frame, ready to hang above the crib or dresser.",
    tag: "Artisanal Frame",
  },
  "cloud-nest": {
    eyebrow: "Personalized Frame",
    title: "Cloud Nest",
    description:
      "A little pilot bear floating with balloons in a cloud-shaped wooden memory frame.",
    detailTitle: "Custom Keepsake",
    detailDescription:
      "Personalized with your little one's name in bold script, made to be kept forever.",
    tag: "Storybook Art",
  },
  "little-roots": {
    eyebrow: "Memory Keepsake",
    title: "Tree of Love Frame",
    description:
      "Intricately crocheted tree with floral blossoms, balloons, and playful animal figures.",
    detailTitle: "Wood & Yarn Craft",
    detailDescription:
      "A handcrafted tableau preserving family memories and your child's name in 3D art.",
    tag: "Cherished Roots",
  },
  "cotton-candy-bunny-keychain": {
    eyebrow: "Pocket Companion",
    title: "Cotton Candy Bunny",
    description:
      "A palm-sized bunny with floppy ears to bring a touch of childlike joy everywhere.",
    detailTitle: "Sturdy Brass Ring",
    detailDescription:
      "Hand-crocheted in rose petal pink with tight, durable stitching.",
    tag: "Everyday Charm",
  },
  "customized-crochet-tea-coaster": {
    eyebrow: "Tabletop Heirloom",
    title: "Crochet Tea Coasters",
    description:
      "Whimsical floral coasters handcrafted from heat-friendly, washable cotton threads.",
    detailTitle: "Set of 4 or 6",
    detailDescription:
      "Add warm, rustic handmade elegance to morning coffee and tea rituals.",
    tag: "Artisanal Table",
  },
  "crochet-tea-coasters-set-of-4": {
    eyebrow: "Tabletop Heirloom",
    title: "Crochet Tea Coasters",
    description:
      "Whimsical floral coasters handcrafted from heat-friendly, washable cotton threads.",
    detailTitle: "Set of 4",
    detailDescription:
      "Add warm, rustic handmade elegance to morning coffee and tea rituals.",
    tag: "Artisanal Table",
  },
};

export function getProductEditorial(
  product: SpotlightProduct,
  index: number,
): PolaroidEditorialMeta {
  const match = PRODUCT_EDITORIALS[product.slug];
  if (match) {
    return {
      eyebrow: match.eyebrow ?? `${String(index + 1).padStart(2, "0")} · Heirloom`,
      title: match.title ?? product.name,
      description: match.description ?? product.imageAlt ?? "",
      detailTitle: match.detailTitle ?? "Pure Cotton Yarn",
      detailDescription:
        match.detailDescription ??
        "Lovingly hand-crocheted for gentle everyday moments.",
      tag: match.tag ?? "Handcrafted",
    };
  }

  const categoryName =
    typeof product.category === "string"
      ? product.category
      : product.category?.name || "Handcrafted";

  let tag = "Artisanal Piece";
  if (/blanket/i.test(product.name) || /blanket/i.test(categoryName)) tag = "Heirloom Warmth";
  else if (/toy/i.test(product.name) || /toy/i.test(categoryName)) tag = "Cuddle Companion";
  else if (/frame/i.test(product.name) || /frame/i.test(categoryName)) tag = "Nursery Keepsake";
  else if (/coaster/i.test(product.name)) tag = "Tabletop Art";

  let detail = "100% Premium Cotton Yarn";
  if (/frame/i.test(product.name)) detail = "Natural Wood & Crochet";

  return {
    eyebrow: `${String(index + 1).padStart(2, "0")} · ${categoryName}`,
    title: product.name,
    description:
      product.imageAlt ||
      "Thoughtfully handcrafted with premium cotton yarn, designed to be loved and cherished.",
    detailTitle: detail,
    detailDescription:
      product.price > 0
        ? `Hand-woven with tender love and care. Starting at ₹${product.price.toLocaleString("en-IN")}.`
        : "Hand-woven with tender love and care for your little one.",
    tag,
  };
}
