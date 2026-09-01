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
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const categories = await Promise.all(
    categorySeedData.map((category) =>
      prisma.category.create({ data: category }),
    ),
  );

  const bySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));

  for (const product of blanketProducts) {
    await prisma.product.create({
      data: {
        ...product,
        ...BLANKET_META,
        categoryId: bySlug.blankets.id,
      },
    });
  }

  for (const product of toyProducts) {
    await prisma.product.create({
      data: { ...product, categoryId: bySlug.toys.id },
    });
  }

  for (const product of frameProducts) {
    await prisma.product.create({
      data: { ...product, categoryId: bySlug.frames.id },
    });
  }

  for (const product of extraProducts) {
    await prisma.product.create({
      data: { ...product, categoryId: bySlug["little-extras"].id },
    });
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
