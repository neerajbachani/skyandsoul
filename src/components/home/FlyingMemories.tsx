import { FlyingMemoriesScene, type FlyingFrame } from "@/components/home/FlyingMemoriesScene";
import { listProducts } from "@/lib/catalog";
import { CLOUDINARY } from "@/lib/catalog-images";

const fallback: FlyingFrame[] = [
  {
    src: CLOUDINARY.bedtimeBuddies,
    alt: "Bed Time Buddies granny-square crochet blanket with a cream scalloped border",
    caption: "Bed Time Buddies",
  },
  {
    src: CLOUDINARY.rainbowNest,
    alt: "Rainbow Nest crochet baby blanket",
    caption: "Rainbow Nest",
  },
  {
    src: CLOUDINARY.dreamKeeper,
    alt: "Dream Keeper crochet baby blanket",
    caption: "Dream Keeper",
  },
  {
    src: CLOUDINARY.butterCupBliss,
    alt: "Butter Cup Bliss crochet baby blanket",
    caption: "Butter Cup Bliss",
  },
  {
    src: CLOUDINARY.crochetLionToy,
    alt: "Handmade crochet lion toy",
    caption: "Simba Lion Toy",
  },
  {
    src: CLOUDINARY.crochetBearToy,
    alt: "Handmade crochet bear toy",
    caption: "Marshmallow Bear",
  },
  {
    src: CLOUDINARY.cloudNest,
    alt: "Cloud Nest nursery frame",
    caption: "Cloud Nest",
  },
  {
    src: CLOUDINARY.bunnyKeychain,
    alt: "Pink crochet bunny keychain",
    caption: "Cotton Candy Bunny",
  },
];

type CatalogProduct = {
  id: string;
  name: string;
  imageAlt: string;
  images: string[];
  category: { slug: string };
};

function framesFromCatalog(products: CatalogProduct[]): FlyingFrame[] {
  const picked: CatalogProduct[] = [];
  const seenCategories = new Set<string>();

  for (const product of products) {
    if (!product.images[0] || seenCategories.has(product.category.slug)) continue;
    seenCategories.add(product.category.slug);
    picked.push(product);
  }

  for (const product of products) {
    if (picked.length >= 12) break;
    if (!product.images[0] || picked.some((item) => item.id === product.id)) continue;
    picked.push(product);
  }

  return picked.slice(0, 12).map((product) => ({
    src: product.images[0],
    alt: product.imageAlt || product.name,
    caption: product.name,
  }));
}

export async function FlyingMemories() {
  const { products } = await listProducts({ limit: 24 });
  const fromCatalog = framesFromCatalog(products);
  const frames = fromCatalog.length >= 5 ? fromCatalog : fallback;

  return (
    <FlyingMemoriesScene
      frames={frames}
      ariaLabel="Handmade pieces floating toward the Sky n Soul mark"
    />
  );
}
