import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { AnnouncementBar } from "@/components/home/AnnouncementBar";
import { Button } from "@/components/ui/Button";

type StubPageProps = {
  title: string;
  description: string;
  eyebrow?: string;
};

export function StubPage({
  title,
  description,
  eyebrow = "Coming Soon",
}: StubPageProps) {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main id="main-content" className="flex-1 bg-canvas">
        <section className="mx-auto max-w-3xl px-5 py-24 text-center sm:px-8 sm:py-32">
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-sage">
            {eyebrow}
          </p>
          <h1 className="mt-4 font-serif text-4xl font-medium text-balance text-chocolate sm:text-5xl">
            {title}
          </h1>
          <p className="mx-auto mt-6 max-w-xl font-serif text-lg leading-relaxed text-chocolate/75">
            {description}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button href="/collections" showArrow>
              Browse Collections
            </Button>
            <Link
              href="/"
              className="font-sans text-xs font-medium uppercase tracking-[0.14em] text-earth underline underline-offset-[6px] decoration-earth/40 transition-colors hover:text-chocolate"
            >
              Back to Home
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
