import { AnnouncementBar } from "@/components/home/AnnouncementBar";
import {
  BannerMosaic,
  PRIMARY_BANNERS,
  SECONDARY_BANNERS,
} from "@/components/home/BannerMosaic";
import { BrandStory } from "@/components/home/BrandStory";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { EditorialBanner } from "@/components/home/EditorialBanner";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Hero } from "@/components/home/Hero";
import { InstagramFeed } from "@/components/home/InstagramFeed";
import { Newsletter } from "@/components/home/Newsletter";
import { SpotlightCarousel } from "@/components/home/SpotlightCarousel";
import { Testimonials } from "@/components/home/Testimonials";
import { ValueProps } from "@/components/home/ValueProps";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { listCategories, listProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, featured] = await Promise.all([
    listCategories(),
    listProducts({ featured: true, limit: 8 }),
  ]);

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main id="main-content" className="flex-1">
        <Hero />
        <BrandStory />
        <div className="flex flex-col gap-2 bg-canvas sm:gap-3 lg:gap-4">
          <BannerMosaic
            banners={PRIMARY_BANNERS}
            eyebrow="Explore"
            title="Shop by Collection"
          />
          <BannerMosaic
            banners={SECONDARY_BANNERS}
            label="Featured product banners"
          />
        </div>
        <ValueProps />
        {/* <FeaturedProducts products={featured.products.slice(0, 4)} /> */}
        {/* <CategoryGrid categories={categories} /> */}
        <SpotlightCarousel
          products={featured.products.map((product) => ({
            slug: product.slug,
            name: product.name,
            price: product.price,
            images: product.images,
            imageAlt: product.imageAlt,
            category: product.category,
          }))}
        />
        <EditorialBanner />
        <InstagramFeed />
        <Testimonials />  
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
