import { AnnouncementBar } from "@/components/home/AnnouncementBar";
import { BannerMosaic } from "@/components/home/BannerMosaic";
import { BrandStory } from "@/components/home/BrandStory";
import { EditorialBanner } from "@/components/home/EditorialBanner";
import { Hero } from "@/components/home/Hero";
import { InstagramFeed } from "@/components/home/InstagramFeed";
import { Newsletter } from "@/components/home/Newsletter";
import { SpotlightCarousel } from "@/components/home/SpotlightCarousel";
import { Testimonials } from "@/components/home/Testimonials";
import { ValueProps } from "@/components/home/ValueProps";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getHomeContent } from "@/lib/home-content";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { content, spotlightProducts } = await getHomeContent();

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main id="main-content" className="flex-1">
        <Hero slides={content.hero.slides} />
        <BrandStory />
        <div className="flex flex-col gap-2 bg-canvas sm:gap-3 lg:gap-4">
          <BannerMosaic
            banners={content.shopByCollection.banners}
            eyebrow={content.shopByCollection.eyebrow}
            title={content.shopByCollection.title}
          />
          <BannerMosaic
            banners={content.featuredBanners}
            label="Featured product banners"
          />
        </div>
        <SpotlightCarousel products={spotlightProducts} />
        <ValueProps />
        <EditorialBanner content={content.editorial} />
        <InstagramFeed content={content.instagram} />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
