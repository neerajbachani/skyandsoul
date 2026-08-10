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

export default function HomePage() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <Hero />
        <BrandStory />
        <CategoryGrid />
        <ValueProps />
        <FeaturedProducts />
        <EditorialBanner />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
