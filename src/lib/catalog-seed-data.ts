import { CLOUDINARY } from "@/lib/catalog-images";
import {
  BLANKET_CARE,
  FRAME_CARE,
  KEYCHAIN_CARE,
  TOY_CARE,
  TOY_THREAD_CARE,
} from "@/lib/catalog-content";

export type SeedProduct = {
  slug: string;
  name: string;
  tagline: string | null;
  description: string;
  material: string | null;
  size: string | null;
  ageRange: string | null;
  features: string[];
  careInstructions: string[];
  images: string[];
  imageAlt: string;
  price: number;
  isFeatured: boolean;
  sortOrder: number;
};

export const BLANKET_META = {
  material: "Premium Cotton Yarn",
  size: "Approximately 35 × 49 inches",
  ageRange: "0–3 Years",
  careInstructions: [...BLANKET_CARE] as string[],
} as const;

export const blanketProducts: Omit<
  SeedProduct,
  "material" | "size" | "ageRange" | "careInstructions"
>[] = [
  {
    slug: "bedtime-buddies",
    name: "Bedtime Buddies",
    tagline: "Wrap Your Little One in Comfort, Every Night.",
    description:
      "Give your little one the gift of warmth, comfort, and peaceful sleep with our Bedtime Buddies Crochet Baby Blanket. Thoughtfully handcrafted with love using premium cotton yarn, this beautifully woven crochet baby blanket is designed to keep your baby cozy during naps, bedtime, tummy time, stroller rides, or cuddle sessions.\n\nMade from soft, breathable cotton crochet, the blanket is gentle on your baby's delicate skin while providing just the right amount of warmth without feeling heavy. It also features a soft backing lining, adding an extra layer of comfort and making it perfect for everyday use.\n\nWhether you're looking for a newborn crochet blanket, a handmade baby blanket, or a thoughtful baby shower gift, Bedtime Buddies is a timeless choice that combines comfort, craftsmanship, and style.\n\nFrom peaceful naps to bedtime snuggles, this handcrafted crochet blanket creates a soothing space where precious memories begin.",
    features: [
      "Handcrafted with premium cotton yarn",
      "Ultra-soft and baby-friendly",
      "Comfortable backing lining for added coziness",
      "Perfect for naps, bedtime & cuddle time",
      "Breathable, lightweight, and gentle on delicate skin",
      "Ideal for babies aged 0–3 years",
    ],
    images: [CLOUDINARY.bedtimeBuddies],
    imageAlt:
      "Bedtime Buddies granny-square crochet blanket with colorful animal faces and a cream scalloped border",
    price: 2999,
    isFeatured: true,
    sortOrder: 1,
  },
  {
    slug: "cozy-cub",
    name: "Cozy Cub",
    tagline: "A Blanket Woven with Warmth, Comfort & Love",
    description:
      "Wrap your little one in the warmth of love with our Cozy Cub Crochet Baby Blanket—thoughtfully handcrafted using premium cotton yarn to make every nap and bedtime feel extra special. This beautifully crafted crochet baby blanket is soft, breathable, and gentle on your baby's delicate skin, offering the perfect balance of comfort and warmth.\n\nDesigned for babies aged 0–3 years, the Cozy Cub Blanket features a soft backing lining that adds an extra layer of coziness, ensuring your little cub enjoys peaceful sleep and comforting cuddle moments. The lightweight cotton crochet blanket provides warmth without feeling heavy, making it ideal for year-round use.\n\nWhether it's bedtime, nap time, tummy time, stroller rides, nursery décor, or snuggles with mom and dad, this handmade crochet baby blanket is the perfect everyday companion.\n\nMore than just a blanket, Cozy Cub is a comforting embrace filled with love, care, and craftsmanship. It also makes a thoughtful baby shower gift, newborn gift, or keepsake for growing little ones.",
    features: [
      "Handcrafted with premium cotton yarn",
      "Ultra-soft and breathable for all-day comfort",
      "Gentle on delicate baby skin",
      "Soft backing lining for enhanced coziness",
      "Perfect for bedtime, naps, cuddles, and stroller use",
      "Lightweight yet warm for year-round comfort",
      "Suitable for babies aged 0–3 years",
    ],
    images: [CLOUDINARY.cozyCub],
    imageAlt:
      "Cozy Cub light blue crochet blanket with bear appliqués covering a baby in a nest",
    price: 2999,
    isFeatured: true,
    sortOrder: 2,
  },
  {
    slug: "rainbow-nest",
    name: "Rainbow Nest",
    tagline: "Where Every Dream Begins in a Cozy Embrace",
    description:
      "Create a warm and comforting space for your little one with our Rainbow Nest Crochet Baby Blanket. Lovingly handcrafted using premium cotton yarn, this beautifully made crochet baby blanket is designed to provide exceptional softness, warmth, and security, making every nap and bedtime a peaceful experience.\n\nPerfect for babies aged 0–3 years, the Rainbow Nest Blanket features a soft backing lining that adds an extra layer of comfort while being gentle on your baby's delicate skin. Made with a breathable cotton crochet, its lightweight construction keeps your little one cozy without feeling heavy, making it perfect for everyday use in every season.\n\nWhether it's nap time, bedtime, tummy time, stroller rides, or cuddle moments, this handmade crochet blanket wraps your baby in comfort—just like a loving hug. Beautifully crafted with care, it's a timeless keepsake and a thoughtful baby shower gift or newborn gift that parents will cherish.",
    features: [
      "Handcrafted with premium cotton yarn",
      "Soft, breathable, and baby-friendly",
      "Gentle on delicate skin",
      "Plush backing lining for extra comfort",
      "Perfect for naps, bedtime, cuddles, and stroller rides",
      "Lightweight yet cozy for year-round use",
      "Designed for babies aged 0–3 years",
    ],
    images: [CLOUDINARY.rainbowNest],
    imageAlt:
      "Rainbow Nest striped crochet baby blanket with cloud appliqués in a kraft gift box",
    price: 3199,
    isFeatured: true,
    sortOrder: 3,
  },
  {
    slug: "dream-keeper",
    name: "Dream Keeper",
    tagline: "Guarding Sweet Dreams, One Cozy Night at a Time",
    description:
      "Give your little one the comfort they deserve with our Dream Keeper Crochet Baby Blanket—beautifully handcrafted using premium cotton yarn to create a soothing and cozy sleep environment. This lovingly made crochet baby blanket is soft, breathable, and gentle on your baby's delicate skin, making it the perfect companion for everyday comfort.\n\nDesigned for babies aged 0–3 years, the Dream Keeper Blanket features a soft backing lining that provides an extra layer of warmth, cushioning, and comfort. Crafted with breathable cotton crochet, it keeps your baby cozy without feeling heavy, making it suitable for year-round use.\n\nWhether it's bedtime, nap time, tummy time, stroller rides, or cuddle sessions, this handmade crochet blanket offers the perfect balance of comfort, care, and timeless craftsmanship.\n\nMore than just a blanket, Dream Keeper is a comforting embrace that helps your little one drift into peaceful, happy dreams. It also makes a thoughtful baby shower gift, newborn gift, or keepsake that families will treasure for years.",
    features: [
      "Handcrafted with premium cotton yarn",
      "Soft, breathable, and gentle on delicate skin",
      "Plush backing lining for added comfort",
      "Lightweight yet warm for everyday use",
      "Perfect for bedtime, naps, cuddles, and stroller rides",
      "Crafted for babies aged 0–3 years",
    ],
    images: [CLOUDINARY.dreamKeeper],
    imageAlt:
      "Dream Keeper striped crochet blanket with owl faces and tassels draped over a white chair",
    price: 3199,
    isFeatured: false,
    sortOrder: 4,
  },
  {
    slug: "butter-cup-bliss",
    name: "Butter Cup Bliss",
    tagline: "Soft as a Bloom, Cozy as a Mother's Embrace",
    description:
      "Wrap your little one in the gentle warmth of our Butter Cup Bliss Crochet Baby Blanket—a beautifully handcrafted crochet blanket designed to make every nap and bedtime extra comforting. Made from premium cotton yarn, this crochet baby blanket is exceptionally soft, breathable, and gentle on your baby's delicate skin.\n\nDesigned especially for babies aged 0–3 years, the Butter Cup Bliss Blanket features a soft backing lining that adds an extra layer of comfort, creating the perfect space for restful sleep and cozy cuddle moments. Crafted with breathable cotton crochet, it provides warmth without feeling heavy, making it ideal for everyday use throughout the year.\n\nWhether it's bedtime, nap time, tummy time, stroller rides, nursery cuddles, or travel, this handmade crochet blanket surrounds your little one with warmth, comfort, and care.\n\nInspired by the softness of blooming buttercups, Butter Cup Bliss is more than just a blanket—it's a comforting hug woven with love. It also makes a thoughtful baby shower gift, newborn gift, or keepsake that families will cherish.",
    features: [
      "Handcrafted with premium cotton yarn",
      "Soft, breathable, and gentle on delicate skin",
      "Plush backing lining for extra comfort",
      "Lightweight yet warm for everyday use",
      "Perfect for bedtime, naps, cuddles, tummy time, and stroller rides",
      "Designed for babies aged 0–3 years",
    ],
    images: [CLOUDINARY.butterCupBliss],
    imageAlt:
      "Butter Cup Bliss lime green crochet blanket with white flower appliqués on a black background",
    price: 3299,
    isFeatured: true,
    sortOrder: 5,
  },
  {
    slug: "tiny-paws",
    name: "Tiny Paws",
    tagline: "Little Paws, Big Comfort, Sweet Dreams.",
    description:
      "Wrap your little bundle of joy in the gentle warmth of our Tiny Paws Crochet Baby Blanket—lovingly handcrafted using premium cotton yarn to provide comfort, security, and peaceful sleep. This beautifully crafted crochet baby blanket is incredibly soft, breathable, and gentle on your baby's delicate skin, making it the perfect everyday essential.\n\nDesigned especially for babies aged 0–3 years, the Tiny Paws Blanket features a soft backing lining that adds an extra layer of coziness, ensuring your little one stays comfortable during naps, bedtime, tummy time, stroller rides, or cuddle sessions. Made with breathable cotton crochet, it is lightweight yet warm, providing year-round comfort without feeling heavy.\n\nThoughtfully handcrafted with love, this handmade crochet blanket is designed to become your baby's favorite companion through every precious milestone and cozy moment.\n\nWith every stitch carefully woven with love, Tiny Paws brings warmth, comfort, and countless cuddles to your little one's journey. It also makes a thoughtful baby shower gift, newborn gift, or cherished keepsake for growing families.",
    features: [
      "Handcrafted with premium cotton yarn",
      "Soft, breathable, and gentle on delicate baby skin",
      "Plush backing lining for enhanced comfort",
      "Lightweight and cozy for year-round use",
      "Perfect for bedtime, nap time, cuddles, tummy time, and stroller rides",
      "Designed for babies aged 0–3 years",
    ],
    images: [CLOUDINARY.tinyPaws],
    imageAlt:
      "Baby wrapped in Tiny Paws light blue crochet blanket with beige bear appliqués",
    price: 2999,
    isFeatured: false,
    sortOrder: 6,
  },
  {
    slug: "dream-raider",
    name: "Dream Raider",
    tagline: "Chasing Sweet Dreams, Wrapping Every Moment in Comfort.",
    description:
      "Give your little one the comfort of peaceful sleep with our Dream Raider Crochet Baby Blanket—carefully handcrafted using premium cotton yarn to bring warmth, softness, and security to every cuddle. This beautifully made crochet baby blanket is soft, breathable, and gentle on your baby's delicate skin, making it the perfect companion from newborn days through toddlerhood.\n\nDesigned for babies aged 0–3 years, the Dream Raider Blanket features a soft backing lining that provides an extra layer of plush comfort. Crafted with breathable cotton crochet, it offers cozy warmth without feeling heavy, making it ideal for everyday use in every season.\n\nWhether it's bedtime, nap time, tummy time, stroller rides, or cozy moments with family, this handmade crochet blanket keeps your little dreamer warm and snug while creating memories that last a lifetime.\n\nInspired by little adventurers who chase big dreams, Dream Raider is more than just a blanket—it's a comforting hug woven with love, care, and timeless craftsmanship. It also makes a thoughtful baby shower gift, newborn gift, or cherished keepsake for growing families.",
    features: [
      "Handcrafted with premium cotton yarn",
      "Ultra-soft, breathable, and baby-friendly",
      "Gentle on delicate baby skin",
      "Plush backing lining for enhanced comfort",
      "Lightweight yet warm for year-round use",
      "Perfect for bedtime, naps, cuddles, stroller rides, and tummy time",
      "Thoughtfully designed for babies aged 0–3 years",
    ],
    images: [CLOUDINARY.dreamRaider],
    imageAlt:
      "Dream Raider pale yellow crochet blanket with white daisy appliqués covering a baby",
    price: 3399,
    isFeatured: false,
    sortOrder: 7,
  },
];

