/** Cloudinary assets — swap product-specific URLs when new uploads are ready. */
const categoryBlankets =
  "https://res.cloudinary.com/dix9x012c/image/upload/v1788113430/IMG_20260825_165049_b5lmu6.jpg";
const categoryToys =
  "https://res.cloudinary.com/dix9x012c/image/upload/v1788113442/IMG_20260830_225100_qth2a7.jpg";
const categoryFrames =
  "https://res.cloudinary.com/dix9x012c/image/upload/v1788113429/IMG-20260623-WA0057_rkkce3.jpg";
const categoryFrameItYourWay =
  "https://res.cloudinary.com/dix9x012c/image/upload/v1788113426/IMG_20260830_225354_dmtjrm.jpg";
const categoryLittleExtras =
  "https://res.cloudinary.com/dix9x012c/image/upload/v1788113427/IMG_20260830_230055_txwtvr.jpg";

export const CLOUDINARY = {
  categoryBlankets,
  categoryToys,
  categoryFrames,
  categoryFrameItYourWay,
  categoryLittleExtras,
  bedtimeBuddies:
    "https://res.cloudinary.com/dix9x012c/image/upload/v1788113433/IMG_20260828_205957_kzj0ky.jpg",
  cozyCub:
    "https://res.cloudinary.com/dix9x012c/image/upload/v1788113434/IMG_20260828_205339_l9lu2d.jpg",
  rainbowNest: categoryBlankets,
  dreamKeeper:
    "https://res.cloudinary.com/dix9x012c/image/upload/v1788113424/IMG_20260828_205140_xypyrn.jpg",
  butterCupBliss:
    "https://res.cloudinary.com/dix9x012c/image/upload/v1788113428/IMG-20260812-WA0019_nhmex2.jpg",
  tinyPaws:
    "https://res.cloudinary.com/dix9x012c/image/upload/v1788113425/IMG_20260828_205551_wo1qbs.jpg",
  dreamRaider:
    "https://res.cloudinary.com/dix9x012c/image/upload/v1788113433/WhatsApp_Image_2026-08-30_at_22.48.19_b6uxfq.jpg",
  crochetLionToy: categoryToys,
  crochetBearToy: categoryToys,
  crochetPilotBearToy: categoryToys,
  crochetGirlToy: categoryToys,
  crochetBoyToy: categoryToys,
  wingsOfJoy: categoryFrames,
  cloudNest: categoryFrameItYourWay,
  littleRoots: categoryFrameItYourWay,
  memoryNest: categoryFrames,
  memoryNestAlt: categoryFrameItYourWay,
  jungleSafari: categoryToys,
  rattanHeart: categoryFrames,
  teaCoaster: categoryLittleExtras,
  bunnyKeychain: categoryLittleExtras,
  donkeyKeychain: categoryLittleExtras,
  dogKeychain: categoryLittleExtras,
  lionKeychain: categoryLittleExtras,
  dollKeychain: categoryLittleExtras,
  giraffeKeychain: categoryLittleExtras,
  stitchKeychain: categoryLittleExtras,
} as const;
