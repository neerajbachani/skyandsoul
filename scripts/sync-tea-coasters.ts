import { Prisma, PrismaClient } from "@prisma/client";
import { extraProducts } from "@/lib/catalog-seed-data";

const TEA_SLUGS = [
  "customized-crochet-tea-coaster",
  "crochet-tea-coasters-set-of-4",
  "crochet-tea-coasters-set-of-6",
] as const;

const LEGACY_SLUG = "crochet-tea-coaster";
const LEGACY_HREF = "/products/crochet-tea-coaster";
const SET_OF_4_HREF = "/products/crochet-tea-coasters-set-of-4";

const prisma = new PrismaClient();

async function main() {
  const category = await prisma.category.findUnique({
    where: { slug: "little-extras" },
  });
  if (!category) {
    throw new Error(
      "Little Extras category is missing. Seed the catalog before syncing tea coasters.",
    );
  }

  const teaProducts = extraProducts.filter((product) =>
    (TEA_SLUGS as readonly string[]).includes(product.slug),
  );

  for (const product of teaProducts) {
    const { variants, ...productData } = product;
    const variantData = (variants ?? []).map((variant) => ({
      slug: variant.slug,
      name: variant.name,
      price: variant.price,
      badge: variant.badge ?? null,
      images: variant.images ?? [],
      sortOrder: variant.sortOrder,
    }));

    await prisma.product.upsert({
      where: { slug: product.slug },
      create: {
        ...productData,
        categoryId: category.id,
        variants: variantData.length ? { create: variantData } : undefined,
      },
      update: {
        ...productData,
        categoryId: category.id,
        variants: {
          deleteMany: {},
          ...(variantData.length ? { create: variantData } : {}),
        },
      },
    });
    console.log(`Upserted ${product.slug}`);
  }

  for (const product of extraProducts) {
    if ((TEA_SLUGS as readonly string[]).includes(product.slug)) continue;
    const updated = await prisma.product.updateMany({
      where: { slug: product.slug },
      data: { sortOrder: product.sortOrder },
    });
    if (updated.count > 0) {
      console.log(`Sort order ${product.sortOrder} for ${product.slug}`);
    }
  }

  const legacy = await prisma.product.findUnique({
    where: { slug: LEGACY_SLUG },
    include: { _count: { select: { orderItems: true, cartItems: true } } },
  });

  if (!legacy) {
    console.log("No legacy crochet-tea-coaster product to retire.");
  } else if (legacy._count.orderItems > 0) {
    await prisma.cartItem.deleteMany({ where: { productId: legacy.id } });
    await prisma.product.update({
      where: { id: legacy.id },
      data: { isPublished: false },
    });
    console.log(
      `Unpublished legacy crochet-tea-coaster (${legacy._count.orderItems} order lines kept, ${legacy._count.cartItems} cart lines removed).`,
    );
  } else {
    await prisma.product.delete({ where: { id: legacy.id } });
    console.log("Deleted legacy crochet-tea-coaster.");
  }

  const home = await prisma.homePage.findUnique({ where: { id: "home" } });
  if (home) {
    const raw = JSON.stringify(home.content);
    const next = raw.replaceAll(`"${LEGACY_HREF}"`, `"${SET_OF_4_HREF}"`);
    if (next !== raw) {
      await prisma.homePage.update({
        where: { id: "home" },
        data: { content: JSON.parse(next) as Prisma.InputJsonValue },
      });
      console.log("Pointed saved homepage tea coaster banner at the set of 4.");
    }
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