export const toyProducts: SeedProduct[] = [
  {
    slug: "crochet-lion-toy",
    name: "Crochet Lion Toy",
    tagline: "A Little Roar of Love",
    description:
      "Bring home a cuddly little friend with our Handmade Crochet Lion Toy, thoughtfully handcrafted using soft, quality cotton yarn. Designed with adorable details and a playful personality, this charming lion is perfect for little ones to cuddle, play with, or keep as a sweet nursery companion.\n\nMeasuring approximately 9–10 inches, it is the perfect size for little hands while also making a beautiful decorative addition to a child's room. Every piece is lovingly handmade, giving it a unique character and a special handcrafted charm.\n\nA little lion, handmade with love, ready to bring cuddles, smiles, and tiny roars into your little one's world.",
    material: "Cotton Yarn",
    size: "Approximately 9–10 inches",
    ageRange: "0–3 Years",
    features: [
      "Adorable and playful lion design",
      "Handmade using quality cotton yarn",
      "Soft and comforting for little ones",
      "Perfect for cuddles, playtime and nursery décor",
      "A thoughtful handmade gift for kids",
      "Lightweight and easy to carry",
    ],
    careInstructions: [...TOY_CARE],
    images: [CLOUDINARY.crochetLionToy],
    imageAlt: "Handmade crochet lion toy",
    price: 1799,
    isFeatured: true,
    sortOrder: 1,
  },
  {
    slug: "crochet-bear-toy",
    name: "Crochet Bear Toy",
    tagline: "A Little Hug of Love",
    description:
      "Bring home a cuddly little companion made with love! Our Crochet Bear Toy is thoughtfully handcrafted using soft, premium cotton yarn, making it a charming and comforting friend for little ones.\n\nMeasuring approximately 9–10 inches, this adorable bear is perfect for cuddles, playtime, nursery décor, or simply becoming a special keepsake your child can cherish for years.\n\nEvery stitch is carefully crafted to give this little bear its unique charm. More than just a toy, it's a handmade cuddle buddy filled with warmth, love, and memories.\n\nA little bear, handmade with love, ready to bring cuddles, smiles, and endless bear hugs into your little one's world.",
    material: "Cotton Yarn",
    size: "Approximately 9–10 inches",
    ageRange: "0–3 Years",
    features: [
      "Adorable bear design",
      "Handmade using premium cotton yarn",
      "Soft and comforting for little ones",
      "Perfect for cuddles, playtime and nursery décor",
      "A thoughtful handmade gift for kids",
    ],
    careInstructions: [...TOY_CARE],
    images: [CLOUDINARY.crochetBearToy],
    imageAlt: "Handmade crochet bear toy",
    price: 1799,
    isFeatured: true,
    sortOrder: 2,
  },
  {
    slug: "crochet-pilot-bear-toy",
    name: "Crochet Pilot Bear Toy",
    tagline: "A Little Adventure of Love",
    description:
      "Take your little one on a tiny adventure with our Handmade Crochet Pilot Bear Toy, thoughtfully handcrafted using quality thread and filled with charm. Dressed like a little aviator, this adorable bear features a cute blue muffler around its neck and stylish goggles on its head, making it ready for endless imaginary journeys.\n\nMeasuring approximately 6–7 inches, this little pilot is the perfect size for tiny hands to hold, carry, and cuddle. Whether it becomes a playful companion, a nursery décor piece, or a special handmade gift, this charming bear is sure to bring smiles and spark little imaginations.\n\nA little pilot bear, handmade with love, ready to take your little one on cuddly adventures, dreamy journeys, and flights full of imagination.",
    material: "Quality Thread",
    size: "Approximately 6–7 inches",
    ageRange: "0–3 Years",
    features: [
      "Adorable little pilot bear design",
      "Handcrafted with quality thread",
      "Cute blue muffler detail",
      "Charming pilot goggles",
      "Perfect for cuddles, playtime and nursery décor",
      "Lightweight and easy for little hands to carry",
      "A thoughtful handmade gift for kids",
    ],
    careInstructions: [...TOY_THREAD_CARE],
    images: [CLOUDINARY.crochetPilotBearToy],
    imageAlt: "Handmade crochet pilot bear toy with blue muffler and goggles",
    price: 1599,
    isFeatured: false,
    sortOrder: 3,
  },
  {
    slug: "crochet-girl-toy",
    name: "Crochet Girl Toy",
    tagline: "A Little Bundle of Love",
    description:
      "Bring home a sweet little companion with our Handmade Crochet Girl Toy, thoughtfully handcrafted using quality thread and lots of love. Designed with adorable details and a charming personality, this little girl is ready to become your little one's new favorite friend.\n\nMeasuring approximately 7–8 inches, she is the perfect size for little hands to hold, carry, cuddle, and take along on tiny adventures. She also makes a lovely addition to a nursery, playroom, or child's room.\n\nEvery piece is carefully handmade, giving each little girl her own unique character and a special handcrafted charm.\n\nA little girl, handmade with love, ready to bring sweet smiles, warm cuddles, and a little extra magic into your little one's world.",
    material: "Quality Thread",
    size: "Approximately 7–8 inches",
    ageRange: "0–3 Years",
    features: [
      "Adorable and charming girl design",
      "Handmade using quality thread",
      "Soft, lightweight and comforting",
      "Perfect for cuddles, pretend play and nursery décor",
      "A thoughtful handmade gift for kids",
      "Easy for little hands to hold and carry",
    ],
    careInstructions: [...TOY_THREAD_CARE],
    images: [CLOUDINARY.crochetGirlToy],
    imageAlt: "Handmade crochet girl toy",
    price: 1599,
    isFeatured: false,
    sortOrder: 4,
  },
  {
    slug: "crochet-boy-toy",
    name: "Crochet Boy Toy",
    tagline: "A Little Bundle of Joy",
    description:
      "Bring home a sweet little companion with our Handmade Crochet Boy Toy, thoughtfully handcrafted using quality thread and lots of love. Designed with adorable details and a playful personality, this charming little boy is ready to become your little one's new favorite friend.\n\nMeasuring approximately 7–8 inches, he is the perfect size for little hands to hold, carry, cuddle, and take along on tiny adventures. He also makes a lovely addition to a nursery, playroom, or child's room.\n\nEvery piece is carefully handmade, giving each little boy his own unique character and a special handcrafted charm.\n\nA little boy, handmade with love, ready to bring giggles, cuddles, and playful adventures into your little one's world.",
    material: "Quality Thread",
    size: "Approximately 7–8 inches",
    ageRange: "0–3 Years",
    features: [
      "Adorable and playful boy design",
      "Handmade using quality thread",
      "Soft, lightweight and comforting",
      "Perfect for cuddles, pretend play and nursery décor",
      "A thoughtful handmade gift for kids",
      "Easy for little hands to hold and carry",
    ],
    careInstructions: [...TOY_THREAD_CARE],
    images: [CLOUDINARY.crochetBoyToy],
    imageAlt: "Handmade crochet boy toy",
    price: 1599,
    isFeatured: false,
    sortOrder: 5,
  },
];

