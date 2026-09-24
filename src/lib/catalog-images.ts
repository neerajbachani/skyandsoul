/** Cloudinary assets — uploaded via scripts/upload-doc2-to-cloudinary.ts */
const categoryBlankets =
  "https://res.cloudinary.com/dix9x012c/image/upload/v1788113430/IMG_20260825_165049_b5lmu6.jpg";
const categoryToys =
  "https://res.cloudinary.com/dix9x012c/image/upload/v1788113442/IMG_20260830_225100_qth2a7.jpg";
const categoryFrameItYourWay =
  "https://res.cloudinary.com/dix9x012c/image/upload/v1788507343/skyandsoul/doc2/frame-cloud-nest.png";
const categoryLittleExtras =
  "https://res.cloudinary.com/dix9x012c/image/upload/v1788507354/skyandsoul/doc2/keychain-bunny.png";

/** Placeholder for frame products that do not yet have their own Cloudinary upload. */
const framePlaceholder =
  "https://res.cloudinary.com/dix9x012c/image/upload/v1788113429/IMG-20260623-WA0057_rkkce3.jpg";

const TEA_CDN = "https://res.cloudinary.com/dix9x012c/image/upload";

/**
 * Visual map of each tea-coaster design to its matching pack photos.
 * File numbers are not aligned, so galleries are derived from this list
 * in Design 1–12 order. Missing set-of-6 shots fall back to the individual photo.
 */
const TEA_COASTER_PATTERNS = [
  {
    individual: `${TEA_CDN}/v1789287357/skyandsoul/docs3/tea-coaster-1.png`,
    set4: `${TEA_CDN}/v1789287393/skyandsoul/docs3/tea-coaster-set4-9.jpg`,
    set6: `${TEA_CDN}/v1789287413/skyandsoul/docs3/tea-coaster-set6-6.png`,
  },
  {
    individual: `${TEA_CDN}/v1789287363/skyandsoul/docs3/tea-coaster-2.png`,
    set4: `${TEA_CDN}/v1789287392/skyandsoul/docs3/tea-coaster-set4-8.jpg`,
    set6: `${TEA_CDN}/v1789287415/skyandsoul/docs3/tea-coaster-set6-7.png`,
  },
  {
    individual: `${TEA_CDN}/v1789287368/skyandsoul/docs3/tea-coaster-3.png`,
    set4: `${TEA_CDN}/v1789287391/skyandsoul/docs3/tea-coaster-set4-7.jpg`,
    set6: `${TEA_CDN}/v1789287417/skyandsoul/docs3/tea-coaster-set6-8.png`,
  },
  {
    individual: `${TEA_CDN}/v1789287370/skyandsoul/docs3/tea-coaster-4.png`,
    set4: `${TEA_CDN}/v1789287390/skyandsoul/docs3/tea-coaster-set4-6.jpg`,
    set6: `${TEA_CDN}/v1789287397/skyandsoul/docs3/tea-coaster-set6-10.png`,
  },
  {
    individual: `${TEA_CDN}/v1789287372/skyandsoul/docs3/tea-coaster-5.png`,
    set4: `${TEA_CDN}/v1789287389/skyandsoul/docs3/tea-coaster-set4-5.jpg`,
    set6: `${TEA_CDN}/v1789287420/skyandsoul/docs3/tea-coaster-set6-9.png`,
  },
  {
    individual: `${TEA_CDN}/v1789287374/skyandsoul/docs3/tea-coaster-6.png`,
    set4: `${TEA_CDN}/v1789287388/skyandsoul/docs3/tea-coaster-set4-4.jpg`,
    set6: `${TEA_CDN}/v1789287410/skyandsoul/docs3/tea-coaster-set6-5.png`,
  },
  {
    individual: `${TEA_CDN}/v1789287376/skyandsoul/docs3/tea-coaster-7.png`,
    set4: `${TEA_CDN}/v1789287382/skyandsoul/docs3/tea-coaster-set4-1.jpg`,
    set6: `${TEA_CDN}/v1789287376/skyandsoul/docs3/tea-coaster-7.png`,
  },
  {
    individual: `${TEA_CDN}/v1789287378/skyandsoul/docs3/tea-coaster-8.png`,
    set4: `${TEA_CDN}/v1789287387/skyandsoul/docs3/tea-coaster-set4-3.jpg`,
    set6: `${TEA_CDN}/v1789287378/skyandsoul/docs3/tea-coaster-8.png`,
  },
  {
    individual: `${TEA_CDN}/v1789287381/skyandsoul/docs3/tea-coaster-9.png`,
    set4: `${TEA_CDN}/v1789287385/skyandsoul/docs3/tea-coaster-set4-2.jpg`,
    set6: `${TEA_CDN}/v1789287405/skyandsoul/docs3/tea-coaster-set6-3.png`,
  },
  {
    individual: `${TEA_CDN}/v1789287359/skyandsoul/docs3/tea-coaster-10.jpg`,
    set4: `${TEA_CDN}/v1789287385/skyandsoul/docs3/tea-coaster-set4-12.jpg`,
    set6: `${TEA_CDN}/v1789287359/skyandsoul/docs3/tea-coaster-10.jpg`,
  },
  {
    individual: `${TEA_CDN}/v1789287360/skyandsoul/docs3/tea-coaster-11.jpg`,
    set4: `${TEA_CDN}/v1789287383/skyandsoul/docs3/tea-coaster-set4-10.jpg`,
    set6: `${TEA_CDN}/v1789287403/skyandsoul/docs3/tea-coaster-set6-2.png`,
  },
  {
    individual: `${TEA_CDN}/v1789287361/skyandsoul/docs3/tea-coaster-12.jpg`,
    set4: `${TEA_CDN}/v1789287384/skyandsoul/docs3/tea-coaster-set4-11.jpg`,
    set6: `${TEA_CDN}/v1789287361/skyandsoul/docs3/tea-coaster-12.jpg`,
  },
] as const;

