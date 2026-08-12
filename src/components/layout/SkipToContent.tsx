import Link from "next/link";

export function SkipToContent() {
  return (
    <Link
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-chocolate focus:px-4 focus:py-3 focus:font-sans focus:text-xs focus:font-medium focus:uppercase focus:tracking-[0.14em] focus:text-white focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-earth"
    >
      Skip to content
    </Link>
  );
}