export const frameProducts: SeedProduct[] = [
  {
    slug: "wings-of-joy",
    name: "Wings of Joy",
    tagline: "Butterfly keepsake frame",
    description:
      "A delicate butterfly-inspired nursery frame designed to hold your sweetest first moments. Wings of Joy brings gentle movement and warmth to any wall or shelf.",
    material: "Handcrafted frame",
    size: "Nursery wall frame",
    ageRange: null,
    features: [
      "Butterfly-inspired design",
      "Perfect for milestone photos",
      "Pairs beautifully with Frame It Your Way",
      "Gift-ready presentation",
    ],
    careInstructions: [...FRAME_CARE],
    images: [CLOUDINARY.wingsOfJoy],
    imageAlt: "Wings of Joy butterfly nursery frame",
    price: 3499,
    isFeatured: true,
    sortOrder: 1,
  },
  {
    slug: "cloud-nest",
    name: "Cloud Nest",
    tagline: "Full cloud nursery frame",
    description:
      "Soft, dreamy, and full of cloud-like charm — Cloud Nest frames your little one's world in a gentle embrace of white and sky.",
    material: "Handcrafted frame",
    size: "Nursery wall frame",
    ageRange: null,
    features: [
      "Full cloud silhouette design",
      "Ideal for newborn portraits",
      "Soft neutral palette for any nursery",
      "Available through Frame It Your Way",
    ],
    careInstructions: [...FRAME_CARE],
    images: [CLOUDINARY.cloudNest],
    imageAlt: "Cloud Nest full cloud nursery frame",
    price: 3299,
    isFeatured: false,
    sortOrder: 2,
  },
  {
    slug: "little-roots",
    name: "Little Roots",
    tagline: "Frame with tree detail",
    description:
      "Rooted in love — this frame features a gentle tree motif, symbolizing growth, family, and the moments that branch into forever memories.",
    material: "Handcrafted frame",
    size: "Nursery wall frame",
    ageRange: null,
    features: [
      "Tree-inspired frame design",
      "Warm, natural aesthetic",
      "Perfect for family keepsakes",
      "Customizable through Frame It Your Way",
    ],
    careInstructions: [...FRAME_CARE],
    images: [CLOUDINARY.littleRoots],
    imageAlt: "Little Roots frame with tree detail",
    price: 3299,
    isFeatured: false,
    sortOrder: 3,
  },
  {
    slug: "memory-nest",
    name: "Memory Nest",
    tagline: "Without tree — pure keepsake frame",
    description:
      "A clean, timeless frame designed to let your memories take center stage. Memory Nest holds first smiles and forever moments without distraction.",
    material: "Handcrafted frame",
    size: "Nursery wall frame",
    ageRange: null,
    features: [
      "Minimal, timeless silhouette",
      "Without tree detail for a clean look",
      "Ideal for photos and small keepsakes",
      "Part of the Frame It Your Way collection",
    ],
    careInstructions: [...FRAME_CARE],
    images: [CLOUDINARY.memoryNest, CLOUDINARY.memoryNestAlt],
    imageAlt: "Memory Nest keepsake frame without tree",
    price: 3199,
    isFeatured: true,
    sortOrder: 4,
  },
  {
    slug: "jungle-safari",
    name: "Jungle Safari",
    tagline: "Semi cloud adventure frame",
    description:
      "A playful semi-cloud frame with safari spirit — perfect for nurseries that celebrate little explorers and wild imaginations.",
    material: "Handcrafted frame",
    size: "Nursery wall frame",
    ageRange: null,
    features: [
      "Semi-cloud safari-inspired design",
      "Pairs with crochet animal toys",
      "Adventure-ready nursery aesthetic",
      "Customizable through Frame It Your Way",
    ],
    careInstructions: [...FRAME_CARE],
    images: [CLOUDINARY.jungleSafari],
    imageAlt: "Jungle Safari semi cloud nursery frame",
    price: 3299,
    isFeatured: false,
    sortOrder: 5,
  },
  {
    slug: "rattan-heart",
    name: "Rattan Heart",
    tagline: "Heart-shaped keepsake frame",
    description:
      "A warm rattan heart frame that wraps your dearest memories in love. Rattan Heart is a nursery favorite for photos, tiny treasures, and handmade companions.",
    material: "Rattan and handcrafted details",
    size: "Heart wall frame",
    ageRange: null,
    features: [
      "Heart-shaped rattan design",
      "Warm natural texture",
      "Ideal for photos and small crochet toys",
      "Signature Sky n Soul frame style",
    ],
    careInstructions: [...FRAME_CARE],
    images: [CLOUDINARY.rattanHeart],
    imageAlt: "Rattan heart wall frame with crochet details",
    price: 3599,
    isFeatured: true,
    sortOrder: 6,
  },
];

