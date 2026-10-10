import { Bowlby_One } from "next/font/google";

export const retroFont = Bowlby_One({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-retro",
  fallback: ["Lilita One", "Impact", "Arial Black", "sans-serif"],
});
