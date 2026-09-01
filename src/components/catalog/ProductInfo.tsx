import { HANDMADE_NOTE } from "@/lib/catalog-content";

type ProductInfoProps = {
  description: string;
  features: string[];
  careInstructions: string[];
};

export function ProductInfo({
  description,
  features,
  careInstructions,
}: ProductInfoProps) {
  return (
    <div className="mt-12 space-y-10 border-t border-chocolate/10 pt-10">
      <section>
        <h2 className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-sage">
          Description
        </h2>
        <div className="mt-4 space-y-4 font-serif text-lg leading-relaxed text-chocolate/80">
          {description.split("\n\n").map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>
      </section>

      {features.length > 0 ? (
        <section>
          <h2 className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-sage">
            Why You&apos;ll Love It
          </h2>
          <ul className="mt-4 space-y-3">
            {features.map((feature) => (
              <li
                key={feature}
                className="flex gap-3 font-serif text-lg text-chocolate/80"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sage" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {careInstructions.length > 0 ? (
        <section>
          <h2 className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-sage">
            Care Instructions
          </h2>
          <ul className="mt-4 space-y-3">
            {careInstructions.map((item) => (
              <li
                key={item}
                className="flex gap-3 font-serif text-lg text-chocolate/80"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-earth" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="border-t border-chocolate/10 pt-8">
        <p className="font-serif text-base italic leading-relaxed text-chocolate/70">
          {HANDMADE_NOTE}
        </p>
      </section>
    </div>
  );
}