export function teaCoasterMatchForImage(imageUrl: string) {
  return (
    TEA_COASTER_PATTERNS.find(
      (pattern) =>
        pattern.individual === imageUrl ||
        pattern.set4 === imageUrl ||
        pattern.set6 === imageUrl,
    ) ?? null
  );
}

export function teaCoasterImageForView(
  patternImage: string,
  view: "individual" | "set4" | "set6",
): string | undefined {
  const match = teaCoasterMatchForImage(patternImage);
  if (!match) return undefined;
  if (view === "set4") return match.set4;
  if (view === "set6") return match.set6;
  return match.individual;
}

export const CUSTOMIZE_FRAME_IMAGES = [
  "https://res.cloudinary.com/dix9x012c/image/upload/v1788507323/skyandsoul/doc2/customize-frame-1.png",
  "https://res.cloudinary.com/dix9x012c/image/upload/v1788507327/skyandsoul/doc2/customize-frame-2.png",
  "https://res.cloudinary.com/dix9x012c/image/upload/v1788507329/skyandsoul/doc2/customize-frame-3.png",
  "https://res.cloudinary.com/dix9x012c/image/upload/v1788507330/skyandsoul/doc2/customize-frame-4.png",
  "https://res.cloudinary.com/dix9x012c/image/upload/v1788507333/skyandsoul/doc2/customize-frame-5.png",
  "https://res.cloudinary.com/dix9x012c/image/upload/v1788507335/skyandsoul/doc2/customize-frame-6.png",
  "https://res.cloudinary.com/dix9x012c/image/upload/v1788507337/skyandsoul/doc2/customize-frame-7.png",
  "https://res.cloudinary.com/dix9x012c/image/upload/v1788507339/skyandsoul/doc2/customize-frame-8.png",
  "https://res.cloudinary.com/dix9x012c/image/upload/v1788507341/skyandsoul/doc2/customize-frame-9.jpg",
] as const;

