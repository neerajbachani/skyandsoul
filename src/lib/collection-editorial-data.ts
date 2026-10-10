export type CollectionEditorial = {
  romanNumeral: string;
  subheading: string;
  tagline: string;
  craftHighlight: string;
  storyNote: string;
  pills: string[];
  vignette: {
    title: string;
    subtitle: string;
    description: string;
    metricLabel: string;
    metricValue: string;
    quoteAuthor?: string;
  };
  filterTags: string[];
};

export const COLLECTION_EDITORIALS: Record<string, CollectionEditorial> = {
  blankets: {
    romanNumeral: "Collection N° 01",
    subheading: "Nursery Comfort",
    tagline: "Woven with pure cotton yarn for peaceful slumbers and cozy snuggles.",
    craftHighlight: "100% Breathable Combed Cotton · Zero Synthetics · Handcrafted in Jaipur",
    storyNote:
      "Crafted loop by loop by women artisans in Jaipur, our baby blankets are designed to provide cocoon-like warmth without heaviness, transitioning seamlessly from newborn swaddles to treasured childhood heirlooms.",
    pills: [
      "100% Cotton Yarn",
      "Breathable Weave",
      "Soft Cotton Backing",
      "Heirloom Grade",
    ],
    vignette: {
      title: "The 14-Hour Woven Journey",
      subtitle: "Jaipur Atelier Craftsmanship",
      description:
        "Every baby blanket requires over 14 hours of continuous hand-crocheting. Our artisans weave subtle cloud borders and plush textures designed to soothe little fingers.",
      metricLabel: "Time Handcrafted",
      metricValue: "14+ Hours",
      quoteAuthor: "Crafted by master artisans in Vidhyadhar Nagar",
    },
    filterTags: ["All Pieces", "Under ₹2,500", "Bestsellers", "Gift Favorites"],
  },
  toys: {
    romanNumeral: "Collection N° 02",
    subheading: "Playful Companions",
    tagline: "Gentle amigurumi friends lovingly stitched for cuddles and nursery warmth.",
    craftHighlight: "Child-Safe Embroidered Eyes · Hypoallergenic Fill · 100% Cotton Amigurumi",
    storyNote:
      "Every Sky n Soul toy is an heirloom companion with a gentle personality. Handcrafted with safe cotton thread and soft hypoallergenic fiber, made for cuddles, nursery styling, and little hands to hold.",
    pills: [
      "Hypoallergenic Fill",
      "Embroidered Eyes",
      "Washable Cotton",
      "Newborn Safe",
    ],
    vignette: {
      title: "Safe For First Cuddles",
      subtitle: "Thoughtful Amigurumi",
      description:
        "No sharp plastic buttons or metal fasteners. Every expression and detail is gently hand-embroidered with baby-safe cotton thread for complete peace of mind.",
      metricLabel: "Safety Standard",
      metricValue: "100% Baby Safe",
      quoteAuthor: "Lovingly shaped by hand",
    },
    filterTags: ["All Pieces", "Soft Amigurumi", "Pocket Companions", "Gift Favorites"],
  },
  frames: {
    romanNumeral: "Collection N° 03",
    subheading: "Keepsake Art",
    tagline: "Natural wood and delicate 3D crochet accents to frame life's sweetest milestones.",
    craftHighlight: "Solid Wood Craftsmanship · 3D Crochet Motifs · Ready to Hang or Stand",
    storyNote:
      "From nursery arrival plaques to tiny footprints and initial letters, our heirloom frames combine natural wood craft with delicate 3D crochet artistry to commemorate life's most precious beginnings.",
    pills: [
      "Solid Wood Frames",
      "3D Crochet Motifs",
      "Ready to Hang or Stand",
      "Customizable",
    ],
    vignette: {
      title: "Where Memories Live",
      subtitle: "Heirloom Framing",
      description:
        "Celebrate the arrival of new life. Each frame is designed with museum-style depth, pairing solid natural wood with hand-crocheted accents that stay vibrant for years.",
      metricLabel: "Craft Longevity",
      metricValue: "Forever Keepsake",
      quoteAuthor: "Custom made in Jaipur",
    },
    filterTags: ["All Pieces", "Milestone Keepsakes", "Nursery Art", "Wall & Tabletop"],
  },
  "little-extras": {
    romanNumeral: "Collection N° 04",
    subheading: "Artisanal Accents",
    tagline: "Thoughtful tea coaster sets and charm keychains that brighten everyday rituals.",
    craftHighlight: "Sets of 4 & 6 Coasters · Artisan Keychains · Perfect Thoughtful Bundles",
    storyNote:
      "The thoughtful details that complete a home. From vibrant crochet tea coaster sets that brighten morning tea to charming plush keychains, these little extras are crafted with equal devotion.",
    pills: [
      "Sets of 4 & 6",
      "Heat-Resistant Cotton",
      "Artisan Charms",
      "Signature Gift Pouches",
    ],
    vignette: {
      title: "The Joy of Thoughtful Details",
      subtitle: "Daily Warmth",
      description:
        "Woven with durable double-ply cotton yarn to protect tabletops and bring artisan warmth to everyday moments. Packaged in signature cotton pouches.",
      metricLabel: "Pack Options",
      metricValue: "Sets of 4 & 6",
      quoteAuthor: "Handmade with care",
    },
    filterTags: ["All Pieces", "Coaster Sets", "Keychains & Charms", "Under ₹1,000"],
  },
};