export const extraProducts: SeedProduct[] = [
  {
    slug: "crochet-tea-coaster",
    name: "Crochet Tea Coaster",
    tagline: "A Little Frame for Your Everyday Moments.",
    description:
      "Turn your everyday tea and coffee breaks into something a little more special with our Photo Frame Crochet Tea Coaster — a beautifully handcrafted piece designed to bring warmth, charm, and personality to your table.\n\nInspired by the look of a classic photo frame, this crochet coaster adds a decorative touch while keeping your surfaces protected from cups and mugs. Carefully handmade with quality cotton yarn, its textured crochet finish brings a cozy, artisanal feel to your home.\n\nWhether placed beside your morning chai, afternoon coffee, or styled as a little accent on your coffee table, it effortlessly blends functionality with beautiful handmade design.\n\nHandcrafted with love — a little care keeps it beautiful for longer.",
    material: "Premium Cotton Yarn",
    size: "Coaster size",
    ageRange: null,
    features: [
      "Unique photo-frame-inspired design",
      "Beautifully handcrafted with cotton yarn",
      "Perfect for tea, coffee and everyday beverages",
      "Adds a decorative and elegant touch to your table",
      "Makes a thoughtful handmade gift",
      "Perfect for coffee tables, bedside tables and workspaces",
    ],
    careInstructions: [...KEYCHAIN_CARE],
    images: [CLOUDINARY.teaCoaster],
    imageAlt: "Photo frame inspired crochet tea coaster",
    price: 399,
    isFeatured: true,
    sortOrder: 1,
  },
  {
    slug: "giraffe-keychain",
    name: "Giraffe Crochet Keychain",
    tagline: "A Little Buddy to Take Everywhere",
    description:
      "Add a touch of handmade cuteness to your everyday essentials with our Giraffe Crochet Keychain, lovingly handcrafted to bring a little joy wherever you go.\n\nMade with soft, quality Thread, this adorable giraffe is carefully crocheted with attention to every tiny detail. Its compact size makes it perfect for attaching to your keys, handbag, backpack, diaper bag, or even gifting to someone special.\n\nAt approximately 4–5 inches, it's small enough to carry everywhere while being big enough to stand out as a charming little accessory.\n\nA tiny giraffe, handcrafted with love, ready to tag along on every little adventure.",
    material: "Thread",
    size: "Approximately 4–5 inches",
    ageRange: null,
    features: [
      "Cute giraffe-inspired design",
      "Handcrafted with quality Thread",
      "Perfect for keys, handbags and backpacks",
      "Easy to carry and lightweight",
      "A thoughtful handmade gift for kids and animal lovers",
      "Each piece has its own unique handmade character",
    ],
    careInstructions: [...KEYCHAIN_CARE],
    images: [CLOUDINARY.giraffeKeychain],
    imageAlt: "Giraffe crochet keychain",
    price: 499,
    isFeatured: false,
    sortOrder: 2,
  },
  {
    slug: "doll-keychain",
    name: "Doll Crochet Keychain",
    tagline: "A Tiny Friend to Carry Everywhere",
    description:
      "Meet our adorable Doll Crochet Keychain, lovingly handcrafted to add a little charm to your everyday essentials. Carefully crocheted with soft, quality Thread, this tiny doll is made with attention to every little detail.\n\nAt approximately 4–5 inches, it's the perfect size to attach to your keys, handbag, backpack, diaper bag, or school bag. Whether you're treating yourself or gifting someone special, this little handmade companion is sure to bring a smile.\n\nSmall in size, big on charm — a little handmade friend for every adventure.",
    material: "Thread",
    size: "Approximately 4–5 inches",
    ageRange: null,
    features: [
      "Cute doll-inspired design",
      "Lovingly handcrafted with quality Thread",
      "Perfect for keys, handbags, backpacks & bags",
      "Lightweight and easy to carry",
      "A charming handmade gift for kids and loved ones",
      "Each piece carries the unique charm of being handmade",
    ],
    careInstructions: [...KEYCHAIN_CARE],
    images: [CLOUDINARY.dollKeychain],
    imageAlt: "Doll crochet keychain",
    price: 499,
    isFeatured: false,
    sortOrder: 3,
  },
  {
    slug: "lion-keychain",
    name: "Lion Crochet Keychain",
    tagline: "A Little Roar of Cuteness",
    description:
      "Bring a tiny touch of wild charm to your everyday essentials with our Lion Crochet Keychain, thoughtfully handcrafted with love and care.\n\nMade from soft, quality Thread, this adorable little lion is carefully crocheted to capture its playful character and charming details. Measuring approximately 4–5 inches, it's perfectly sized to carry along on your keys, handbag, backpack, diaper bag, or school bag.\n\nWhether you're adding it to your own collection or gifting it to a little one, this handmade lion makes every bag a little more fun!\n\nA little lion, a little love, and a whole lot of handmade charm.",
    material: "Thread",
    size: "Approximately 4–5 inches",
    ageRange: null,
    features: [
      "Adorable lion-inspired design",
      "Handcrafted with quality Thread",
      "Perfect for keys, handbags, backpacks & bags",
      "Lightweight and easy to carry",
      "A cute handmade gifting option",
      "Every piece has its own unique handmade character",
    ],
    careInstructions: [...KEYCHAIN_CARE],
    images: [CLOUDINARY.lionKeychain],
    imageAlt: "Lion crochet keychain",
    price: 499,
    isFeatured: false,
    sortOrder: 4,
  },
  {
    slug: "donkey-keychain",
    name: "Donkey Crochet Keychain",
    tagline: "A Little Bundle of Handmade Charm",
    description:
      "Add a fun and adorable touch to your everyday essentials with our Donkey Crochet Keychain, lovingly handcrafted to bring a smile wherever it goes.\n\nMade with soft, quality Thread, this charming little donkey is carefully crocheted with attention to every tiny detail. Measuring approximately 4–5 inches, it's the perfect size to attach to your keys, handbag, backpack, school bag, or diaper bag.\n\nWhether you're looking for a cute accessory for yourself or a thoughtful handmade gift, this little donkey is ready to become your everyday companion.\n\nA tiny donkey with a big personality, handcrafted to tag along on all your little adventures.",
    material: "Thread",
    size: "Approximately 4–5 inches",
    ageRange: null,
    features: [
      "Adorable donkey-inspired design",
      "Lovingly handcrafted with quality Thread",
      "Perfect for keys, handbags, backpacks & bags",
      "Lightweight and easy to carry",
      "A charming handmade gifting option",
      "Each piece has its own unique handmade character",
    ],
    careInstructions: [...KEYCHAIN_CARE],
    images: [CLOUDINARY.donkeyKeychain],
    imageAlt: "Donkey crochet keychain",
    price: 499,
    isFeatured: false,
    sortOrder: 5,
  },
  {
    slug: "dog-keychain",
    name: "Dog Crochet Keychain",
    tagline: "Your Little Everyday Companion",
    description:
      "Add a little paw-some charm to your everyday essentials with our Dog Crochet Keychain, lovingly handcrafted with care and attention to detail.\n\nMade using soft, quality Thread, this adorable little dog is carefully crocheted to bring a playful and heartwarming touch wherever you take it. Measuring approximately 4–5 inches, it is the perfect size for your keys, handbag, backpack, school bag, or diaper bag.\n\nWhether you're a dog lover or simply love cute handmade accessories, this little companion makes a delightful addition to your collection and a thoughtful gift for someone special.\n\nA tiny bundle of paws, love, and handmade happiness—ready to go wherever you do.",
    material: "Thread",
    size: "Approximately 4–5 inches",
    ageRange: null,
    features: [
      "Cute dog-inspired design",
      "Handcrafted with quality Thread",
      "Perfect for keys, handbags, backpacks & bags",
      "Lightweight and easy to carry",
      "A lovely handmade gifting option",
      "Each piece has its own unique handmade charm",
    ],
    careInstructions: [...KEYCHAIN_CARE],
    images: [CLOUDINARY.dogKeychain],
    imageAlt: "Dog crochet keychain",
    price: 499,
    isFeatured: false,
    sortOrder: 6,
  },
  {
    slug: "bunny-keychain",
    name: "Bunny Crochet Keychain",
    tagline: "A Little Bundle of Cuteness",
    description:
      "Add a sweet touch of handmade charm to your everyday essentials with our Bunny Crochet Keychain, lovingly handcrafted to bring a little joy wherever you go.\n\nMade using soft, quality Thread, this adorable bunny is carefully crocheted with attention to every tiny detail. Measuring approximately 4–5 inches, it is perfectly sized to hang on your keys, handbag, backpack, school bag, or diaper bag.\n\nWhether you're a bunny lover, looking for a cute accessory, or searching for a thoughtful handmade gift, this little bunny is sure to make every day a little more cheerful.\n\nA tiny bunny, handcrafted with love, ready to hop along on every little adventure.",
    material: "Thread",
    size: "Approximately 4–5 inches",
    ageRange: null,
    features: [
      "Adorable bunny-inspired design",
      "Lovingly handcrafted with quality Thread",
      "Perfect for keys, handbags, backpacks & bags",
      "Lightweight and easy to carry",
      "A charming handmade gifting option",
      "Each piece has its own unique handmade character",
    ],
    careInstructions: [...KEYCHAIN_CARE],
    images: [CLOUDINARY.bunnyKeychain],
    imageAlt: "Bunny crochet keychain",
    price: 499,
    isFeatured: false,
    sortOrder: 7,
  },
  {
    slug: "stitch-keychain",
    name: "Stitch Crochet Keychain",
    tagline: "A Little Bundle of Mischief",
    description:
      "Bring home a little Stitch-inspired charm with this adorable handmade crochet keychain. Lovingly handcrafted with soft, quality Thread, this playful character is designed with attention to every little detail—from its big ears and bright eyes to its cheerful expression.\n\nMeasuring approximately 4–5 inches, it's the perfect size to add a fun touch to your keys, handbag, backpack, school bag, or travel bag. A delightful accessory for fans of cute characters and a thoughtful handmade gift for someone special.\n\nA little blue buddy to add a whole lot of fun to your everyday adventures!",
    material: "Thread",
    size: "Approximately 4–5 inches",
    ageRange: null,
    features: [
      "Cute Stitch-inspired design",
      "Handmade with quality Thread",
      "Perfect for keys, handbags and backpacks",
      "Lightweight and easy to carry",
      "Great gifting option for character lovers",
      "Each handmade piece has its own unique charm",
    ],
    careInstructions: [...KEYCHAIN_CARE],
    images: [CLOUDINARY.stitchKeychain],
    imageAlt: "Stitch crochet keychain",
    price: 549,
    isFeatured: false,
    sortOrder: 8,
  },
];

