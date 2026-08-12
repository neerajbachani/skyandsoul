import { AnnouncementBar } from "@/components/home/AnnouncementBar";
import { BrandStory } from "@/components/home/BrandStory";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { EditorialBanner } from "@/components/home/EditorialBanner";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Hero } from "@/components/home/Hero";
import { Newsletter } from "@/components/home/Newsletter";
import { Testimonials } from "@/components/home/Testimonials";
import { ValueProps } from "@/components/home/ValueProps";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { listCategories, listProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, featured] = await Promise.all([
    listCategories(),
    listProducts({ featured: true, limit: 4 }),
  ]);

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main id="main-content" className="flex-1">
        <Hero />
        <BrandStory />
        <CategoryGrid categories={categories} />
        <ValueProps />
        <FeaturedProducts products={featured.products} />
        <EditorialBanner />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
