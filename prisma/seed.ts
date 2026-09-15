import { PrismaClient } from "@prisma/client";
import {
  BLANKET_META,
  blanketProducts,
  categorySeedData,
  extraProducts,
  frameProducts,
  toyProducts,
} from "@/lib/catalog-seed-data";

const prisma = new PrismaClient();

async function main() {
  await prisma.cartItem.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const categories = await Promise.all(
    categorySeedData.map((category) =>
      prisma.category.create({ data: category }),
    ),
  );

  const bySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));

  async function createProduct(
    product: (typeof blanketProducts)[number],
    categoryId: string,
    extra: Record<string, unknown> = {},
  ) {
    const { variants, ...productData } = product;
    await prisma.product.create({
      data: {
        ...productData,
        ...extra,
        categoryId,
        variants: variants?.length ? { create: variants } : undefined,
      },
    });
  }

  for (const product of blanketProducts) {
    await createProduct(product, bySlug.blankets.id, BLANKET_META);
  }

  for (const product of toyProducts) {
    await createProduct(product, bySlug.toys.id);
  }

  for (const product of frameProducts) {
    await createProduct(product, bySlug.frames.id);
  }

  for (const product of extraProducts) {
    await createProduct(product, bySlug["little-extras"].id);
  }

  console.log(
    `Seeded Sky n Soul catalog: ${blanketProducts.length} blankets, ${toyProducts.length} toys, ${frameProducts.length} frames, ${extraProducts.length} little extras.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
