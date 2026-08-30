import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CARE = [
  "Hand wash only using a mild detergent.",
  "Do not hang the blanket after washing.",
  "Lay flat on a clean surface to air dry.",
  "Do not bleach or tumble dry.",
];

const BLANKET_META = {
  material: "Premium Cotton Yarn",
  size: "Approximately 35 × 49 inches",
  ageRange: "0–3 Years",
  careInstructions: CARE,
} as const;

async function main() {
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const blankets = await prisma.category.create({
    data: {
      slug: "blankets",
      name: "Blankets",
      description:
        "Handcrafted crochet baby blankets woven with premium cotton yarn — soft, breathable, and made for every nap and bedtime cuddle.",
      image:
        "https://res.cloudinary.com/dix9x012c/image/upload/v1788113430/IMG_20260825_165049_b5lmu6.jpg",
      imageAlt:
        "Rainbow Nest striped crochet baby blanket with cloud appliqués in a kraft gift box",
      sortOrder: 1,
    },
  });

  const toys = await prisma.category.create({
    data: {
      slug: "toys",
      name: "Toys",
      description:
        "Soft crochet companions made by hand for play, comfort, and keepsake moments.",
      image:
        "https://res.cloudinary.com/dix9x012c/image/upload/v1788113442/IMG_20260830_225100_qth2a7.jpg",
      imageAlt:
        "Handmade crochet safari animals and personalized nursery keepsake",
      sortOrder: 2,
    },
  });

  const frames = await prisma.category.create({
    data: {
      slug: "frames",
      name: "Frames",
      description:
        "Thoughtful frames designed to hold first smiles, tiny footprints, and forever memories.",
      image:
        "https://res.cloudinary.com/dix9x012c/image/upload/v1788113429/IMG-20260623-WA0057_rkkce3.jpg",
      imageAlt:
        "Rattan heart wall frame with crochet ballerina, flowers, and fairy lights",
      sortOrder: 3,
    },
  });

  await prisma.category.create({
    data: {
      slug: "frame-it-your-way",
      name: "Frame It Your Way",
      description:
        "Personalize a keepsake in five gentle steps — choose a frame, pick a toy, add a name, preview, and order when checkout opens.",
      image:
        "https://res.cloudinary.com/dix9x012c/image/upload/v1788113426/IMG_20260830_225354_dmtjrm.jpg",
      imageAlt:
        "Personalized cloud nursery frame with crochet animals and a name plaque",
      sortOrder: 4,
    },
  });

  const extras = await prisma.category.create({
    data: {
      slug: "little-extras",
      name: "Little Extras",
      description:
        "Small thoughtful pieces that complete the nursery nest — rattles, wraps, and everyday comforts.",
      image:
        "https://res.cloudinary.com/dix9x012c/image/upload/v1788113427/IMG_20260830_230055_txwtvr.jpg",
      imageAlt: "Handmade nursery keepsake from the Little Extras collection",
      sortOrder: 5,
    },
  });

  const blanketProducts = [
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
      images: [
        "https://res.cloudinary.com/dix9x012c/image/upload/v1788113433/IMG_20260828_205957_kzj0ky.jpg",
      ],
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
      images: [
        "https://res.cloudinary.com/dix9x012c/image/upload/v1788113434/IMG_20260828_205339_l9lu2d.jpg",
      ],
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
      images: [
        "https://res.cloudinary.com/dix9x012c/image/upload/v1788113430/IMG_20260825_165049_b5lmu6.jpg",
      ],
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
      images: [
        "https://res.cloudinary.com/dix9x012c/image/upload/v1788113424/IMG_20260828_205140_xypyrn.jpg",
      ],
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
      images: [
        "https://res.cloudinary.com/dix9x012c/image/upload/v1788113428/IMG-20260812-WA0019_nhmex2.jpg",
      ],
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
      images: [
        "https://res.cloudinary.com/dix9x012c/image/upload/v1788113425/IMG_20260828_205551_wo1qbs.jpg",
      ],
      imageAlt:
        "Tiny Paws personalized nursery shadow box with a crochet girl and fluffy dog on a swing",
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
      images: [
        "https://res.cloudinary.com/dix9x012c/image/upload/v1788113433/WhatsApp_Image_2026-08-30_at_22.48.19_b6uxfq.jpg",
      ],
      imageAlt:
        "Dream Raider pale yellow crochet blanket with white daisy appliqués covering a baby",
      price: 3399,
      isFeatured: false,
      sortOrder: 7,
    },
  ];

  for (const product of blanketProducts) {
    await prisma.product.create({
      data: {
        ...product,
        ...BLANKET_META,
        categoryId: blankets.id,
      },
    });
  }

  await prisma.product.createMany({
    data: [
      {
        slug: "little-fox-companion",
        name: "Little Fox Companion",
        tagline: "A soft friend for every adventure.",
        description:
          "Hand-crocheted fox companion made for gentle play and nursery cuddles. Soft, safe, and ready to become a first favorite.",
        material: "Premium Cotton Yarn",
        size: "Approximately 8 inches tall",
        ageRange: "0–3 Years",
        features: [
          "Handcrafted crochet construction",
          "Soft and baby-friendly yarn",
          "Perfect nursery companion",
        ],
        careInstructions: [
          "Spot clean with mild soap.",
          "Air dry flat.",
          "Do not bleach or tumble dry.",
        ],
        images: [
          "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=1200&q=80",
        ],
        imageAlt: "Handmade crochet fox toy",
        price: 1499,
        categoryId: toys.id,
        isFeatured: true,
        sortOrder: 1,
      },
      {
        slug: "cloud-bunny",
        name: "Cloud Bunny",
        tagline: "Soft ears, softer hugs.",
        description:
          "A cozy crochet bunny with cloud-soft texture — made for stroller rides, bedtime, and quiet afternoons.",
        material: "Premium Cotton Yarn",
        size: "Approximately 7 inches tall",
        ageRange: "0–3 Years",
        features: [
          "Handcrafted with care",
          "Lightweight and cuddly",
          "Thoughtful baby shower gift",
        ],
        careInstructions: [
          "Spot clean with mild soap.",
          "Air dry flat.",
          "Do not bleach or tumble dry.",
        ],
        images: [
          "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=1200&q=80",
        ],
        imageAlt: "Soft handmade nursery toy",
        price: 1399,
        categoryId: toys.id,
        isFeatured: false,
        sortOrder: 2,
      },
      {
        slug: "first-smile-frame",
        name: "First Smile Frame",
        tagline: "Hold the moment that started it all.",
        description:
          "A warm wooden frame designed for first portraits and milestone photographs — simple, timeless, and nursery-ready.",
        material: "Natural wood",
        size: "Fits 5 × 7 inch photo",
        ageRange: null,
        features: [
          "Natural wood finish",
          "Ready to display",
          "Pairs beautifully with Frame It Your Way",
        ],
        careInstructions: [
          "Wipe with a soft dry cloth.",
          "Keep away from prolonged moisture.",
        ],
        images: [
          "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=1200&q=80",
        ],
        imageAlt: "Wooden photo frame",
        price: 1299,
        categoryId: frames.id,
        isFeatured: false,
        sortOrder: 1,
      },
      {
        slug: "tiny-footprints-frame",
        name: "Tiny Footprints Frame",
        tagline: "A quiet place for forever keepsakes.",
        description:
          "Designed for footprint prints and early memories — a soft-edged frame that belongs on any nursery shelf.",
        material: "Natural wood",
        size: "Fits 4 × 6 inch print",
        ageRange: null,
        features: [
          "Soft rounded edges",
          "Natural finish",
          "Gift-ready packaging",
        ],
        careInstructions: [
          "Wipe with a soft dry cloth.",
          "Keep away from prolonged moisture.",
        ],
        images: [
          "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=1200&q=80",
        ],
        imageAlt: "Keepsake frame styling",
        price: 1199,
        categoryId: frames.id,
        isFeatured: false,
        sortOrder: 2,
      },
      {
        slug: "wooden-rattle",
        name: "Wooden Rattle",
        tagline: "Gentle sounds for little hands.",
        description:
          "A classic wooden rattle with soft natural tones — a little extra that makes everyday play feel special.",
        material: "Natural wood",
        size: "Approximately 5 inches",
        ageRange: "3 months+",
        features: [
          "Smooth natural wood",
          "Gentle sound",
          "Perfect little extra",
        ],
        careInstructions: [
          "Wipe clean with a damp cloth.",
          "Air dry completely before storing.",
        ],
        images: [
          "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=1200&q=80",
        ],
        imageAlt: "Wooden baby rattle with greenery",
        price: 899,
        categoryId: extras.id,
        isFeatured: false,
        sortOrder: 1,
      },
      {
        slug: "soft-swaddle-wrap",
        name: "Soft Swaddle Wrap",
        tagline: "Everyday comfort, gently wrapped.",
        description:
          "A lightweight wrap for stroller rides and quiet moments — soft enough for delicate skin, simple enough for every day.",
        material: "Soft cotton blend",
        size: "Approximately 40 × 40 inches",
        ageRange: "0–12 months",
        features: [
          "Breathable cotton blend",
          "Lightweight everyday wrap",
          "Pairs with heirloom blankets",
        ],
        careInstructions: [
          "Gentle machine wash cold.",
          "Lay flat or tumble dry low.",
        ],
        images: [
          "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1200&q=80",
        ],
        imageAlt: "Soft gift packaging and textiles",
        price: 999,
        categoryId: extras.id,
        isFeatured: false,
        sortOrder: 2,
      },
    ],
  });

  console.log("Seeded Sky n Soul catalog successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