export const CLOUDINARY = {
  categoryBlankets,
  categoryToys,
  categoryFrames:
    "https://res.cloudinary.com/dix9x012c/image/upload/v1788507352/skyandsoul/doc2/frame-memory-nest.jpg",
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
    "https://res.cloudinary.com/dix9x012c/image/upload/v1788507370/skyandsoul/doc2/toy-lion.png",
  crochetBearToy:
    "https://res.cloudinary.com/dix9x012c/image/upload/v1788507364/skyandsoul/doc2/toy-bear.png",
  crochetPilotBearToy:
    "https://res.cloudinary.com/dix9x012c/image/upload/v1788507374/skyandsoul/doc2/toy-pilot-bear.png",
  crochetGirlToy:
    "https://res.cloudinary.com/dix9x012c/image/upload/v1788507368/skyandsoul/doc2/toy-girl.png",
  crochetBoyToy:
    "https://res.cloudinary.com/dix9x012c/image/upload/v1788507365/skyandsoul/doc2/toy-boy.png",
  wingsOfJoy: framePlaceholder,
  cloudNest:
    "https://res.cloudinary.com/dix9x012c/image/upload/v1788507343/skyandsoul/doc2/frame-cloud-nest.png",
  littleRoots:
    "https://res.cloudinary.com/dix9x012c/image/upload/v1788507349/skyandsoul/doc2/frame-little-roots-1.jpg",
  littleRootsAlt:
    "https://res.cloudinary.com/dix9x012c/image/upload/v1788507350/skyandsoul/doc2/frame-little-roots-2.jpg",
  littleRootsThird:
    "https://res.cloudinary.com/dix9x012c/image/upload/v1788507351/skyandsoul/doc2/frame-little-roots-3.jpg",
  memoryNest:
    "https://res.cloudinary.com/dix9x012c/image/upload/v1788507352/skyandsoul/doc2/frame-memory-nest.jpg",
  welcomeToTheWorld:
    "https://res.cloudinary.com/dix9x012c/image/upload/v1788507353/skyandsoul/doc2/frame-welcome-to-the-world.jpg",
  littleCurve:
    "https://res.cloudinary.com/dix9x012c/image/upload/v1788507344/skyandsoul/doc2/frame-little-curve-1.jpg",
  littleCurveAlt:
    "https://res.cloudinary.com/dix9x012c/image/upload/v1788507345/skyandsoul/doc2/frame-little-curve-2.jpg",
  littleCurveThird:
    "https://res.cloudinary.com/dix9x012c/image/upload/v1788507348/skyandsoul/doc2/frame-little-curve-3.png",
  littleMeadow:
    "https://res.cloudinary.com/dix9x012c/image/upload/v1788507345/skyandsoul/doc2/frame-little-curve-2.jpg",
  littleWorld:
    "https://res.cloudinary.com/dix9x012c/image/upload/v1788507348/skyandsoul/doc2/frame-little-curve-3.png",
  rattanHeart: framePlaceholder,
  teaCoasterGallery: TEA_COASTER_PATTERNS.map((pattern) => pattern.individual),
  teaCoasterSet4Gallery: TEA_COASTER_PATTERNS.map((pattern) => pattern.set4),
  teaCoasterSet6Gallery: TEA_COASTER_PATTERNS.map((pattern) => pattern.set6),
  teaCoaster:
    "https://res.cloudinary.com/dix9x012c/image/upload/v1789287357/skyandsoul/docs3/tea-coaster-1.png",
  bunnyKeychain:
    "https://res.cloudinary.com/dix9x012c/image/upload/v1788507354/skyandsoul/doc2/keychain-bunny.png",
  donkeyKeychain:
    "https://res.cloudinary.com/dix9x012c/image/upload/v1788507359/skyandsoul/doc2/keychain-donkey.jpg",
  dogKeychain:
    "https://res.cloudinary.com/dix9x012c/image/upload/v1788507356/skyandsoul/doc2/keychain-dog.png",
  lionKeychain:
    "https://res.cloudinary.com/dix9x012c/image/upload/v1788507361/skyandsoul/doc2/keychain-lion.jpg",
  dollKeychain:
    "https://res.cloudinary.com/dix9x012c/image/upload/v1788507357/skyandsoul/doc2/keychain-doll.jpg",
  giraffeKeychain:
    "https://res.cloudinary.com/dix9x012c/image/upload/v1788507360/skyandsoul/doc2/keychain-giraffe.jpg",
  stitchKeychain: categoryLittleExtras,
} as const;
