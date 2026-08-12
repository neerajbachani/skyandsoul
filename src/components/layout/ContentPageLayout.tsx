import { SiteShell } from "@/components/layout/SiteShell";

type ContentPageLayoutProps = {
  eyebrow?: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
};

export function ContentPageLayout({
  eyebrow = "Sky n Soul",
  title,
  intro,
  children,
}: ContentPageLayoutProps) {
  return (
    <SiteShell>
      <article className="bg-canvas">
        <header className="border-b border-chocolate/10 px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-sage">
              {eyebrow}
            </p>
            <h1 className="mt-4 font-serif text-4xl font-medium text-balance text-chocolate sm:text-5xl">
              {title}
            </h1>
            {intro ? (
              <p className="mx-auto mt-5 max-w-2xl font-serif text-lg leading-relaxed text-chocolate/75">
                {intro}
              </p>
            ) : null}
          </div>
        </header>
        <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-16">
          <div className="space-y-8 font-serif text-lg leading-relaxed text-chocolate/80">
            {children}
          </div>
        </div>
      </article>
    </SiteShell>
  );
}
