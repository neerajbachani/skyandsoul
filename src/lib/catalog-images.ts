/** Cloudinary assets — swap product-specific URLs when new uploads are ready. */
const categoryBlankets =
  "https://res.cloudinary.com/dix9x012c/image/upload/v1788113430/IMG_20260825_165049_b5lmu6.jpg";
const categoryToys =
  "https://res.cloudinary.com/dix9x012c/image/upload/v1788113442/IMG_20260830_225100_qth2a7.jpg";
const categoryFrames =
  "https://res.cloudinary.com/dix9x012c/image/upload/v1788297645/frame-memory-nest-1_s4c1ze.jpg";
const categoryFrameItYourWay =
  "https://res.cloudinary.com/dix9x012c/image/upload/v1788113426/IMG_20260830_225354_dmtjrm.jpg";
const categoryLittleExtras =
  "https://res.cloudinary.com/dix9x012c/image/upload/v1788298177/keychain-bunny_hmz9wh.png";

/** Placeholder for frame products that do not yet have their own Cloudinary upload. */
const framePlaceholder =
  "https://res.cloudinary.com/dix9x012c/image/upload/v1788113429/IMG-20260623-WA0057_rkkce3.jpg";

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
  crochetLionToy:
    "https://res.cloudinary.com/dix9x012c/image/upload/v1788299928/toy-lion_ukbjsx.png",
  crochetBearToy:
    "https://res.cloudinary.com/dix9x012c/image/upload/v1788298162/toy-bear_frsfzm.png",
  crochetPilotBearToy:
    "https://res.cloudinary.com/dix9x012c/image/upload/v1788298601/toy-pilot-bear_k5p83w.png",
  crochetGirlToy:
    "https://res.cloudinary.com/dix9x012c/image/upload/v1788298330/toy-girl_qnrdcs.png",
  crochetBoyToy:
    "https://res.cloudinary.com/dix9x012c/image/upload/v1788298060/toy-boy_oiecyd.png",
  wingsOfJoy: framePlaceholder,
  cloudNest: categoryFrameItYourWay,
  littleRoots: categoryFrameItYourWay,
  memoryNest:
    "https://res.cloudinary.com/dix9x012c/image/upload/v1788297645/frame-memory-nest-1_s4c1ze.jpg",
  memoryNestAlt:
    "https://res.cloudinary.com/dix9x012c/image/upload/v1788297656/frame-memory-nest-2_vobnkk.jpg",
  jungleSafari: categoryToys,
  rattanHeart: framePlaceholder,
  teaCoaster: categoryLittleExtras,
  bunnyKeychain:
    "https://res.cloudinary.com/dix9x012c/image/upload/v1788298177/keychain-bunny_hmz9wh.png",
  donkeyKeychain:
    "https://res.cloudinary.com/dix9x012c/image/upload/v1788297652/keychain-donkey_jxipn0.jpg",
  dogKeychain:
    "https://res.cloudinary.com/dix9x012c/image/upload/v1788298204/keychain-dog_iqlnxv.png",
  lionKeychain: categoryLittleExtras,
  dollKeychain: categoryLittleExtras,
  giraffeKeychain: categoryLittleExtras,
  stitchKeychain: categoryLittleExtras,
} as const;
