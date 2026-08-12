import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "text" | "filled" | "ghost";

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  showArrow?: boolean;
};

type ButtonAsButton = CommonProps &
  Omit<ComponentProps<"button">, "className" | "children"> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps & {
  href: string;
} & Omit<ComponentProps<typeof Link>, "className" | "children" | "href">;

type ButtonProps = ButtonAsButton | ButtonAsLink;

const base =
  "inline-flex items-center justify-center gap-2 font-sans text-xs font-medium uppercase tracking-[0.14em] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-earth";

const variants: Record<Variant, string> = {
  text: "bg-transparent text-chocolate underline underline-offset-[6px] decoration-chocolate/40 hover:text-earth hover:decoration-earth",
  filled:
    "bg-chocolate px-7 py-3.5 text-white no-underline hover:bg-earth active:scale-[0.98] focus-visible:outline-chocolate",
  ghost:
    "bg-white px-5 py-3 text-chocolate no-underline shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300",
};

export function Button(props: ButtonProps) {
  const {
    children,
    variant = "text",
    className = "",
    showArrow = false,
    ...rest
  } = props;

  const classes = `${base} ${variants[variant]} ${className}`.trim();
  const content = (
    <>
      <span>{children}</span>
      {showArrow ? <span aria-hidden="true">→</span> : null}
    </>
  );

  if ("href" in rest && rest.href) {
    const { href, ...linkRest } = rest;
    return (
      <Link href={href} className={classes} {...linkRest}>
        {content}
      </Link>
    );
  }

  const buttonRest = rest as ButtonAsButton;
  return (
    <button type="button" className={classes} {...buttonRest}>
      {content}
    </button>
  );
}
