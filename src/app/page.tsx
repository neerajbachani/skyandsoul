import { AnnouncementBar } from "@/components/home/AnnouncementBar";
import { BannerMosaic, FeaturedBannerRow } from "@/components/home/BannerMosaic";
import { BrandStory } from "@/components/home/BrandStory";
import { EditorialBanner } from "@/components/home/EditorialBanner";
import { Hero } from "@/components/home/Hero";
import { InstagramFeed } from "@/components/home/InstagramFeed";
import { Newsletter } from "@/components/home/Newsletter";
import stageStyles from "@/components/home/flyingMemoriesStage.module.css";
import { FlyingMemories } from "@/components/home/FlyingMemories";
import { FlyingMemoriesCta, FlyingMemoriesInvite } from "@/components/home/FlyingMemoriesCta";
import { PolaroidGallery } from "@/components/home/PolaroidGallery";
import { Testimonials } from "@/components/home/Testimonials";
import { ValueProps } from "@/components/home/ValueProps";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { WhatsAppChatButton } from "@/components/layout/WhatsAppChatButton";
import { getHomeContent } from "@/lib/home-content";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { content, spotlightProducts } = await getHomeContent();

  return (
    <>
      <AnnouncementBar />
      <Header />
      <Hero slides={content.hero.slides} />
      <main id="main-content" className="flex-1 overflow-clip">
      <ValueProps />
        
        <div className="flex flex-col gap-4 bg-white sm:gap-8 lg:gap-12">
          <BannerMosaic
            banners={content.shopByCollection.banners}
            eyebrow={content.shopByCollection.eyebrow}
            title={content.shopByCollection.title}
          />
          <FeaturedBannerRow banners={content.featuredBanners} />
        </div>
        <PolaroidGallery products={spotlightProducts} />
        <BrandStory />
        <EditorialBanner content={content.editorial} />
        <Testimonials />
        <div className={stageStyles.stage} data-flying-stage>
          <FlyingMemories />
          <FlyingMemoriesCta>
            <InstagramFeed content={content.instagram} />
          </FlyingMemoriesCta>
        </div>
        {/* <FlyingMemoriesInvite /> */}
        {/* <Newsletter /> */}
      </main>
      <Footer />
      <WhatsAppChatButton />
    </>
  );
}
