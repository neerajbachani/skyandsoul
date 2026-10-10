import Link from "next/link";
import styles from "./retro-cta.module.css";

/**
 * RetroCta - A vintage 3D block-lettering call-to-action component inspired by retro signages.
 *
 * @example
 * ```tsx
 * <RetroCta label="Key Chains" href="/collections/key-chains" theme="cream-chocolate" size="lg" />
 * <RetroCta eyebrow="Shop" label="Frames" href="/collections/frames" theme="mustard-navy" underline />
 * <RetroCta label="Coasters" onClick={handleClick} theme="chocolate-sky" size="md" />
 * ```
 */

export type RetroThemeKey =
  | "mustard-navy"
  | "cream-chocolate"
  | "chocolate-sky"
  | "mustard-chocolate"
  | "white-rust";

export interface RetroThemeConfig {
  fill: string;
  shadow: string;
  recommendedBg: string;
}

export const RETRO_THEMES: Record<RetroThemeKey, RetroThemeConfig> = {
  "mustard-navy": { fill: "#E8A93A", shadow: "#1E3A4F", recommendedBg: "#C3D4E4" },
  "cream-chocolate": { fill: "#FAFAF8", shadow: "#4B3222", recommendedBg: "#889A6F" },
  "chocolate-sky": { fill: "#4B3222", shadow: "#C3D4E4", recommendedBg: "#FAFAF8" },
  "mustard-chocolate": { fill: "#E8A93A", shadow: "#4B3222", recommendedBg: "#80592C" },
  "white-rust": { fill: "#FFFFFF", shadow: "#A0482A", recommendedBg: "#4B3222" },
} as const;

export type RetroSizeKey = "xs" | "sm" | "md" | "lg" | "xl";

export interface RetroSizeConfig {
  depth: number;
  fontSize: string;
}

export const RETRO_SIZES: Record<RetroSizeKey, RetroSizeConfig> = {
  xs: { depth: 2, fontSize: "clamp(0.6875rem, 1.8vw, 0.8125rem)" },
  sm: { depth: 3, fontSize: "clamp(1.125rem, 3.5vw, 1.5rem)" },
  md: { depth: 4, fontSize: "clamp(1.5rem, 4.5vw, 2.25rem)" },
  lg: { depth: 6, fontSize: "clamp(2rem, 6vw, 4rem)" },
  xl: { depth: 8, fontSize: "clamp(2.75rem, 8vw, 5.5rem)" },
} as const;

export function buildExtrude(depth: number, color: string): string {
  const steps: string[] = [];
  for (let i = 1; i <= depth; i++) {
    steps.push(`${i}px ${i}px 0 ${color}`);
  }
  const groundShadow = `0 ${depth + 4}px ${depth * 3}px rgba(75,50,34,0.25)`;
  return steps.length > 0 ? `${steps.join(", ")}, ${groundShadow}` : groundShadow;
}

const warnedThemes = new Set<string>();
function checkContrast(theme: RetroThemeKey, fill: string, bg: string): void {
  if (process.env.NODE_ENV === "production" || warnedThemes.has(theme)) return;
  warnedThemes.add(theme);
  const getLum = (hex: string) => {
    const c = hex.replace("#", "");
    const rgb = [0, 2, 4].map((i) => {
      const v = parseInt(c.slice(i, i + 2), 16) / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
  };
  const ratio = (Math.max(getLum(fill), getLum(bg)) + 0.05) / (Math.min(getLum(fill), getLum(bg)) + 0.05);
  if (ratio < 3) {
    console.warn(
      `[RetroCta] Low contrast for "${theme}": fill ${fill} vs ${bg} ratio is ${ratio.toFixed(2)}:1 (< 3:1).`
    );
  }
}

export interface RetroCtaProps {
  label: string;
  eyebrow?: string;
  href?: string;
  onClick?: () => void;
  size?: RetroSizeKey;
  theme?: RetroThemeKey;
  align?: "left" | "center" | "right";
  underline?: boolean;
  className?: string;
}

export function RetroCta({
  label,
  eyebrow,
  href,
  onClick,
  size = "lg",
  theme = "mustard-navy",
  align = "center",
  underline = false,
  className = "",
}: RetroCtaProps) {
  const themeConfig = RETRO_THEMES[theme] ?? RETRO_THEMES["mustard-navy"];
  const sizeConfig = RETRO_SIZES[size] ?? RETRO_SIZES.lg;
  checkContrast(theme, themeConfig.fill, themeConfig.recommendedBg);

  const isInteractive = Boolean(href || onClick);
  const alignClass = align === "left" ? "items-start text-left" : align === "right" ? "items-end text-right" : "items-center text-center";
  const rootClasses = `${styles.retroCta} ${alignClass} ${isInteractive ? styles.interactive : ""} ${className}`.trim();

  const styleVars = {
    "--fill": themeConfig.fill,
    "--shadow-color": themeConfig.shadow,
    "--depth": `${sizeConfig.depth}px`,
    "--font-size": sizeConfig.fontSize,
    "--min-tap-target": size === "xs" ? "32px" : "44px",
    "--shadow-normal": buildExtrude(sizeConfig.depth, themeConfig.shadow),
    "--shadow-hover": buildExtrude(Math.max(1, Math.round(sizeConfig.depth / 2)), themeConfig.shadow),
    "--shadow-active": buildExtrude(1, themeConfig.shadow),
    "--shadow-eyebrow-normal": buildExtrude(Math.max(2, Math.round(sizeConfig.depth * 0.5)), themeConfig.shadow),
    "--shadow-eyebrow-hover": buildExtrude(Math.max(1, Math.round(sizeConfig.depth * 0.25)), themeConfig.shadow),
    "--shadow-eyebrow-active": buildExtrude(1, themeConfig.shadow),
  } as React.CSSProperties;

  const content = (
    <>
      {eyebrow ? <span className={styles.eyebrow}>{eyebrow}</span> : null}
      <span className={styles.label}>{label}</span>
      {underline ? (
        <span aria-hidden="true" className={styles.divider}>
          <span className={styles.diamond} />
          <span className={styles.line} />
          <span className={styles.diamond} />
        </span>
      ) : null}
    </>
  );

  const accessibleName = eyebrow ? `${eyebrow} ${label}` : undefined;

  if (href) {
    return (
      <Link href={href} aria-label={accessibleName} className={rootClasses} style={styleVars}>
        {content}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} aria-label={accessibleName} className={rootClasses} style={styleVars}>
        {content}
      </button>
    );
  }

  return (
    <span aria-label={accessibleName} className={rootClasses} style={styleVars}>
      {content}
    </span>
  );
}

export default RetroCta;
