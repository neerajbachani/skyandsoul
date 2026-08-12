import Link from "next/link";

type Crumb = {
  label: string;
  href?: string;
};

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex flex-wrap items-center gap-2 font-sans text-[11px] uppercase tracking-[0.14em] text-chocolate/55">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-2">
            {index > 0 ? <span aria-hidden="true">/</span> : null}
            {item.href ? (
              <Link href={item.href} className="transition-colors hover:text-earth">
                {item.label}
              </Link>
            ) : (
              <span className="text-chocolate">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
