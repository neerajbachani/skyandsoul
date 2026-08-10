import { TESTIMONIALS } from "@/lib/constants";

export function Testimonials() {
  return (
    <section className="bg-canvas px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center sm:mb-16">
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-sage">
            Kind Words
          </p>
          <h2 className="mt-3 font-serif text-3xl font-medium text-chocolate sm:text-4xl">
            Loved by Growing Families
          </h2>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <blockquote
              key={item.id}
              className="border border-chocolate/10 bg-white px-6 py-8 sm:px-8"
            >
              <p className="font-serif text-xl leading-relaxed text-chocolate">
                “{item.quote}”
              </p>
              <footer className="mt-8 border-t border-chocolate/10 pt-5">
                <cite className="not-italic">
                  <span className="block font-sans text-xs font-medium uppercase tracking-[0.14em] text-earth">
                    {item.author}
                  </span>
                  <span className="mt-1 block font-sans text-xs text-chocolate/55">
                    {item.detail}
                  </span>
                </cite>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
