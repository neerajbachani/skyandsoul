import { VALUE_PROPS } from "@/lib/constants";

const ICONS = {
  handmade: (
    <path d="M12 3v3M8 6.5l-2-2M16 6.5l2-2M6 12H3M21 12h-3M7.5 16.5l-1.5 2M16.5 16.5l1.5 2M12 9a4 4 0 014 4v5H8v-5a4 4 0 014-4z" />
  ),
  heirloom: (
    <path d="M12 3l7 4v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7l7-4z" />
  ),
  "gift-ready": (
    <path d="M4 9h16v11H4V9zm0 0l2.5-4h11L20 9M12 5v15M4 13h16" />
  ),
  "made-with-love": (
    <path d="M12 20s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 10c0 5.5-7 10-7 10z" />
  ),
} as const;

export function ValueProps() {
  return (
    <section className="bg-canvas px-5 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {VALUE_PROPS.map((prop) => (
          <div key={prop.id} className="text-center lg:text-left">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center text-sage lg:mx-0">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                aria-hidden="true"
              >
                {ICONS[prop.id as keyof typeof ICONS]}
              </svg>
            </div>
            <h3 className="font-serif text-xl font-medium text-chocolate">
              {prop.title}
            </h3>
            <p className="mt-2 font-serif text-base leading-relaxed text-chocolate/70">
              {prop.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