export const categorySeedData = [
  {
    slug: "blankets",
    name: "Blankets",
    description:
      "Handcrafted crochet baby blankets woven with premium cotton yarn — soft, breathable, and made for every nap and bedtime cuddle.",
    image: CLOUDINARY.categoryBlankets,
    imageAlt:
      "Rainbow Nest striped crochet baby blanket with cloud appliqués in a kraft gift box",
    sortOrder: 1,
  },
  {
    slug: "toys",
    name: "Toys",
    description:
      "Soft crochet companions made by hand for play, comfort, and keepsake moments.",
    image: CLOUDINARY.categoryToys,
    imageAlt:
      "Handmade crochet safari animals and personalized nursery keepsake",
    sortOrder: 2,
  },
  {
    slug: "frames",
    name: "Frames",
    description:
      "Thoughtful frames designed to hold first smiles, tiny footprints, and forever memories.",
    image: CLOUDINARY.categoryFrames,
    imageAlt: "Memory Nest keepsake frame with crochet details",
    sortOrder: 3,
  },
  {
    slug: "frame-it-your-way",
    name: "Frame It Your Way",
    description:
      "Personalize a keepsake in five gentle steps — choose a frame, pick a toy, add a name, preview, and purchase.",
    image: CLOUDINARY.categoryFrameItYourWay,
    imageAlt:
      "Personalized cloud nursery frame with crochet animals and a name plaque",
    sortOrder: 4,
  },
  {
    slug: "little-extras",
    name: "Little Extras",
    description:
      "Tea coasters and crochet keychains — small thoughtful pieces that complete the nursery nest.",
    image: CLOUDINARY.categoryLittleExtras,
    imageAlt: "Bunny crochet keychain",
    sortOrder: 5,
  },
] as const;
