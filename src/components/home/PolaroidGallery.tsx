import {
  PolaroidStackSlider,
  type PolaroidImage,
} from "@/components/PolaroidStackSlider";
import { listProducts } from "@/lib/catalog";
import { CLOUDINARY } from "@/lib/catalog-images";

const fallback: PolaroidImage[] = [
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

function slidesFromCatalog(products: CatalogProduct[]): PolaroidImage[] {
  const picked: CatalogProduct[] = [];
  const seenCategories = new Set<string>();

  for (const product of products) {
    if (!product.images[0] || seenCategories.has(product.category.slug)) continue;
    seenCategories.add(product.category.slug);
    picked.push(product);
  }

  for (const product of products) {
    if (picked.length >= 8) break;
    if (!product.images[0] || picked.some((item) => item.id === product.id)) continue;
    picked.push(product);
  }

  return picked.slice(0, 8).map((product) => ({
    src: product.images[0],
    alt: product.imageAlt || product.name,
    caption: product.name,
  }));
}

export async function PolaroidGallery() {
  const { products } = await listProducts({ limit: 24 });
  const fromCatalog = slidesFromCatalog(products);
  const images = fromCatalog.length >= 5 ? fromCatalog : fallback;

  return (
    <section className="overflow-hidden bg-sky/30 py-16 sm:py-28" aria-label="Collection photographs">
      <div className="mx-auto max-w-xl px-5 text-center sm:px-8">
        <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-sage">
          From the table
        </p>
        <h2 className="mt-3 font-serif text-3xl font-medium text-chocolate sm:text-4xl">
          Flip through the pieces
        </h2>
        <p className="mt-3 font-serif text-lg leading-relaxed text-chocolate/75">
          Photographs from the collection, stacked like prints on the worktable.
        </p>
      </div>
      <PolaroidStackSlider className="mt-6 sm:mt-8" images={images} />
    </section>
  );
}
