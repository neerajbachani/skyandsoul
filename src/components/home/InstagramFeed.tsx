import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { SOCIAL_LINKS } from "@/lib/constants";

const INSTAGRAM = SOCIAL_LINKS.find((link) => link.network === "instagram");
const INSTAGRAM_HANDLE = "skynsoul.co";

const POSTS = [
  {
    id: "DdWR1EnMAri",
    href: "https://www.instagram.com/skynsoul.co/reel/DdWR1EnMAri/",
    src: "/images/instagram/DdWR1EnMAri.jpg",
    alt: "Instagram reel that says When I say hmm!",
    kind: "reel",
  },
  {
    id: "DdQCW2tTgwH",
    href: "https://www.instagram.com/skynsoul.co/reel/DdQCW2tTgwH/",
    src: "/images/instagram/DdQCW2tTgwH.jpg",
    alt: "Crochet Ganesha surrounded by yarn and embroidered flowers",
    kind: "reel",
  },
  {
    id: "DdJfofIKqoW",
    href: "https://www.instagram.com/skynsoul.co/reel/DdJfofIKqoW/",
    src: "/images/instagram/DdJfofIKqoW.jpg",
    alt: "Phone diagram labeled with product sampling, material sourcing, website making, product making, and packaging",
    kind: "reel",
  },
  {
    id: "Dc_RYNXT690",
    href: "https://www.instagram.com/skynsoul.co/reel/Dc_RYNXT690/",
    src: "/images/instagram/Dc_RYNXT690.jpg",
    alt: "Crochet bear toy in a blue and white striped dress",
    kind: "reel",
  },
  {
    id: "Dc3cxizKzRl",
    href: "https://www.instagram.com/skynsoul.co/p/Dc3cxizKzRl/",
    src: "/images/instagram/Dc3cxizKzRl.jpg",
    alt: "Two children in festive dress holding crochet toys",
    kind: "post",
  },
  {
    id: "Dc1A8RwIdJj",
    href: "https://www.instagram.com/skynsoul.co/reel/Dc1A8RwIdJj/",
    src: "/images/instagram/Dc1A8RwIdJj.jpg",
    alt: "Crochet pilot bear waving from a small airplane",
    kind: "reel",
  },
  {
    id: "DcvwztyT8w9",
    href: "https://www.instagram.com/skynsoul.co/reel/DcvwztyT8w9/",
    src: "/images/instagram/DcvwztyT8w9.jpg",
    alt: "Sky n Soul gift box with the nest logo on the lid",
    kind: "reel",
  },
  {
    id: "DcoGfThzBjQ",
    href: "https://www.instagram.com/skynsoul.co/reel/DcoGfThzBjQ/",
    src: "/images/instagram/DcoGfThzBjQ.jpg",
    alt: "Instagram reel titled CCO and CTO vs the receipt",
    kind: "reel",
  },
  {
    id: "DcdpybRTtIS",
    href: "https://www.instagram.com/skynsoul.co/reel/DcdpybRTtIS/",
    src: "/images/instagram/DcdpybRTtIS.jpg",
    alt: "Behind-the-scenes reel from a material shopping trip",
    kind: "reel",
  },
  {
    id: "DcQ3lmVzz6m",
    href: "https://www.instagram.com/skynsoul.co/reel/DcQ3lmVzz6m/",
    src: "/images/instagram/DcQ3lmVzz6m.jpg",
    alt: "Sky n Soul comic of two neighbors talking from their balconies",
    kind: "reel",
  },
  {
    id: "DcJPp9mtver",
    href: "https://www.instagram.com/skynsoul.co/reel/DcJPp9mtver/",
    src: "/images/instagram/DcJPp9mtver.jpg",
    alt: "Family on a red tandem bicycle in front of a Sky n Soul shopfront",
    kind: "reel",
  },
  {
    id: "DcBc0GNCyL0",
    href: "https://www.instagram.com/skynsoul.co/reel/DcBc0GNCyL0/",
    src: "/images/instagram/DcBc0GNCyL0.jpg",
    alt: "Instagram reel that says Chupchaap Apna kaam kar rahi thi",
    kind: "reel",
  },
] as const;

function InstagramGlyph() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function PlayGlyph() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8.4 5.8A1 1 0 0 0 7 6.7v10.6a1 1 0 0 0 1.5.86l9.2-5.3a1 1 0 0 0 0-1.72l-9.2-5.34Z" />
    </svg>
  );
}

function FeedRow({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <div
      className={`flex gap-2.5 pr-2.5 sm:gap-[10px] sm:pr-[10px]${duplicate ? " motion-reduce:hidden" : ""}`}
      aria-hidden={duplicate || undefined}
    >
      {POSTS.map((post, index) => (
        <a
          key={`${post.id}-${duplicate ? "copy" : "live"}`}
          href={post.href}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={duplicate ? -1 : undefined}
          aria-label={duplicate ? undefined : `View ${post.alt} on Instagram`}
          className="group relative aspect-square w-[min(46vw,13.5rem)] shrink-0 overflow-hidden rounded-[6px] bg-sky/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-earth"
        >
          <Image
            src={post.src}
            alt={duplicate ? "" : post.alt}
            fill
            sizes="(max-width: 768px) 46vw, 216px"
            priority={!duplicate && index < 4}
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
          <span className="absolute inset-0 flex items-center justify-center bg-chocolate/45 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:duration-0">
            {post.kind === "reel" ? <PlayGlyph /> : <InstagramGlyph />}
          </span>
        </a>
      ))}
    </div>
  );
}

export function InstagramFeed() {
  if (!INSTAGRAM) return null;

  return (
    <section className="overflow-hidden bg-white py-20 sm:py-28" aria-label="Follow us on Instagram">
      <div className="mb-10 px-5 text-center sm:mb-14 sm:px-8">
        <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-sage">
          Follow Along
        </p>
        <h2 className="mt-3 font-serif text-3xl font-medium text-chocolate sm:text-4xl">
          Follow us on Instagram
        </h2>
        <div className="mt-6">
          <Button href={INSTAGRAM.href} target="_blank" rel="noopener noreferrer" showArrow>
            @{INSTAGRAM_HANDLE}
          </Button>
        </div>
      </div>

      <div className="overflow-hidden motion-reduce:overflow-x-auto">
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none">
          <FeedRow />
          <FeedRow duplicate />
        </div>
      </div>
    </section>
  );
}
